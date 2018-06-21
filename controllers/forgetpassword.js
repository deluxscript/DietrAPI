const forgetPasswordHandler = (req, res, db, bcrypt, sendEmail, jwt, randomString, waterfall, crypto)=> {

    const { email } = req.body;

	// db.select('*').from('dietr_users').where({email})
	// 	.then(user => {
	// 		if(user) {
    //             res.json(user)
    //             console.log('abayo', user[0].email);
	// 		}
	// 		else {
	// 			res.status(400).json('No user found')
	// 		}
			
	// 	})
	// 	.catch(err => res.status(400).json('No user rfound'))


    waterfall([
        function(done) {
            db.select('*').from('dietr_users').where('email', '=', 'delsam94@yahoo.com')
		.then(user => {
			if(user) {
                // res.json(user);
                done(user);
			}
			else {
                done('User not found.');
			}
			
		});
        },
        function(user, done) {
          // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(user, token);
        
      });
      console.log(user)
            // var token = randomString(40);
            // done(err, user, token);
        },
        function(user, done, token) {
            console.log('2s', user);

            const emailResponse = {
                        to: email,
                        subject:  'Dietr Password reset',
                        text: `Kindly reset your password by following this link: localhost:3001/resetpassword/${resettoken}`,
                        html: `<p>Kindly reset your password by following this link:</p> <p>localhost:3001/resetpassword/${resettoken}</p>`,
                    };
    
                    sendEmail(emailResponse);
        }
      ], function(err) {
        return res.status(422).json({ errormessage: err });
      });

    // const { email } = req.body;
    // if(!req.body)
    //     return res.status(400).json('No request body');
    // if(!email)
    //     return res.status(400).json('No request body email');

    // const resettoken = randomString(40);
    // const emailResponse = {
    //     to: email,
    //     subject:  'Dietr Password reset',
    //     text: `Kindly reset your password by following this link: localhost:3001/resetpassword/${resettoken}`,
    //     html: `<p>Kindly reset your password by following this link:</p> <p>localhost:3001/resetpassword/${resettoken}</p>`,
    // };
}

module.exports = {
    forgetPasswordHandler: forgetPasswordHandler
}