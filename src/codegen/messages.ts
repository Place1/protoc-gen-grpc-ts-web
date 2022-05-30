import {
  DescriptorProto,
  FieldDescriptorProto,
  FileDescriptorProto,
} from 'google-protobuf/google/protobuf/descriptor_pb';
import { concat, last } from 'lodash';
import ts from 'typescript';
import { Context } from './context';
import { keyword, primatives } from './keywords';
import { naming } from './naming';

export function codegenMessages(context: Context, file: FileDescriptorProto): ts.Statement[] {
  return allmessages(file).map((message) => codegenMessage(context, file, message));
}

export function allmessages(file: FileDescriptorProto): DescriptorProto[] {
  return file.getMessageTypeList().flatMap((message) => concat(message, message.getNestedTypeList()));
}

function codegenMessage(context: Context, proto: FileDescriptorProto, descriptor: DescriptorProto): ts.Statement {
  return ts.factory.createInterfaceDeclaration(
    undefined,
    [keyword.Export],
    naming.message(descriptor.getName()),
    undefined,
    undefined,
    descriptor.getFieldList().map((field) => codegenField(context, field)),
  );
}

export function codegenField(context: Context, descriptor: FieldDescriptorProto): ts.TypeElement {
  return ts.factory.createPropertySignature(
    undefined,
    naming.field(descriptor.getName()),
    undefined,
    typeOfField(context, descriptor),
  );
}

export function typeOfField(context: Context, descriptor: FieldDescriptorProto): ts.TypeNode {
  const t = typeOf(descriptor.getTypeName(), descriptor.getType());

  // TODO: maps
  // if (isMap(context, descriptor)) {
  //   return primatives.recordOf(
  //     typeOfField(context, mapKeyType(context, descriptor)),
  //     typeOfField(context, mapValueType(context, descriptor)),
  //   );
  // }

  if (descriptor.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED) {
    return primatives.arrayOf(t);
  }

  return t;
}

export function typeOf(typeName: string | undefined, descriptor: FieldDescriptorProto.Type | undefined): ts.TypeNode {
  if (!descriptor) {
    return ts.factory.createTypeReferenceNode('any');
  }

  switch (descriptor) {
    case FieldDescriptorProto.Type.TYPE_DOUBLE:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_FLOAT:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_INT64:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_UINT64:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_INT32:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_FIXED64:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_FIXED32:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_BOOL:
      return primatives.boolean;
    case FieldDescriptorProto.Type.TYPE_STRING:
      return primatives.string;
    case FieldDescriptorProto.Type.TYPE_GROUP:
      return ts.factory.createTypeReferenceNode('TYPE_GROUP');
    case FieldDescriptorProto.Type.TYPE_MESSAGE:
      return primatives.typeReference(naming.message(typeReference(typeName)));
    case FieldDescriptorProto.Type.TYPE_BYTES:
      return ts.factory.createTypeReferenceNode('any /* TYPE_BYTES */');
    case FieldDescriptorProto.Type.TYPE_UINT32:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_ENUM:
      return primatives.typeReference(naming.enum(typeReference(typeName)));
    case FieldDescriptorProto.Type.TYPE_SFIXED32:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_SFIXED64:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_SINT32:
      return primatives.number;
    case FieldDescriptorProto.Type.TYPE_SINT64:
      return primatives.number;
    default:
      return ts.factory.createTypeReferenceNode('any');
  }
}

export function typeReference(typeName: string | undefined): string {
  if (!typeName) {
    return 'UNKNOWN_TYPE_REFERENCE';
  }
  return last(typeName.split('.'))!;
}
