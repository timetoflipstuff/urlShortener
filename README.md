# URL Shortening API via Node.JS and Redis
A working version is up on Heroku: https://infinite-inlet-19708.herokuapp.com
## Usage
The API can turn long links into short links and vice versa.
To shorten a link make a POST HTTP request to /api/url/shorten with the long link.
The api will return the shortened link as a response if the link is valid.
# Example request:
POST https://infinite-inlet-19708.herokuapp.com/api/url/shorten
Content-Type: application/json

{
    "longUrl": "https://soundcloud.com/bellgates"
}
## Installation
Install all npm dependencies specified in package.json: npm i -S DEPENDENCY
Modify the redisURL variable in server.js and the urlBase variable in routes/url.js to your needs
## Start
npm start