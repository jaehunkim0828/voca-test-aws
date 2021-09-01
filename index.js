const express = require('express') //express를 설치했기 때문에 가져올 수 있다.
const cookieparser = require('cookie-parser');
const app = express();
require("dotenv").config();
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port: process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : 'db_voca'
  }
});

const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('build'));
app.use(cookieparser());
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*")
  next();
});

app.get('/', function(req, res, next) {
  res.send('hello')
});

app.route('/voca')
  .get((req, res) => {
    res.send('voca');
  })
  .post((req, res) => {
    const { voca, engvoca } =req.body;

    if (!voca) {
      knex.select('*')
        .from('voca')
        .where({
          user_id: req.cookies['user']
        })
        .then(data => {
          res.send(data);
          return;
        })
      return;
    }
    knex.insert({
      created: new Date(), engvoca, user_id: req.cookies['user'], voca,
    })
      .into('voca')
      .then(data => res.send(data));
  })
  .delete((req, res) => {
    const { userId, voca, engvoca } = req.body;
    console.log(req.body);

    knex('voca').del().where({voca, engvoca, user_id: userId})
      .then(data => {
        //지우지말기
        console.log(data);
        res.send('제거성공')
      });
  })

app.route('/user')
  .get((_, res) => {
    knex.select('*').from('user')
      .then(data => {
        console.log(data);
        res.send('user')
      })
      .catch(err => res.send(err))
  })
  .post((req, res) => {
    const { code, password } =req.body;

    knex.select('code').from('user')
      .then(data => {
        for (let i = 0; i < data.length; i += 1 ) {
          if (data[i].code === code) {
            return res.status(409).send('이메일이 존재합니다.');
          }   
        }
        return knex.insert({
          code,
          password,
          created: new Date(),
        })
          .into('user')
          .then(data => res.status(201).send(data))
          .catch((err) => {
            res.send(err);
          })
      })
  })

app.route('/login')
  .get((_, res) => {
    res.clearCookie('user');
    res.send('로그아웃');
  })
  .post((req, res) => {
    const { code, password } = req.body;
    let userCookie = req.cookies["user"];

    if(userCookie){
      //쿠키가 있으면 로그인 유지.
      res.send(true);
      return;
    } 
    if (!code) {
      //로그아웃
      res.send(false);
      return;
    }

    knex.select('id').from('user').where({ code, password })
      .then(data => {
        if (data.length !== 0) {
          res.cookie('user', data[0].id);
          res.status(200).send('성공');
          return;
        } else {
          res.status(404).send('로그인 실패') 
        }
      }) 
  })

app.listen(port, () => console.log("Listening on", port));