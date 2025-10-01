CREATE OR REPLACE FUNCTION public.add_to_cart(p_user_id integer, p_variant_id integer, p_quantity integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_cart_id INTEGER;
    existing_item_id INTEGER;
    new_item_id INTEGER;
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
        RETURN existing_item_id;
    ELSE
        -- If it doesn't exist, insert a new item
        INSERT INTO cart_items (cart_id, variant_id, quantity)
        VALUES (user_cart_id, p_variant_id, p_quantity)
        RETURNING cart_item_id INTO new_item_id;
        RETURN new_item_id;
    END IF;
    RETURN user_cart_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.create_address(p_user_id integer, p_address_line_1 character varying, p_address_line_2 character varying, p_city character varying, p_state character varying, p_postal_code character varying, p_country character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_address_id INTEGER;
BEGIN
    INSERT INTO addresses (user_id, address_line_1, address_line_2, city, state, postal_code, country)
    VALUES (p_user_id, p_address_line_1, p_address_line_2, p_city, p_state, p_postal_code, p_country)
    RETURNING address_id INTO new_address_id;
    RETURN new_address_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_category(p_name character varying, p_parent_category_id integer DEFAULT NULL::integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_category_id INTEGER;
BEGIN
    INSERT INTO categories (name, parent_category_id)
    VALUES (p_name, p_parent_category_id)
    RETURNING category_id INTO new_category_id;
    RETURN new_category_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.create_order(p_user_id integer, p_shipping_address_id integer, p_total_amount numeric)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_order_id INTEGER;
BEGIN
    INSERT INTO orders (user_id, total_amount, shipping_address_id)
    VALUES (p_user_id, p_total_amount, p_shipping_address_id)
    RETURNING order_id INTO new_order_id;
    RETURN new_order_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_order_item(p_order_id integer, p_variant_id integer, p_quantity integer, p_price numeric)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_order_item_id INTEGER;
BEGIN
    INSERT INTO order_items (order_id, variant_id, quantity, price)
    VALUES (p_order_id, p_variant_id, p_quantity, p_price)
    RETURNING order_item_id INTO new_order_item_id;
    RETURN new_order_item_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_payment(p_order_id integer, p_amount numeric, p_payment_method character varying, p_transaction_id character varying, p_status character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_payment_id INTEGER;
BEGIN
    INSERT INTO payments (order_id, amount, payment_method, transaction_id, status)
    VALUES (p_order_id, p_amount, p_payment_method, p_transaction_id, p_status)
    RETURNING payment_id INTO new_payment_id;
    RETURN new_payment_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_product(p_name character varying, p_description text, p_price numeric, p_category_id integer, base_image_url character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_product_id INTEGER;
BEGIN
    INSERT INTO products (name, description, price, category_id, base_image_url)
    VALUES (p_name, p_description, p_price, p_category_id, base_image_url)
    RETURNING product_id INTO new_product_id;
    RETURN new_product_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_product_variant(p_product_id integer, p_color character varying, p_size character varying, p_stock_quantity integer, p_image_url character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_variant_id INTEGER;
BEGIN
    INSERT INTO product_variants (product_id, color, size, stock_quantity, image_url)
    VALUES (p_product_id, p_color, p_size, p_stock_quantity, p_image_url)
    RETURNING variant_id INTO new_variant_id;
    RETURN new_variant_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_product_variant(p_product_id integer, p_color character varying, p_size character varying, p_stock_quantity integer, p_price numeric, p_image_url character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_variant_id INTEGER;
BEGIN
    INSERT INTO product_variants (product_id, color, size, stock_quantity, price, image_url)
    VALUES (p_product_id, p_color, p_size, p_stock_quantity, p_price, p_image_url)
    RETURNING variant_id INTO new_variant_id;
    RETURN new_variant_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_review(p_product_id integer, p_user_id integer, p_rating integer, p_comment text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_review_id INTEGER;
BEGIN
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES (p_product_id, p_user_id, p_rating, p_comment)
    RETURNING review_id INTO new_review_id;
    RETURN new_review_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.create_user(p_first_name character varying, p_last_name character varying, p_email character varying, p_password_hash character varying, p_phone_number character varying DEFAULT NULL::character varying, p_is_admin boolean DEFAULT false)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_user_id INTEGER;
BEGIN
    INSERT INTO users (first_name, last_name, email, password_hash, phone_number, is_admin)
    VALUES (p_first_name, p_last_name, p_email, p_password_hash, p_phone_number, p_is_admin)
    RETURNING user_id INTO new_user_id;
    RETURN new_user_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.delete_user(p_user_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM users WHERE user_id = p_user_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.get_address_by_id(p_address_id integer)
 RETURNS TABLE(address_id integer, user_id integer, address_line_1 character varying, address_line_2 character varying, city character varying, state character varying, postal_code character varying, country character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT a.address_id, a.user_id, a.address_line_1, a.address_line_2, a.city, a.state, a.postal_code, a.country FROM addresses a WHERE a.address_id = p_address_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_addresses_by_user_id(p_user_id integer)
 RETURNS TABLE(address_id integer, user_id integer, address_line_1 character varying, address_line_2 character varying, city character varying, state character varying, postal_code character varying, country character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT a.address_id, a.user_id, a.address_line_1, a.address_line_2, a.city, a.state, a.postal_code, a.country FROM addresses a WHERE a.user_id = p_user_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.get_all_categories()
 RETURNS TABLE(category_id integer, name character varying, parent_category_id integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT c.category_id, c.name, c.parent_category_id FROM categories c;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_all_products()
 RETURNS TABLE(product_id integer, name character varying, description text, price numeric, category_id integer, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT p.product_id, p.name, p.description, p.price, p.category_id, p.created_at FROM products p;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_cart_items(p_user_id integer)
 RETURNS TABLE(cart_item_id integer, cart_id integer, variant_id integer, quantity integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_cart_id INTEGER;
BEGIN
    SELECT cart_id INTO user_cart_id FROM carts WHERE user_id = p_user_id;

    --  no cart , return an empty set.
    IF user_cart_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY SELECT ci.cart_item_id, ci.cart_id, ci.variant_id, ci.quantity FROM cart_items ci WHERE ci.cart_id = user_cart_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_category_by_id(p_category_id integer)
 RETURNS TABLE(category_id integer, name character varying, parent_category_id integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT c.category_id, c.name, c.parent_category_id FROM categories c WHERE c.category_id = p_category_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_or_create_cart(p_user_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.get_order_by_id(p_order_id integer)
 RETURNS TABLE(order_id integer, user_id integer, order_date timestamp with time zone, total_amount numeric, status character varying, shipping_address_id integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status, o.shipping_address_id FROM orders o WHERE o.order_id = p_order_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_order_items_by_order_id(p_order_id integer)
 RETURNS TABLE(order_item_id integer, order_id integer, variant_id integer, quantity integer, price numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT oi.order_item_id, oi.order_id, oi.variant_id, oi.quantity, oi.price FROM order_items oi WHERE oi.order_id = p_order_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.get_orders_by_user_id(p_user_id integer)
 RETURNS TABLE(order_id integer, user_id integer, order_date timestamp with time zone, total_amount numeric, status character varying, shipping_address_id integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT o.order_id, o.user_id, o.order_date, o.total_amount, o.status, o.shipping_address_id FROM orders o WHERE o.user_id = p_user_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_payment_by_order_id(p_order_id integer)
 RETURNS TABLE(payment_id integer, order_id integer, amount numeric, payment_method character varying, transaction_id character varying, status character varying, payment_date timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT p.payment_id, p.order_id, p.amount, p.payment_method, p.transaction_id, p.status, p.payment_date FROM payments p WHERE p.order_id = p_order_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_product_by_id(p_product_id integer)
 RETURNS TABLE(product_id integer, name character varying, description text, price numeric, category_id integer, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT p.product_id, p.name, p.description, p.price, p.category_id, p.created_at FROM products p WHERE p.product_id = p_product_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_product_variant_by_id(p_variant_id integer)
 RETURNS TABLE(variant_id integer, product_id integer, color character varying, size character varying, stock_quantity integer, image_url character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT pv.variant_id, pv.product_id, pv.color, pv.size, pv.stock_quantity, pv.image_url FROM product_variants pv WHERE pv.variant_id = p_variant_id;
END;
$function$



CREATE OR REPLACE FUNCTION public.get_reviews_by_product_id(p_product_id integer)
 RETURNS TABLE(review_id integer, product_id integer, user_id integer, rating integer, comment text, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT r.review_id, r.product_id, r.user_id, r.rating, r.comment, r.created_at FROM reviews r WHERE r.product_id = p_product_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_user_by_email(p_email text)
 RETURNS SETOF users
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        user_id,
        first_name,
        last_name,
        email,
        password_hash, 
        phone_number,
        is_admin,
        created_at
    FROM 
        users
    WHERE 
        email = p_email;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_user_by_id(p_user_id integer)
 RETURNS TABLE(user_id integer, first_name character varying, last_name character varying, email character varying, phone_number character varying, is_admin boolean, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone_number, u.is_admin, u.created_at
    FROM users u
    WHERE u.user_id = p_user_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.get_variants_by_product_id(p_product_id integer)
 RETURNS TABLE(variant_id integer, product_id integer, color character varying, size character varying, stock_quantity integer, image_url character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT pv.variant_id, pv.product_id, pv.color, pv.size, pv.stock_quantity, pv.image_url FROM product_variants pv WHERE pv.product_id = p_product_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.remove_from_cart(p_cart_item_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM cart_items WHERE cart_item_id = p_cart_item_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_order_status(p_order_id integer, p_new_status character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE orders
    SET status = p_new_status
    WHERE order_id = p_order_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_order_total_amount()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$


CREATE OR REPLACE FUNCTION public.update_payment_status(p_payment_id integer, p_new_status character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE payments
    SET status = p_new_status
    WHERE payment_id = p_payment_id;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_product_stock_on_order()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE variant_id = NEW.variant_id;
    RETURN NEW;
END;
$function$


CREATE OR REPLACE FUNCTION public.update_user(p_user_id integer, p_first_name character varying DEFAULT NULL::character varying, p_last_name character varying DEFAULT NULL::character varying, p_email character varying DEFAULT NULL::character varying, p_password_hash character varying DEFAULT NULL::character varying, p_phone_number character varying DEFAULT NULL::character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
