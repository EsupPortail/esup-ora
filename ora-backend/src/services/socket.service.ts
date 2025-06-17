import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { Server as httpsServer } from "https";
import { logger } from "../configs/logger";

interface UserInfo {
  firstname: string;
  lastname: string;
}

const INACTIVITY_TIMEOUT = 3600000; // 1 hour

export class SocketService {
  private static instance: SocketService;
  private static io: SocketIOServer;

  private roomActivityTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private roomUsers: Map<string, Set<string>> = new Map(); // roomName -> Set of user JSON strings
  private socketUserMap: Map<string, { room: string; user: UserInfo }> =
    new Map();

  private constructor(server: httpServer | httpsServer) {
    SocketService.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGIN,
      },
      path: "/api/websocket",
    });
    logger.info("Socket service initialized. State: running");
    this.initialize();
  }

  public static initInstance(server: httpServer | httpsServer): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService(server);
    }
    return SocketService.instance;
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      throw new Error(
        "SocketService not initialized. Call initInstance first.",
      );
    }
    return SocketService.instance;
  }

  private initialize() {
    SocketService.io.on("connection", (socket: Socket) => {
      socket.on(
        "connect-to-formation",
        ({ formationId, firstname, lastname }) => {
          if (!formationId || !firstname || !lastname) {
            socket.emit("error", "Missing formationId, firstname or lastname");
            return;
          }

          const roomName = `formation-${formationId}`;
          const userStr = JSON.stringify({ firstname, lastname });

          // Remove user from previous room
          const prev = this.socketUserMap.get(socket.id);
          if (prev) {
            const prevRoom = prev.room;
            this.roomUsers.get(prevRoom)?.delete(JSON.stringify(prev.user));
            socket.leave(prevRoom);
            SocketService.io.to(prevRoom).emit("user-left", prev.user);
          }

          // Join new room
          socket.join(roomName);
          if (!this.roomUsers.has(roomName)) {
            this.roomUsers.set(roomName, new Set());
          }
          this.roomUsers.get(roomName)!.add(userStr);
          this.socketUserMap.set(socket.id, {
            room: roomName,
            user: { firstname, lastname },
          });

          this.refreshActivity(roomName);
          this.notifyRoomNewUserConnection(formationId);
        },
      );

      socket.on("disconnect-to-formation", () => {
        const data = this.socketUserMap.get(socket.id);
        if (!data) return;

        const { room, user } = data;
        const userStr = JSON.stringify(user);

        this.roomUsers.get(room)?.delete(userStr);
        socket.leave(room);
        this.socketUserMap.delete(socket.id);
        this.refreshActivity(room);
        SocketService.io.to(room).emit("user-left", user);
      });

      socket.on("get-users-count", ({ formationId }, callback) => {
        const roomName = `formation-${formationId}`;
        const count = this.roomUsers.get(roomName)?.size || 0;
        const users = Array.from(this.roomUsers.get(roomName) || []).map((u) =>
          JSON.parse(u),
        );
        callback({ count, room: roomName, usersConnected: users });
      });

      socket.on("notify-change-on-datamodel", ({ elementToNotify}) => {
        const data = this.socketUserMap.get(socket.id);
        console.log("hello 1111 from back for notify", data?.room);
        if (!data) return;

        const { room, user } = data;
        console.log("hello from back for notify", data?.room);
        if (!data) {
          return;
        }
        console.log(room);
        console.log(elementToNotify)
        SocketService.io
          .to(room)
          .emit("need-refresh", {
            message: `${elementToNotify} has changed!`,
            datamodel_element: `${elementToNotify}`,
          });
      });
      socket.on("disconnect", () => {
        const data = this.socketUserMap.get(socket.id);
        if (!data) return;

        const { room, user } = data;
        const userStr = JSON.stringify(user);
        this.roomUsers.get(room)?.delete(userStr);
        this.socketUserMap.delete(socket.id);
        this.refreshActivity(room);
        SocketService.io.to(room).emit("user-left", user);
      });
    });
  }

  private refreshActivity(roomName: string) {
    if (this.roomActivityTimeouts.has(roomName)) {
      clearTimeout(this.roomActivityTimeouts.get(roomName)!);
    }
    const timeout = setTimeout(
      () => this.disconnectRoom(roomName),
      INACTIVITY_TIMEOUT,
    );
    this.roomActivityTimeouts.set(roomName, timeout);
  }

  private notifyRoomNewUserConnection(formationId: string) {
    const roomName = `formation-${formationId}`;
    const users = Array.from(this.roomUsers.get(roomName) || []).map(
      (userStr) => JSON.parse(userStr),
    );

    if (users.length === 0) return;

    SocketService.io.to(roomName).emit("room-notification", {
      message: `new users connected in room ${formationId}`,
      users,
    });
  }

  private disconnectRoom(roomName: string) {
    const clients = SocketService.io.sockets.adapter.rooms.get(roomName);
    if (clients) {
      for (const socketId of clients) {
        const socket = SocketService.io.sockets.sockets.get(socketId);
        if (socket) socket.disconnect(true);
      }
    }
    this.clearRoom(roomName);
  }

  private clearRoom(roomName: string) {
    this.roomActivityTimeouts.delete(roomName);
    this.roomUsers.delete(roomName);
  }

  public static needRefresh(formationId: string, objectToRefresh: string) {
    const roomName = `formation-${formationId}`;
    SocketService.io.to(roomName).emit("need-refresh", {
      message: `${objectToRefresh}`,
    });
  }

  public getConnectedUsers(formationId: string): string[] {
    const roomName = `formation-${formationId}`;
    return Array.from(this.roomUsers.get(roomName) || []);
  }

  public getNbUsersInRoom(formationId: string): number {
    const roomName = `formation-${formationId}`;
    return this.roomUsers.get(roomName)?.size || 0;
  }
}
