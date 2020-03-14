require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passwordHash = requer('password-hash');
const rateCalc = require('./getPostRate');
const PORT = process.env.PORT || 5000;

const connectionString = process.env.DATABASE_URL;
const { Pool } = require("pg");
const pool = new Pool({ connectionString: connectionString });

express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/computePostage', computePostage)
  .get('/isUserNameAvailable', checkUsernameAvailable)
  .post('/signUp', addUser)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function computePostage(req, res) {
  const parcelType = req.query.postType;
  const weight = Number(req.query.weight);

  let rate = rateCalc.getPostRate(parcelType, weight);

  let description = rateCalc.getParcelTypeDescriptionString(parcelType);

  const params = { parcelType: description, weight: weight, rate: rate };

  res.render('pages/prove9', params);
}


function checkUsernameAvailable(req, response) {
  const usernameSubmitted = req.query.username;

  const sql = "SELECT COUNT(id) FROM user_table WHERE username = $1";
  const params = [usernameSubmitted];
  response.type('application/json');

  pool.query(sql, params, (err, res) => {
    if (err) {
      console.log(`Error in query: ${err}`);
    }
    let usercount = res.rows[0];
    if (Number(usercount.count) > 0) {
      response.status(409).send(JSON.stringify(usercount));
    }
    else {
      response.status(200).send(JSON.stringify(usercount));
    }

  });
}

function addUser(req, response) {
  const username = req.query.username;
  const pass = req.query.password;
  let hashedPass = passwordHash.generate(pass);

  const sql = "INSERT INTO user_table (username, password_hash, user_level) VALUES ($1, $2, $3::int)";
  const params = [username, hashedPass, 1];
  response.type('application/json');

  pool.query(sql, params, (err, res) => {
    if (err) {
      console.log(`Error in query: ${err}`);
      response.status(500).send({ error: "Database error" });
    }
    else {
      response.status(200).send({ result: "User added" });
    }
  });
}
