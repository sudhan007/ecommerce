import fs from "fs";
import { Router } from "express";
import path from "path";
import process from "process";

const fileRouter = Router();

const BASE_FOLDER = "uploads/";
const TARGET_FOLDER = path.join(process.cwd(), BASE_FOLDER);

fileRouter.get("/view", (request, reply) => {
  try {
    const { image: filename } = request.query;
    const filePath = TARGET_FOLDER + filename;
    if (fs.existsSync(filePath)) {
      return reply.sendFile(filename, { root: BASE_FOLDER });
    }

    return reply.status(404).send({
      message: "File not found",
      ok: false,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      message: error.message,
      ok: false,
    });
  }
});

export { fileRouter };
