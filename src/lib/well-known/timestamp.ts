interface Timestamp {
  seconds: number;
  nanos: number;
}

export function timestampFromDate(value: Date): Timestamp {
  return {
    seconds: Math.floor(value.getTime() / 1000),
    nanos: value.getMilliseconds() * 1000000,
  };
}

export function timestampToDate(timestamp: Timestamp) {
  return new Date(timestamp.seconds * 1000 + timestamp.nanos / 1000000);
}
