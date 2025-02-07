const https = require('https');
const fs = require('fs');
const path = require('path');

/*
 * Baixa um arquivo de uma URL e salva localmente.
 * @param {string} url - O link do arquivo para download.
 * @param {string} outputPath - O caminho completo onde o arquivo será salvo.
 * @returns {Promise<string>} - Uma Promise que resolve com o caminho do arquivo salvo.
 */
async function download_boleto(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);

        file.on('finish', () => {
          file.close(() => resolve(outputPath));
        });
      } else {
        file.close();
        fs.unlink(outputPath, () => {}); // Remove arquivo parcialmente baixado
        reject(new Error(`Download falhou: Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(outputPath, () => {}); // Remove arquivo parcialmente baixado
      reject(err);
    });
  });
}

module.exports = download_boleto;
