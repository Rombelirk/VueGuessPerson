const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.login) {
        return next();
    }

    return res.send({
        code: 1,
        message: "Not authenticated",
    });
};

export default isAuthenticated;
