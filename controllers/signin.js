const signinHandler = (req, res, db, bcrypt, jwt)=> {

    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

        db.select('email', 'hash').from('dietr_login')
            .where('email', '=', req.body.email)
            .then(data => {
                const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
                if(isValid) {
                    return db.select('*').from('dietr_users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json({token: jwt.sign(user[0], 'dietrapi')})
                        })
                        .catch(err => res.status(400).json('Unable to get user'))
                } else {
                    res.status(400).json('wrong login details')
                }
            })
            .catch(err => res.status(400).json('wrong login details'))
}

module.exports = {
    signinHandler: signinHandler
}