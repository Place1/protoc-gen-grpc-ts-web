import { BinaryReader, BinaryWriter } from 'google-protobuf';
import { Metadata, MethodDescriptor, MethodType, RpcError } from 'grpc-web';
import { Marshaller } from './serialization';
import { Service } from './service';

export interface UnaryRequestOptions {
  metadata?: Metadata;
  signal?: AbortSignal;
}

export interface UnaryMethod<TRequest, TResponse> {
  name: string;
  input: Marshaller<TRequest>;
  output: Marshaller<TResponse>;
}

export function unaryRequest<TRequest, TResponse>(
  service: Service,
  request: TRequest,
  options: UnaryRequestOptions,
  method: UnaryMethod<TRequest, TResponse>,
): Promise<TResponse> {
  return new Promise<TResponse>((resolve, reject) => {
    const unaryCall = service.client.rpcCall(
      service.hostname + `/${service.package}.${service.service}/${method.name}`,
      request,
      options.metadata ?? {},
      new MethodDescriptor<TRequest, TResponse>(
        method.name,
        MethodType.UNARY,
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
      (err: RpcError, res: TResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      },
    );

    if (options.signal) {
      // TODO: do we need to cleanup the listener?
      options.signal.addEventListener('abort', () => {
        unaryCall.cancel();
      });
    }
  });
}
