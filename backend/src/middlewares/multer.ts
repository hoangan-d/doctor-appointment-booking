import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Use unique filenames
    },
});

const upload = multer({ storage });
export default upload;
