import { Response } from "express";
import Lead from "../models/Lead";
import { leadSchema } from "../utils/validators";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message,
      });
    }

    const lead = await Lead.create({
      ...parsed.data,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};