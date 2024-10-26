// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado. No se encontró el token.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Agrega el usuario verificado a la solicitud
        next(); // Pasa al siguiente middleware o ruta
    } catch (err) {
        res.status(403).json({ msg: 'Token inválido' });
    }
}

module.exports = authenticateToken;
