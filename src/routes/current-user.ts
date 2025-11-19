import express, { Request, Response } from 'express';
import { currentUser } from '@ccticketsorg/common';

const router = express.Router();

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: { jwt?: string };
    }
  }
}

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter }