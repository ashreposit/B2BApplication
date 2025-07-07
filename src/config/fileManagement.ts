import path from "path";
import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { CustomStorage } from "../services/common.service";

const myStorage: StorageEngine = new CustomStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename?: string) => void
  ) => {
    const originalName = file.originalname.replace(/\s/g, "_");
    const ext = path.extname(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

    const timestamp = Date.now();
    const fileName = `images/${nameWithoutExt}_${timestamp}${ext}`

    cb(null, fileName);
  },
});

export const upload = multer({
  storage: myStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
