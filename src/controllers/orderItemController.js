
const db = require("../db/pool"); 
const orderItemService = require("../services/orderItemService");

exports.createOrderItemsController = async (req, res) => {
  try {
    const {orderId, variantId,quantity,price} = req.body;
     if (!orderId || !variantId || !quantity || !price) {
       return res.status(400).json({
         error: "Missing required orderItem fields (userId,variantId,quantity,price).",
       });
     }

     const orderItemId = await orderItemService.createOrderItems(orderId, variantId,quantity,price);
     res.status(201).json({
       message: "OrderItem created successfully.",
       orderItemId,
     });
    
  } catch (error) {
    console.error("Error placing order:", error.message);
    res
      .status(500)
      .json({ error: "Failed to place order", detail: error.message });
  }
};
exports.getOrderItemsController = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format." });
    }

    const items = await orderItemService.getOrderItems(orderId);

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching order items:", error.message);
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

exports.createOrderItemsController = async (req, res) => {
  try {    
    const {orderId, variantId, quantity, price} = req.body
    
    if ( !orderId || !variantId || !quantity || !price) {
      return res.status(400).json({ error: "Missing required orderItem fields." });
    }

    const orderItemId = await orderItemService.createOrderItems(orderId, variantId, quantity, price);

    res.status(200).json({
      message: "OrderItem created successfully.",
      orderItemId
    });
  }
  catch(err) {
    console.error("Error adding order items:", err.message);
    res.status(500).json({error: "Failed to add order items"});
  }
}

exports.createOrderItemFromArrayController = async (req, res) => {
  
  try {
    const { orderItems } = req.body;

    
    if (!orderItems) {
      
      return res.status(400).json({ error: "Order items array is required" });
    }

    if (!Array.isArray(orderItems)) {
     
      return res.status(400).json({ error: "Order items must be an array" });
    }

    if (orderItems.length === 0) {
     
      return res
        .status(400)
        .json({ error: "Order items array cannot be empty" });
    }

   

    
    for (const [index, item] of orderItems.entries()) {
    

      if (!item.orderId) {
       
        return res
          .status(400)
          .json({ error: `Missing orderId in item ${index + 1}` });
      }
      if (!item.variantId) {
       
        return res
          .status(400)
          .json({ error: `Missing variantId in item ${index + 1}` });
      }
      if (!item.quantity) {
       
        return res
          .status(400)
          .json({ error: `Missing quantity in item ${index + 1}` });
      }
      if (!item.price) {
 
        return res
          .status(400)
          .json({ error: `Missing price in item ${index + 1}` });
      }

     
    }

   

    
    const orderItemIds = await orderItemService.createOrderItemFromArray(
      orderItems
    );

   

    res.status(200).json({
      message: "Order items created successfully.",
      orderItemIds,
      count: orderItemIds.length,
    });

   
  } catch (err) {
   
    
    if (err.code) {
      console.error("Database error code:", err.code);
    }
    if (err.detail) {
      console.error("Database error detail:", err.detail);
    }

    res.status(500).json({
      error: "Failed to add order items",
      detail: err.message,
      code: err.code,
    });
  }
};

