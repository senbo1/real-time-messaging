import { Router, Request, Response } from 'express';
import { getLastMessage } from '../services/messageService';
const router = Router();

router.get(
  '/:conversationId/last-message',
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const lastMessage = await getLastMessage(conversationId);
    res.json(lastMessage);
  }
);

export default router;
