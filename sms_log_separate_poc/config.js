const DOT_ENV = require('dotenv');

const result = DOT_ENV.config();
if (result.error) {
    throw result.error
  }
   
  console.log(result.parsed)

const Database = { 
    URL: process.env.DATABASE_URL,
    NAME: process.env.DATABASE_NAME
}

module.exports ={
    ENVIRONMENT: process.env.NODE_ENV,
    HTTP_PORT: process.env.HTTP_PORT,
    HTTPS_PORT: process.env.HTTPS_PORT,
    HOST_NAME: process.env.HOST_NAME,
    DATABASE: Database,
    SECRET: process.env.HOST_SECRET
}