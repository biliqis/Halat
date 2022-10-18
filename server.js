const http = require('http');
const config = require('./config');
const app = require('./src/app');
const db = require('./src/db');

const startApp = async () => {
    try{
        // config.logger.info('Waiting for DATABASE Connection...');
        //no need for db now
        await db.connect();
        const server =  http.createServer(app);
        //start listening on the http server on PORT
        server.listen(config.PORT, () => config.logger.info(
            `Env ${config.NODE_ENV}: Server started on PORT ${config.PORT}`
        ));      
    }catch(error){
        config.logger.error(err.stack);
        process.emit('SIGTERM');
    }
}


startApp();