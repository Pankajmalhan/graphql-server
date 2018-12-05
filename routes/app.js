var router = require('express').Router();
var path = require("path");
var fs = require("fs");
const util = require('util');
wrapperFun = (callBack) => {
    return (req, res, next) => {
        try {
            callBack(req, res);
        }
        catch (exp) {
            // next(exp);
            res.status(200).send("maja aa gya fir se 2");
        }
    }
}

router.get('/', async (req, res, next) => {
    console.log("__basedir", __basedir);
    const stat = util.promisify(fs.readFile);
    var data = await stat(__basedir + "/files/data.txt", "utf8");
    res.status(200).send(data);
});

module.exports = router;