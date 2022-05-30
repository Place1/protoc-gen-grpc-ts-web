import { EnumDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';
import ts from 'typescript';
import { Context } from './context';
import { keyword } from './keywords';
import { naming } from './naming';

export function codegenEnum(context: Context, descriptor: EnumDescriptorProto): ts.Statement[] {
  const members = descriptor.getValueList().map((value) => {
    return ts.factory.createPropertyAssignment(
      naming.enumValue(value.getName()),
      ts.factory.createAsExpression(
        ts.factory.createNumericLiteral(value.getNumber() ?? 0),
        ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(value.getNumber() ?? 0))
      )
    );
  });

  const enumobj = ts.factory.createVariableStatement(
    [keyword.Export],
    ts.factory.createVariableDeclarationList([
      ts.factory.createVariableDeclaration(
        naming.enum(descriptor.getName()),
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(members)
      ),
    ])
  );

  const typealias = ts.factory.createTypeAliasDeclaration(
    undefined,
    [keyword.Export],
    naming.enum(descriptor.getName()),
    undefined,
    ts.factory.createIndexedAccessTypeNode(
      ts.factory.createTypeQueryNode(ts.factory.createIdentifier(naming.enum(descriptor.getName())), undefined),
      ts.factory.createTypeOperatorNode(
        ts.SyntaxKind.KeyOfKeyword,
        ts.factory.createTypeQueryNode(ts.factory.createIdentifier(naming.enum(descriptor.getName())), undefined)
      )
    )
  );

  return [enumobj, typealias];
}
