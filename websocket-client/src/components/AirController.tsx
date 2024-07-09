import React, { PropsWithChildren, useEffect, useState } from "react";
import { socket } from "../shared/utils";

// 상수
const LIMIT_MIN = 0;
const LIMIT_MAX = 5;

const AirController = () => {
  // 카운트
  const [count, setCount] = useState<number>(LIMIT_MIN);

  // 카운트 증가
  const countDown = (): void => {
    if (count <= LIMIT_MIN) return;

    // 소켓을 통해 서버로 이벤트 전송 (이벤트 이름, 전송할 데이터)
    socket.emit("counter", count - 1);
    setCount(count - 1);
  };

  // 카운트 감소
  const countUp = (): void => {
    if (count >= LIMIT_MAX) return;

    // 소켓을 통해 서버로 이벤트 전송 (이벤트 이름, 전송할 데이터)
    socket.emit("counter", count + 1);
    setCount(count + 1);
  };

  useEffect(() => {
    // 카운터 이벤트 실행
    socket.on("counter", (num: number) => {
      setCount(num);
    });

    return () => {
      // 카운터 이벤트 종료
      socket.off("counter");
    };
  }, []);

  return (
    <section>
      <h2>counter</h2>

      <p>{count}</p>

      <ControleButton clickHandler={countDown}>-</ControleButton>
      <ControleButton clickHandler={countUp}>+</ControleButton>
    </section>
  );
};

interface PropsType {
  clickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const ControleButton: React.FC<PropsWithChildren<PropsType>> = ({
  children,
  clickHandler,
}) => {
  return (
    <button type="button" onClick={clickHandler}>
      {children}
    </button>
  );
};

export default AirController;
