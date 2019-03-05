const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');

const server = express();

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
	if (email === database.users[0].email && 
		 password === database.users[0].password ){
			res.json(database.users[0])
		}
		else {
			res.status(400).json('error signing in')
		}
})

server.post('/register', (req, res) => {
	const {email, name, password} = req.body; 
	database.users.push({
		id: '125',
		name: name,
		email: email,
		//password: password, not how we store passwords
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1])
})

server.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	database.users.forEach( (user) => {
		if (user.id===id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json('user not found')
	}
});

server.put('/image', (req, res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach( (user) => {
		if (user.id===id) {
			found = true;
			return res.json(++user.entries);
		}
	})
	if (!found) {
		res.status(400).json('user not found')
	}
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