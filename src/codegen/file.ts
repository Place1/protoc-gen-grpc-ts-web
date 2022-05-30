import { CodeGeneratorResponse } from 'google-protobuf/google/protobuf/compiler/plugin_pb';
import { FileDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import { concat } from 'lodash';
import { Context } from './context';
import { codegenEnum } from './enums';
import { codegenHead } from './head';
import { codegenImports } from './imports';
import { codegenMarshallers } from './marshallers';
import { codegenMessages } from './messages';
import { naming } from './naming';
import { printFile } from './printer';
import { codegenService } from './services';

export function codegen(context: Context, file: FileDescriptorProto): CodeGeneratorResponse.File {
  const out = new CodeGeneratorResponse.File();
  out.setName(naming.file(file.getName()!));

  const statements = concat(
    codegenHead(),
    codegenImports(context, file),
    file.getServiceList().map((service) => codegenService(context, file, service)),
    codegenMessages(context, file),
    file.getEnumTypeList().flatMap((enumdesc) => codegenEnum(context, enumdesc)),
    codegenMarshallers(context, file),
  );

  out.setContent(printFile(statements));

  return out;
}
