import { BinaryReader, BinaryWriter } from 'google-protobuf';
import { Metadata, MethodDescriptor, MethodType, RpcError } from 'grpc-web';
import { Channel } from './channel';
import { Marshaller } from './serialization';
import { Service } from './service';

export interface StreamingRequestOptions {
  metadata?: Metadata;
  signal?: AbortSignal;
}

export interface StreamingMethod<TRequest, TResponse> {
  name: string;
  input: Marshaller<TRequest>;
  output: Marshaller<TResponse>;
}

export async function* streamingRequest<TRequest, TResponse>(
  service: Service,
  request: TRequest,
  options: StreamingRequestOptions,
  method: StreamingMethod<TRequest, TResponse>,
): AsyncIterable<TResponse> {
  const stream = service.client.serverStreaming(
    service.hostname + `/${service.package}.${service.service}/${method.name}`,
    request,
    options.metadata ?? {},
    new MethodDescriptor<TRequest, TResponse>(
      method.name,
      MethodType.SERVER_STREAMING,
      null as any,
      null as any,
      (request: TRequest): Uint8Array => {
        const writer = new BinaryWriter();
        method.input.serializeBinaryToWriter(request, writer);
        return writer.getResultBuffer();
      },
      (bytes: Uint8Array): TResponse => {
        const message: any = {};
        method.output.deserializeBinaryFromReader(message, new BinaryReader(bytes));
        return message;
      },
    ),
  );

  const channel = new Channel<[TResponse | undefined, RpcError | undefined]>();

  const ondata = (message: TResponse) => channel.send([message, undefined]);
  stream.on('data', ondata);

  const onerror = (error: RpcError) => channel.send([undefined, error]);
  stream.on('error', onerror);

  const onend = () => {
    stream.removeListener('data', ondata);
    stream.removeListener('error', onerror);
    stream.removeListener('end', onend);
    channel.close();
  };
  stream.on('end', onend);

  if (options.signal) {
    // TODO: do we need to cleanup the listener?
    options.signal.addEventListener('abort', () => {
      stream.cancel();
    });
  }

  return channel;
}
