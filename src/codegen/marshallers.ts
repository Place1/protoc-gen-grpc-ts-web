import { FieldDescriptorProto, FileDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import ts from 'typescript';
import { Context } from './context';
import { keyword, primatives } from './keywords';
import { isMapMessage } from './maps';
import { allmessages, typeOfField, typeReference } from './messages';
import { naming } from './naming';

export function codegenMarshallers(context: Context, file: FileDescriptorProto): ts.Statement[] {
  return allmessages(file).map((message) =>
    ts.factory.createClassDeclaration(
      undefined,
      [keyword.Export],
      naming.marshaller(message.getName()),
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier('MessageMarshaller'), [
            isMapMessage(message)
              ? primatives.recordOf(
                  typeOfField(context, message.getFieldList()[0]),
                  typeOfField(context, message.getFieldList()[1]),
                )
              : ts.factory.createTypeReferenceNode(naming.message(message.getName())),
          ]),
        ]),
      ],
      [
        ts.factory.createPropertyDeclaration(
          undefined,
          [keyword.Protected],
          'descriptor',
          undefined,
          undefined,
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            undefined,
            ts.factory.createStringLiteral(Buffer.from(message.serializeBinary()).toString('base64')),
          ),
        ),
        ts.factory.createPropertyDeclaration(
          undefined,
          [keyword.Protected],
          'dependencies',
          undefined,
          undefined,
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            undefined,
            ts.factory.createObjectLiteralExpression(
              message
                .getFieldList()
                .filter((field) => field.getType() === FieldDescriptorProto.Type.TYPE_MESSAGE)
                .map((field) =>
                  ts.factory.createPropertyAssignment(
                    ts.factory.createStringLiteral(field.getTypeName()!),
                    ts.factory.createNewExpression(
                      ts.factory.createIdentifier(naming.marshaller(typeReference(field.getTypeName()))),
                      undefined,
                      [],
                    ),
                  ),
                ),
              true,
            ),
          ),
        ),
      ],
    ),
  );
}
