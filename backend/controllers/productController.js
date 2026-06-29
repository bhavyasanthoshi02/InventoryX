import Product from '../models/Product.js';
import { logActivity } from '../utils/logger.js';

// GET PRODUCTS
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Isolation Logic: Admin only sees their own. Users see all.
    if (req.user && req.user.role === 'Admin') {
      query.createdBy = req.user.name;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    let queryBuilder = Product.find(query);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryBuilder = queryBuilder.sort(sortBy);
    } else {
      queryBuilder = queryBuilder.sort('-createdAt');
    }

    const products = await queryBuilder.skip(startIndex).limit(limit);
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


// ADD PRODUCT
export const addProduct = async (req, res, next) => {
  try {
    const { name, category, quantity, price, status } = req.body;

    if (!name || !category || quantity === undefined || price === undefined) {
      res.status(400);
      throw new Error('Please provide all necessary product fields');
    }

    const product = await Product.create({
      name,
      category,
      quantity,
      price,
      status, 
      createdBy: req.user.name, // Use actual admin name
    });

    logActivity(`Added Product: ${product.name}`, req.user.name);

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Verify ownership
    if (product.createdBy !== req.user.name) {
      res.status(401);
      throw new Error('Not authorized to update this product');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (req.body.quantity !== undefined) {
      updatedProduct.quantity = req.body.quantity;
      await updatedProduct.save();
    }

    logActivity(`Updated Product: ${updatedProduct.name}`, req.user.name);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Verify ownership
    if (product.createdBy !== req.user.name) {
      res.status(401);
      throw new Error('Not authorized to delete this product');
    }

    await Product.findByIdAndDelete(req.params.id);

    logActivity(`Deleted Product: ${product.name}`, req.user.name);

    res.json({
      success: true,
      message: 'Product removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};