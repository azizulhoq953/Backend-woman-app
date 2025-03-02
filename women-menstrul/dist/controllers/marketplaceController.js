import Product from '../models/Product';
// @desc    Get all marketplace products
// @route   GET /api/marketplace/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        // Filter by category if provided
        if (category) {
            query.category = category;
        }
        // Search by name or description if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const products = await Product.find(query).populate('category', 'name');
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
// @desc    Get product by ID
// @route   GET /api/marketplace/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
