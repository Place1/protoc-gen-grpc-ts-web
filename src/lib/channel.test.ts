import { Channel } from './channel';

describe('channel', () => {
  it('should send and receive', async () => {
    const channel = new Channel(1);
    await channel.send('hello');
    expect(await channel.recv()).toEqual(['hello', false]);
  });

  it('should send and receive multiple senders', async () => {
    const channel = new Channel(0);
    channel.send(1);
    channel.send(2);
    channel.send(3);
    channel.send(4);
    const results = await Promise.all([channel.recv(), channel.recv(), channel.recv(), channel.recv()]);
    expect(results).toEqual([
      [1, false],
      [2, false],
      [3, false],
      [4, false],
    ]);

    const last = channel.recv();
    channel.close();
    await expect(last).resolves.toEqual([undefined, true]);
  });

  it('should throw when sending on a closed channel', async () => {
    const channel = new Channel();
    channel.close();
    await expect(channel.send('hello')).rejects.toThrowError('send on closed channel');
  });

  it('blocked sends throw when the channel is closed', async () => {
    const channel = new Channel();
    const promise = channel.send('hello');
    channel.close();
    await expect(promise).rejects.toThrowError('send on closed channel');
  });

  it('should throw when recv on a closed channel', async () => {
    const channel = new Channel();
    channel.close();
    await expect(channel.recv()).rejects.toThrowError('recv on closed channel');
  });

  it('should be an AsyncIterator', async () => {
    const channel = new Channel<number>();

    channel.send(0);
    channel.send(1);
    channel.send(2);
    channel.send(3);
    sleep(0).then(() => channel.close());

    let i = 0;
    for await (const value of channel) {
      expect(value).toEqual(i);
      i += 1;
    }
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}
