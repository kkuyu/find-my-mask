export interface CustomErrorProto extends Error {
  readonly name: string;
  readonly label: string;
  readonly extra?: object;
  readonly stack: string;
}
