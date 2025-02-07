const path = require('path'); // Módulo nativo para manipulação de caminhos
const XLSX = require('xlsx'); // Certifique-se de instalar a biblioteca xlsx

const download_boleto = require('./download_boleto.js');
const processName = require('./process_name.js');
const msg_lembrete = require('./msg_lembrete.js')
const {sendMessage, sendDocument} = require('./venom_bot.js');
const { time } = require('console');
const msg_pendencia = require('./msg_pendencia.js');

const outputPath = './src/files/boletos/boleto.pdf';
//const fileName = "arquivo.xlsx"; // Nome do arquivo na pasta raiz

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processExcel(client, fileName) {

    console.log('Iniciando processamento...');
    // Constrói o caminho absoluto para o arquivo na raiz do projeto
    const filePath = path.resolve(__dirname, '../..', fileName);
    console.log('Acessando o arquivo...');
    
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(filePath);
    
    console.log('Lendo o arquivo...');
    // Seleciona a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    
    // Converte a planilha para JSON
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log('Preparnado o arquivo...');

    const columnNames = rows[0];

    // Começa a iteração na linha 2 (índice 1 no array) até encontrar uma linha com linha[0] vazio
    for (let linhaIdx = 1; linhaIdx < rows.length; linhaIdx++) {
        const linha = rows[linhaIdx];

        if (!linha[0]) {
            console.log('Fim do processo');
            break; // Para o loop se a célula linha[0] estiver vazia
        }

        const raw_nome = linha[columnNames.indexOf('nome')];
        const placa = linha[columnNames.indexOf('placa')];
        const raw_contato = linha[columnNames.indexOf('celular')];
        const raw_codigo_barras = linha[columnNames.indexOf('boleto')];
        const link = linha[columnNames.indexOf('link')];

        const nome = processName(raw_nome)
        const contato = `55${raw_contato}@c.us`

        const msg = msg_pendencia(nome, placa)
        //const msg = msg_lembrete(nome, placa)
        const codigo_barras = String(raw_codigo_barras)

        console.log(`Enviando...`)
        try {
            
            await download_boleto(link, outputPath)
            .then(async (savedPath) => {
                await timeout(1000);
                sendMessage(client, contato, msg);
                
                // nao enviar na pendencia
                /*
                await timeout(2000);
                sendMessage(client, contato, codigo_barras);
                */
                await timeout(3000);
                sendDocument(client, contato, savedPath, "boleto", "");
                
                
                console.log(`Enviado para: ${nome}`)
                console.log('-------------------------------')
              
            })
        } catch (err) {
            
            console.error(`Erro ao baixar o arquivo: ${err.message.to}${err.message.text}`);
            
            console.log(`Erro ao Enviar para: ${nome} <<<<<<`)
            console.log('-----------------------------------')
          
        }
    }
}

module.exports = processExcel;
