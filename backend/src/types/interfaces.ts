export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
}

export interface ILead {
  name: string;
  email: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: IUser;
}