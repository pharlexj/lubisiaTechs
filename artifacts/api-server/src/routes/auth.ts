import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, verifyToken } from "../lib/auth";
import { RegisterUserBody, LoginUserBody } from "@workspace/api-zod";

const router = Router();

function userToProfile(u: typeof usersTable.$inferSelect) {
	return {
		id: u.id,
		name: u.name,
		email: u.email,
		role: u.role,
		newsletterSubscribed: u.newsletterSubscribed,
		createdAt: u.createdAt.toISOString(),
	};
}

router.post("/auth/register", async (req, res) => {
	try {
		const body = RegisterUserBody.parse(req.body);
		const existing = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, body.email.toLowerCase()));
		if (existing.length > 0) {
			return res.status(400).json({ error: "Email already registered" });
		}
		const passwordHash = await bcrypt.hash(body.password, 12);
		const [user] = await db
			.insert(usersTable)
			.values({
				name: body.name,
				email: body.email.toLowerCase(),
				passwordHash,
				role: "customer",
				newsletterSubscribed: body.newsletterSubscribed ?? false,
			})
			.returning();
		const token = signToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});
		return res.status(201).json({ token, user: userToProfile(user) });
	} catch (err) {
		req.log.error({ err }, "Failed to register user");
		return res.status(400).json({ error: "Bad request" });
	}
});

router.post("/auth/login", async (req, res) => {
	try {
		const body = LoginUserBody.parse(req.body);
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, body.email.toLowerCase()));
		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}
		const ok = await bcrypt.compare(body.password, user.passwordHash);
		if (!ok) {
			return res.status(401).json({ error: "Invalid email or password" });
		}
		const token = signToken({
			userId: user.id,
			email: user.email,
			role: user.role,
		});
		return res.json({ token, user: userToProfile(user) });
	} catch (err) {
		req.log.error({ err }, "Failed to login");
		return res.status(400).json({ error: "Bad request" });
	}
});

router.get("/auth/me", async (req, res) => {
	try {
		const auth = req.headers.authorization;
		if (!auth?.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const payload = verifyToken(auth.slice(7));
		if (!payload) {
			return res.status(401).json({ error: "Invalid token" });
		}
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, payload.userId));
		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}
		return res.json(userToProfile(user));
	} catch (err) {
		req.log.error({ err }, "Failed to get me");
		return res.status(401).json({ error: "Unauthorized" });
	}
});

export default router;
