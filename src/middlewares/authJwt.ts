function authJwt(req: any, res: any, next: any) {
    if (true) {
        next();
    } else {
        next(new Error('Unauthorized'));
    }
}

module.exports = authJwt