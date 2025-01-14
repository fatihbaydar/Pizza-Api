"use strict"

const User = require("../models/user")
const Token = require("../models/token")
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../errors/customError")
const passwordEncrypt = require("../helpers/passwordEncrypt")

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

        let tokenData = await Token.findOne({ userId: user._id })

        if (!tokenData) {
            const tokenKey = passwordEncrypt(user._id + Date.now())
            tokenData = await Token.create({ userId: user._id, token: tokenKey })
        }

        res.status(200).send({
            error: false,
            token: tokenData.token,
            user,
        });
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

        if(tokenKey?.at(0) == "Token"){
            deleted = await Token.deleteOne({token:tokenKey[1]})
        }
    }
}