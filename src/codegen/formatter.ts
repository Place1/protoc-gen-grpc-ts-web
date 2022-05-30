import ts from 'typescript';

class InMemoryLanguageServiceHost implements ts.LanguageServiceHost {
  constructor(private fileName: string, private sourceCode: string) {}

  getCompilationSettings() {
    return ts.getDefaultCompilerOptions();
  }

  getScriptFileNames() {
    return [this.fileName];
  }

  getScriptVersion(_fileName: string) {
    return '0';
  }

  getScriptSnapshot(fileName: string) {
    if (fileName === this.fileName) {
      return ts.ScriptSnapshot.fromString(this.sourceCode);
    }
  }

  getCurrentDirectory() {
    return process.cwd();
  }

  getDefaultLibFileName(options: ts.CompilerOptions) {
    return ts.getDefaultLibFilePath(options);
  }

  readFile(path: string, encoding?: string): string | undefined {
    throw new Error('Method not implemented.');
  }

  fileExists(path: string): boolean {
    throw new Error('Method not implemented.');
  }
}

const options: ts.FormatCodeSettings | ts.FormatCodeOptions = {
  convertTabsToSpaces: true,
  insertSpaceAfterCommaDelimiter: true,
  insertSpaceAfterKeywordsInControlFlowStatements: true,
  insertSpaceBeforeAndAfterBinaryOperators: true,
  trimTrailingWhitespace: true,
  newLineCharacter: '\n',
  indentStyle: ts.IndentStyle.Smart,
  indentSize: 2,
  tabSize: 2,
};

export function format(fileName: string, sourceCode: string) {
  const host = new InMemoryLanguageServiceHost(fileName, sourceCode);
  const languageService = ts.createLanguageService(host);

  languageService
    .getFormattingEditsForDocument(fileName, options)
    .sort((a, b) => a.span.start - b.span.start)
    .reverse()
    .forEach((edit) => {
      const head = sourceCode.slice(0, edit.span.start);
      const tail = sourceCode.slice(edit.span.start + edit.span.length);
      sourceCode = `${head}${edit.newText}${tail}`;
    });

  return sourceCode;
}
