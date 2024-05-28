"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('CodeRefine is now working!');
    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const formatted = formatCode(document.getText());
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function formatCode(text) {
    // formatação simples (correção de indentação)
    const formattedText = text.replace(/^\s+/gm, ''); // faz remove espacos em branco no inicio de cada linha
    return formattedText;
}
//# sourceMappingURL=extension.js.map