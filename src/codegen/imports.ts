import { FieldDescriptorProto, FileDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import { chain, concat, values } from 'lodash';
import ts from 'typescript';
import { Context, Dependency } from './context';
import { typeReference } from './messages';
import { naming } from './naming';

export function codegenImports(context: Context, proto: FileDescriptorProto): ts.Statement[] {
  return concat(codegenRuntimeImports(context, proto), codegenDependencyImports(context, proto));
}

function codegenRuntimeImports(context: Context, proto: FileDescriptorProto): ts.Statement[] {
  return [
    ts.factory.createImportDeclaration(
      undefined,
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('GrpcWebClientBase')),
        ]),
      ),
      ts.factory.createStringLiteral('grpc-web'),
    ),
    ts.factory.createImportDeclaration(
      undefined,
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('unaryRequest')),
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('UnaryRequestOptions')),
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('streamingRequest')),
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('StreamingRequestOptions')),
          ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier('MessageMarshaller')),
        ]),
      ),
      ts.factory.createStringLiteral('grpc-ts-web'),
    ),
  ];
}

function codegenDependencyImports(context: Context, proto: FileDescriptorProto): ts.Statement[] {
  return chain(dependencies(context, proto))
    .filter((dependency) => dependency.file !== proto.getName())
    .groupBy((dependency) => dependency.file)
    .map((dependencies, file) => {
      return ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createImportClause(
          false,
          undefined,
          ts.factory.createNamedImports(
            dependencies.flatMap((dependency) => [
              ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(naming.message(typeReference(dependency.typeName))),
              ),
              ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(naming.marshaller(typeReference(dependency.typeName))),
              ),
            ]),
          ),
        ),
        ts.factory.createStringLiteral('./' + naming.file(file).replace('.ts', '')),
      );
    })
    .value();
}

export function dependencies(context: Context, proto: FileDescriptorProto): Dependency[] {
  return values(context.typemap)
    .filter((dependency) => {
      return dependency.file !== proto.getName();
    })
    .filter((dependency) => {
      return proto.getDependencyList().includes(dependency.file);
    });
}
