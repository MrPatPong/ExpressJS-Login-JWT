const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE);

exports.auth = async (req, res, next) => {
    try {
        //code
        const token = req.headers["authtoken"]
        if (!token) {
            return res.status(401).send('No token')
        }
        const decoded = jwt.verify(token,accessTokenSecret)
        req.user = decoded.user
        console.log("req.user:",req.user)
        next();
    } catch (err) {
        // err
        console.log(err)
        res.send('Token Invalid').status(500)
    }
}

exports.RefreshTokenValidate = async (req, res, next) => {
    try {
      const token = req.headers["authtoken"]
      if (!token) return res.Status(401).send('No token')
      jwt.verify(token, refreshTokenSecret, (err, decoded) => {
        if (err) throw new Error(error);
  
        req.user = decoded
        req.user.token = token
        console.log('a0',req.user)
        // delete req.user.exp
        // delete req.user.iat

        
      }) 
      const decoded = jwt.verify(token,refreshTokenSecret)
      req.user = decoded.user

      next();
    } catch (err) {
      console.log(err)
      res.send('Token Invalid1').status(500)
    }
  }