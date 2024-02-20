import {fileURLToPath} from "url"
import {dirname} from "path"
import { genSaltSync,hashSync,compareSync } from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const persistencia = "DB" //"FS" para FyleSystem

export const createHash = password => hashSync(password, genSaltSync(10))

export const isValidPassword = (password, passwordUser) => {
    return compareSync(password, passwordUser)
}

export default __dirname
