// src/extension.ts
import * as vscode from 'vscode';
import * as prettier from 'prettier';

export function activate(context: vscode.ExtensionContext) {
    console.log('Agora, CodeRefine está ativo!');

    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Active editor found.');
            const document = editor.document;
            console.log('Document retrieved.');
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = formatCode(text, languageId);
            console.log('Documento Formatado.');
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

function formatCode(text: string, languageId: string): string {
    console.log('Formatting text with Prettier.');

    // Map the VSCode language ID to a Prettier parser
    const parserMap: { [key: string]: prettier.BuiltInParserName } = {
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
        return prettier.format(text, {
            parser: parser,
            singleQuote: true, // Example option, customize as needed
            trailingComma: 'es5',
            tabWidth: 2
        });
    } catch (error) {
        console.error('Error formatting with Prettier:', error);
        return text; // Return the original text if formatting fails
    }
}
