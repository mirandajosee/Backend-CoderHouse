import {fileURLToPath} from "url"
import {dirname} from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const persistencia = "DB" //"FS" para FyleSystem

export default __dirname
