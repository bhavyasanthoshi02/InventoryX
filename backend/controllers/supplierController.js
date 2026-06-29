import Supplier from '../models/Supplier.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private (Admin Role implied in frontend logic)
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Add a supplier
// @route   POST /api/suppliers
// @access  Private (Admin Role)
export const addSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, rating, createdBy } = req.body;

    if (!name || !contact || !email || !phone || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const supplier = await Supplier.create({
      name,
      contact,
      email,
      phone,
      rating: rating || 5.0,
      createdBy,
    });

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating supplier',
      error: err.message,
    });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin Role)
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found',
      });
    }

    await supplier.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Supplier removed',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting supplier',
      error: err.message,
    });
  }
};
