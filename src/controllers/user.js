"use strict"
const User = require("../models/user")
const { BadRequestError } = require("../errors/customError")
const sendMail = require("../helpers/sendMail")

module.exports = {
    list: async (req, res) => {
        /*
             #swagger.tags = ["Users"]
             #swagger.summary = "List Users"
             #swagger.description = `
                 You can send query with endpoint for filter[], search[], sort[], page and limit.
                 <ul> Examples:
                     <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                     <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                     <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                     <li>URL/?<b>page=2&limit=1</b></li>
                 </ul>
             `
         */
        const data = await res.getModelList(User)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(User),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    $ref: "#/definitions/User"
            }
        }
        */
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test
            (req?.body?.password)
        )
            throw new BadRequestError("password must be at least 8 characters including a number and an uppercase letter");

        const data = await User.create(req.body)

        sendMail(
            // to whom
            data.email,
            // title
            "Welcome to our website",
            //content
           ` <h1>Welcome</h1>
            <h2>${data.username}</h2>
            <p>"Welcome to our system</p>`
        )     
    
        res.status(201).send({
            error: false,
            data,
        });
    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
        const data = await User.findOne({ _id: req.params.id })

        res.status(200).send({
            error: false,
            data,
        });

    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    $ref: "#/definitions/User"
            }
        }
        */
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
            req?.body?.password)
        )
            throw new BadRequestError("password must be at least 8 characters including a number and an uppercase letter");

        const data = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

        res.status(202).send({
            error: false,
            data,
            new: await User.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
        const data = await User.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}