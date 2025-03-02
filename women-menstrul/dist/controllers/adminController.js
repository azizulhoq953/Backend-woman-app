import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Order from '../models/Order';
import Post from '../models/Post';
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
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
// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and type',
            });
        }
        if (type !== 'blog' && type !== 'marketplace') {
            return res.status(400).json({
                success: false,
                message: 'Type must be blog or marketplace',
            });
        }
        // Check if category already exists
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }
        const category = await Category.create({
            name,
            type,
        });
        res.status(201).json({
            success: true,
            data: category,
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
// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getCategories = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) {
            query = { type };
        }
        const categories = await Category.find(query);
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
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
// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name',
            });
        }
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Check if category name already exists (except for this category)
        const categoryExists = await Category.findOne({
            name,
            _id: { $ne: req.params.id },
        });
        if (categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists',
            });
        }
        category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.status(200).json({
            success: true,
            data: category,
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
// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Check if category is used in posts or products
        if (category.type === 'blog') {
            const postsWithCategory = await Post.countDocuments({
                category: req.params.id,
            });
            if (postsWithCategory > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete category used in posts',
                });
            }
        }
        else {
            const productsWithCategory = await Product.countDocuments({
                category: req.params.id,
            });
            if (productsWithCategory > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete category used in products',
                });
            }
        }
        await category.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Category removed',
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
// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, countInStock } = req.body;
        if (!name || !description || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        // Check if category exists and is marketplace type
        const categoryExists = await Category.findById(category);
        if (!categoryExists || categoryExists.type !== 'marketplace') {
            return res.status(404).json({
                success: false,
                message: 'Marketplace category not found',
            });
        }
        // Handle image upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a product image',
            });
        }
        // In a real app, you'd upload to cloud storage and get URL
        const image = `/uploads/${req.file.filename}`;
        const product = await Product.create({
            name,
            description,
            category,
            price,
            image,
            countInStock: countInStock || 0,
        });
        res.status(201).json({
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
// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name');
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
// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const { name, description, category, price, countInStock } = req.body;
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        // Check if category exists and is marketplace type if changing category
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists || categoryExists.type !== 'marketplace') {
                return res.status(404).json({
                    success: false,
                    message: 'Marketplace category not found',
                });
            }
        }
        // Handle image upload
        let image = product.image;
        if (req.file) {
            // In a real app, you'd upload to cloud storage and get URL
            image = `/uploads/${req.file.filename}`;
        }
        product = await Product.findByIdAndUpdate(req.params.id, {
            name: name || product.name,
            description: description || product.description,
            category: category || product.category,
            price: price !== undefined ? price : product.price,
            image,
            countInStock: countInStock !== undefined ? countInStock : product.countInStock,
        }, { new: true }).populate('category', 'name');
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
// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        // Check if product is in any order
        const orders = await Order.find({
            'products.product': req.params.id,
        });
        if (orders.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete product with existing orders',
            });
        }
        await product.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Product removed',
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
// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name');
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
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
// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { isPaid, isDelivered } = req.body;
        if (isPaid === undefined && isDelivered === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status to update',
            });
        }
        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        order = await Order.findByIdAndUpdate(req.params.id, {
            ...(isPaid !== undefined && { isPaid }),
            ...(isDelivered !== undefined && { isDelivered }),
        }, { new: true })
            .populate('user', 'name email')
            .populate('products.product', 'name');
        res.status(200).json({
            success: true,
            data: order,
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
// @desc    Get top community posts
// @route   GET /api/admin/top-posts
// @access  Private/Admin
export const getTopPosts = async (req, res) => {
    try {
        // Get posts sorted by engagement (likes + comments)
        const posts = await Post.aggregate([
            {
                $addFields: {
                    engagement: {
                        $add: [{ $size: "$likes" }, { $size: "$comments" }]
                    }
                }
            },
            { $sort: { engagement: -1 } },
            { $limit: 10 }
        ]);
        // Populate needed fields
        const populatedPosts = await Post.populate(posts, [
            { path: 'user', select: 'name' },
            { path: 'category', select: 'name' }
        ]);
        res.status(200).json({
            success: true,
            count: populatedPosts.length,
            data: populatedPosts,
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
// @desc    Create admin account
// @route   POST /api/admin/create
// @access  Private/Admin
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        // Create admin user with verified status
        const user = await User.create({
            name,
            email,
            password,
            isAdmin: true,
            isVerified: true,
        });
        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
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
// @desc    Update admin password
// @route   PUT /api/admin/password
// @access  Private/Admin
export const updateAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
            });
        }
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }
        // Set new password
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
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
