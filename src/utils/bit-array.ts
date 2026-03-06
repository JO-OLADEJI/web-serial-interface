export const toBitArray = (byteArray: Uint8Array): number[] => {
  if (byteArray.length !== 1)
    throw new Error("Uint8Array must contain exactly one byte");

  const BYTE_LEN = 8;

  const byte = byteArray[0];
  const bitString = byte.toString(2).padStart(BYTE_LEN, "0");

  return bitString.split("").map((bit) => parseInt(bit));
};
