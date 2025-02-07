function msg_lembrete(nome, placa ){
    msg = 
`Boa tarde ${nome} 🌟
    
Aqui é a Maiara da APVS 🛡
Simplificando as coisas para você! 😁

‼ Para sua tranquilidade, estou enviando antecipadamente o boleto para pagamento 🤗

⬇ Por favor, confira os detalhes abaixo com atenção ⬇

🚦 PLACA ➔ ${placa}

🔢 CÓDIGO DE BARRAS `

    return msg
}


module.exports = msg_lembrete;