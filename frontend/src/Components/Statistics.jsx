import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const Statistics = ({ year, month }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!year || !month) {
        setError('Please select both year and month');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log(`Sending request to API with year: ${year}, month: ${month}`);

        const response = await axios.get('http://localhost:4000/api/statistics', {
          params: {
            year: year,
            month: month,
          },
        });

        console.log('API response:', response.data);  // Log the API response

        if (response.data && response.data.transactions && response.data.transactions.length === 0) {
          setError('No data available for the selected month');
        } else {
          setStatistics(response.data);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('An error occurred while fetching statistics');
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchStatistics();
    }
  }, [year, month]);  // Dependency array includes year and month

  return (
    <div className="statistics-container">
      <h1>Transaction Statistics</h1>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : statistics ? (
        <div>
          <div className="statistics-summary">
            <p><strong>Total Sale Amount:</strong> Rs {statistics.totalSaleAmount}</p>
            <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
            <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
          </div>

          <h3>Transactions Table</h3>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {statistics.transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.title}</td>
                  <td>Rs {transaction.price}</td>
                  <td>{transaction.sold ? 'Sold' : 'Not Sold'}</td>
                  <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Statistics;
