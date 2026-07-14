import Cart from "../models/Cart";


const createCart = async (req, res) => {
    try {
        const { user, items } = req.body;

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User is required",
            });
        }

        const cart = new Cart({ user, items });
        await cart.save();

        res.status(201).json({
            status: true,
            message: "Cart created",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate("items.product");
        if (!cart) {
            return res.status(404).json({
                status: false,
                message: "Cart not found",
            });
        }

        res.status(200).json({
            status: true,
            data: cart,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { items } = req.body;             
        const cart = await Cart.findOneAndUpdate(
            { user: req.params.userId },
            { items },
            { new: true, runValidators: true }
        ).populate("items.product");

        if (!cart) {
            return res.status(404).json({
                status: false,
                message: "Cart not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Cart updated",
            data: cart,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.params.userId });

        if (!cart) {
            return res.status(404).json({
                status: false,
                message: "Cart not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Cart deleted",
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};  

module.exports = { createCart, getCart, updateCart, deleteCart };