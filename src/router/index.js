const express = require('express');
const router = express.Router();

const route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "API CODE",
        version: "0.0.01",
        method: "GET"
    })
});
module.exports = route;