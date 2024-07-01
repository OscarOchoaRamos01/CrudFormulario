const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'crud-form.cj8sqoack6x1.us-east-1.rds.amazonaws.com',
  user: 'oscar',
  password: 'oscar123',
  database: 'dbconsultas'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para crear un usuario
app.post('/users', (req, res) => {
  const { name, first_name, dni, gender, birthdate } = req.body;
  const query = 'INSERT INTO users (name, first_name, dni, gender, birthdate) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, first_name, dni, gender, birthdate], (err, result) => {
    if (err) {
      console.error('Error al insertar usuario:', err.message);
      return res.status(500).send(err.message);
    }
    res.send('Usuario creado');
  });
});

// Ruta para leer todos los usuarios
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al leer usuarios:', err.message);
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
});

// Ruta para actualizar un usuario
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, first_name, dni, gender, birthdate } = req.body;
  const query = 'UPDATE users SET name = ?, first_name = ?, dni = ?, gender = ?, birthdate = ? WHERE id = ?';
  db.query(query, [name, first_name, dni, gender, birthdate, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err.message);
      return res.status(500).send(err.message);
    }
    res.send('Usuario actualizado');
  });
});

// Ruta para eliminar un usuario
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err.message);
      return res.status(500).send(err.message);
    }
    res.send('Usuario eliminado');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
