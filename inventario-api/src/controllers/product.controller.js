//Controlador para gestionar productos en el inventario

const { Product } = require('../models');

exports.create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Datos de producto inválidos' });
        }
        const prod = await Product.create(req.body);
        res.status(201).json(prod);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

exports.getAll = async (_, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.getById = async (req, res) => {
    try {
        const prod = await Product.findByPk(req.params.id);
        if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(prod);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Datos para actualizar inválidos' });
        }

        // Buscar producto antes de actualizar
        const existingProduct = await Product.findByPk(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Guardamos los valores originales para comparar
        const originalData = existingProduct.toJSON();

        // Ejecutar actualización
        await existingProduct.update(req.body);

        // Obtener nuevo estado del producto
        const updatedProduct = existingProduct.toJSON();

        // Comparar campos actualizados
        const updatedFields = {};
        for (const key in req.body) {
            if (originalData[key] !== updatedProduct[key]) {
                updatedFields[key] = {
                    antes: originalData[key],
                    ahora: updatedProduct[key]
                };
            }
        }

        return res.json({
            message: `Producto con ID ${req.params.id} actualizado correctamente`,
            camposActualizados: req.body,
            productoActualizado: updatedProduct.name
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};



exports.delete = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (deleted === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};

