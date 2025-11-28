# API Inventario

## Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Configurar archivo `.env` (ver ejemplo abajo).
4. Ejecutar `npm start` (o `node index.js`).

## Variables de Entorno (.env)
DB_NAME=inventario
DB_USER=root
DB_PASS=tu_password
DB_HOST=localhost
JWT_SECRET=tu_secreto_seguro

## Uso
### Autenticación
* POST `/api/auth/register` - Registro (rol: 'Administrador' o 'Cliente')
* POST `/api/auth/login` - Login (retorna JWT)

### Productos (Requiere Token)
* GET `/api/products` - Ver todos (Admin/Cliente)
* POST `/api/products` - Crear (Solo Admin)

### Compras
* POST `/api/purchases` - Comprar { items: [{productId: 1, quantity: 2}] }
* GET `/api/purchases/historial/mis-compras` - Historial del Cliente.
* GET `/api/purchases` - Ver todas las compras (Solo Admin).