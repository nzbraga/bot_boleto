const path = require('path'); // Módulo nativo para manipulação de caminhos
const XLSX = require('xlsx'); // Certifique-se de instalar a biblioteca xlsx
const fs = require('fs');

const download_boleto = require('./download_boleto.js');
const msg_lembrete = require('./msg_lembrete.js')
const {sendMessage, sendDocument} = require('./venom_bot.js');
const { time } = require('console');


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processExcel(client, fileName) {

    console.log('Iniciando LEMBRETE...');
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
        //BUSCAR INFORMAÇÃO NO EXCEL
        const raw_nome = linha[columnNames.indexOf('nome')];
        const placa = linha[columnNames.indexOf('placa')];
        const raw_contato = linha[columnNames.indexOf('celular')];
        const raw_data = linha[columnNames.indexOf('vencimento')];
        const raw_codigo_barras = linha[columnNames.indexOf('boleto')];
        const link = linha[columnNames.indexOf('link')];

        const nome = raw_nome.trim().toUpperCase();     
        const contato = `55${raw_contato}@c.us`

        // trata a data do excel
        const excelSerial =raw_data // Número recebido do Excel
        const excelEpoch = new Date(1899, 11, 30); // Base do Excel (30/12/1899)
        const msPerDay = 86400000; // Milissegundos por dia        
        const data_raw = new Date(excelEpoch.getTime() + excelSerial * msPerDay);// Convertendo para data        
        const data = data_raw.toLocaleDateString("pt-BR");// Formatando para DD/MM/YYYY
                
        const outputPath = `./src/files/boletos/boleto.pdf`;
        
        const msg = msg_lembrete(nome, placa, data)        
        const codigo_barras = String(raw_codigo_barras)
        console.log(`Enviando...`)

        /*   testes
        await download_boleto(link, outputPath)
        .then(async (savedPath) => {
            console.log( contato, msg)
        console.log( contato, codigo_barras)
        console.log( contato, savedPath, "boleto", "")
        })    
        */
        try {
        await download_boleto(link, outputPath)
        .then(async (savedPath) => {
            await timeout(1000);
            sendMessage(client, contato, msg);
            
            await timeout(1000);
            sendMessage(client, contato, codigo_barras);
            
            await timeout(2000);
            sendDocument(client, contato, savedPath, nome, "")                
        
            
            }).then(() => {
                fs.unlinkSync(outputPath);                 
            })
        console.log(`Enviado para: ${nome}`)
        console.log('-------------------------------')
        
        } catch (err) {            
        console.log(`Erro ao Enviar para: ${nome}\nErro: ${err}<<<<<<`)
        console.log('-----------------------------------')
        
    }
    }

    console.log('Fim do processo');
}

module.exports = processExcel;
