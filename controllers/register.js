const registerHandler = (req, res, db, bcrypt) => {

    const {email, fname, lname, gender, password} = req.body;

    if(!email || !gender || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('dietr_login')
        .returning('email')
        .then(loginEmail => {
            return trx('dietr_users')
            .returning('*')
            .insert({
                fname: fname,
                lname: lname,
                email: loginEmail[0],
                gender: gender

            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err))
}

module.exports = {
registerHandler: registerHandler
}