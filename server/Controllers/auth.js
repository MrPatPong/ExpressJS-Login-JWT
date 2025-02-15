const User = require('../Models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')
const  dotenv = require('dotenv')

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE);

let refreshTokens = [];

exports.register = async (req, res) => {
    try {
        //code
        // 1.CheckUser
        const { name, password } = req.body
        var user = await User.findOne({ name })
        if (user) {
            return res.send('User Already Exists!!!').status(400)
        }
        // 2.Encrypt
        const salt = await bcrypt.genSalt(10)
        user = new User({
            name,
            password
        })
        user.password = await bcrypt.hash(password, salt)
        // 3.Save
        await user.save()
        res.send('Register Success!!')

    } catch (err) {
        //code
        console.log(err)
        res.status(500).send('Server Error')
    }
}
exports.login = async (req, res) => {
    try {
        //code
        // 1. Check User
        const { name, password } = req.body
        var user = await User.findOneAndUpdate({ name }, { new: true })
        console.log(user)
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).send('Password Invalid!!!')
            }
            // 2. Payload
            var payload = {
                user: {
                    name: user.name,
                    exp: Math.floor(Date.now() / 1000) + accessTokenExpire
                }
            }
            // 3. Generate
            //     jwt.sign(payload, 'jwtsecret', { expiresIn: accessTokenExpire }, (err, token) => {
            //     if (err) throw err;
            //     res.json({ token, payload ,expiresIn:120 })
            // })

            const accessToken = jwt.sign(payload, accessTokenSecret, {
                expiresIn: accessTokenExpire,
              });
            
              const refreshToken = jwt.sign(
                payload,
                refreshTokenSecret,
                { expiresIn: refreshTokenExpire }   
              );
            
              refreshTokens.push(refreshToken);
            
              res.json({payload, accessToken, refreshToken, expiresIn: accessTokenExpire });
            
        } else {
            return res.status(400).send('User not found!!!')
        }

    } catch (err) {
        //code
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.refreshToken = async (req, res) => {

    try {
        const { token } = req.body;
        if (!token) {
            return res.send('No token!!!').status(400)
          }
          
        //   console.log(token)
          jwt.verify(token, refreshTokenSecret, (err, user) => {
            if (err) {
              return res.Status(403)
            }
            payload = {
              user: {
                name: user.name,
                exp: Math.floor(Date.now() / 1000) + accessTokenExpire,
              }
            }
        
            const accessToken = jwt.sign(payload, accessTokenSecret, {
              expiresIn: accessTokenExpire,
            });
      
            const refreshToken = jwt.sign(
              payload,
              refreshTokenSecret,
              { expiresIn: refreshTokenExpire }
            );              
            res.json({
              accessToken,refreshToken
            });
          });
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
  };

//   exports.registerPrisma = async (req, res) => {
//     try {
//         //code
//         // 1.CheckUser
//         const { name, password } = req.body
//         var user = await User.findOne({ name })
//         if (user) {
//             return res.send('User Already Exists!!!').status(400)
//         }
//         // 2.Encrypt
//         const salt = await bcrypt.genSalt(10)
//         user = new User({
//             name,
//             password
//         })
//         user.password = await bcrypt.hash(password, salt)
//         // 3.Save
//         await user.save()
//         res.send('Register Success!!')

//     } catch (err) {
//         //code
//         console.log(err)
//         res.status(500).send('Server Error')
//     }
// }
