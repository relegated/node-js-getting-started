require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passwordHash = require('password-hash');
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
  .get('/kanalogin', kanaLogin)
  .post('/login', validateLogin)
  .get('/loadKanaQuestions', loadKanaQuestions)
  .post('/levelup', levelUpUser)
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
  const username = req.body.username;
  const pass = req.body.password;
  
  let hashedPass = passwordHash.generate(pass);
  
  const sql = "INSERT INTO user_table (username, password_hash, user_level) VALUES ($1, $2, $3::int)";
  const params = [username, hashedPass, 1];
  

  pool.query(sql, params, (err, res) => {
    if (err) {
      console.log(`Error in query: ${err}`);
      response.type('application/json');
      response.status(500).send({ error: "Database error" });
    }
    else {
      let loginParams = { 
        username: username,
        invalid: false 
      };
      response.type('html');
      response.render('pages/login', loginParams);
    }
  });
}

function kanaLogin(req, response) { 
  response.render('pages/login', { username: "", invalid: false});
}

function validateLogin(req, response) {
  const username = req.body.username;
  const pass = req.body.password;

  const passHashSql = "SELECT password_hash, user_level FROM user_table WHERE username = $1";
  const passHashParams = [username];

  pool.query(passHashSql, passHashParams, (err, sqlResponse) => {
    if (err) {
      console.log(`Error in query: ${err}`);
      response.type('application/json');
      response.status(500).send({ error: "Database error" });
    }
    else {
      if (sqlResponse.rowCount == 0)
      {
        let loginParams = { 
          username: username,
          invalid: true
         };
         response.type('html');
         response.render('pages/login', loginParams);
      }
      else {
        let returnedHash = sqlResponse.rows[0].password_hash;
        let successfulLogin = passwordHash.verify(pass, returnedHash);
  
        if (! successfulLogin) {
          let loginParams = { 
            username: username,
            invalid: true
           };
           response.type('html');
           response.render('pages/login', loginParams);
        }
        else{
          let userLevel = sqlResponse.rows[0].user_level
          let mainPageParams = {
            username: username,
            level: userLevel
          }
          response.type('html');
          response.render('pages/kanamain', mainPageParams);
        }
      }
    }
  }); 
}

function loadKanaQuestions(req, response) {
   const level = Number(req.query.userlevel);

   const sql = "SELECT root.sylable_root AS romanji, h.kana_id AS hiragana, k.kana_id AS katakana, root.level_requirement AS userlevel FROM sylable_root root " 
    + "LEFT JOIN symbol_value h ON h.sylable_root_id = root.id AND h.is_katakana = FALSE "
    + "LEFT JOIN symbol_value k ON k.sylable_root_id = root.id AND k.is_katakana = TRUE "
    + "WHERE root.level_requirement <= $1::int";
   const sqlParams = [level];

   pool.query(sql, sqlParams, (err, sqlResponse) => {
    if (err) {
      console.log(`Error in query: ${err}`);
      response.type('application/json');
      response.status(500).send({ error: "Database error" });
    }
    else {
      response.type('application/json');
      response.status(200).send(sqlResponse.rows);
    }
   });
}

function levelUpUser(req, response) {
  const user = req.body.user;
  const newLevel = Number(req.body.newLevel);

  const sql = "UPDATE user_table SET user_level = $1::int WHERE username = $2";
  const sqlParams = [newLevel, user];

  pool.query(sql, sqlParams, (err, sqlResponse) => {
    if (err) {
      console.log(`Error in query: ${err}`);
      response.type('application/json');
      response.status(500).send({error: "Database error" });
    }
    else {
      response.type('application/json');
      response.status(200).send({newLevel : newLevel});
    }
  });
}