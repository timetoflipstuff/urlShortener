const express = require('express');
const server = require('../server.js');

const router = express.Router();

// GET /:code
router.get('/:code', async function (req, res) {
    try {
        let longUrl = await server.getLongUrl(req.params.code);
        console.log(longUrl, req.params.code);
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

module.exports = router;