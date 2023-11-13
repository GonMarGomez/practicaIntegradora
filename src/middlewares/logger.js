import 'dotenv/config'
import winston from 'winston';


const customLevelsOptions = {
    levels: {
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    }
}

const loggerDev = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
        })
    ]
})

const loggerProd = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info' 
        }),
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple())
        }).on('error', (error) => {
            console.error('Error al crear el archivo de registro:', error);
        })        
    ]
})

export const addLogger = (req, res, next) =>{
    req.logger = process.env.LOGGER === 'prod' ? loggerProd : loggerDev;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}