import {Router} from "express"

const testingRouter = Router()



testingRouter.get('/loggerTest', (req, res) => {
    req.logger.warning('warning ejecutandose')
    req.logger.info('info ejecutandose')
    req.logger.error('error ejecutandose')
    req.logger.http('http ejecutandose')

    res.send('logger ejecutado')
})

export {testingRouter}