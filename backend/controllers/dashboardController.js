import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const adminName = req.user.name;

    // Isolate by admin
    const totalProducts = await Product.countDocuments({ createdBy: adminName });
    const lowStockProducts = await Product.find({ 
      createdBy: adminName,
      quantity: { $lt: 10 } 
    }).limit(5);

    const orders = await Order.find({ 
      assignedTo: adminName,
      status: 'Accepted' 
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = await Order.countDocuments({ assignedTo: adminName });

    res.json({
      success: true,
      message: 'Dashboard data retrieved',
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        lowStockProducts
      }
    });
  } catch (error) {
    next(error);
  }
};
