const handleRegister =  (req, res, db, bcrypt) => {
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
}

module.exports = {
	handleRegister: handleRegister
}