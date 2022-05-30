// https://gist.github.com/iwasaki-kenta/a3eff0bfbbb4974d33517ecf500b69de

export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

// [T, false] when the channel emits a value.
// [undefined, true] when the channel is closed.
type Value<T> = [T, false] | [undefined, true];

export class Channel<T> implements AsyncIterable<T> {
  private isClosed = false;

  public constructor(
    public readonly capacity = 0,
    private readonly values: Array<T> = [],
    private readonly sends: Array<{ value: T; signal: Deferred<void> }> = [],
    private readonly recvs: Array<Deferred<Value<T>>> = []
  ) {}

  public send(value: T): Promise<void> {
    if (this.isClosed) {
      return Promise.reject(new Error('send on closed channel'));
    }

    if (this.recvs.length > 0) {
      this.recvs.shift()!.resolve([value, false]);
      return Promise.resolve();
    }

    if (this.values.length < this.capacity) {
      this.values.push(value);
      return Promise.resolve();
    }

    const signal = new Deferred<void>();
    this.sends.push({ value, signal });
    return signal.promise;
  }

  public recv(): Promise<Value<T>> {
    if (this.isClosed) {
      return Promise.reject(new Error('recv on closed channel'));
    }

    if (this.values.length > 0) {
      return Promise.resolve([this.values.shift()!, false]);
    }

    if (this.sends.length > 0) {
      const send = this.sends.shift()!;
      send.signal.resolve();
      return Promise.resolve([send.value, false]);
    }

    const signal = new Deferred<Value<T>>();
    this.recvs.push(signal);
    return signal.promise;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
    while (true) {
      const [value, closed] = await this.recv();
      if (closed) {
        return;
      }
      yield value!;
    }
  }

  public close(): void {
    this.isClosed = true;
    if (this.sends.length > 0) {
      for (const send of this.sends) {
        send.signal.reject(new Error('send on closed channel'));
      }
    }
    if (this.recvs.length > 0) {
      for (const recv of this.recvs) {
        recv.resolve([undefined, true]);
      }
    }
  }
}
