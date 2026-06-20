import { useEffect, useRef, useState } from "react";
import {
	useListAboutSections,
	useListTeamMembers,
} from "@workspace/api-client-react";
import type { TeamMember, AboutSection } from "@workspace/api-client-react";
import {
	ChevronLeft,
	ChevronRight,
	Linkedin,
	Target,
	Eye,
	BookOpen,
	Shield,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";

const SECTION_ICONS: Record<string, React.ReactNode> = {
	vision: <Eye className="h-8 w-8" />,
	mission: <Target className="h-8 w-8" />,
	mandate: <BookOpen className="h-8 w-8" />,
	core_values: <Shield className="h-8 w-8" />,
};

const SECTION_COLORS: Record<string, string> = {
	vision: "bg-primary text-primary-foreground",
	mission: "bg-secondary text-secondary-foreground",
	mandate: "bg-accent text-accent-foreground",
	core_values: "bg-primary text-primary-foreground",
};

function CoreValuesList({ content }: { content: string }) {
	const lines = content.split("\n").filter(Boolean);
	return (
		<ul className="space-y-3">
			{lines.map((line, i) => {
				const [label, ...rest] = line.split("—");
				return (
					<li key={i} className="flex items-start gap-3">
						<span className="mt-0.5 h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold shrink-0">
							{i + 1}
						</span>
						<span>
							<strong className="text-primary">{label.trim()}</strong>
							{rest.length > 0 && (
								<span className="text-muted-foreground">
									{" "}
									— {rest.join("—")}
								</span>
							)}
						</span>
					</li>
				);
			})}
		</ul>
	);
}

function TeamCarousel({ members }: { members: TeamMember[] }) {
	const active = members.filter((m) => m.active === 1);
	const [index, setIndex] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const visibleCount = Math.min(3, active.length);

	const resetTimer = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = setInterval(
			() => setIndex((i) => (i + 1) % active.length),
			5000,
		);
	};

	useEffect(() => {
		if (active.length > 1) resetTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [active.length]);

	const prev = () => {
		setIndex((i) => (i - 1 + active.length) % active.length);
		resetTimer();
	};
	const next = () => {
		setIndex((i) => (i + 1) % active.length);
		resetTimer();
	};

	if (active.length === 0) return null;

	const visible = Array.from(
		{ length: visibleCount },
		(_, offset) => active[(index + offset) % active.length],
	);

	return (
		<div className="relative">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{visible.map((member) => (
					<div
						key={member.id}
						className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
					>
						<div className="h-52 bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
							{member.photoUrl ? (
								<img
									src={member.photoUrl}
									alt={member.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
									<Users className="h-12 w-12 text-white" />
								</div>
							)}
						</div>
						<div className="p-5">
							<h3 className="font-bold text-lg text-primary">{member.name}</h3>
							<Badge className="mt-1 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
								{member.role}
							</Badge>
							{member.bio && (
								<p className="mt-3 text-sm text-muted-foreground line-clamp-3">
									{member.bio}
								</p>
							)}
							{member.linkedIn && (
								<a
									href={member.linkedIn}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-3 inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline"
								>
									<Linkedin className="h-4 w-4" /> LinkedIn
								</a>
							)}
						</div>
					</div>
				))}
			</div>

			{active.length > visibleCount && (
				<div className="flex items-center justify-center gap-4 mt-8">
					<Button
						variant="outline"
						size="icon"
						onClick={prev}
						className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex gap-1.5">
						{active.map((_, i) => (
							<button
								key={i}
								onClick={() => {
									setIndex(i);
									resetTimer();
								}}
								className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-secondary" : "w-2 bg-muted-foreground/30"}`}
							/>
						))}
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={next}
						className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}

export function About() {
	const { data: sections = [], isLoading: sectionsLoading } =
		useListAboutSections();
	const { data: members = [], isLoading: membersLoading } =
		useListTeamMembers();

	const sectionMap = Object.fromEntries(
		sections.map((s: AboutSection) => [s.key, s]),
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Banner */}
			<section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-24 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-secondary" />
					<div className="absolute bottom-10 right-20 h-60 w-60 rounded-full bg-white" />
					<div className="absolute top-1/2 left-1/2 h-32 w-32 rounded-full bg-accent" />
				</div>
				<div className="container mx-auto px-4 text-center relative z-10">
					<Badge className="mb-4 bg-secondary text-secondary-foreground px-4 py-1 text-sm font-semibold">
						Kitale Town, Kenya
					</Badge>
					<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
						About LubisiaTech
						<br />
						<span className="text-secondary">Solutions</span>
					</h1>
					<p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
						Empowering businesses and individuals across Kenya through
						innovative IT services and quality computer accessories.
					</p>
				</div>
			</section>

			{/* Vision, Mission, Mandate */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					{sectionsLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-56 rounded-2xl bg-muted animate-pulse"
								/>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{["vision", "mission", "mandate"].map((key, i) => {
								const section = sectionMap[key];
								if (!section) return null;
								return (
									<div
										key={key}
										data-reveal="up"
										data-delay={String(i * 150)}
										className="hover-up group rounded-2xl border border-border p-8 hover:shadow-lg transition-all duration-300 bg-white"
									>
										<div
											className={`h-14 w-14 rounded-xl flex items-center justify-center mb-5 ${SECTION_COLORS[key]}`}
										>
											{SECTION_ICONS[key]}
										</div>
										<h2 className="text-xl font-bold text-primary mb-3">
											{section.title}
										</h2>
										<p className="text-muted-foreground leading-relaxed">
											{section.content}
										</p>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</section>

			{/* Core Values */}
			{sectionMap.core_values && (
				<section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
					<div className="container mx-auto px-4">
						<div className="max-w-3xl mx-auto">
							<div data-reveal="down" className="text-center mb-10">
								<div className="inline-flex h-14 w-14 rounded-xl bg-primary text-primary-foreground items-center justify-center mb-4">
									<Shield className="h-7 w-7" />
								</div>
								<h2 className="text-3xl font-extrabold text-primary">
									{sectionMap.core_values.title}
								</h2>
								<p className="text-muted-foreground mt-2">
									The principles that guide everything we do
								</p>
							</div>
							<div
								data-reveal="up"
								data-delay="150"
								className="hover-up bg-white rounded-2xl shadow-md p-8 border border-border"
							>
								<CoreValuesList content={sectionMap.core_values.content} />
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Orange Stats Strip */}
			<section className="bg-secondary py-14">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-secondary-foreground">
						<div data-reveal="up" data-delay="0">
							<div className="text-4xl font-extrabold">
								<AnimatedNumber to={10} suffix="+" />
							</div>
							<div className="text-sm mt-1 text-white/80 font-medium">
								Years Experience
							</div>
						</div>
						<div data-reveal="up" data-delay="150">
							<div className="text-4xl font-extrabold">
								<AnimatedNumber to={500} suffix="+" />
							</div>
							<div className="text-sm mt-1 text-white/80 font-medium">
								Happy Clients
							</div>
						</div>
						<div data-reveal="up" data-delay="300">
							<div className="text-4xl font-extrabold">
								<AnimatedNumber to={8} />
							</div>
							<div className="text-sm mt-1 text-white/80 font-medium">
								IT Services
							</div>
						</div>
						<div data-reveal="up" data-delay="450">
							<div className="text-4xl font-extrabold">Kitale</div>
							<div className="text-sm mt-1 text-white/80 font-medium">
								Based In Kenya
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Team Carousel */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div data-reveal="up" className="text-center mb-12">
						<Badge className="mb-3 bg-accent/10 text-accent border-accent/20">
							Our People
						</Badge>
						<h2 className="text-3xl md:text-4xl font-extrabold text-primary">
							Meet the Team
						</h2>
						<p className="text-muted-foreground mt-3 max-w-xl mx-auto">
							The passionate professionals behind LubisiaTech Solutions
						</p>
					</div>
					{membersLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-72 rounded-2xl bg-muted animate-pulse"
								/>
							))}
						</div>
					) : members.filter((m: TeamMember) => m.active === 1).length === 0 ? (
						<div className="text-center text-muted-foreground py-12">
							Team members coming soon.
						</div>
					) : (
						<TeamCarousel members={members} />
					)}
				</div>
			</section>
		</div>
	);
}
