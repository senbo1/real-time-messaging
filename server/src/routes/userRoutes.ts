import { Router, Request, Response } from 'express';
import { getContacts, searchUsers } from '../services/userService';
import z from 'zod';

const router = Router();

router.get('/contacts', async (req: Request, res: Response) => {
  const userId = req.user!.id as string;
  const contacts = await getContacts(userId);
  res.json(contacts);
});

router.get('/search', async (req: Request, res: Response) => {
  console.log('request hit');
  const userId = req.user!.id as string;
  const result = z.string().safeParse(req.query.email);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: 'Invalid email', errors: result.error.errors });
  }

  const email = result.data;
  const users = await searchUsers(email, userId);

  console.log('response sent');
  res.json(users);
});

export default router;
