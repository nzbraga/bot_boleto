const processExcel = require('./src/func/read_excel.js')
const fileName = "contatos.xlsx"; 
const { initializeClient } = require('./src/func/venom_bot.js');


// Inicializa o cliente
initializeClient()
  .then((client) => {
    processExcel(client, fileName);
  
  })
  .catch((error) => {
    console.error('Erro ao inicializar o cliente:', error);
  });




