
import { Router } from "express";
import { createLead } from "../controllers/lead.controller";
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post("/", protect, createLead);

export default router;