import { FieldDescriptorProto, DescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import { Context } from './context';

export function isMap(context: Context, descriptor: FieldDescriptorProto): boolean {
  const isMessage = descriptor.getType() === FieldDescriptorProto.Type.TYPE_MESSAGE;
  const isRepeated = descriptor.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED;
  if (isMessage && isRepeated) {
    const dep = context.typemap[descriptor.getTypeName()!];
    if (dep.descriptor instanceof DescriptorProto) {
      return isMapMessage(dep.descriptor);
    }
  }
  return false;
}

export function isMapMessage(descriptor: DescriptorProto): boolean {
  const fields = descriptor.getFieldList();
  if (fields.length === 2) {
    return fields[0].getName() === 'key' && fields[1].getName() === 'value';
  }
  return false;
}

export function mapKeyType(context: Context, descriptor: FieldDescriptorProto): FieldDescriptorProto {
  if (!isMap(context, descriptor)) {
    throw new Error('descriptor is not a map');
  }
  const dep = context.typemap[descriptor.getTypeName()!];
  const mapDescriptor = dep.descriptor as DescriptorProto;
  return mapDescriptor.getFieldList()[0];
}

export function mapValueType(context: Context, descriptor: FieldDescriptorProto) {
  if (!isMap(context, descriptor)) {
    throw new Error('descriptor is not a map');
  }
  const dep = context.typemap[descriptor.getTypeName()!];
  const mapDescriptor = dep.descriptor as DescriptorProto;
  return mapDescriptor.getFieldList()[1];
}
