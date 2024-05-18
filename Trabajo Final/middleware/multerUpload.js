import multer from 'multer'
import { __dirname } from '../utils.js'

let path
let newFileName
//configuracion de donde se guardaran los archivos:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    switch (file.fieldname) {
        case "document":
            path = __dirname + '\\public\\documents'
            break
        case "profile":
            path = __dirname + '\\public\\profiles'
            break
        case "product":
            path = __dirname + '\\public\\products'
            break
        default:
            path = __dirname + '\\public\\documents'
            break
    }
    cb(null, path)
  },
  filename: function (req, file, cb) {
    switch (file.fieldname) {
      case "identity":
        newFileName = `${(new Date(Date.now())).toISOString().substring(0,10)}-identificacion-${(req.session.user.name+file.originalname).replace(/\s/g, '')}`
        break;
      case "address":
        newFileName = `${(new Date(Date.now())).toISOString().substring(0,10)}-certificadoDomicilio-${(req.session.user.name+file.originalname).replace(/\s/g, '')}`
        break;
      case "account":
        newFileName = `${(new Date(Date.now())).toISOString().substring(0,10)}-estadoCuenta-${(req.session.user.name+file.originalname).replace(/\s/g, '')}`
        break;

      default:
        newFileName = `${(new Date(Date.now())).toISOString().substring(0,10)}-${(req.session.user.name+file.originalname).replace(/\s/g, '')}`
        break;
    }
    
    cb(null, newFileName)
  }
})

const upload = multer({storage})
export default upload