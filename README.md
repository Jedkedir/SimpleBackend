# Clothing E-commerce Platform (Full Stack) 

This repository contains the full-stack code for a modern, feature-rich clothing e-commerce platform. The application is built with a robust Node.js/Express backend, a PostgreSQL database, and a clean, modular Vanilla JavaScript frontend (following the Service/View pattern).

🚀 **Key Features**
- **Complete Product Management**: Full CRUD operations for Products, Categories, and detailed Product Variants (Size, Color, Stock).
- **User & Authentication**: Secure registration, login, and token-based authentication using JSON Web Tokens (JWT).
- **Shopping Cart**: Persistent shopping cart management using PostgreSQL functions (carts and cart_items tables).
- **Order Workflow**: Creation and management of orders, linked to product variants and user addresses.
- **Image Upload System**: Dedicated Express middleware (multer) for secure and efficient handling of product image uploads.
- **Modular Frontend**: Clean separation of concerns using the Service/View pattern, with a centralized BaseService for all API communication and authentication management.

🛠️ **Architecture Overview**

### Backend (Node.js/Express)
The API is built using Express, following a standard MVC-like structure (Routes, Controllers, Services/Middleware). All data access is handled asynchronously through shared utility modules.

### Database (PostgreSQL)
The application uses PostgreSQL as its primary data store. The database logic is highly centralized:

- **Schema** (`schema_and_indexing.sql`): Defines all tables, foreign keys, and indexes for optimal relational integrity and query speed.
- **Stored Procedures** (`procedures_and_triggers.sql`): Core business logic (like adding to cart, user creation) is implemented directly in PostgreSQL functions using PL/pgSQL for improved performance and transactional reliability.

### Frontend (Modular Vanilla JS)
The client-side code avoids heavy frameworks and uses native Fetch API for networking. It implements a **Service/View** architecture:

- **Service Layer**: (`public/js/services/`) Handles all API calls, data fetching, and transformation. Relies exclusively on `BaseService.js`.
- **View Layer**: (`public/js/views/`) Handles all DOM manipulation, rendering, and event listening. It is purely responsible for the UI.
- **Controller**: (`public/js/app.js`) Acts as the central router, coordinating data flow between the Service and View layers.

⚙️ **Getting Started**
### Prerequisites
You must have the following installed on your local machine:
- Node.js (v18 or higher)
- PostgreSQL (with the `psql` command-line utility)

#### 1. Database Setup
- **Create Database**: 
```sql
CREATE DATABASE clothingDB;
```
- **Load Schema**: 
```bash
psql -d clothingDB -f schema_and_indexing.sql
```
- **Load Procedures**: 
```bash
psql -d clothingDB -f procedures_and_triggers.sql
```

#### 2. Project Setup
- **Install Dependencies**:
```bash
npm install
```
*(Note: This project relies on express and pg for the backend, and multer for file uploads.)*

- **Configure Environment Variables**:  
Create a file named `.env` in the root directory and populate it with your configuration details (see the section below).

- **Start the Server (Development)**:  
The dev script uses `node --watch` for hot reloading and loads the environment file automatically.
```bash
npm run dev
```
The server will start at [http://localhost:8000](http://localhost:8000) (or the port specified in your `.env` file).

🌍 **Environment Variables**
Create a file named `.env` in the root of your project.

| Variable    | Description                        | Example Value |
|-------------|------------------------------------|---------------|
| PORT        | Server listening port              | 8000          |
| DB_HOST     | PostgreSQL host                    | localhost     |
| DB_USER     | PostgreSQL user                    | postgres      |
| DB_NAME     | PostgreSQL database name           | clothingDB    |
| DB_PASSWORD | PostgreSQL password                | 0000          |
| DB_PORT     | PostgreSQL port                    | 5432          |
| JWT_SECRET  | Secret key for signing JWTs        | key           |

🗃️ **Database Details**
The database is highly normalized to handle the complexities of e-commerce data:

| Table            | Purpose                                              | Key Relations |
|------------------|------------------------------------------------------|---------------|
| users            | Stores user credentials and profile data.             | Primary entity. |
| categories       | Organizes products (supports nested categories).      | `parent_category_id` references categories. |
| products         | Core product information.                             | Links to categories. |
| product_variants | Size, color, stock, and image URL for product versions.| Links to products. |
| carts, cart_items| Stores current items in a user's shopping cart.       | Links to users and product_variants. |
| orders, order_items | Completed transactions and the items included.     | Links to users, addresses, and product_variants. |

**Key Stored Procedures**
The `crud_procedures.sql` file contains essential utility functions, including:

- `get_or_create_cart(p_user_id)`: Ensures every user has an active cart.
- `add_to_cart(p_user_id, p_variant_id, p_quantity)`: Handles insertion or updating quantity if the item is already present.
- `get_all_products()`: Retrieves the list of products for the catalog view.
