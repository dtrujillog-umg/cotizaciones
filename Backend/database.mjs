import { createConnection } from 'mysql';

const connection = createConnection({
  host: '65.109.88.87',
  user: 'jpmotors_dtrujillo',
  password: 'Sopadepollo2024.',
  database: 'jpmotors_bd'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL: ' + err.stack);
    return;
  }
  console.log('Conexión a MySQL establecida con el ID ' + connection.threadId);
});

// Función para ejecutar una consulta SQL utilizando la conexión a MySQL
export function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results, fields) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Exportar la conexión como un módulo
export default connection;