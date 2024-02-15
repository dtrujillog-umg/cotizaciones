const mysql = require('mysql');

// Configurar la conexión a MySQL
const connection = mysql.createConnection({
    host: '65.109.88.87',
    user: 'jpmotors_dtrujillo',
    password: 'Sopadepollo2024.',
    database: 'jpmotors_bd'
});

// Conectar a MySQL
connection.connect(function(err) {
  if (err) {
    console.error('Error de conexión a MySQL: ' + err.stack);
    return;
  }
  console.log('Conexión a MySQL establecida con el ID ' + connection.threadId);
});

module.exports = connection;
