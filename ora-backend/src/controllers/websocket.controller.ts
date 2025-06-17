import { Request, Response } from 'express';
import { SocketService } from '../services/socket.service';

export class websocketController {
    static async getUsersConnected( req: Request, res: Response ): Promise<Response> {
        const formationId = req.query.formationId as string;

        const nbUsers = SocketService.getInstance().getNbUsersInRoom(formationId);

        return res.status(200).json({
            nbUsers: nbUsers
        });
    }
}