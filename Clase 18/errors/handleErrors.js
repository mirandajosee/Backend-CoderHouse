import { EnumErrors } from "./EnumErrors.js";
import { logger } from "../logger/logger.js";

export const handleErrors = (error, req, res, next) => {
    logger.error(error.message)

    switch (error.code) {
        case EnumErrors.INVALID_TYPES_ERROR:
            return res.send({status: 'error', error: error.name})            
            break;
        case EnumErrors.ROUTING_ERROR:
                return res.send({status: 'error', error: error.name})            
                break;
        case EnumErrors.DATABASES_ERROR:
            return res.send({status: 'error', error: error.name})            
            break;
        default:
            return res.send({status: 'error', error: 'Error de server'})
            break;
    }
    next()
}