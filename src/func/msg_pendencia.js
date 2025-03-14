function msg_pendencia(nome, placa ){
    msg = 
`⚠ VOCÊ ESTÁ DESPROTEGIDO! ⚠ 

Boa tarde ${nome} 🌤

Aqui é a Maiara da APVS 🛡

⚠ Passando para lembrar de um boleto que está pendente a ${tempo_pendente} dias!⚠
 
🔐  É hora de garantir sua proteção de volta! 😁


🚦 PLACA  ➔ ${placa}


📄 Se já efetuou o pagamento, desconsidere

🔢 CÓDIGO DE BARRAS :`

    return msg
}


module.exports = msg_pendencia;