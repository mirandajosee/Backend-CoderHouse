export function auth(req, res, next) {
    if (req.body.email == 'adminCoder@coder.com' &  req.body.password=="adminCod3r123") {
        req.session.user={
        name:"Admin",
        email: 'adminCoder@coder.com',
        role:"admin",
        cartID:"65ca19112dc0eaafade1935e"}
        return res.status(200).redirect("/products")
    }
    if (req.session?.email == 'adminCoder@coder.com' ||  !req.session?.role=="admin") {
        return res.status(401).send('error de autorización')
    }
    return next()
}

export function allow(req,res,next,allowed){
    if(allowed.includes(req.session.user.role,0))
        {return next()}
    else {
    return res.status(401).send('error de autorización')}
}