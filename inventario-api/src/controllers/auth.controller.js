// Controlador de autenticación (registro e inicio de sesión)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Registro de un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hash, role });

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro' });
    }
};

// Inicio de sesión de un usuario existente
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
};
