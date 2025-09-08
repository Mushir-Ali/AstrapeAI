import Item from "../models/Item.js";

// there will be 4 functions for items

// create

// Create new item (admin use case)
export const createItem = async (req,res)=>{
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // multer aur cloudinary file info ko req.file mein de denge
    const imageUrl = req.file?.path || "";

    const newItem = new Item({name,description,price,category,imageUrl,});

    const savedItem = await newItem.save();
    console.log("item added succesfully", savedItem);
    return res.status(201).json({
      message: "Item created successfully",
      item: savedItem,
    });
  } catch (error) {
    console.error("Error creating item:",error);
    return res.status(500).json({message: "Server error while creating item"});
  }
};


// read single
export const getItem = async (req, res) => {
  try {
    const {id} = req.params;
    // console.log(id);

    if(!id){
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await Item.findById(id);
    // console.log(item);

    if(!item){
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  }catch(error){
    console.error("Error fetching item:", error);
    res.status(500).json({message:"Server error"});
  }
};

// read all
export const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, minRate, maxRate } = req.query;

    let query = {};

    // Category filter
    if (category && category !== "ALL") {
      query.category = category;
    }

    // Price filter (was rate before)
    const min = Number(minRate);
    const max = Number(maxRate);

    if (!isNaN(min) || !isNaN(max)) {
      query.price = {};
      if (!isNaN(min)) query.price.$gte = min;
      if (!isNaN(max)) query.price.$lte = max;
    }

    // Fetch items with pagination
    const items = await Item.find(query).skip(skip).limit(limit);
    const total = await Item.countDocuments(query);

    res.status(200).json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};


// update
export const updateItem = async (req, res) => {
  try {
    const {id}=req.params;

    if(!id){
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await Item.findById(id);
    if(!item){
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.price = req.body.price !== undefined ? req.body.price : item.price;
    item.category = req.body.category || item.category;

    if(req.file?.path){
      item.imageUrl = req.file.path;
    }
    
    const updatedItem = await item.save();
    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({message:"Server error while updating item"});
  }
};

// delete
export const deleteItem = async(req,res)=>{
  try {
    const {id}=req.params;

    if(!id){
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const item = await Item.findById(id);
    if(!item){
      return res.status(404).json({ message: "Item not found" });
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted successfully" });
  }catch(error){
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};
