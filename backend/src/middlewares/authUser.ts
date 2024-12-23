import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include the custom property
interface CustomRequest extends Request {
    body: {
        userId?: string; // Adding userId as an optional property
        [key: string]: any; // To allow other properties in body
    };
}

// User authentication middleware
const authUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Extract the token from headers
        const token = req.headers["token"] as string | undefined;

        if (!token) {
            res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
            return;
        }

        // Verify the token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof tokenDecode === "string") {
            res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
            return;
        }

        // Safely add userId to req.body
        const decodedPayload = tokenDecode as JwtPayload;
        req.body.userId = decodedPayload.id;

        next(); // Proceed to the next middleware
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default authUser;

