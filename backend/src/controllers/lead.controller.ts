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

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, source, search, page = "1", sort = "latest"} = req.query;

    const limit = 10;
    const pageNumber = parseInt(page as string) || 1;
    const skip = (pageNumber - 1) * limit;

    const query: any = {
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