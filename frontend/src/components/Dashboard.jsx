import { useState, useEffect } from 'react';
import axios from 'axios';
import TransferForm from './TransferForm';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Toggle for showing the Transfer Form
    const [showTransfer, setShowTransfer] = useState(false);

    // We define this function outside useEffect so we can call it again after a transfer
    const fetchAccountData = async () => {
        try {
            // 1. Get User (ID 1)
            const userRes = await axios.get('http://localhost:8080/users/1');
            setUser(userRes.data);

            // 2. Get Account (ID 8) - Assuming 8 is your main account now
            const accountRes = await axios.get('http://localhost:8080/accounts/8');
            setAccount(accountRes.data);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Could not load data. Are services running?");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountData();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;
    if (error) return <div className="alert alert-danger m-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">👋 Welcome, {user.fullName}</h2>

            <div className="row">
                {/* Profile Card */}
                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body text-center">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Profile"
                                style={{ width: '100px' }}
                                className="mb-3"
                            />
                            <h4>{user.username}</h4>
                            <p className="text-muted">{user.email}</p>
                            <button className="btn btn-outline-primary btn-sm">Edit Profile</button>
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className="col-md-8">
                    {/* Balance Card */}
                    <div className="card shadow-sm bg-primary text-white mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Savings Account</h5>
                            <h1 className="display-4 fw-bold">${account.balance}</h1>
                            <p className="mb-0">Account ID: #{account.id}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-3 mb-4">
                        <button
                            className="btn btn-success btn-lg flex-grow-1"
                            onClick={() => setShowTransfer(!showTransfer)}
                        >
                            {showTransfer ? "❌ Close Transfer" : "💸 Transfer Money"}
                        </button>
                        <button className="btn btn-secondary btn-lg flex-grow-1">
                            📜 History
                        </button>
                    </div>

                    {/* 🚀 CONDITIONAL RENDER: Pass ACCOUNT ID, NOT USER ID */}
                    {showTransfer && (
                        <TransferForm
                            fromAccountId={account.id}
                            refreshAccount={fetchAccountData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;