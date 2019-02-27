import httpAuth from "http-auth";
import config from "../../config";

export default httpAuth.basic({},(username, password, callback) => {
    callback(username === config.baseAuthUser && password === config.baseAuthPass)
});
