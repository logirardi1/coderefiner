"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const prettier = require("prettier");
const cp = require("child_process"); // Para rodar comandos externos
function activate(context) {
    console.log('Agora, CodeRefine está ativo!');
    let disposable = vscode.commands.registerCommand('extension.formatCode', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const languageId = document.languageId;
            const formatted = yield formatCode(text, languageId); // chamada assíncrona com await
            if (typeof formatted === 'string') { // Verificação para garantir que VAI retornar uma string
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
                editor.edit(editBuilder => {
                    editBuilder.replace(fullRange, formatted);
                });
            }
            else {
                console.error("Erro: format result is not a string.");
            }
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
// Função principal para formatação de código
function formatCode(text, languageId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Code Refine está formatando...');
        // mapa linguagens para o parser correto (babel foi indexado, não é mais retono de erro)
        const parserMap = {
            javascript: 'babel',
            typescript: 'typescript',
            css: 'css',
            scss: 'scss',
            html: 'html',
            json: 'json',
            markdown: 'markdown',
            php: 'php',
            xml: 'xml' // index do @prettier/plugin-xml
        };
        const parser = parserMap[languageId];
        try {
            if (parser) {
                // Se a linguagem for suportada pelo Prettier
                return yield prettier.format(text, {
                    parser: parser,
                    singleQuote: true,
                    trailingComma: 'es5',
                    tabWidth: 2
                });
            }
            else if (languageId === 'python') {
                return formatWithBlack(text); // formatação python - black
            }
            else if (languageId === 'java') {
                return formatWithGoogleJavaFormat(text); // formatação p/ Java com google format
            }
            else if (languageId === 'csv') {
                return formatCSV(text); // format básico p CSV
            }
            else {
                return text; // retorna o texto sem formatação se a linguagem não for suportada
            }
        }
        catch (error) {
            console.error('CodeRefine encontrou um erro ao tentar formatar', error);
            return text; // voltar texto original caso falhe
        }
    });
}
// Função para formatar Python com Black usando o venv
function formatWithBlack(text) {
    try {
        // AQUI substituir pelo caminho do Black no ambiente virtual (venv)
        const formatted = cp.execSync('/home/gorgopat/Documentos/git lorenzo/coderefiner/venv/bin/black -q -', { input: text }).toString();
        return formatted;
    }
    catch (error) {
        console.error('Houve um erro ao tentar formatar o arquivo Python', error);
        return text;
    }
}
// Função para formatar Java com google-java-format
function formatWithGoogleJavaFormat(text) {
    try {
        const formatted = cp.execSync('javaS -jar /home/gorgopat/Documentos/git lorenzo/coderefiner/google-java-format-1.23.0-all-deps.jar', { input: text }).toString();
        return formatted;
    }
    catch (error) {
        console.error('Houve um erro ao tentar formatar o arquivo JAVA:', error);
        return text;
    }
}
// Função para formatação básica de CSV
function formatCSV(text) {
    return text.split('\n')
        .map(line => line.trim())
        .join('\n');
}
//# sourceMappingURL=extension.js.map