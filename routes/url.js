const express = require('express');
const validUrl = require('valid-url');
const redis = require('redis');
const {promisify} = require('util');
const murmurhash = require('murmurhash');
//redis://h:pbba1ed4b66de98f4ff7683e7c9441a066206a12fd8f968b265635deed31d729a@ec2-3-229-149-241.compute-1.amazonaws.com:9199
const urlBase = 'https://infinite-inlet-19708.herokuapp.com';
const server = require('../server.js');

const router = express.Router();

// POST /api/url/shorten
router.post('/shorten', async function (req, res) {
    const { longUrl } = req.body;
    if (validUrl.isUri(longUrl)) {
        try {
            console.log('Looks like an URI');
            let shortenedUrl = await server.dbInsert(longUrl);
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