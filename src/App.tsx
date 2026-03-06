import React, { useState } from "react";
import "./App.css";
import { toBitArray } from "./utils/bit-array";

function App() {
  const [port, setPort] = useState<SerialPort>();
  const [connectionState, setConnectionState] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const [byte, setByte] = useState<string>("");

  const connectionHandler = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port?.open({
        baudRate: 9600,
        bufferSize: 255,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        flowControl: "none",
      });

      setPort(port);
      setConnectionState("connected");
    } catch (e) {
      console.error(e);
    }
  };

  const writeHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const writer = port?.writable?.getWriter();
    if (!writer) throw new Error("Writer not found");

    const value = new Uint8Array([parseInt(byte) % 256]);
    await writer.write(value);
    writer.releaseLock();
  };

  const readHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const reader = port?.readable?.getReader();
    if (!reader) throw new Error("Reader not found");

    try {
      while (true) {
        const { value, done } = await reader.read();

        console.log(toBitArray(value!));
        if (done) break;
      }
    } catch (err) {
      console.error("Serial read error:", err);
    } finally {
      reader.releaseLock();
    }
  };

  return (
    <>
      <h1>{connectionState}</h1>
      <button onClick={connectionHandler}>Initiate connection</button>

      <button onClick={readHandler}>Init Read</button>

      <br />

      <input
        type="number"
        value={byte}
        onChange={(e) => setByte(e.target.value)}
      />
      <button onClick={writeHandler}>write</button>
    </>
  );
}

export default App;
