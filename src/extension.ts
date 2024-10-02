import * as vscode from 'vscode';
import * as prettier from 'prettier';
import * as cp from 'child_process'; // Para rodar comandos externos

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "coderefiner" is now active!');

    let disposable = vscode.commands.registerCommand('extension.formatCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = formatCode(text, languageId);

            if (typeof formatted === 'string') { // Verificação para garantir que retornamos uma string
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );

                editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, formatted);
                });
            } else {
                console.error("Error: Format result is not a string.");
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

// Função principal para formatação de código
function formatCode(text: string, languageId: string): string {
    console.log('Formatting text with Prettier or external tool.');

    // Mapear linguagens para o parser correto
    const parserMap: { [key: string]: prettier.LiteralUnion<prettier.BuiltInParserName, string> } = {
        javascript: 'babel',
        typescript: 'typescript',
        css: 'css',
        scss: 'scss',
        html: 'html',
        json: 'json',
        markdown: 'markdown',
        php: 'php',        // index do @prettier/plugin-php
        xml: 'xml'         // index do @prettier/plugin-xml
    };

    const parser = parserMap[languageId];

    try {
        if (parser) {
            // Se a linguagem for suportada pelo Prettier
            return prettier.format(text, {
                parser: parser,
                singleQuote: true,
                trailingComma: 'es5',
                tabWidth: 2
            });
        } else if (languageId === 'python') {
            return formatWithBlack(text);  // formatação python - black
        } else if (languageId === 'java') {
            return formatWithGoogleJavaFormat(text);  // formatação p/ Java com google format
        } else if (languageId === 'csv') {
            return formatCSV(text);  // Formatação básica para CSV
        } else {
            return text; // Retorna o texto sem formatação se a linguagem não for suportada
        }
    } catch (error) {
        console.error('Error formatting with Prettier:', error);
        return text; // Retorna o texto original em caso de falha
    }
}

// Função para formatar Python com Black usando o ambiente virtual
function formatWithBlack(text: string): string {
    try {
        // Substitua o caminho pelo caminho correto do Black no ambiente virtual
        const formatted = cp.execSync('venv/bin/black -q -', { input: text }).toString();
        return formatted;
    } catch (error) {
        console.error('Error formatting Python with Black:', error);
        return text;
    }
}

// Função para formatar Java com google-java-format
function formatWithGoogleJavaFormat(text: string): string {
    try {
        const formatted = cp.execSync('java -jar /home/gorgopat/Documentos/git lorenzo/coderefiner/google-java-format-1.23.0-all-deps.jar', { input: text }).toString();
        return formatted;
    } catch (error) {
        console.error('Error formatting Java with google-java-format:', error);
        return text;
    }
}

// Função para formatação básica de CSV
function formatCSV(text: string): string {
    return text.split('\n')
        .map(line => line.trim())
        .join('\n');
}
