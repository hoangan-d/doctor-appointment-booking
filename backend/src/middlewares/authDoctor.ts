import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include the custom property
interface CustomRequest extends Request {
    body: {
        docId?: string; // Adding doctorId as an optional property
        [key: string]: any; // To allow other properties in body
    };
}

// Doctor authentication middleware
const authDoctor = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Extract the token from headers
        const dtoken = req.headers["dtoken"] as string | undefined;

        if (!dtoken) {
            res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
            return;
        }

        // Verify the token
        const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET!);

        if (typeof tokenDecode === "string") {
            res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
            return;
        }

        // Safely add doctorId to req.body
        const decodedPayload = tokenDecode as JwtPayload;
        req.body.docId = decodedPayload.id;

        next(); // Proceed to the next middleware
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

export default authDoctor;

