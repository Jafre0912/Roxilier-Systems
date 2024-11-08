// controllers/statisticsController.js
const Transaction = require('../models/Transaction');

exports.getStatistics = async (req, res) => {
  try {
      const { year, month } = req.query;
      
      // Check if year and month are provided
      if (!year || !month) {
          return res.status(400).json({ message: "Year and month are required." });
      }

      const parsedYear = parseInt(year);
      const parsedMonth = parseInt(month); // Ensure month is an integer

      // Log for debugging
      console.log('Year:', parsedYear);
      console.log('Month:', parsedMonth);

      // Validate year and month
      if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
          return res.status(400).json({ message: "Invalid year or month." });
      }

      // Query database for transactions in the specified year and month
      const startDate = new Date(parsedYear, parsedMonth - 1, 1); // First day of the month
      const endDate = new Date(parsedYear, parsedMonth, 1); // First day of the next month

      const filteredTransactions = await Transaction.find({
          dateOfSale: {
              $gte: startDate,
              $lt: endDate,
          },
      });

      // Log for debugging
      console.log('Found transactions:', filteredTransactions);

      // Calculate statistics
      const totalSaleAmount = filteredTransactions.reduce(
          (sum, transaction) => sum + (transaction.sold ? transaction.price : 0), 
          0
      );
      const totalSoldItems = filteredTransactions.filter(transaction => transaction.sold).length;
      const totalNotSoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;

      // Respond with calculated statistics
      res.json({
          totalSaleAmount,
          totalSoldItems,
          totalNotSoldItems,
          transactions: filteredTransactions
      });

  } catch (error) {
      console.error("Error retrieving statistics:", error);
      res.status(500).json({ message: "Error retrieving statistics", error: error.message });
  }
};
