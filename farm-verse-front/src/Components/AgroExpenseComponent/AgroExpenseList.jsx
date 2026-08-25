import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAgroExpenses, deleteAgroExpenseById } from '../../Services/AgroExpenseService';
import '../../DisplayView.css';

const AgroExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    let navigate = useNavigate();

    const fetchExpenses = () => {
        getAllAgroExpenses().then((response) => {
            setExpenses(response.data || []);
        }).catch(error => {
            alert("Error occurred while loading data: " + error);
        });
    }

    useEffect(() => {
        fetchExpenses();
    }, []);

    const removeExpense = (id) => {
        deleteAgroExpenseById(id).then(res => {
            let remainExpenses = expenses.filter((exp) => (exp.expenseId !== id));
            setExpenses(remainExpenses);
        }).catch(error => {
            alert("Error deleting expense: " + error);
        });
    }

    const returnBack = () => {
        navigate('/farmer-menu');
    }

    return (
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1605000794699-6660659dcb59?auto=format&fit=crop&w=2832&q=80')`,
                height: '100vh',
                overflowY: 'auto',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}
        >
            <div className="farmer-menu-container" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '28px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                margin: '0 auto',
                maxWidth: '1200px'
            }}>
                
                <div className="menu-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="menu-title" style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: '800' }}>Agro Expenses Base Rates</h1>
                    <p className="menu-subtitle" style={{ color: '#475569', fontSize: '1.1rem', marginTop: '10px' }}>Manage unit costs for agricultural resources</p>
                </div>

                {expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
                        <h3 style={{ color: '#334155' }}>No expenses registered yet.</h3>
                        <button className="btn btn-success" style={{ marginTop: '20px' }} onClick={() => navigate('/expense-add')}>Add Expense</button>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {expenses.map((expense) => (
                            <div key={expense.expenseId} className="dashboard-card" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-content" style={{ flexGrow: 1, padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <h3 className="card-title" style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>{expense.expenseName}</h3>
                                        <span style={{ background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>ID: {expense.expenseId}</span>
                                    </div>
                                    
                                    <div className="card-description" style={{ marginBottom: '20px', color: '#334155' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Unit</span>
                                            <span>{expense.unitName}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontWeight: '600' }}>Rate per Unit</span>
                                            <span style={{ fontWeight: '700', color: '#059669' }}>₹{expense.ratePerUnit?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-actions" style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-danger" style={{ flex: 1, padding: '8px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.3s' }} onClick={() => removeExpense(expense.expenseId)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="dashboard-footer" style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '30px' }}>
                    <button className="btn btn-secondary" onClick={returnBack} style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: '600', background: '#64748b', border: 'none', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginRight: '10px' }}>
                        ← Back to Dashboard
                    </button>
                    {expenses.length > 0 && (
                        <button className="btn btn-success" onClick={() => navigate('/expense-add')} style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: '600', border: 'none', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            Add New Expense
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AgroExpenseList;
