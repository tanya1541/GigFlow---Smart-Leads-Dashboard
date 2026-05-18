
import { Router } from "express";
import { createLead, getLeads } from "../controllers/lead.controller";
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post("/", protect, createLead);
router.get("/", protect, getLeads);

export default router;