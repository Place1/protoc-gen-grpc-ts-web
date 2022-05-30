import {
  FileDescriptorProto,
  MethodDescriptorProto,
  ServiceDescriptorProto,
} from 'google-protobuf/google/protobuf/descriptor_pb';
import ts from 'typescript';
import { Context } from './context';
import { keyword, primatives } from './keywords';
import { typeReference } from './messages';
import { naming } from './naming';

export function codegenService(
  context: Context,
  file: FileDescriptorProto,
  service: ServiceDescriptorProto,
): ts.Statement {
  return ts.factory.createClassDeclaration(
    undefined,
    [keyword.Export],
    naming.service(service.getName()),
    undefined,
    undefined,
    [
      ts.factory.createPropertyDeclaration(
        undefined,
        [keyword.Public],
        'service',
        undefined,
        undefined,
        ts.factory.createStringLiteral(service.getName()!),
      ),
      ts.factory.createPropertyDeclaration(
        undefined,
        [keyword.Public],
        'package',
        undefined,
        undefined,
        ts.factory.createStringLiteral(file.getPackage()!),
      ),
      ts.factory.createConstructorDeclaration(
        undefined,
        [keyword.Public],
        [
          ts.factory.createParameterDeclaration(
            undefined,
            [keyword.Public],
            undefined,
            'client',
            undefined,
            primatives.typeReference('GrpcWebClientBase'),
          ),
          ts.factory.createParameterDeclaration(
            undefined,
            [keyword.Public],
            undefined,
            'hostname',
            undefined,
            primatives.string,
          ),
        ],
        ts.factory.createBlock([]),
      ),
      ...service.getMethodList().map((method) => codegenMethod(context, file, service, method)),
    ],
  );
}

export function codegenMethod(
  context: Context,
  file: FileDescriptorProto,
  service: ServiceDescriptorProto,
  method: MethodDescriptorProto,
): ts.ClassElement {
  if (method.hasServerStreaming()) {
    return codegenStreamingMethod(context, file, service, method);
  }
  return codegenUnaryMethod(context, file, service, method);
}

export function codegenUnaryMethod(
  context: Context,
  file: FileDescriptorProto,
  service: ServiceDescriptorProto,
  method: MethodDescriptorProto,
): ts.ClassElement {
  return ts.factory.createPropertyDeclaration(
    undefined,
    [keyword.Public],
    naming.method(method.getName()),
    undefined,
    undefined,
    ts.factory.createArrowFunction(
      [keyword.Async],
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'request',
          undefined,
          primatives.typeReference(typeReference(method.getInputType())),
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'options',
          undefined,
          ts.factory.createTypeReferenceNode('UnaryRequestOptions'),
        ),
      ],
      primatives.promiseOf(primatives.typeReference(typeReference(method.getOutputType()))),
      undefined,
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createAwaitExpression(
              ts.factory.createCallExpression(ts.factory.createIdentifier('unaryRequest'), undefined, [
                ts.factory.createIdentifier('this'),
                ts.factory.createIdentifier('request'),
                ts.factory.createIdentifier('options'),
                codegenMethodDescriptor(context, method),
              ]),
            ),
          ),
        ],
        true,
      ),
    ),
  );
}

export function codegenStreamingMethod(
  context: Context,
  file: FileDescriptorProto,
  service: ServiceDescriptorProto,
  method: MethodDescriptorProto,
): ts.ClassElement {
  return ts.factory.createPropertyDeclaration(
    undefined,
    [keyword.Public],
    naming.method(method.getName()),
    undefined,
    undefined,
    ts.factory.createArrowFunction(
      undefined,
      undefined,
      [
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'request',
          undefined,
          primatives.typeReference(typeReference(method.getInputType())),
        ),
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          'options',
          undefined,
          ts.factory.createTypeReferenceNode('StreamingRequestOptions'),
        ),
      ],
      ts.factory.createTypeReferenceNode('AsyncIterable', [
        primatives.typeReference(typeReference(method.getOutputType())),
      ]),
      undefined,
      ts.factory.createBlock(
        [
          ts.factory.createReturnStatement(
            ts.factory.createCallExpression(ts.factory.createIdentifier('streamingRequest'), undefined, [
              ts.factory.createThis(),
              ts.factory.createIdentifier('request'),
              ts.factory.createIdentifier('options'),
              codegenMethodDescriptor(context, method),
            ]),
          ),
        ],
        true,
      ),
    ),
  );
}

export function codegenMethodDescriptor(context: Context, descriptor: MethodDescriptorProto): ts.Expression {
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment('name', ts.factory.createStringLiteral(descriptor.getName()!)),
      ts.factory.createPropertyAssignment(
        'input',
        ts.factory.createNewExpression(
          ts.factory.createIdentifier(naming.marshaller(typeReference(descriptor.getInputType()!))),
          undefined,
          [],
        ),
      ),
      ts.factory.createPropertyAssignment(
        'output',
        ts.factory.createNewExpression(
          ts.factory.createIdentifier(naming.marshaller(typeReference(descriptor.getOutputType()!))),
          undefined,
          [],
        ),
      ),
    ],
    true,
  );
}
