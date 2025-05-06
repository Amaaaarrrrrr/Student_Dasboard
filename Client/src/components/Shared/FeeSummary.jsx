import React from 'react';

const FeeSummary = ({ totalFees, paidAmount, dueAmount }) => {
  return (
    <div className="fee-summary">
      <h3>Fee Summary</h3>
      <p>Total Fees: ${totalFees}</p>
      <p>Paid Amount: ${paidAmount}</p>
      <p>Amount Due: ${dueAmount}</p>
    </div>
  );
};

export default FeeSummary;
