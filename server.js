const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register = require('./Controllers/register')
const signin = require('./Controllers/signin')
const image = require('./Controllers/image')
const profile = require('./Controllers/profile')

const server = express();

const PGserver = process.env.DATABASE_URL;

const db = knex({
  client: 'pg',
  connection: {
    connectionString : PGserver,
    ssl: true,
  }
});

// for local pg database

// const PGserver = '127.0.0.1';
// const PGuser = 'postgres';
// const PGpassword = 'Alex1885';
// const PGdatabase = 'smart-brain';

//  const db = knex({
//   client: 'pg',
//   connection: {
//     host : PGserver,
//     user : PGuser,
//     password : PGpassword,
//     database : PGdatabase
//   }
// });


server.use(bodyParser.json())
server.use(cors());

server.get('/', (req, res) => {
	res.json('running')
});


server.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))
server.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))
server.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db))
server.put('/image', (req, res) => image.handleImage(req, res, db))

server.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
});

/*

/ --> res = this is working
/signin --> post = success/fail
/register --> post = new user object
/profile/:userID --> GET = user
/image --> put = user


*/