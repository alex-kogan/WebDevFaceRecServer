const handleSignin = (req, res, db, bcrypt) => {
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
}

module.exports = {
	handleSignin: handleSignin
}