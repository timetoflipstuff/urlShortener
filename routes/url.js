const express = require('express');
const validUrl = require('valid-url');
const redis = require('redis');
const {promisify} = require('util');
const murmurhash = require('murmurhash');
const url = require('url');
//redis://h:pbba1ed4b66de98f4ff7683e7c9441a066206a12fd8f968b265635deed31d729a@ec2-3-229-149-241.compute-1.amazonaws.com:9199
const urlBase = 'https://infinite-inlet-19708.herokuapp.com/';
const redisURL = url.parse('redis://redistogo:de7cb3d72c0d15c801919d25b28110ad@hammerjaw.redistogo.com:11523/');
console.log(process.env.REDISTOGO_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);
const setnxAsync = promisify(client.setnx).bind(client);

client.on('error', function (err) {
    // NOTICE: Enters here
    console.log("Error " + err);
})

const router = express.Router();

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