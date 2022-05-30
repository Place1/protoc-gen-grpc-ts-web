import {
  DescriptorProto,
  EnumDescriptorProto,
  FileDescriptorProto,
} from 'google-protobuf/google/protobuf/descriptor_pb';
import { concat, keyBy } from 'lodash';

export interface Context {
  typemap: Record<string, Dependency>;
}

export function createContext(protos: FileDescriptorProto[]): Context {
  return {
    typemap: createDependencyMap(protos),
  };
}

export interface Dependency {
  file: string;
  typeName: string;
  descriptor: DescriptorProto | EnumDescriptorProto;
}

function createDependencyMap(protos: FileDescriptorProto[]): Record<string, Dependency> {
  const dependencies = protos.flatMap((file) => {
    return concat(
      file.getMessageTypeList().map(
        (message): Dependency => ({
          file: file.getName()!,
          typeName: `.${file.getPackage()}.${message.getName()}`,
          descriptor: message,
        })
      ),
      file.getEnumTypeList().map(
        (message): Dependency => ({
          file: file.getName()!,
          typeName: `.${file.getPackage()}.${message.getName()}`,
          descriptor: message,
        })
      ),
      file
        .getMessageTypeList()
        .flatMap((message) => message.getNestedTypeList().map((nestedMessage) => ({ message, nestedMessage })))
        .map(({ message, nestedMessage }) => ({
          file: file.getName()!,
          typeName: `.${file.getPackage()}.${message.getName()}.${nestedMessage.getName()}`,
          descriptor: nestedMessage,
        }))
    );
  });

  return keyBy(dependencies, (dep) => dep.typeName);
}
