"use strict"

const router = require('express').Router()
const pizza = require("../controllers/pizza")
const multer = require("multer")

//* UPLOADING * MULTER
const upload = multer({
    // dest: './upload',
    storage:multer.diskStorage({
        destination:"./upload",
        filename:function (req, file, returnCallback) {
            // console.log(file)
            // returnCallback(error, fileName)
            // returnCallback(null, "pizza.png")
            // returnCallback(null, file.originalname) // dynamic name
            returnCallback(null, Date.now() + "_" + file.originalname) // to avoid conflicts
        }
    })
})

router.route("/")
.get(pizza.list)
// .post(pizza.create)
// .post(upload.single("image"), pizza.create)
.post(upload.array("image"), pizza.create)
// .post(upload.any(), pizza.create) // no need to use filename. but it is not recommended.

router.route("/:id")
.get(pizza.read)
.post(upload.array("image"),pizza.update)
.patch(upload.array("image"),pizza.update)
.delete(pizza.read)

module.exports = router