import winston from "winston";

const consoleLevel = (entorno)=>{
    switch(entorno){
        case "development":
            return "debug"
            break;
        case "production":
            return "info"
            break;
        default:
            return "info"
            break;
    }
}

const levelOptions = {
    levels: {
        fatal: 0,
        error:1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'blue'
    }
}

export const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: consoleLevel(process.env.NODE_ENV),
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

// middleware
export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
} 