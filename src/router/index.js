const express = require('express');
const router = express.Router();

// const route = router.get('/', (req, res, next) => {
//     res.status(200).send({
//         title: "API CODE",
//         version: "0.0.01",
//         method: "GET"
//     })
// });

router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "API CODE",
        version: "0.0.01",
        method: "GET"
    })
});

router.post('/myuser', (req, res, next) => {
    
    const name = req.body.name;
    const phone = req.body.phone;
    console.log("name: " + name + "phone: " + phone);
    res.status(200).send({
        name: name,
        phone: phone
    })
});

// module.exports = route;

module.exports = router;