const router = require("express").Router();
const { protectRoute, adminRoute } = require("../Middleware/authMiddleware.js");
let transaction = require("../Models/Transaction.js");

router.get(
  "/getAlltransactions",
  protectRoute,
  adminRoute,
  async (req, res) => {
    try {
      const Transactions = await transaction.find({});
      res.json({ Transactions });
    } catch (error) {
      console.log("Error in getAlltransactions Controller", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/deleteAlltransactions",
  protectRoute,
  adminRoute,
  async (req, res) => {
    try {
      await transaction.deleteMany({});
      res
        .status(200)
        .json({ success: true, message: "All transactions deleted!" });
    } catch (error) {
      console.log("Error in deleteAlltransactions Controller", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/getUserTransactions", protectRoute, async (req, res) => {
  try {
    const userTransactions = await transaction.find({ User: req.user._id });
    res.json({ userTransactions });
  } catch (error) {
    console.log("Error in getUserTransactions Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/getTransaction/:id", protectRoute, async (req, res) => {
  try {
    const Transaction = await transaction.findById(req.params.id);
    res.json({ Transaction });
  } catch (error) {
    console.log("Error in getTransaction Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/addTransaction", protectRoute, async (req, res) => {
  try {
    const { amount, description, type } = req.body;
    const newTransaction = new transaction({
      User: req.user._id,
      Amount: amount,
      Description: description,
      Type: type,
    });
    await newTransaction.save();
    res.status(200).json({
      success: true,
      message: "Transaction added successfully!",
      Transaction: newTransaction,
    });
  } catch (error) {
    console.log("Error in addTransaction Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateTransaction/:id", protectRoute, async (req, res) => {
  try {
    const { amount, description, type } = req.body;
    const updatedTransaction = {
      Amount: amount,
      Description: description,
      Type: type,
    };
    await transaction.findByIdAndUpdate(req.params.id, updatedTransaction);
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully!",
      Transaction: updatedTransaction,
    });
  } catch (error) {
    console.log("Error in updateTransaction Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteTransaction/:id", protectRoute, async (req, res) => {
  try {
    await transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Transaction deleted!" });
  } catch (error) {
    console.log("Error in deleteTransaction Controller", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
