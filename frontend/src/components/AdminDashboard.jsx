import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [totalLiquidity, setTotalLiquidity] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllAccounts();
    }, []);

    const fetchAllAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8085/accounts/admin/all");
            setAccounts(response.data);
            const total = response.data.reduce((sum, account) => sum + account.balance, 0);
            setTotalLiquidity(total);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    // 👇 NEW: The function that runs when you click the button
    const handleFreezeToggle = async (id) => {
        try {
            await axios.put(`http://localhost:8085/accounts/admin/${id}/freeze`);
            fetchAllAccounts(); // Refresh the table instantly!
        } catch (error) {
            console.error("Failed to freeze account", error);
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', margin: 0 }}>🛡️ Admin Command Center</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 20px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Back to User App
                </button>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', marginBottom: '40px', borderLeft: '5px solid #10b981' }}>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase' }}>Total Global Liquidity</p>
                <h2 style={{ margin: '10px 0 0 0', fontSize: '48px', color: '#10b981' }}>
                    ₹{totalLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#e2e8f0' }}>Global User Ledger</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                            <th style={{ padding: '12px' }}>Account ID</th>
                            <th style={{ padding: '12px' }}>Current Balance</th>
                            <th style={{ padding: '12px' }}>Network Status</th>
                            <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                            <tr key={account.id} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: '15px 12px', fontFamily: 'monospace', color: '#38bdf8' }}>{account.accountNumber}</td>
                                <td style={{ padding: '15px 12px', fontWeight: 'bold' }}>₹{account.balance.toLocaleString()}</td>

                                {/* 👇 NEW: Dynamic Status Text */}
                                <td style={{ padding: '15px 12px', fontWeight: 'bold', color: account.frozen ? '#ef4444' : '#10b981' }}>
                                    {account.frozen ? '❄️ FROZEN' : '✅ ACTIVE'}
                                </td>

                                {/* 👇 NEW: Dynamic Button */}
                                <td style={{ padding: '15px 12px' }}>
                                    <button
                                        onClick={() => handleFreezeToggle(account.id)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: account.frozen ? '#10b981' : '#ef4444',
                                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100px'
                                        }}>
                                        {account.frozen ? 'Unfreeze' : 'Freeze'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;