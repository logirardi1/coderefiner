// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "coderefiner" is now active!');

    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Active editor found.');
            const document = editor.document;
            console.log('Document retrieved.');
            const text = document.getText();
            const formatted = formatCode(text);
            console.log('Document formatted.');
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );

            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
                console.log('Document replaced.');
            });
        } else {
            console.log('No active editor found.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function formatCode(text: string): string {
    console.log('Formatting text.');

    // Divide o texto em linhas
    const lines = text.split('\n');
    let indentLevel = 0;

    const formattedLines = lines.map(line => {
        // Remove espaços desnecessários no início de cada linha
        let trimmedLine = line.trimStart();

        // Ajusta o nível de indentação baseado nas chaves '{' e '}'
        if (trimmedLine.endsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = '  '.repeat(indentLevel) + trimmedLine;

        if (trimmedLine.endsWith('{')) {
            indentLevel += 1;
        }

        // Adiciona ponto e vírgula no final de linhas que precisam (simplesmente adicionando para este exemplo)
        if (trimmedLine && !trimmedLine.endsWith(';') && !trimmedLine.endsWith('{') && !trimmedLine.endsWith('}') && !trimmedLine.includes('if') && !trimmedLine.includes('else') && !trimmedLine.includes('for') && !trimmedLine.includes('while') && !trimmedLine.includes('function')) {
            trimmedLine += ';';
        }

        return indentedLine;
    });

    return formattedLines.join('\n');
}
