import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentFees = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payments, setPayments] = useState([]);
  const [clearance, setClearance] = useState(null);

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetchFeeStructures();
    fetchPayments();
    fetchClearance();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/fee-structures/all');
      setFeeStructures(res.data.fee_structures);
    } catch (err) {
      toast.error('Failed to load fee structures');
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.payments);
    } catch (err) {
      toast.error('Failed to load payments');
    }
  };

  const fetchClearance = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/clearance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClearance(res.data.data);
    } catch {
      setClearance(null);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return toast.error('No fee selected');

    try {
      const res = await axios.post(
        'http://127.0.0.1:5000/api/payments',
        {
          fee_structure_id: selectedFee.id,
          amount_paid: amountPaid,
          payment_method: paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Payment successful!');
      setAmountPaid('');
      setPaymentMethod('');
      setSelectedFee(null);
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Student Fee Portal</h1>

      {/* Fee Structures */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Fee Structures</h2>
        {feeStructures.length === 0 ? (
          <p>No fee structures found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeStructures.map((fs) => (
              <div
                key={fs.id}
                className="border p-4 rounded shadow-sm flex flex-col justify-between"
              >
                <p><strong>Program ID:</strong> {fs.program_id}</p>
                <p><strong>Semester ID:</strong> {fs.semester_id}</p>
                <p><strong>Amount:</strong> KES {fs.amount}</p>
                <p><strong>Due:</strong> {fs.due_date}</p>
                <button
                  onClick={() => setSelectedFee(fs)}
                  className="mt-2 bg-blue-600 text-white py-1 px-3 rounded"
                >
                  Pay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Form */}
      {selectedFee && (
        <form onSubmit={handlePayment} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Pay for Semester {selectedFee.semester_id}</h2>
          <p className="mb-4 text-gray-600">Program: {selectedFee.program_id} | Amount: KES {selectedFee.amount}</p>
          <div className="flex flex-col gap-3">
            <input
              type="number"
              placeholder="Amount Paid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Payment Method (e.g. M-Pesa)"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Submit Payment
              </button>
              <button
                type="button"
                onClick={() => setSelectedFee(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Payment History */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        {payments.length === 0 ? (
          <p>No payments recorded.</p>
        ) : (
          <ul className="space-y-2">
            {payments.map((pay) => (
              <li key={pay.id} className="border-b py-2">
                KES {pay.amount_paid} - {pay.payment_method} - {new Date(pay.date_paid).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clearance Status */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Clearance Status</h2>
        {clearance ? (
          <div>
            <p><strong>Status:</strong> {clearance.status}</p>
            <p><strong>Cleared On:</strong> {clearance.cleared_on || 'Pending'}</p>
          </div>
        ) : (
          <p>No clearance record found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentFees;
