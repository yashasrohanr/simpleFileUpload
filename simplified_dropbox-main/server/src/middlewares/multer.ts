import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
        cb(err, "");
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
export default upload;
