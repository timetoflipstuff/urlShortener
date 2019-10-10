const express = require('express');
const app = express();

const port = 8080;

app.use(express.json({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

app.listen(process.env.PORT || port);