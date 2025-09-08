import Cart from "../models/Cart.js";
import Item from "../models/Item.js";
//  5 functions

// get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.itemId", "name price imageUrl category");

    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};


// add to cart
export const addToCart = async(req,res)=>{
  try {
    const userId = req.user._id;
    const { itemId, quantity = 1 } = req.body;

    const product = await Item.findById(itemId);
    if (!product) return res.status(404).json({ message: "Item not found" });
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ itemId, quantity, price: product.price }]
      });
    } else {
      const itemIndex = cart.items.findIndex(i => i.itemId.toString() === itemId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ itemId, quantity, price: product.price });
      }
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

// remove from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.itemId.toString() !== itemId);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart", error: err.message });
  }
};


// update cart
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, quantity } = req.body;

    if (quantity < 0) return res.status(400).json({ message: "Quantity cannot be negative" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.itemId.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not in cart" });

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
};

// delete cart
export const deleteCart = async (req, res) => {
  try{
    const userId = req.user._id;
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Cart deleted successfully" });
   }catch(err){
     res.status(500).json({ message: "Error deleting cart", error: err.message });
   }
}
