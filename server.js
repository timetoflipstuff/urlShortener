const express = require('express');
const url = require('url');
const {promisify} = require('util');
const redis = require('redis');
const murmurhash = require('murmurhash');
const app = express();

const port = 8080;

const redisURL = url.parse(process.env.REDISTOGO_URL || 'some redis url value here');
//console.log(process.env.REDISTOGO_URL);
const client = redis.createClient(redisURL.port, redisURL.hostname);
client.auth(redisURL.auth.split(":")[1]);
const setnxAsync = promisify(client.setnx).bind(client);
const getAsync = promisify(client.get).bind(client);

async function dbInsert(longUrl) {
    let shortenedUrl = String(murmurhash.v3(longUrl));
    console.log(shortenedUrl);
    await setnxAsync(shortenedUrl, longUrl);
    return shortenedUrl;
}

async function getUrl(shortUrl) {
    let longUrl = await getAsync(shortUrl);
    return longUrl;
}

client.on('error', function (err) {
    // NOTICE: Enters here
    console.log("Error " + err);
})

app.use(express.json({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

module.exports.dbInsert = dbInsert;
module.exports.getLongUrl = getUrl;

app.listen(process.env.PORT || port);

