import { GrpcWebClientBase } from 'grpc-web';

export interface Service {
  client: GrpcWebClientBase;
  hostname: string;
  service: string;
  package: string;
}
