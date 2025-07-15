
import multer from "multer";

const storage = multer.memoryStorage(); // lưu file trong RAM
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

