import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { logActivity } from '../utils/logger.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { products } = req.body; 

    if (!products || products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Map to store orders grouped by admin
    const adminOrders = {};

    for (const item of products) {
      const productDoc = await Product.findById(item.product);
      
      if (!productDoc) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }

      if (productDoc.quantity < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${productDoc.name}. Available: ${productDoc.quantity}`);
      }

      const adminName = productDoc.createdBy; // The admin who listed this

      if (!adminOrders[adminName]) {
        adminOrders[adminName] = {
          products: [],
          totalPrice: 0
        };
      }

      adminOrders[adminName].products.push({
        product: productDoc._id,
        quantity: item.quantity,
        price: productDoc.price,
      });
      adminOrders[adminName].totalPrice += productDoc.price * item.quantity;
    }

    const createdOrders = [];

    // Create separate orders for each admin
    for (const [adminName, orderData] of Object.entries(adminOrders)) {
      const order = await Order.create({
        products: orderData.products,
        totalPrice: orderData.totalPrice,
        createdBy: req.user.name,
        assignedTo: adminName,
      });

      // Deduct stock
      for (const item of orderData.products) {
        const productDoc = await Product.findById(item.product);
        productDoc.quantity -= item.quantity;
        await productDoc.save();
      }

      logActivity(`Created Order ID: ${order._id} for Admin: ${adminName}`, req.user.name);
      createdOrders.push(order);
    }

    res.status(201).json({
      success: true,
      message: 'Order(s) placed successfully',
      data: createdOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Filtered by Isolation)
// @route   GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'Admin') {
      // Admin sees orders assigned to them
      filter.assignedTo = req.user.name;
    } else {
      // Users see orders they created
      filter.createdBy = req.user.name;
    }

    const orders = await Order.find(filter)
      .populate('products.product', 'name category price')
      .sort('-createdAt');

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, deliveryDate, adminMessage } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Verify ownership
    if (order.assignedTo !== req.user.name) {
      res.status(401);
      throw new Error('Not authorized to process this order');
    }

    const oldStatus = order.status;
    order.status = status;
    if (deliveryDate) order.deliveryDate = deliveryDate;
    if (adminMessage) order.adminMessage = adminMessage;

    await order.save();

    // Refund stock if rejected
    if (status === 'Rejected' && oldStatus !== 'Rejected') {
      for (const item of order.products) {
        const productDoc = await Product.findById(item.product);
        if (productDoc) {
          productDoc.quantity += item.quantity;
          await productDoc.save();
        }
      }
    }

    logActivity(`Updated Order status to ${status}`, req.user.name, adminMessage);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
