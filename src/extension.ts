import * as vscode from 'vscode';
import * as prettier from 'prettier';
import * as cp from 'child_process'; // Para rodar comandos externos


export function activate(context: vscode.ExtensionContext) {
    // Inicializar o Sentry
    const Sentry = require("@sentry/node");

    Sentry.init({
      dsn: "https://dd4fc19e421a540ea60c2beb3109de09@o4508169162063872.ingest.us.sentry.io/4508170204020736",
    });

    console.log('Agora, CodeRefine está ativo!');

    let disposable = vscode.commands.registerCommand('extension.formatCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = await formatCode(text, languageId);  // chamada assíncrona com await

            if (typeof formatted === 'string') { // Verificação para garantir que VAI retornar uma string
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );

                editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, formatted);
                });
            } else {
                console.error("Erro: format result is not a string.");
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

// Função principal para formatação de código
async function formatCode(text: string, languageId: string): Promise<string> {
    console.log('Code Refine está formatando...');

    // mapa linguagens para o parser correto (babel foi indexado, não é mais retono de erro)
    const parserMap: { [key: string]: prettier.LiteralUnion<prettier.BuiltInParserName, string> } = {
        javascript: 'babel', // certo
        typescript: 'typescript', // certo
        css: 'css', // certo
        scss: 'scss',
        html: 'html', // certo
        json: 'json',
        markdown: 'markdown',
        php: 'php',        // index do @prettier/plugin-php
        xml: 'xml'         // index do @prettier/plugin-xml
    };

    const parser = parserMap[languageId];

    try {
        if (parser) {
            // Se a linguagem for suportada pelo Prettier
            return await prettier.format(text, {  // Tornando o prettier.format assíncrono com await
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
            return formatCSV(text);  // format básico p CSV
        } else {
            return text; // retorna o texto sem formatação se a linguagem não for suportada
        }
    } catch (error) {
        console.error('CodeRefine encontrou um erro ao tentar formatar', error);
        return text; // voltar texto original caso falhe
    }
}

// Função para formatar Python com Black usando o venv
function formatWithBlack(text: string): string {
    try {
        // AQUI substituir pelo caminho do Black no ambiente virtual (venv)
        const formatted = cp.execSync('/home/gorgopat/Documentos/GitLorenzo/coderefiner/venv/bin/black -q -', { input: text }).toString();
        return formatted;
    } catch (error) {
        console.error('Houve um erro ao tentar formatar o arquivo Python', error);
        return text;
    }
}

// Função para formatar Java com google-java-format
function formatWithGoogleJavaFormat(text: string): string {
    try {
        const formatted = cp.execSync(
            'java -jar /home/gorgopat/Documentos/GitLorenzo/coderefiner/google-java-format-1.23.0-all-deps.jar -',
            { input: text }
        ).toString();

        return formatted;
    } catch (error) {
        console.error('Houve um erro ao tentar formatar o arquivo JAVA:', error);
        return text;
    }
}

// Função para formatação básica de CSV
function formatCSV(text: string): string {
    return text.split('\n')
        .map(line => line.trim())
        .join('\n');
}
