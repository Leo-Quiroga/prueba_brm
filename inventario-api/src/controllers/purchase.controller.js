
// Controlador para manejar compras en el sistema de inventario
const {Purchase, PurchaseItem, Product, User} = require('../models');

exports.buy = async (req, res) => {
    try {
        const { items } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Se requieren items de compra" });
        }
        
        const transaction = await Purchase.sequelize.transaction();
        try {
            let total = 0;

            // Validar stock y calcular total
            for (const item of items) {
                if (!item || typeof item.productId === 'undefined' || typeof item.quantity === 'undefined') {
                    await transaction.rollback();
                    return res.status(400).json({ message: 'Cada item debe contener productId y quantity' });
                }

                const quantity = Number(item.quantity);
                if (!Number.isInteger(quantity) || quantity <= 0) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Cantidad inválida para el producto ${item.productId}` });
                }

                const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
                if (!product) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Producto con ID ${item.productId} no encontrado` });
                }

                if (product.stock < quantity) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Stock insuficiente para el producto ${product.name}` });
                }

                total += product.price * quantity;
                await product.update({ stock: product.stock - quantity }, { transaction });
            }
            // Crear la compra y los items asociados
            const purchase = await Purchase.create({
                userId: req.user.id,
                total
            }, { transaction });
            
            for (const item of items) {
                const product = await Product.findByPk(item.productId, { transaction });
                await PurchaseItem.create({
                    purchaseId: purchase.id,
                    productId: product.id,
                    quantity: Number(item.quantity),
                    price: product.price
                }, { transaction });
            }

            await transaction.commit();
            res.status(201).json({ message: 'Compra realizada exitosamente', purchaseId: purchase.id });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todas las compras con detalles de usuario y items
exports.getAll = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                { model: User },
                {
                    model: PurchaseItem,
                    include: [ Product ]
                }
            ]
        });
        res.json(purchases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo compras' });
    }
}

exports.getById = async (req, res) => {
    try {
        const purchase = await Purchase.findByPk(req.params.id, {
            include: [
                { model: User },
                {
                    model: PurchaseItem,
                    include: [ Product ]
                }
            ]
        });

        if (!purchase) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        res.json(purchase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo la compra' });
    }
};
