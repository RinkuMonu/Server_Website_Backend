// const Cart = require('../models/cart.model');
// const Product = require('../models/product.model');

// exports.addToCart = async (req, res) => {
//   const { user_id, plan_id, quantity = 1 } = req.body;

//   if (!user_id || !plan_id) {
//     return res.status(400).json({ message: 'user_id and plan_id are required' });
//   }

//   try {
//     let cart = await Cart.findOne({ user_id });

//     if (!cart) {
//       cart = new Cart({
//         user_id,
//         products: [{ plan_id, quantity }]
//       });
//     } else {
//       const existingItem = cart.products.find(
//         (item) => item.plan_id.toString() === plan_id
//       );

//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.products.push({ plan_id, quantity });
//       }
//     }

//     await cart.save();
//     res.status(200).json({ message: 'Plan added to cart', cart });
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding plan to cart', error: err.message });
//   }
// };

// exports.removeFromCart = async (req, res) => {
//     const { user_id, product_id } = req.body;

//     if (!user_id || !product_id) {
//         return res.status(400).json({ message: 'user_id and product_id are required' });
//     }

//     try {
//         const cart = await Cart.findOne({ user_id });
//         if (!cart) return res.status(404).json({ message: 'Cart not found' });

//         const originalLength = cart.products.length;
//         cart.products = cart.products.filter(
//             (item) => item.product_id.toString() !== product_id
//         );

//         if (cart.products.length === originalLength) {
//             return res.status(404).json({ message: 'Product not found in cart' });
//         }

//         await cart.save();
//         res.status(200).json({ message: 'Product removed from cart', cart });
//     } catch (err) {
//         res.status(500).json({ message: 'Error removing product from cart', error: err.message });
//     }
// };

// exports.getUserCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user_id: req.params.user_id }).populate('products.product_id');
//         if (!cart) return res.status(200).json({ message: 'Cart is empty', products: [] });

//         res.status(200).json(cart);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching cart', error: err.message });
//     }
// };

// exports.clearCart = async (req, res) => {
//     try {
//         const deleted = await Cart.findOneAndDelete({ user_id: req.params.user_id });
//         if (!deleted) {
//             return res.status(404).json({ message: 'Cart already empty or not found' });
//         }

//         res.status(200).json({ message: 'Cart cleared successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error clearing cart', error: err.message });
//     }
// };