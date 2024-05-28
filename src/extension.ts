import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeRefine is now working!');

    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const formatted = formatCode(document.getText());
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );

            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
            });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function formatCode(text: string): string {
    // formatação simples (correção de indentação)
    const formattedText = text.replace(/^\s+/gm, ''); // faz remove espacos em branco no inicio de cada linha
    return formattedText;
}