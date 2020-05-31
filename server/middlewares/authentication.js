const jwt = require('jsonwebtoken');

// ==============================
// Validate Token
// ==============================
let validateToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// ==============================
// Validate Admin Role
// ==============================
let validateAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No tiene permisos para crear o editar'
            }
        });
    }
    next();
};

module.exports = {
    validateToken,
    validateAdminRole
}