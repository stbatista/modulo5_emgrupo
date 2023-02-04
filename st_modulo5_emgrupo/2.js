// Arquivo: model.js
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
const bcrypt = require('bcrypt');

// Rota de cadastro
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, surname, login, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    connection.query('INSERT INTO users SET ?', { name, surname, login, password: hash }, (error, results) => {
      if (error) throw error;
      res.redirect('/');
    });
  });
});

// Rota de login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { login, password } = req.body;
  connection.query('SELECT * FROM users WHERE login = ?', [login], (error, results) => {
    if (error) throw error;
    if (!results.length) return res.redirect('/login');
    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      if (!result) return res.redirect('/login');
      req.session.user = user;
      res.redirect('/members');
    });
  });
});

// Rota de membros
router.get('/members', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('members');
});

module.exports = router;

// Arquivo: app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const controller = require('./controller');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(controller);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});