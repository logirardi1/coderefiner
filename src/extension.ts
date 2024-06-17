// src/extension.ts
import * as vscode from 'vscode';
import * as prettier from 'prettier';

export function activate(context: vscode.ExtensionContext) {
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
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );

            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, formatted);
                console.log('Documento recolocado.');
            });
        } else {
            console.log('Nenhum editor ativo encontrado.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function formatCode(text: string, languageId: string): string {
    console.log('Code Refine está formatando...');

    // mapa de bounds entre linguagens e identacoes
    const parserMap: { [key: string]: prettier.BuiltInParserName } = {
        javascript: 'babel',
        typescript: 'typescript',
        css: 'css',
        scss: 'scss',
        html: 'html',
        json: 'json',
        markdown: 'markdown'
        
    };

    const parser = parserMap[languageId] || 'babel'; // 'babel' é para quando um linguagem não estiver atribuida no mapa

    try {
        const options: prettier.Options = {
            parser: parser,
            singleQuote: true, 
            trailingComma: 'es5',
            tabWidth: 2
        };

        const formatted = prettier.format(text, options);
        return formatted;
    } catch (error) {
        console.error('Code Refine encontrou um erro ao formatar.', error);
        return text; // voltar texto original caso falhe
    }
}
