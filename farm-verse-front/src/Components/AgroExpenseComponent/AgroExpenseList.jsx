import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurAdminLayout from '../Layout/BlurAdminLayout';
import { getAllAgroExpenses, deleteAgroExpenseById } from '../../Services/AgroExpenseService';
import '../../DisplayView.css';

const AgroExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    let navigate = useNavigate();

    const fetchExpenses = () => {
        getAllAgroExpenses().then((response) => {
            setExpenses(response.data || []);
        }).catch(error => {
            console.error("Error loading agro expenses: ", error);
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
            console.error("Error deleting expense: ", error);
        });
    }

    const returnBack = () => {
        navigate('/farmer-menu');
    }

    return (
        <BlurAdminLayout title="AGRO EXPENSES" breadcrumb="Home / Expenses / Rate Matrix">
            <div className="farmer-menu-container" style={{ background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                <div className="menu-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="menu-title" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#ffffff' }}>Agro Resource Expense Rates</h1>
                    <p className="menu-subtitle" style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700' }}>Unit cost management for water, fertilizers, pesticide treatments, machinery and tools</p>
                </div>

                {expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#07171e', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                        <h4 style={{ color: '#ffffff', fontWeight: '800' }}>No agro expenses configured yet.</h4>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px' }}>Define standard unit costs to calculate accurate crop input expenses.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/expense-add')}>+ Add Expense Rate</button>
                    </div>
                ) : (
                    <div className="blur-cards-grid">
                        {expenses.map((expense) => (
                            <div key={expense.expenseId} className="blur-feature-card" style={{ background: '#07171e', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                                <div className="blur-card-icon-banner">
                                    <div className="blur-card-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23"></line>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </svg>
                                    </div>
                                    <span className="blur-badge blur-badge-pink" style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: '800' }}>ID: #{expense.expenseId}</span>
                                </div>
                                
                                <h3 className="blur-card-title" style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', margin: '8px 0' }}>{expense.expenseName}</h3>
                                
                                <div style={{ margin: '14px 0 20px 0', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.92rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>UNIT MEASUREMENT</span>
                                        <span style={{ fontWeight: '800', color: '#ffffff' }}>{expense.unitName}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.92rem' }}>
                                        <span style={{ color: '#00e5ff', fontWeight: '800' }}>RATE PER UNIT</span>
                                        <span style={{ fontWeight: '900', color: '#00d2aa', fontSize: '1.15rem' }}>₹{expense.ratePerUnit?.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="blur-card-actions" style={{ marginTop: 'auto' }}>
                                    <button className="btn btn-danger w-100" style={{ fontWeight: '800', padding: '10px' }} onClick={() => removeExpense(expense.expenseId)}>
                                        Delete Rate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '14px' }}>
                    <button className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '800' }} onClick={returnBack}>
                        ← Back to Dashboard
                    </button>
                    <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: '900' }} onClick={() => navigate('/expense-add')}>
                        + Add New Expense
                    </button>
                </div>
            </div>
        </BlurAdminLayout>
    );
}

export default AgroExpenseList;
