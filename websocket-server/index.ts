import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";

// url 설정
const BASIC_URL = "http://localhost";
const PORT_CLIENT = 3000;
const PORT_SERVER = 4000;

const clientUrl = `${BASIC_URL}:${PORT_CLIENT}`;

// express 애플리케이션 생성
const app = express();

// 애플리케이션에 cors 설정 추가
app.use(cors({ origin: clientUrl }));

// 정적 파일 서빙 설정(React 연동)
app.use(express.static(path.join(__dirname, "../../websocket-client/build")));

// Express.js 서버에서 특정 경로로 요청이 들어왔을 때, 해당 경로에 대응하는 HTML 파일을 클라이언트에게 보내줌
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../websocket-client/build/index.html"));
});

// http 서버 생성. 명시적으로 호출.
const server = http.createServer(app);

// Socket.io 서버를 생성하여 HTTP 서버에 연결, 전역 객체 생성
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
  },
});

// 서버 실행 여부 확인
console.log("서버 실행 중🔥");

// 클라이언트 연결 처리
io.on("connection", (socket) => {
  console.log("a user connected");

  // 메세지 이벤트 처리
  socket.on("message", (msg) => {
    // msg는 클라이언트에서 보낸 메세지 객체
    console.log("message: " + msg.text);
    console.log("user: " + msg.userId);

    // 모든 클라이언트에게 이 메시지를 브로드캐스트
    io.emit("message", msg);
  });

  // 카운터 이벤트 처리
  socket.on("counter", (num) => {
    // num은 클라이언트에서 보낸 숫자
    console.log("num: " + num);

    io.emit("counter", num);
  });

  // 클라이언트 연결 종료 처리
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// 서버 시작(app.listen은 express의 편의 메서드로, 내부적으로 http.createServer를 호출하지만, 이미 http.createServer를 명시적으로 호출했기 때문에 server.listen을 사용해야 합니다.)
server.listen(PORT_SERVER, () => {
  console.log("listening on *:4000");
});
