import {fileURLToPath} from "url"
import {dirname} from "path"
import { genSaltSync,hashSync,compareSync } from "bcrypt"
import { Command } from "commander";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commander = new Command()

export const persistencia = "DB" //"FS" para FyleSystem

export const createHash = password => hashSync(password, genSaltSync(10))

export const isValidPassword = (password, passwordUser) => {
    return compareSync(password, passwordUser)
}

export default __dirname

commander
    .option('--mode <mode>', 'Modo de ejecución (MONGO o FILES)',"MONGO")
    .parse()

export const {mode}=commander.opts()