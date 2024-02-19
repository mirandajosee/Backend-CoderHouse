export function auth(req, res, next) {
    if (req.body.email == 'adminCoder@coder.com' &  req.body.password=="adminCod3r123") {
        req.session.user={
        name:"Admin",
        email: 'adminCoder@coder.com',
        role:"admin"}
        return res.status(200).redirect("/products")
    }
    if (req.session?.email == 'adminCoder@coder.com' ||  !req.session?.role=="admin") {
        return res.status(401).send('error de autorización')
    }
    return next()
}
