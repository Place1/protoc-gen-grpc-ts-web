import ts from 'typescript';
import { format } from './formatter';

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

export function printFile(statements: ts.Statement[]): string {
  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  return format('', printer.printFile(sourceFile));
}

export function printNode(node: ts.Node): string {
  const sourceFile = ts.createSourceFile('', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
}
