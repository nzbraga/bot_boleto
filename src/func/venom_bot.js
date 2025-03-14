const venom = require('venom-bot');

let client;

function initializeClient() {
  return new Promise((resolve, reject) => {
    if (!client) {
      venom.create({
        session: 'APVS', //name of session
        multidevice: true, // Add this option to enable multi-device support
        headless: false, // true navegador invisivel / false navegador visivel
      }) // Cria o cliente uma vez
        .then((createdClient) => {
          client = createdClient; // Armazena o cliente para reutilização
          console.log('Cliente criado com sucesso');
          resolve(client); // Resolve a promise com o cliente
        })
        .catch((error) => {
          console.error('Erro ao criar o cliente:', error);
          reject(error); // Rejeita a promise em caso de erro
        });
    } else {
      resolve(client); // Se já existir o cliente, resolve imediatamente
    }
  });
}
function sendMessage(client, to, message) {
  client
    .sendText(to, message) // Envia a mensagem
    .then((result) => {
      //console.log('Mensagem enviada com sucesso:', result);
      //console.log('Mensagem enviada com sucesso');
    })
    .catch((error) => {
      console.error('Erro ao enviar a mensagem:', {
        to: error.to,
        erro: error.erro,
        text: error.text,
        status: error.status
      })
    });
}
function sendDocument(client, to, filePath, fileName, caption) {
  client
    .sendFile(to, filePath, fileName, caption) // Envia o arquivo
    .then((result) => {
     // console.log('Documento enviado com sucesso');
    })
    .catch((error) => {
      console.error('Erro ao enviar o documento:', {
        to: error.to,
        erro: error.erro,
        text: error.text,
        status: error.status
      });
      
    });
}

module.exports = { initializeClient, sendMessage, sendDocument };
