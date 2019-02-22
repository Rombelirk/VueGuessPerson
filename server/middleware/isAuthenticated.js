const isAuthenticated = (req, res, next) => {

    if (req.session && req.session.login) {
        return next();
    }

    return res.send({
        message: "Not authenticated"
    });
};

export default isAuthenticated;
