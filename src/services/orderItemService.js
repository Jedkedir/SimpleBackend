
const db = require("../db/pool");

async function createOrderItems( orderId, variantId,quantity,price ) {
  const sql = `SELECT create_order_item($1, $2, $3,$4) AS orderItem_id`;
  const params = [orderId, variantId, quantity, price];
  const result = await db.query(sql, params);
  return result.rows[0].orderItem_id;
}

async function getOrderItems(orderId) {
  const sql = `SELECT * FROM get_order_items_by_order_id($1);`;
  const result = await db.query(sql, [orderId]);
  return result.rows;
}

async function createOrderItems(orderId, variantId, quantity, price) {
  try {
    console.log("🔧 Creating order item with params:", {
      orderId,
      variantId,
      quantity,
      price,
      types: {
        orderId: typeof orderId,
        variantId: typeof variantId,
        quantity: typeof quantity,
        price: typeof price,
      },
    });

    const sql = `SELECT create_order_item($1, $2, $3, $4) AS order_item_id;`;
    const params = [orderId, variantId, quantity, price];

    console.log("📝 Executing SQL:", sql, "with params:", params);

    const result = await db.query(sql, params);

    const orderItemId = result.rows[0].order_item_id;
    console.log("✅ Successfully created order item with ID:", orderItemId);

    return orderItemId;
  } catch (error) {
    console.error("❌ Database error in createOrderItems:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
    });
    throw error;
  }
}

async function createOrderItemFromArray(orderItems) {
  try {
        let orderItemIds = [];
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
     
      const { orderId, variantId, quantity, price } = item;

      // Parse values to ensure correct types
      const parsedOrderId = parseInt(orderId);
      const parsedVariantId = parseInt(variantId);
      const parsedQuantity = parseInt(quantity);
      const parsedPrice = parseFloat(price);

      console.log(`🔢 Parsed values:`, {
        orderId: parsedOrderId,
        variantId: parsedVariantId,
        quantity: parsedQuantity,
        price: parsedPrice,
      });

      console.log(`📝 Calling createOrderItems function...`);
      const orderItemId = await createOrderItems(
        parsedOrderId,
        parsedVariantId,
        parsedQuantity,
        parsedPrice
      );

      orderItemIds.push(orderItemId);
    }

    return orderItemIds;
  } catch (error) {
    console.error("💥 Error in createOrderItemFromArray service:", error);
    throw error;
  }
}
async function verifyOrderAndVariantsExist(orderId, variantIds) {
  try {
    console.log("🔍 Verifying order and variants exist...");
    
    // Check if order exists
    const orderCheck = await db.query('SELECT order_id FROM orders WHERE order_id = $1', [orderId]);
    if (orderCheck.rows.length === 0) {
      throw new Error(`Order with ID ${orderId} does not exist`);
    }
    console.log("✅ Order exists:", orderId);
    
    // Check if variants exist
    const variantCheck = await db.query(
      'SELECT variant_id FROM product_variants WHERE variant_id = ANY($1)',
      [variantIds]
    );
    
    const foundVariantIds = variantCheck.rows.map(row => row.variant_id);
    const missingVariants = variantIds.filter(id => !foundVariantIds.includes(id));
    
    if (missingVariants.length > 0) {
      throw new Error(`Variants not found: ${missingVariants.join(', ')}`);
    }
    
    console.log("✅ All variants exist:", variantIds);
    return true;
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    throw error;
  }
}
module.exports = {
  getOrderItems,
  createOrderItems,
  createOrderItemFromArray,
  verifyOrderAndVariantsExist, 
};

