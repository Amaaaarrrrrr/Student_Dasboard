import React, { useState } from 'react';

const PaymentForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment Form</h3>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;
