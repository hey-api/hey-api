const x = value as {
  readonly [K in keyof T]?: string;
};
