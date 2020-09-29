const DOT_ENV = require('dotenv');
DOT_ENV.config();

exports.MQTT = {
    'BROKER_URL': process.env.BROKER_URL,
    'PORT': process.env.PORT,
    'TOPICS': {
        'singleLvlElliot': process.env.singleLvlElliot,
        'singleLvlElliotHistorical': process.env.singleLvlElliotHistorical,
        'singleLvlHkHistorical': process.env.singleLvlHkHistorical,
        'singleLvlHkRealtime': process.env.singleLvlHkRealtime,
        'assetLvl': process.env.assetLvl,
        'registerLvl': process.env.registerLvl,
        'pendingHrsLvl': process.env.pendingHrsLvl
    }
};

exports.SMS = {
    'AUTH_KEY': process.env.AUTH_KEY,
    'SENDER_ID': process.env.SENDER_ID
};

exports.DATABASE = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'DATABASE_NAME': process.env.DATABASE_NAME
};

exports.HTTP = {
    'URL': process.env.HTTP_URL,
    'PORT': process.env.HTTP_PORT
};
