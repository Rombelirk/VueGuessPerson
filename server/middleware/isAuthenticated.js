const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.login) {
        return next();
    } else {
        res.send({
            message: "Not authenticated"
        })
    }
}

module.exports = isAuthenticated;