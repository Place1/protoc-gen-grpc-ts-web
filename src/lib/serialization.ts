import { BinaryReader, BinaryWriter } from 'google-protobuf';
import { DescriptorProto, FieldDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import { naming } from '../codegen/naming';

export type Dependencies = Record<string, Marshaller<any>>;

export interface Marshaller<T> {
  serialize: (message: T) => Uint8Array;
  deserialize: (bytes: Uint8Array) => T;
  serializeBinaryToWriter: (message: T, writer: BinaryWriter) => void;
  deserializeBinaryFromReader: (message: Partial<T>, reader: BinaryReader) => void;
}

export abstract class MessageMarshaller<T> implements Marshaller<T> {
  protected abstract descriptor(): string;
  protected abstract dependencies(): Dependencies;

  serialize = (message: T): Uint8Array => {
    const writer = new BinaryWriter();
    this.serializeBinaryToWriter(message, writer);
    return writer.getResultBuffer();
  };

  deserialize = (bytes: Uint8Array): T => {
    const message = {};
    const reader = new BinaryReader(bytes);
    this.deserializeBinaryFromReader(message, reader);
    return message as T;
  };

  serializeBinaryToWriter = (message: T, writer: BinaryWriter): void => {
    const descriptor = new DescriptorProto();
    DescriptorProto.deserializeBinaryFromReader(descriptor, new BinaryReader(this.descriptor()));
    const registry = this.dependencies();

    for (const field of descriptor.getFieldList()) {
      serializeField(registry, field, (message as any)[naming.field(field.getName())], writer);
    }
  };

  deserializeBinaryFromReader = (message: Partial<T>, reader: BinaryReader): void => {
    const descriptor = new DescriptorProto();
    DescriptorProto.deserializeBinaryFromReader(descriptor, new BinaryReader(this.descriptor()));
    const registry = this.dependencies();

    for (const field of descriptor.getFieldList()) {
      (message as any)[naming.field(field.getName())] = fieldDefaultValue(field);
    }

    while (reader.nextField()) {
      if (reader.isEndGroup()) {
        break;
      }

      const field = reader.getFieldNumber();

      const fieldDesc = descriptor.getFieldList().find((fieldDesc) => fieldDesc.getNumber() === field);
      if (!fieldDesc) {
        reader.skipField();
      } else {
        const fieldValue = deserializeField(registry, fieldDesc, reader);

        if (fieldDesc.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED) {
          (message as any)[naming.field(fieldDesc.getName())].push(fieldValue);
        } else {
          (message as any)[naming.field(fieldDesc.getName())] = fieldValue;
        }
      }
    }
  };
}

function fieldDefaultValue(field: FieldDescriptorProto): any {
  if (field.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED) {
    return [];
  }

  switch (field.getType()) {
    case FieldDescriptorProto.Type.TYPE_DOUBLE:
      return 0;
    case FieldDescriptorProto.Type.TYPE_FLOAT:
      return 0;
    case FieldDescriptorProto.Type.TYPE_INT64:
      return 0;
    case FieldDescriptorProto.Type.TYPE_UINT64:
      return 0;
    case FieldDescriptorProto.Type.TYPE_INT32:
      return 0;
    case FieldDescriptorProto.Type.TYPE_FIXED64:
      return 0;
    case FieldDescriptorProto.Type.TYPE_FIXED32:
      return 0;
    case FieldDescriptorProto.Type.TYPE_BOOL:
      return false;
    case FieldDescriptorProto.Type.TYPE_STRING:
      return '';
    case FieldDescriptorProto.Type.TYPE_MESSAGE:
      return undefined;
    case FieldDescriptorProto.Type.TYPE_BYTES:
      return new Uint8Array();
    case FieldDescriptorProto.Type.TYPE_UINT32:
      return 0;
    case FieldDescriptorProto.Type.TYPE_ENUM:
      return 0;
    case FieldDescriptorProto.Type.TYPE_SFIXED32:
      return 0;
    case FieldDescriptorProto.Type.TYPE_SFIXED64:
      return 0;
    case FieldDescriptorProto.Type.TYPE_SINT32:
      return 0;
    case FieldDescriptorProto.Type.TYPE_SINT64:
      return 0;
    case FieldDescriptorProto.Type.TYPE_GROUP:
      console.warn('skipping TYPE_GROUP unsupported');
      return undefined;
    default:
      return undefined;
  }
}

function deserializeField(registry: Dependencies, descriptor: FieldDescriptorProto, reader: BinaryReader): any {
  switch (descriptor.getType()) {
    case FieldDescriptorProto.Type.TYPE_DOUBLE:
      return reader.readDouble();
    case FieldDescriptorProto.Type.TYPE_FLOAT:
      return reader.readFloat();
    case FieldDescriptorProto.Type.TYPE_INT64:
      return reader.readInt64();
    case FieldDescriptorProto.Type.TYPE_UINT64:
      return reader.readUint64();
    case FieldDescriptorProto.Type.TYPE_INT32:
      return reader.readInt32();
    case FieldDescriptorProto.Type.TYPE_FIXED64:
      return reader.readFixed64();
    case FieldDescriptorProto.Type.TYPE_FIXED32:
      return reader.readFixed32();
    case FieldDescriptorProto.Type.TYPE_BOOL:
      return reader.readBool();
    case FieldDescriptorProto.Type.TYPE_STRING:
      return reader.readString();
    case FieldDescriptorProto.Type.TYPE_MESSAGE:
      const message = {};
      reader.readMessage(message, registry[descriptor.getTypeName()!].deserializeBinaryFromReader);
      return message;
    case FieldDescriptorProto.Type.TYPE_BYTES:
      return reader.readBytes();
    case FieldDescriptorProto.Type.TYPE_UINT32:
      return reader.readUint32;
    case FieldDescriptorProto.Type.TYPE_ENUM:
      return reader.readEnum();
    case FieldDescriptorProto.Type.TYPE_SFIXED32:
      return reader.readSfixed32();
    case FieldDescriptorProto.Type.TYPE_SFIXED64:
      return reader.readSfixed64();
    case FieldDescriptorProto.Type.TYPE_SINT32:
      return reader.readSint32();
    case FieldDescriptorProto.Type.TYPE_SINT64:
      return reader.readSint64();
    case FieldDescriptorProto.Type.TYPE_GROUP:
      // return reader.readGroup();
      console.warn('skipping TYPE_GROUP unsupported');
      return reader.skipField();
    default:
      console.warn(`skipping deserialization of grpc type ${descriptor.getType()} (unknown type)`);
      return reader.skipField();
  }
}

function serializeField(
  registry: Dependencies,
  descriptor: FieldDescriptorProto,
  value: any,
  writer: BinaryWriter,
): void {
  const isRepeated = descriptor.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED;
  switch (descriptor.getType()) {
    case FieldDescriptorProto.Type.TYPE_DOUBLE:
      if (isRepeated) {
        writer.writeRepeatedDouble(descriptor.getNumber()!, value);
      } else {
        writer.writeDouble(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_FLOAT:
      if (isRepeated) {
        writer.writeRepeatedFloat(descriptor.getNumber()!, value);
      } else {
        writer.writeFloat(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_INT64:
      if (isRepeated) {
        writer.writeRepeatedInt64(descriptor.getNumber()!, value);
      } else {
        writer.writeInt64(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_UINT64:
      if (isRepeated) {
        writer.writeRepeatedUint64(descriptor.getNumber()!, value);
      } else {
        writer.writeUint64(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_INT32:
      if (isRepeated) {
        writer.writeRepeatedInt32(descriptor.getNumber()!, value);
      } else {
        writer.writeInt32(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_FIXED64:
      if (isRepeated) {
        writer.writeRepeatedFixed64(descriptor.getNumber()!, value);
      } else {
        writer.writeFixed64(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_FIXED32:
      if (isRepeated) {
        writer.writeRepeatedFixed32(descriptor.getNumber()!, value);
      } else {
        writer.writeFixed32(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_BOOL:
      if (isRepeated) {
        writer.writeRepeatedBool(descriptor.getNumber()!, value);
      } else {
        writer.writeBool(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_STRING:
      if (isRepeated) {
        writer.writeRepeatedString(descriptor.getNumber()!, value);
      } else {
        writer.writeString(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_MESSAGE:
      if (isRepeated) {
        writer.writeRepeatedMessage(
          descriptor.getNumber()!,
          value,
          registry[descriptor.getTypeName()!].serializeBinaryToWriter,
        );
      } else {
        writer.writeMessage(
          descriptor.getNumber()!,
          value,
          registry[descriptor.getTypeName()!].serializeBinaryToWriter,
        );
      }
      return;
    case FieldDescriptorProto.Type.TYPE_BYTES:
      if (isRepeated) {
        writer.writeRepeatedBytes(descriptor.getNumber()!, value);
      } else {
        writer.writeBytes(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_UINT32:
      if (isRepeated) {
        writer.writeRepeatedUint32(descriptor.getNumber()!, value);
      } else {
        writer.writeUint32(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_ENUM:
      if (isRepeated) {
        writer.writeRepeatedEnum(descriptor.getNumber()!, value);
      } else {
        writer.writeEnum(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_SFIXED32:
      if (isRepeated) {
        writer.writeRepeatedSfixed32(descriptor.getNumber()!, value);
      } else {
        writer.writeSfixed32(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_SFIXED64:
      if (isRepeated) {
        writer.writeRepeatedSfixed64(descriptor.getNumber()!, value);
      } else {
        writer.writeSfixed64(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_SINT32:
      if (isRepeated) {
        writer.writeRepeatedSint32(descriptor.getNumber()!, value);
      } else {
        writer.writeSint32(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_SINT64:
      if (isRepeated) {
        writer.writeRepeatedSint64(descriptor.getNumber()!, value);
      } else {
        writer.writeSint64(descriptor.getNumber()!, value);
      }
      return;
    case FieldDescriptorProto.Type.TYPE_GROUP:
      // return reader.readGroup();
      console.warn('skipping TYPE_GROUP unsupported');
      return;
    default:
      console.warn(`skipping serialization of grpc type ${descriptor.getType()} (unknown type)`);
      return;
  }
}
