import httpAuth from "http-auth";
import config from "../../config"

var base = httpAuth.basic({},(username, password, callback) => {
    callback(username === config.baseAuthUser && password === config.baseAuthPass)
});

export default base;