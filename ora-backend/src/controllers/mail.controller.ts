import { Request, Response } from 'express';
import { logger } from '../configs/logger';
import { MailService } from '../services/mail.service';

interface NotifyMutualisationBody {
  to: string | string[];
  subject?: string;
  message: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export class mailController {
  static async notifyMutualisation(req: Request, res: Response): Promise<Response> {
    console.log(req.body)
    const { to, subject, message, cc, bcc } = req.body as NotifyMutualisationBody;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    try {
      await MailService.getInstance().sendMail({
        to,
        subject: subject ?? 'Notification de mutualisation',
        html: message,
        cc,
        bcc, 
      });

      return res.status(200).json({ success: true, message: 'Mail sent successfully.' });
    } catch (error) {
      logger.error('[mailController] Failed to send mutualisation notification.', { error });
      return res.status(500).json({ error: 'Failed to send mail.' });
    }
  }
}