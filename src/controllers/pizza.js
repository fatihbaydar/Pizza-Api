"use strict"

const Pizza = require("../models/pizza")

module.exports = {
    list: async (req, res) => {
        /*
            #swagger.tags = ["Pizzas"]
            #swagger.summary = "List Pizzas"
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
        const data = await res.getModelList(Pizza)

        res.status(200).send({
            error:false,
            details:res.getModelListDetails(Pizza),
            data
        })
    },

    create: async (req, res) => {
        /*
            #swagger.tags = ["Pizzas"]
            #swagger.summary = "Create Pizza"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    $ref: "#/definitions/Pizza"
            }
        }
        */
     
    //    console.log("file", req.file) // upload.single()
    //    console.log("files", req.files) // uplaod.array() || upload.any()

    req.body.images = []
    if(req.files){
        for(let file of req.files){
            req.body.images.push(file.path)
        }
    }

    const data = await Pizza.create(req.body)

       res.status(201).send({
        error:false,
        data
       })

    },

    read: async (req, res) => {
        /*
            #swagger.tags = ["Pizzas"]
            #swagger.summary = "Get Single Pizza"
        */
       const data = await Pizza.findOne({_id:req.params.id})

       res.status(200).send({
        error:false,
        data
       })
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Pizzas"]
            #swagger.summary = "Update Pizza"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    $ref: "#/definitions/Pizza"
            }
        }
        */
       const data = await Pizza.updateOne({_id:req.params.id}, req.body, {runValidators:true})

       res.status(202).send({
        error:false,
        data,
        new: await Pizza.findOne({_id:req.params.id})
       })
    },

    delete: async (req, res) => {
         /*
            #swagger.tags = ["Pizzas"]
            #swagger.summary = "Delete Pizza"
        */
       const data = await Pizza.deleteOne({_id:req.params.id})

       res.status(data.deletedCount ? 204 : 404).send({
        error:!data.deletedCount,
        data
       })
    },
}