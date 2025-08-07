const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const db = require('./config/db');

const app = express();


// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    exposedHeaders: ["set-cookie"]
}));

// Routes
app.use('/api', require('./routes/mou/s_childdev_specialpp'));
app.use('/api', require('./routes/mou/s_anc_quality'));
app.use('/api', require('./routes/mou/s_ncd_screen_repleate1'));
app.use('/api', require('./routes/mou/s_epi_complete'));
app.use('/api', require('./routes/mou/s_ht_screen_follow'));
app.use('/api', require('./routes/mou/s_breast_screen'));
app.use('/api', require('./routes/mou/s_colon_screen'));
app.use('/api', require('./routes/mou/s_dm_control'));
app.use('/api', require('./routes/mou/s_ht_control'));
app.use('/api', require('./routes/mou/s_ttm35'));
app.use('/api', require('./routes/mou/s_2q_adl_anc_chronic'));
app.use('/api', require('./routes/mou/s_epi1_3'));
app.use('/api', require('./routes/mou/s_dental_70'));
app.use('/api', require('./routes/mou/s_thai_id'));


app.use('/api', require('./routes/mou/summary_mou'));

// Port
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// 404 Error
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});