export class CustomError {
    static createError({name='Error', cause, message, code=5}) {
        // console.log(cause)  
           
        let error = new Error(message)
        error.cause = cause  
        error.name = name
        error.code = code
        // console.log(error)
        throw error
    }
}
