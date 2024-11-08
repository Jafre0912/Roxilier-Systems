const Transaction = require('../models/Transaction');

exports.getStatistics = async (req, res) => {
  try {
      const { year, month } = req.query;

      // Ensure the year and month are integers
      const parsedYear = parseInt(year);
      const parsedMonth = parseInt(month);

      // Check if year and month are valid
      if (isNaN(parsedYear) || isNaN(parsedMonth)) {
          return res.status(400).json({ message: 'Invalid year or month.' });
      }

      // Log for debugging
      console.log('Year:', parsedYear);
      console.log('Month:', parsedMonth);

      // Set the start and end dates for filtering
      const startDate = new Date(parsedYear, parsedMonth - 1, 1); // First day of the month
      const endDate = new Date(parsedYear, parsedMonth, 1); // First day of next month

      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      // Query MongoDB for transactions within the specified date range
      const filteredTransactions = await Transaction.find({
          dateOfSale: {
              $gte: startDate,
              $lt: endDate,
          },
      });

      console.log('Filtered Transactions:', filteredTransactions);

      // Check if no transactions are found
      if (filteredTransactions.length === 0) {
        return res.status(404).json({ message: 'No data available for the selected month' });
      }

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
