// Controlador para manejar compras en el sistema de inventario

const { Purchase, PurchaseItem, Product, User } = require('../models');

// Crear una compra (Transacción completa para asegurar integridad)
exports.buy = async (req, res) => {
    try {
        const { items } = req.body;
        
        // 1. Validaciones iniciales
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Se requieren items para procesar la compra" });
        }
        
        // Iniciar transacción
        const transaction = await Purchase.sequelize.transaction();
        
        try {
            let total = 0;

            // 2. Validar stock y calcular total (Bloqueo de filas para evitar condiciones de carrera)
            for (const item of items) {
                if (!item.productId || !item.quantity) {
                    throw new Error('Cada item debe tener productId y quantity');
                }

                const quantity = Number(item.quantity);
                if (quantity <= 0) {
                    throw new Error(`Cantidad inválida para el producto ID ${item.productId}`);
                }

                const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE });
                
                if (!product) {
                    throw new Error(`Producto con ID ${item.productId} no encontrado`);
                }

                if (product.stock < quantity) {
                    throw new Error(`Stock insuficiente para el producto: ${product.name}`);
                }

                total += product.price * quantity;
                
                // Actualizar stock
                await product.update({ stock: product.stock - quantity }, { transaction });
            }

            // 3. Crear la compra cabecera
            const purchase = await Purchase.create({
                userId: req.user.id,
                total
            }, { transaction });
            
            // 4. Crear los items de la compra
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
            return res.status(400).json({ message: err.message || 'Error procesando la compra' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener TODAS las compras (Solo Administrador)
// Formatea la respuesta según los requisitos de la prueba
exports.getAll = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                { model: User, as: 'user' },
                {
                    model: PurchaseItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Transforma los datos para cumplir el requisito de visualización:
        // "fecha, cliente, productos comprados, cantidad por producto, precio total"
        const formattedResponse = purchases.map(p => ({
            id: p.id,
            fecha: p.createdAt,
            cliente: p.user ? p.user.name : 'Usuario Eliminado',
            emailCliente: p.user ? p.user.email : 'N/A',
            detallesProductos: p.items.map(item => ({
                nombreProducto: item.product ? item.product.name : 'Producto Eliminado',
                cantidad: item.quantity,
                precioUnitario: item.price,
                subtotal: item.quantity * item.price
            })),
            totalCompra: p.total
        }));

        res.json(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo reporte de compras' });
    }
};

// Obtener una compra por ID (Admin ve cualquiera, Cliente solo las suyas)
exports.getById = async (req, res) => {
    try {
        const purchase = await Purchase.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                {
                    model: PurchaseItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!purchase) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        // Validación de seguridad: Cliente solo accede a sus propios registros
        if (req.user.role === 'Cliente' && purchase.userId !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado para ver esta compra' });
        }

        res.json(purchase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo la compra' });
    }
};

// Generar factura (Admin ve cualquiera, Cliente solo las suyas)
exports.getInvoice = async (req, res) => {
    try {
        const purchase = await Purchase.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                {
                    model: PurchaseItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!purchase) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        if (req.user.role === 'Cliente' && purchase.userId !== req.user.id) {
            return res.status(403).json({ message: 'No tiene permiso para ver esta factura' });
        }

        // Formato de factura amigable
        const factura = {
            factura_id: purchase.id,
            fecha_emision: purchase.createdAt,
            cliente: {
                nombre: purchase.user ? purchase.user.name : 'Desconocido',
                email: purchase.user ? purchase.user.email : 'Desconocido'
            },
            items: purchase.items.map(i => ({
                producto: i.product ? i.product.name : 'Producto no disponible',
                cantidad: i.quantity,
                precio_unitario: i.price,
                total_linea: i.quantity * i.price
            })),
            total_pagar: purchase.total
        };

        res.json(factura);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generando factura" });
    }
};

// Historial personal del cliente
exports.getMyPurchases = async (req, res) => {
    try {
        // Doble verificación de seguridad
        if (req.user.role !== 'Cliente') {
            return res.status(403).json({ message: 'Acceso reservado para clientes' });
        }

        const purchases = await Purchase.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: PurchaseItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(purchases);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo historial de compras" });
    }
};