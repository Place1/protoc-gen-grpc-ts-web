import ts from 'typescript';

export const keyword = {
  Export: ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
  Public: ts.factory.createModifier(ts.SyntaxKind.PublicKeyword),
  Private: ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
  Protected: ts.factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
  Async: ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword),
  Static: ts.factory.createModifier(ts.SyntaxKind.StaticKeyword),
};

export const primatives = {
  number: ts.factory.createTypeReferenceNode('number'),
  any: ts.factory.createTypeReferenceNode('any'),
  string: ts.factory.createTypeReferenceNode('string'),
  boolean: ts.factory.createTypeReferenceNode('boolean'),
  void: ts.factory.createTypeReferenceNode('void'),
  typeReference: (name: string) => ts.factory.createTypeReferenceNode(name),
  arrayOf: (element: ts.TypeNode) => ts.factory.createTypeReferenceNode('Array', [element]),
  recordOf: (key: ts.TypeNode, value: ts.TypeNode) => ts.factory.createTypeReferenceNode('Record', [key, value]),
  promiseOf: (element: ts.TypeNode) => ts.factory.createTypeReferenceNode('Promise', [element]),
};
