const EXPRESS = require('express');
const NOCACHE = require('nocache');
const BODY_PARSER = require('body-parser');
const CORS = require('cors');
const CONFIG = require('../configurations/env.config');
const app = EXPRESS();
const path = require('path');
const fs = require('fs');
const ROUTE = require('./webServer/routes');
const http = require('http'); //for ssl http
const https = require('https'); ///for ssl https
const CONFIGURATION = require('../../config');
const HOST_NAME = CONFIGURATION.HOST_NAME;
app.use(BODY_PARSER.urlencoded({ extended: false }));
app.use(BODY_PARSER.json());

ROUTE.applyRoutes(app);

const httpsOptions = {
    cert: fs.readFileSync(path.resolve(__dirname, '../../Wildcard_SSL/ee8c5a7c6af27611.crt')),
    ca: fs.readFileSync(path.resolve(__dirname, '../../Wildcard_SSL/gdroot-g2.crt')),
    key: fs.readFileSync(path.resolve(__dirname, '../../Wildcard_SSL/Private-Key.key'))
  }

const httpsServer = https.createServer(httpsOptions, app);
const httpServer = http.createServer(app);

httpsServer.listen(CONFIGURATION.HTTPS_PORT, HOST_NAME);
httpServer.listen(CONFIGURATION.HTTP_PORT, HOST_NAME);


console.log('Node Server is running on port: ' + CONFIGURATION.HTTP_PORT + ' and ' + CONFIGURATION.HTTPS_PORT + ' with HostName => ' + HOST_NAME);


