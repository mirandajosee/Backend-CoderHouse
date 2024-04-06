import { logger } from "../logger/logger"

export class CustomError {
    static createError({name='Error', cause, message, code=5}) {
        let error = new Error(message)
        error.cause = cause  
        error.name = name
        error.code = code
        throw error
    }
}
