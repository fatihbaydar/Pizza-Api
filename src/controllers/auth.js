"use strict"

const User = require("../models/user")
const Token = require("../models/token")
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../errors/customError")
const passwordEncrypt = require("../helpers/passwordEncrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    login: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */
        const { username, password, email } = req.body

        if (!((username || email) && password))
            throw new BadRequestError("username/email and password are required")

        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (!user) throw new NotFoundError("username or email is not found")

        if (!user.isActive) throw new UnauthorizedError("inactive user")

        if (user.password !== passwordEncrypt(password))
            throw new UnauthorizedError("the password is incorrect")

        /* SIMLPLE TOKEN */
        let tokenData = await Token.findOne({ userId: user._id })

        if (!tokenData) {
            const tokenKey = passwordEncrypt(user._id + Date.now())
            tokenData = await Token.create({ userId: user._id, token: tokenKey })
        }
        /* /SIMLPLE TOKEN */

        /* JWT */
        // Access Token
        const accessData = {
            _id:user._id,
            username:user.username,
            email:user.email,
            isActive:user.isActive,
            isAdmin:user.isAdmin,
        }
        // convert to jwt
        // const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {expiresIn:"30m"})
        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {expiresIn:process.env.ACCESS_EXP})

        // Refresh Token
        const refreshData = {
            _id:user._id,
            password:user.password
        }
        // convert to jwt
        const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {expiresIn:process.env.REFRESH_EXP})

        /* /JWT */

        res.status(200).send({
            error: false,
            token: tokenData.token,
            bearer:{
                access:accessToken,
                refresh:refreshToken
            },
            user,
        });
    },

    refresh: async(req,res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Refresh"
        #swagger.description = 'Refresh with refreshToken for get accessToken'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "bearer": {
                    refresh: '...refresh_token...'
                }
            }
        }
    */
   const refreshToken = req.body?.bearer?.refresh
   if(refreshToken) {
    const refreshData = jwt.verify(refreshToken,process.env.REFRESH_KEY)
    console.log(refreshData)

    if(refreshData) {
        const user = await User.findOne({_id:refreshData._id})

        if(user && user.password == refreshData.password) {
            if(user.isActive) {
                res.status(200).send({
                error:false,
                bearer:{access:jwt.sign(user.toJSON(), process.env.ACCESS_KEY, {expiresIn:process.env.ACCESS_EXP})} 
                })
                
            }else {
                res.errorStatusCode = 401
                throw new Error("This account is not active.")
              }
        } else{
            res.errorStatusCode = 401
          throw new Error('Wrong id or password.')
        }
    }else{
        res.errorStatusCode = 401
        throw new Error('JWT refresh data is wrong.')
    }
   }else{
    res.errorStatusCode = 401
            throw new Error('Please enter bearer.refresh')
   }
    },

    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "simpleToken: Logout"
            #swagger.description = 'Delete token key.'
        */
        const auth = req.headers?.authorization || null
        const tokenKey = auth ? auth.split(" ") : null
        let deleted = null

        if (tokenKey[0] == "Token") {
            deleted = await Token.deleteOne({ token: tokenKey[1] })
            res.send({
                error: false,
                message: "Token deleted. Logout was OK.",
                deleted
              });
        }else if (tokenKey[0] == "Bearer") {
            res.send({
                error:false,
                message:"JWT: No need any process for logout"
            })
        }
    }
}