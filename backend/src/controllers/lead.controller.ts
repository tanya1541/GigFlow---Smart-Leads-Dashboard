import { Response } from "express";
import Lead from "../models/Lead";
import { leadSchema } from "../utils/validators";
import { AuthRequest } from "../middlewares/auth.middleware";
import { FilterQuery } from "mongoose";
import { ILead } from "../types/interfaces";

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

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, source, search, page = "1", sort = "latest"} = req.query;

    const limit = 10;
    const pageNumber = parseInt(page as string) || 1;
    const skip = (pageNumber - 1) * limit;

    const query: FilterQuery<ILead> = {
      createdBy: req.user!._id,
    };

    const sortOption =
      sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // FILTER
    if (status) query.status = status;
    if (source) query.source = source;

    // SEARCH
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // FETCH DATA
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // COUNT TOTAL
    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: pageNumber,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const parsed = leadSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message,
      });
    }

    const lead = await Lead.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user!._id, // ownership check
      },
      parsed.data,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // RBAC: only admin
    if (req.user!.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};