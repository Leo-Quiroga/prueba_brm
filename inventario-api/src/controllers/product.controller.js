// //Controlador para gestionar productos en el inventario

const { Product } = require('../models');

exports.create = async (req, res) => {
    try {
        const { productionLot, name, price, stock, entryDate } = req.body;

        // Validaciones (Punto Extra)
        if (!productionLot || !name || !entryDate) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
        if (price < 0) return res.status(400).json({ message: 'El precio no puede ser negativo' });
        if (stock < 0) return res.status(400).json({ message: 'El stock no puede ser negativo' });

        const prod = await Product.create(req.body);
        res.status(201).json(prod);
    } catch (err) {
        console.error(err);
        if(err.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'El número de lote ya existe' });
        }
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

exports.getAll = async (_, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error server' });
    }
};

exports.getById = async (req, res) => {
    try {
        const prod = await Product.findByPk(req.params.id);
        if (!prod) return res.status(404).json({ message: 'No encontrado' });
        res.json(prod);
    } catch (err) {
        res.status(500).json({ message: 'Error server' });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Datos vacíos' });
        }
        
        const existingProduct = await Product.findByPk(req.params.id);
        if (!existingProduct) return res.status(404).json({ message: 'Producto no encontrado' });

        // Validaciones en update también
        if (req.body.stock !== undefined && req.body.stock < 0) return res.status(400).json({ message: 'Stock inválido' });
        if (req.body.price !== undefined && req.body.price < 0) return res.status(400).json({ message: 'Precio inválido' });

        const originalData = existingProduct.toJSON();
        await existingProduct.update(req.body);
        const updatedProduct = existingProduct.toJSON();

        const updatedFields = {};
        for (const key in req.body) {
            if (originalData[key] !== updatedProduct[key]) {
                updatedFields[key] = { antes: originalData[key], ahora: updatedProduct[key] };
            }
        }

        return res.json({
            message: `Producto actualizado`,
            cambios: updatedFields
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

exports.delete = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};