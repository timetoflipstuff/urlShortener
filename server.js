const express = require('express');
const url = require('url');
const {promisify} = require('util');
const redis = require('redis');
const murmurhash = require('murmurhash');
const app = express();

const port = 8080;

const redisURL = url.parse(process.env.REDISTOGO_URL || 'redis://redistogo:de7cb3d72c0d15c801919d25b28110ad@hammerjaw.redistogo.com:11523/');
//console.log(process.env.REDISTOGO_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);
const setnxAsync = promisify(client.setnx).bind(client);
async function dbInsert(longUrl) {
    let shortenedUrl = murmurhash.v3(longUrl);
    await setnxAsync(shortenedUrl, longUrl);
    return shortenedUrl;
}

client.on('error', function (err) {
    // NOTICE: Enters here
    console.log("Error " + err);
})

app.use(express.json({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

module.exports.dbInsert = dbInsert;

app.listen(process.env.PORT || port);

