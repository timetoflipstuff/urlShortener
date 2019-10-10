const express = require('express');
const validUrl = require('valid-url');
const redis = require('redis');
const {promisify} = require('util');
const murmurhash = require('murmurhash');

const urlBase = 'https://infinite-inlet-19708.herokuapp.com/';
console.log(process.env.REDISTOGO_URL);
const client = redis.createClient(process.env.REDIS_URL);

const router = express.Router();
const setnxAsync = promisify(client.setnx).bind(client);
// POST /api/url/shorten
router.post('/shorten', async function (req, res) {
    const { longUrl } = req.body;
    if (validUrl.isUri(longUrl)) {
        try {
            console.log('Looks like an URI');
            let shortenedUrl = murmurhash.v3(longUrl);
            await setnxAsync(shortenedUrl, longUrl);
            res.json(urlBase + '/' + shortenedUrl);
        } catch(e) {
            res.status(500).json('Server error');
            console.log(e);
        } 
    } else {
        console.log('Not a URI');
        res.status(400).json('Invalid URL');
    }
})

module.exports = router