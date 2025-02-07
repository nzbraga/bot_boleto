function processName(fullName) {
    // Remove espaços extras e divide o nome completo em partes
    const parts = fullName.trim().split(" ");
    // Retorna o primeiro nome com a primeira letra maiúscula
    const firstName = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1).toLowerCase() : '';
    return firstName;
}

module.exports = processName;