--
-- Procedures and Triggers
-- This file contains all functions, stored procedures, and triggers for business logic.
--

-- Clean up any existing functions and triggers to avoid conflicts.
DROP TRIGGER IF EXISTS update_order_total_trigger ON order_items;
DROP TRIGGER IF EXISTS decrease_stock_trigger ON order_items;

DROP FUNCTION IF EXISTS update_order_total_amount() CASCADE;
DROP FUNCTION IF EXISTS update_product_stock_on_order() CASCADE;
DROP FUNCTION IF EXISTS create_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS get_user_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_user(INTEGER, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS delete_user(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_category(VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_all_categories() CASCADE;
DROP FUNCTION IF EXISTS get_category_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_product(VARCHAR, TEXT, NUMERIC, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_all_products() CASCADE;
DROP FUNCTION IF EXISTS get_product_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_product_variant(INTEGER, VARCHAR, VARCHAR, INTEGER, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_product_variant_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_variants_by_product_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_address(INTEGER, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_addresses_by_user_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_address_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_order(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_order_by_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_orders_by_user_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_order_status(INTEGER, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS create_order_item(INTEGER, INTEGER, INTEGER, NUMERIC) CASCADE;
DROP FUNCTION IF EXISTS get_order_items_by_order_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_or_create_cart(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS add_to_cart(INTEGER, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS remove_from_cart(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_cart_items(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_review(INTEGER, INTEGER, INTEGER, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_reviews_by_product_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_payment(INTEGER, NUMERIC, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_payment_by_order_id(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_payment_status(INTEGER, VARCHAR) CASCADE;

--
-- Triggers and their functions
--

-- Function to update the total amount of an order whenever its items change.
CREATE OR REPLACE FUNCTION update_order_total_amount()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_items
        WHERE order_id = NEW.order_id OR order_id = OLD.order_id
    )
    WHERE order_id = NEW.order_id OR order_id = OLD.order_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically call the function after an order item is inserted, updated, or deleted.
CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total_amount();

-- Function to decrease the stock quantity of a product variant after an order item is created.
CREATE OR REPLACE FUNCTION update_product_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE variant_id = NEW.variant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically call the function when an order item is created.
CREATE TRIGGER decrease_stock_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock_on_order();

--
-- CRUD Procedures for the 'users' table
--

-- Function to create a new user.
CREATE OR REPLACE FUNCTION create_user(
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR,
    p_phone_number VARCHAR DEFAULT NULL,
    p_is_admin BOOLEAN DEFAULT FALSE
) RETURNS INTEGER AS $$
DECLARE
    new_user_id INTEGER;
BEGIN
    INSERT INTO users (first_name, last_name, email, password_hash, phone_number, is_admin)
    VALUES (p_first_name, p_last_name, p_email, p_password_hash, p_phone_number, p_is_admin)
    RETURNING user_id INTO new_user_id;
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to retrieve a user by their user ID.
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id INTEGER)
RETURNS TABLE (
    user_id INTEGER,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    is_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone_number, u.is_admin, u.created_at
    FROM users u
    WHERE u.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update an existing user's information.
CREATE OR REPLACE FUNCTION update_user(
    p_user_id INTEGER,
    p_first_name VARCHAR DEFAULT NULL,
    p_last_name VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_password_hash VARCHAR DEFAULT NULL,
    p_phone_number VARCHAR DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        email = COALESCE(p_email, email),
        password_hash = COALESCE(p_password_hash, password_hash),
        phone_number = COALESCE(p_phone_number, phone_number)
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to delete a user.
CREATE OR REPLACE FUNCTION delete_user(p_user_id INTEGER) RETURNS VOID AS $$
BEGIN
    DELETE FROM users WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'categories' table
--

-- Function to create a new category.
CREATE OR REPLACE FUNCTION create_category(
    p_name VARCHAR,
    p_parent_category_id INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    new_category_id INTEGER;
BEGIN
    INSERT INTO categories (name, parent_category_id)
    VALUES (p_name, p_parent_category_id)
    RETURNING category_id INTO new_category_id;
    RETURN new_category_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all categories.
CREATE OR REPLACE FUNCTION get_all_categories()
RETURNS TABLE (
    category_id INTEGER,
    name VARCHAR,
    parent_category_id INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT c.category_id, c.name, c.parent_category_id FROM categories c;
END;
$$ LANGUAGE plpgsql;

-- Function to get a category by ID.
CREATE OR REPLACE FUNCTION get_category_by_id(p_category_id INTEGER)
RETURNS TABLE (
    category_id INTEGER,
    name VARCHAR,
    parent_category_id INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT c.category_id, c.name, c.parent_category_id FROM categories c WHERE c.category_id = p_category_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'products' table
--

-- Function to create a new product.
CREATE OR REPLACE FUNCTION create_product(
    p_name VARCHAR,
    p_description TEXT,
    p_price NUMERIC,
    p_category_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    new_product_id INTEGER;
BEGIN
    INSERT INTO products (name, description, price, category_id)
    VALUES (p_name, p_description, p_price, p_category_id)
    RETURNING product_id INTO new_product_id;
    RETURN new_product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all products.
CREATE OR REPLACE FUNCTION get_all_products()
RETURNS TABLE (
    product_id INTEGER,
    name VARCHAR,
    description TEXT,
    price NUMERIC,
    category_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT p.product_id, p.name, p.description, p.price, p.category_id, p.created_at FROM products p;
END;
$$ LANGUAGE plpgsql;

-- Function to get a product by its ID.
CREATE OR REPLACE FUNCTION get_product_by_id(p_product_id INTEGER)
RETURNS TABLE (
    product_id INTEGER,
    name VARCHAR,
    description TEXT,
    price NUMERIC,
    category_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT p.product_id, p.name, p.description, p.price, p.category_id, p.created_at FROM products p WHERE p.product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'product_variants' table
--

-- Function to create a new product variant.
CREATE OR REPLACE FUNCTION create_product_variant(
    p_product_id INTEGER,
    p_color VARCHAR,
    p_size VARCHAR,
    p_stock_quantity INTEGER,
    p_image_url VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    new_variant_id INTEGER;
BEGIN
    INSERT INTO product_variants (product_id, color, size, stock_quantity, image_url)
    VALUES (p_product_id, p_color, p_size, p_stock_quantity, p_image_url)
    RETURNING variant_id INTO new_variant_id;
    RETURN new_variant_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a product variant by its ID.
CREATE OR REPLACE FUNCTION get_product_variant_by_id(p_variant_id INTEGER)
RETURNS TABLE (
    variant_id INTEGER,
    product_id INTEGER,
    color VARCHAR,
    size VARCHAR,
    stock_quantity INTEGER,
    image_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT pv.variant_id, pv.product_id, pv.color, pv.size, pv.stock_quantity, pv.image_url FROM product_variants pv WHERE pv.variant_id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all variants for a given product.
CREATE OR REPLACE FUNCTION get_variants_by_product_id(p_product_id INTEGER)
RETURNS TABLE (
    variant_id INTEGER,
    product_id INTEGER,
    color VARCHAR,
    size VARCHAR,
    stock_quantity INTEGER,
    image_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT pv.variant_id, pv.product_id, pv.color, pv.size, pv.stock_quantity, pv.image_url FROM product_variants pv WHERE pv.product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'addresses' table
--

-- Function to create a new address.
CREATE OR REPLACE FUNCTION create_address(
    p_user_id INTEGER,
    p_address_line_1 VARCHAR,
    p_address_line_2 VARCHAR,
    p_city VARCHAR,
    p_state VARCHAR,
    p_postal_code VARCHAR,
    p_country VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    new_address_id INTEGER;
BEGIN
    INSERT INTO addresses (user_id, address_line_1, address_line_2, city, state, postal_code, country)
    VALUES (p_user_id, p_address_line_1, p_address_line_2, p_city, p_state, p_postal_code, p_country)
    RETURNING address_id INTO new_address_id;
    RETURN new_address_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a user's addresses.
CREATE OR REPLACE FUNCTION get_addresses_by_user_id(p_user_id INTEGER)
RETURNS TABLE (
    address_id INTEGER,
    user_id INTEGER,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    city VARCHAR,
    state VARCHAR,
    postal_code VARCHAR,
    country VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT a.address_id, a.user_id, a.address_line_1, a.address_line_2, a.city, a.state, a.postal_code, a.country FROM addresses a WHERE a.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a single address by its ID.
CREATE OR REPLACE FUNCTION get_address_by_id(p_address_id INTEGER)
RETURNS TABLE (
    address_id INTEGER,
    user_id INTEGER,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    city VARCHAR,
    state VARCHAR,
    postal_code VARCHAR,
    country VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT a.address_id, a.user_id, a.address_line_1, a.address_line_2, a.city, a.state, a.postal_code, a.country FROM addresses a WHERE a.address_id = p_address_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'orders' table
--

-- Function to create a new order.
CREATE OR REPLACE FUNCTION create_order(
    p_user_id INTEGER,
    p_shipping_address_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    new_order_id INTEGER;
BEGIN
    INSERT INTO orders (user_id, shipping_address_id)
    VALUES (p_user_id, p_shipping_address_id)
    RETURNING order_id INTO new_order_id;
    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get an order by its ID.
CREATE OR REPLACE FUNCTION get_order_by_id(p_order_id INTEGER)
RETURNS TABLE (
    order_id INTEGER,
    user_id INTEGER,
    order_date TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC,
    status VARCHAR,
    shipping_address_id INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status, o.shipping_address_id FROM orders o WHERE o.order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all orders for a user.
CREATE OR REPLACE FUNCTION get_orders_by_user_id(p_user_id INTEGER)
RETURNS TABLE (
    order_id INTEGER,
    user_id INTEGER,
    order_date TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC,
    status VARCHAR,
    shipping_address_id INTEGER
) AS $$
BEGIN
    RETURN QUERY SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status, o.shipping_address_id FROM orders o WHERE o.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update an order's status.
CREATE OR REPLACE FUNCTION update_order_status(
    p_order_id INTEGER,
    p_new_status VARCHAR
) RETURNS VOID AS $$
BEGIN
    UPDATE orders
    SET status = p_new_status
    WHERE order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'order_items' table
--

-- Function to create a new order item.
CREATE OR REPLACE FUNCTION create_order_item(
    p_order_id INTEGER,
    p_variant_id INTEGER,
    p_quantity INTEGER,
    p_price NUMERIC
) RETURNS INTEGER AS $$
DECLARE
    new_order_item_id INTEGER;
BEGIN
    INSERT INTO order_items (order_id, variant_id, quantity, price)
    VALUES (p_order_id, p_variant_id, p_quantity, p_price)
    RETURNING order_item_id INTO new_order_item_id;
    RETURN new_order_item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all items for a given order.
CREATE OR REPLACE FUNCTION get_order_items_by_order_id(p_order_id INTEGER)
RETURNS TABLE (
    order_item_id INTEGER,
    order_id INTEGER,
    variant_id INTEGER,
    quantity INTEGER,
    price NUMERIC
) AS $$
BEGIN
    RETURN QUERY SELECT oi.order_item_id, oi.order_id, oi.variant_id, oi.quantity, oi.price FROM order_items oi WHERE oi.order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'carts' and 'cart_items' tables
--

-- Function to get or create a user's cart.
CREATE OR REPLACE FUNCTION get_or_create_cart(p_user_id INTEGER) RETURNS INTEGER AS $$
DECLARE
    user_cart_id INTEGER;
BEGIN
    -- Try to get the existing cart
    SELECT cart_id INTO user_cart_id FROM carts WHERE user_id = p_user_id;

    -- If no cart exists, create a new one
    IF user_cart_id IS NULL THEN
        INSERT INTO carts (user_id)
        VALUES (p_user_id)
        RETURNING cart_id INTO user_cart_id;
    END IF;

    RETURN user_cart_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add or update an item in the cart.
CREATE OR REPLACE FUNCTION add_to_cart(
    p_user_id INTEGER,
    p_variant_id INTEGER,
    p_quantity INTEGER
) RETURNS VOID AS $$
DECLARE
    user_cart_id INTEGER;
    existing_item_id INTEGER;
BEGIN
    -- Get or create the user's cart
    user_cart_id := get_or_create_cart(p_user_id);

    -- Check if the item already exists in the cart
    SELECT cart_item_id INTO existing_item_id
    FROM cart_items
    WHERE cart_id = user_cart_id AND variant_id = p_variant_id;

    IF existing_item_id IS NOT NULL THEN
        -- If it exists, update the quantity
        UPDATE cart_items
        SET quantity = quantity + p_quantity
        WHERE cart_item_id = existing_item_id;
    ELSE
        -- If it doesn't exist, insert a new item
        INSERT INTO cart_items (cart_id, variant_id, quantity)
        VALUES (user_cart_id, p_variant_id, p_quantity);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to remove an item from the cart.
CREATE OR REPLACE FUNCTION remove_from_cart(p_cart_item_id INTEGER) RETURNS VOID AS $$
BEGIN
    DELETE FROM cart_items WHERE cart_item_id = p_cart_item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all items in a cart.
CREATE OR REPLACE FUNCTION get_cart_items(p_user_id INTEGER)
RETURNS TABLE (
    cart_item_id INTEGER,
    cart_id INTEGER,
    variant_id INTEGER,
    quantity INTEGER
) AS $$
DECLARE
    user_cart_id INTEGER;
BEGIN
    SELECT cart_id INTO user_cart_id FROM carts WHERE user_id = p_user_id;

    -- If no cart exists, return an empty set.
    IF user_cart_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY SELECT ci.cart_item_id, ci.cart_id, ci.variant_id, ci.quantity FROM cart_items ci WHERE ci.cart_id = user_cart_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'reviews' table
--

-- Function to create a new review.
CREATE OR REPLACE FUNCTION create_review(
    p_product_id INTEGER,
    p_user_id INTEGER,
    p_rating INTEGER,
    p_comment TEXT
) RETURNS INTEGER AS $$
DECLARE
    new_review_id INTEGER;
BEGIN
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES (p_product_id, p_user_id, p_rating, p_comment)
    RETURNING review_id INTO new_review_id;
    RETURN new_review_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all reviews for a product.
CREATE OR REPLACE FUNCTION get_reviews_by_product_id(p_product_id INTEGER)
RETURNS TABLE (
    review_id INTEGER,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT r.review_id, r.product_id, r.user_id, r.rating, r.comment, r.created_at FROM reviews r WHERE r.product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

--
-- CRUD Procedures for the 'payments' table
--

-- Function to create a new payment record.
CREATE OR REPLACE FUNCTION create_payment(
    p_order_id INTEGER,
    p_amount NUMERIC,
    p_payment_method VARCHAR,
    p_transaction_id VARCHAR,
    p_status VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    new_payment_id INTEGER;
BEGIN
    INSERT INTO payments (order_id, amount, payment_method, transaction_id, status)
    VALUES (p_order_id, p_amount, p_payment_method, p_transaction_id, p_status)
    RETURNING payment_id INTO new_payment_id;
    RETURN new_payment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a payment record by its order ID.
CREATE OR REPLACE FUNCTION get_payment_by_order_id(p_order_id INTEGER)
RETURNS TABLE (
    payment_id INTEGER,
    order_id INTEGER,
    amount NUMERIC,
    payment_method VARCHAR,
    transaction_id VARCHAR,
    status VARCHAR,
    payment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY SELECT p.payment_id, p.order_id, p.amount, p.payment_method, p.transaction_id, p.status, p.payment_date FROM payments p WHERE p.order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update a payment's status.
CREATE OR REPLACE FUNCTION update_payment_status(
    p_payment_id INTEGER,
    p_new_status VARCHAR
) RETURNS VOID AS $$
BEGIN
    UPDATE payments
    SET status = p_new_status
    WHERE payment_id = p_payment_id;
END;
$$ LANGUAGE plpgsql;
