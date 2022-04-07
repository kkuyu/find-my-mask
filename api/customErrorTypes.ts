export interface CustomErrorProto extends Error {
  readonly name: string;
  readonly label: string;
  readonly extra: {
    [key: string]: any;
  };
  readonly stack: string;
}
