const router = require("express").Router();
let user = require("../Models/User.js");
let transaction = require("../Models/Transaction.js");
const { protectRoute, adminRoute } = require("../Middleware/authMiddleware.js");

router.get("/adminAnalytics", protectRoute, adminRoute, async (req, res) => {
  try {
    const totalUsers = await user.countDocuments();
    const totalCreditTransactions = await transaction.countDocuments({
      Type: "Credit",
    });
    const totalDebitTransactions = await transaction.countDocuments({
      Type: "Debit",
    });

    const averageTransactions = await transaction.aggregate([
      {
        $group: {
          _id: null,
          averageAmount: { $avg: "$Amount" },
        },
      },
    ]);
    res.status(202).json({
      totalUsers,
      totalCreditTransactions,
      totalDebitTransactions,
      averageTransactions: averageTransactions[0]?.averageAmount || 0,
    });
  } catch (error) {
    console.error("Error in analytics route", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/userAnalytics", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const totalUserTransactions = await transaction.countDocuments({
      User: userId,
    });

    const totalUserCreditTransactions = await transaction.countDocuments({
      User: userId,
      Type: "Credit",
    });

    const totalUserDebitTransactions = await transaction.countDocuments({
      User: userId,
      Type: "Debit",
    });

    const averageUserTransactions = await transaction.aggregate([
      { $match: { User: userId } },
      {
        $group: {
          _id: null,
          averageAmount: { $avg: "$Amount" },
        },
      },
    ]);
    res.status(202).json({
      totalUserTransactions,
      totalUserCreditTransactions,
      totalUserDebitTransactions,
      averageUserTransactions: averageUserTransactions[0]?.averageAmount || 0,
    });
  } catch (error) {
    console.error("Error in user analytics route", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
