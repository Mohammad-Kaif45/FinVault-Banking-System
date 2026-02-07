import { useState } from 'react';
import axios from 'axios';

// 👇 Updated props to accept fromAccountId
const TransferForm = ({ fromAccountId, refreshAccount }) => {
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleTransfer = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            // This is the payload we will send to the backend
            const transactionData = {
                fromAccountId: fromAccountId,  // 👈 Send the actual Account ID
                receiverAccountId: toAccount, // Who we are paying
                amount: parseFloat(amount) // Ensure it's a number
            };

            // Call the API Gateway (Transaction Service)
            const response = await axios.post('http://localhost:8080/transactions/transfer', transactionData);

            setMessage("✅ Transfer Successful! Transaction ID: " + response.data.id);

            // Clear form
            setToAccount("");
            setAmount("");

            // Refresh the dashboard balance automatically!
            setTimeout(() => {
                refreshAccount();
            }, 1000);

        } catch (err) {
            console.error("Transfer Failed:", err);
            // Improved error message handling
            setError("❌ Transfer Failed: " + (err.response?.data?.message || "Check Account ID or Balance."));
        }
    };

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body">
                <h4 className="card-title mb-3">💸 Transfer Money</h4>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="mb-3">
                        <label className="form-label">To Account ID:</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g. 9"
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Amount ($):</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="e.g. 100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        Send Money 🚀
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransferForm;