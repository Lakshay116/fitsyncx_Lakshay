
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring');
const sendMail = require('../helper/sendMaill')

const register = (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }
    db.query(`SELECT * FROM users WHERE LOWER(EMAIL) = LOWER(${db.escape(
        req.body.email
    )});`,
        (err, result) => {
            if (result && result.length) {
                return res.status(409).send({
                    msg: 'User Exist'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(400).send({
                            msg: err
                        });
                    }
                    else {
                        db.query(`INSERT INTO users(NAME,EMAIL,PHONE,PASSWORD) 
                            VALUES('${req.body.name.toUpperCase()}',UPPER(${db.escape(req.body.email)}),${db.escape(req.body.phone)},${db.escape(hash)});`,
                            (err, result) => {
                                if (err) {
                                    return res.status(500).send({
                                        msg: err
                                    });
                                }
                                let mailSubject = 'Mail Verification';
                                const randomToken = randomstring.generate();
                                let content = '<p>Hey!' + req.body.name + '\
                                Please <a href="http://localhost:5001/mail-verification?token='+ randomToken + '"> Verify</a> your Mail.'
                                sendMail(req.body.email, mailSubject, content);
                                db.query('UPDATE users set token=? where email=?', [randomToken, req.body.email], function (error, result) {
                                    if (error) {
                                        return res.status(400).send({
                                            msg: error
                                        });
                                    }
                                })
                                return res.status(200).send({
                                    msg: `User ${req.body.email} is registered.`
                                });
                            })
                    }
                })
            }
        })


}

const verifyMail = (req, res) => {
    var token = req.query.token;
    db.query('SELECT * FROM users WHERE TOKEN=? LIMIT 1', token, function (error, result, fields) {
        if (error) {
            console.log(error.message);
        }
        if (result.length > 0) {
            db.query(`update users set token = null , is_verified = 1 where EMAIL = '${result[0].EMAIL}'
                `);

            return res.render('mailVerification', {
                message: "Mail verified!"
            })
        }
        else {
            return res.render('404');
        }
    })

}


const login = (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }
    db.query(`SELECT * FROM users where EMAIL = '${req.body.email.toUpperCase()}';`,
        (err, result) => {
            if (err) {
                res.status(400).send({
                    msg: err
                })
            }
            if (!result.length) {
                return res.status(401).send({
                    msg: "Usernsme and Password not matched."
                })
            }
            bcrypt.compare(
                req.body.password,
                result[0]['PASSWORD'], (berr, bresult) => {
                    if (berr) {
                        res.status(400).send({
                            msg: berr
                        })
                    }
                    if (bresult) {
                        const token = jwt.sign({ email: result[0]['EMAIL'] }, process.env.JWT_SECRET, { expiresIn: '1h' });

                        return res.status(200).send({
                            msg: "Logged In",
                            token,
                            user: result[0]
                        })
                    }

                    return res.status(401).send({
                        msg: "Usernsme and Password not matched end."
                    })
                })

        }
    );
}

module.exports = { register, verifyMail, login } 