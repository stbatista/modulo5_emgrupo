const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_db'
});

module.exports = connection;

// Arquivo: controller.js
const express = require('express');
const router = express.Router();
const connection = require('./model');

// Listar todos os registros
router.get('/', (req, res) => {
  connection.query('SELECT * FROM my_table', (error, results) => {
    if (error) throw error;
    res.render('index', { results });
  });
});

// Listar um único registro
router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM my_table WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.render('show', { result: results[0] });
  });
});

// Inserir um registro novo
router.post('/', (req, res) => {
  const name = req.body.name;
  connection.query('INSERT INTO my_table SET name = ?', [name], (error, results) => {
    if (error) throw error;
    res.redirect('/');
  });
});

// Alterar um registro existente
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  connection.query('UPDATE my_table SET name = ? WHERE id = ?', [name, id], (error, results) => {
    if (error) throw error;
    res.redirect(`/${id}`);
  });
});

// Excluir um registro
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM my_table WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.redirect('/');
  });
});

module.exports = router;

// Arquivo: app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require('./controller');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controller);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});