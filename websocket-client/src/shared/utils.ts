import { Socket, io } from "socket.io-client";

// 소켓 설정
export const socket: Socket = io("http://localhost:4000");
