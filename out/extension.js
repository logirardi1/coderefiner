"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// src/extension.ts
const vscode = require("vscode");
const prettier = require("prettier");
function activate(context) {
    console.log('Agora, CodeRefine está ativo!');
    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Editor ativo encontrado!');
            const document = editor.document;
            console.log('Documento Recuperado.');
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = formatCode(text, languageId);
            console.log('Documento Formatado...');
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
                console.log('Documento recolocado.');
            });
        }
        else {
            console.log('Nenhum editor ativo encontrado.');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function formatCode(text, languageId) {
    console.log('Code Refine está formatando...');
    // mapa de bounds entre linguagens e identacoes
    const parserMap = {
        javascript: 'babel',
        typescript: 'typescript',
        css: 'css',
        scss: 'scss',
        html: 'html',
        json: 'json',
        markdown: 'markdown'
    };
    const parser = parserMap[languageId] || 'babel'; // 'babel' é para quando um linguagem não estiver atribuida no mapa (não ta funcionando)
    try {
        const options = {
            parser: parser,
            singleQuote: true,
            trailingComma: 'es5',
            tabWidth: 2
        };
        const formatted = prettier.format(text, options);
        return formatted;
    }
    catch (error) {
        console.error('Code Refine encontrou um erro ao formatar.', error);
        return text; // voltar texto original caso falhe
    }
}
//# sourceMappingURL=extension.js.map