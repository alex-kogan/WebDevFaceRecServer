const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const server = express();

const PGserver = '127.0.0.1';
const PGuser = 'postgres';
const PGpassword = 'Alex1885';
const PGdatabase = 'smart-brain';

const db = knex({
  client: 'pg',
  connection: {
    host : PGserver,
    user : PGuser,
    password : PGpassword,
    database : PGdatabase
  }
});

server.use(bodyParser.json())
server.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}		
	]
};

server.get('/', (req, res) => {
	res.json(database.users);
});

//let hashP = bcrypt.hashSync(database.users[0].password); // doing it sync as this doesn't happne in real life in the server

server.post('/signin', (req, res) => {
	const {email, password} = req.body;
	db.select('email', 'hash').from('login')
		.where('email','=', email)
		.then(data => {
			bcrypt.compare(password, data[0].hash, (error, passwordValid) => {
				if (passwordValid) {
					db.select('*').from('users')
						.where('email','=', email)
						.then(data => {
							res.json(data[0])
						})
						.catch(error => res.status(400).json('could not get user'))
				}
				else
					res.status(400).json("wrong password")
			});
		})
		.catch(error => res.status(400).json("email does not exsit in system"))
})

server.post('/register', (req, res) => {
	const {email, name, password} = req.body; 
	const hash = bcrypt.hash(password, null, null, (error, hash) => {
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx.insert({ // trx is avialble in this scope but needs to be returned to the parent scope so it can be commited
						email: loginEmail[0], // since it's returning an array
						name: name,
						joined: new Date()
					})
					.into('users')
					.returning('*')
					.then(user => {
						res.json(user[0])
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
			})
		.catch(error => res.status(400).json(error))
	})
})

server.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id: id})
		.then(user => {
			if (user.length!==0)
				res.json(user[0])
			else
				res.status(400).json('no such user')
		})
		.catch(error => res.status(400).json('error getting user'))
});

server.put('/image', (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0])
	})
	.catch(error => res.status(400).json('unable to get entries'))
})

server.listen(3000, () => {
	console.log('app is running on port 3000')
});

/*

/ --> res = this is working
/signin --> post = success/fail
/register --> post = new user object
/profile/:userID --> GET = user
/image --> put = user


*/