import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import productsRouter from "./products";
import ordersRouter from "./orders";
import inquiriesRouter from "./inquiries";
import statsRouter from "./stats";
import blogRouter from "./blog";
import settingsRouter from "./settings";
import affiliateRouter from "./affiliate";
import authRouter from "./auth";
import newsletterRouter from "./newsletter";
import websiteTemplatesRouter from "./website-templates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(newsletterRouter);
router.use(servicesRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(inquiriesRouter);
router.use(statsRouter);
router.use(blogRouter);
router.use(settingsRouter);
router.use(affiliateRouter);
router.use(websiteTemplatesRouter);

export default router;
