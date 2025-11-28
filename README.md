# API Inventario

# Requisitos Previos

Asegúrese de tener instalado en su sistema:
* **Node.js** (versión recomendada: 18 o superior)
* **MySQL** (motor de base de datos)

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias (Incluye Sequelize):**
    ```bash
    npm install
    ```
    *Este comando instala automáticamente todas las librerías necesarias, incluyendo Express, Sequelize y todas las demás dependencias listadas en package.json.*
3. Configurar archivo `.env` (ver ejemplo abajo).
4. Ejecutar `npm start` (o `node index.js`).
5. El servidor se ejecutará en: `http://localhost:3000`

*Nota: Asegúrese de crear la base de datos `inventario` en su motor SQL antes de arrancar.*

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

# Roles y Autorización

El sistema utiliza dos roles: **Administrador** y **Cliente**. Todas las rutas de CRUD de productos y las consultas de compras requieren autenticación con un Token JWT.

### Endpoints Clave

| Funcionalidad      | Método               | Ruta                                  | Roles Permitidos  |
| :---               | :---                 | :---                                  | :---              |
| **Registro**       | `POST`               | `/api/auth/register`                  | Público           |
| **Login**          | `POST`               | `/api/auth/login`                     | Público           |
| **CRUD Productos** | `POST/GET/PUT/DELETE`| `/api/products`                       | Administrador     |
| **Comprar**        | `POST`               | `/api/purchases`                      | Admin / Cliente   |
| **Ver Historial**  | `GET`                | `/api/purchases/historial/mis-compras`| **Solo Cliente**  |
| **Reporte General**| `GET`                | `/api/purchases`                      | **Solo Admin**    |
| **Ver Factura**    | `GET`                | `/api/purchases/factura/:id`          | Admin / Cliente (propio) |