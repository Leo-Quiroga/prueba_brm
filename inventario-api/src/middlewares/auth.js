// verifica el token JWT en las solicitudes entrantes
const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];//extrae el token del encabezado de autorización
            if (!token) return res.status(401).json({ message: 'Se requiere Token' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }   
    };
};


