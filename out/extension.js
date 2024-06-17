"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// src/extension.ts
const vscode = require("vscode");
const prettier = require("prettier");
function activate(context) {
    console.log('Congratulations, your extension "coderefiner" is now active!');
    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Active editor found.');
            const document = editor.document;
            console.log('Document retrieved.');
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = formatCode(text, languageId);
            console.log('Document formatted.');
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
                console.log('Document replaced.');
            });
        }
        else {
            console.log('No active editor found.');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function formatCode(text, languageId) {
    console.log('Formatting text with Prettier.');
    // Map the VSCode language ID to a Prettier parser
    const parserMap = {
        javascript: 'babel',
        typescript: 'typescript',
        css: 'css',
        scss: 'scss',
        html: 'html',
        json: 'json',
        markdown: 'markdown'
        // Add more mappings as needed
    };
    const parser = parserMap[languageId] || 'babel'; // Default to 'babel' if the languageId is not in the map
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
        console.error('Error formatting with Prettier:', error);
        return text; // Return the original text if formatting fails
    }
}
//# sourceMappingURL=extension.js.map