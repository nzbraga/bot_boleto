const fileName = "contatos.xlsx"; 
const { initializeClient } = require('./src/func/venom_bot.js');

const processExcel_lembrete = require('./src/func/read_excel_lembrete.js')
//const processExcel_pendencia = require('./src/func/read_excel_pendencia.js')


// Inicializa o cliente
initializeClient()
  .then((client) => {
    processExcel_lembrete(client, fileName);
    //processExcel_pendencia(client, fileName);
  
  })
  .catch((error) => {
    console.error('Erro ao inicializar o cliente:', error);
  });




