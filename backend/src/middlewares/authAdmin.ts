import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Ensure JWT_SECRET is defined
        if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error("Server configuration error. Missing environment variables.");
        }

        // Extract the token from headers
        const atoken = req.headers["atoken"] as string | undefined;

        if (!atoken) {
            res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
            return;
        }

        // Verify the token
        const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET!);

        if (typeof tokenDecode !== "object" || tokenDecode === null) {
            res.status(401).json({ success: false, message: "Invalid token." });
            return;
        }

        const { email, role } = tokenDecode as { email: string; role: string };

        // Check if the email and role match admin credentials
        if (
            email !== process.env.ADMIN_EMAIL ||
            role !== "admin"
        ) {
            res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
            return;
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default authAdmin;
