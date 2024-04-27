import User from '../models/User.js';
import { verifyToken } from '../utils/utility.function.js';

export const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : 'Invalid input !!');
};

// export const verifyUser = async (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization) {
//     sendResponseError(400, 'You are not authorized ', res);
//     return;
//   } else if (!authorization.startsWith('Bearer ')) {
//     sendResponseError(400, 'You are not authorized ', res);
//     return;
//   }

//   try {
//     const payload = await verifyToken(authorization.split(' ')[1]);
//     if (payload) {
//       const user = await User.findById(payload.id, { password: 0 });

//       req.user = user;

//       next();
//     } else {
//       sendResponseError(400, 'You are not authorized', res);
//     }
//   } catch (err) {
//     console.log('Error ', err);
//     sendResponseError(400, `Error ${err}`, res);
//   }
// };

export const verifyUser = async (req, res, next) => {
  const authcookie = req.cookies.authcookie;

  if (!authcookie) {
    sendResponseError(400, 'You are not authorized', res);
    return;
  }

  try {
    const payload = await verifyToken(authcookie);

    if (payload) {
      const user = await User.findById(payload.id, { password: 0 });

      if (user) {
        req.user = user;
        next();
      } else {
        sendResponseError(400, 'User not found', res);
      }
    } else {
      sendResponseError(400, 'You are not authorized', res);
    }
  } catch (err) {
    console.log('Error:', err);
    sendResponseError(400, `Error: ${err}`, res);
  }
};

export const isAdmin = (req, res, next) => {
  const isAdminUser = req.user && req.user.isAdmin;

  if (isAdminUser) {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized: Admin access required" });
  }
};




