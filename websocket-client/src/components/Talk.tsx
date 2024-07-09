import React, { useEffect, useState } from "react";
import { socket } from "../shared/utils";

// 타입 설정
type userIdType = string;
type formType = "id" | "submit";

interface Message {
  messageId: number;
  text: string;
  userId: userIdType;
}

const Talk: React.FC = () => {
  // 현재 입력된 메세지
  const [message, setMessage] = useState<string>("");
  // 메세지 배열
  const [messages, setMessages] = useState<Message[]>([]);
  // 폼의 타입
  const [formType, setFormType] = useState<formType>("id");
  // userId
  const [userId, setUserId] = useState<userIdType>("");
  // id 입력여부
  const [isPermit, setPermit] = useState<boolean>(false);

  // 메세지 전송 함수
  const sendMessage = () => {
    if (message.trim() === "") return;

    // 소켓을 통해 서버로 이벤트 전송 (이벤트 이름, 전송할 데이터)
    socket.emit("message", { text: message, userId: userId });
    setMessage("");
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const type = e.currentTarget.dataset.type;

    if (type === "id") {
      setPermit(true);
      setFormType("submit");
      return;
    }

    sendMessage();
  };

  useEffect(() => {
    // 메세지 이벤트 실행
    socket.on("message", (msg: { text: string; userId: userIdType }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { messageId: prevMessages.length, text: msg.text, userId: msg.userId },
      ]);
    });

    return () => {
      // 메세지 이벤트 종료
      socket.off("message");
    };
  }, [userId]);

  // 컴포넌트 출력
  if (isPermit) {
    return (
      <form onSubmit={formSubmit} data-type={formType}>
        <section>
          <h2>메세지</h2>

          <div>
            {messages.map((msg) => (
              <div key={msg.messageId}>
                {msg.userId}:{msg.text}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>메세지 입력</h2>

          <div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <button type="submit">Send</button>
          </div>
        </section>
      </form>
    );
  }

  return (
    <form onSubmit={formSubmit} data-type={formType}>
      <section>
        <h2>아이디 설정</h2>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your id"
        />
        <button type="submit">Send</button>
      </section>
    </form>
  );
};

export default Talk;
