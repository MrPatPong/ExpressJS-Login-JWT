const express = require('express')
const router = express.Router()

const { register, login, refreshToken } = require('../Controllers/auth')
const { auth, RefreshTokenValidate } = require('../Middleware/auth')



// http://localhost:5000/api/register
router.post('/register', register)
router.post('/login', login)
router.post('/refresh_token',RefreshTokenValidate,refreshToken) 



module.exports = router