// verifica el token JWT en las solicitudes entrantes
const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
    return (req, res, next) => {
        try {
            console.log("AUTH HEADER:", req.headers.authorization);  // 👈 IMPORTANTE
            
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Se requiere Token' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }

            next();
        } catch (error) {
            console.error(error); // 👈 imprime la razón real (expirado, corrupto, mal formado, etc)
            return res.status(401).json({ message: 'Token inválido' });
        }   
    };
};
