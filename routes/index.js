const express = require('express');
const validUrl = require('valid-url');
const redis = require('redis');
const {promisify} = require('util');

const client = redis.createClient();
const router = express.Router();
const getAsync = promisify(client.get).bind(client);
// GET /:code
router.get('/:code', async function (req, res) {
    try {
        let longUrl = await getAsync(req.params.code);
        console.log(longUrl);
        if (longUrl) {
            return res.redirect(longUrl);
        } else {
            return res.status(404).json('URL not found');
        }
    } catch(e) {
        res.status(500).json('Server error');
        console.log(e);
    }
})

module.exports = router