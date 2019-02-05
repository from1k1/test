const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const router = require('./router.js');
const cors = require('cors');
const app = express();
//App setupe
app.use(morgan('combined'));
app.use('/static',express.static('/home/c2617/frmk.tk/app/static/'));
app.use(cors());
router(app);

//Server setup
const { APP_PORT, APP_IP, APP_PATH } = process.env;
const server = http.createServer(app);
server.listen(APP_PORT);