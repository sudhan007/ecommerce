import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT } from "../config/config.js";

export const checkPassword = (password, passwordHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        reject(err);
      }
      resolve(same);
    });
  });
};

export const newToken = (phoneNumber) => {
  return jwt.sign({ id: phoneNumber }, JWT.jwt, {
    expiresIn: JWT.jwtExp,
  });
};

export const adminToken = (admin) => {
  const payload = {
    id: admin._id,
    isAdmin: true,
  };

  return jwt.sign(payload, JWT.jwt, {
    expiresIn: JWT.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
