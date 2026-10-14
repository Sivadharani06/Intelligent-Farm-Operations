import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlurAdminLayout from "../Layout/BlurAdminLayout";
import { addAgroExpense, generateExpenseId } from "../../Services/AgroExpenseService";
import '../../DisplayView.css';

const AgroExpenseEntry = () => {
    let navigate = useNavigate();

    const [expense, setExpense] = useState({
        expenseId: "",
        expenseName: "",
        unitName: "",
        ratePerUnit: ""
    });

    useEffect(() => {
        generateExpenseId()
            .then((res) => {
                setExpense((prevState) => ({
                    ...prevState,
                    expenseId: res.data
                }));
            })
            .catch((error) => {
                console.error("Error generating expense ID:", error);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        addAgroExpense(expense)
            .then(() => {
                navigate("/expense-list");
            })
            .catch((error) => {
                alert("Error Adding Expense: " + error);
            });
    };

    return (
        <BlurAdminLayout title="ADD AGRO EXPENSE" breadcrumb="Home / Expenses / Add Expense">
            <div style={{ maxWidth: '600px', margin: '20px auto' }}>
                <div className="blur-card" style={{ padding: '36px', background: '#0d222a', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                    <div className="menu-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>Add Expense Rate</h2>
                        <p style={{ color: '#00e5ff', fontSize: '1.05rem', fontWeight: '700', marginTop: '8px' }}>Register base rates for fertilizers, water, machine hours and chemicals</p>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group mb-4">
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>EXPENSE ID (AUTO-GENERATED):</label>
                            <input
                                type="text"
                                className="form-control"
                                name="expenseId"
                                value={expense.expenseId}
                                readOnly
                                style={{ background: '#07171e', color: '#00d2aa', fontWeight: '800', fontSize: '1.1rem', border: '1.5px solid rgba(255,255,255,0.15)' }}
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>EXPENSE NAME (E.G. FERTILIZER, WATERGALLON, TRACTORHOUR):</label>
                            <input
                                type="text"
                                className="form-control"
                                name="expenseName"
                                value={expense.expenseName}
                                onChange={handleChange}
                                required
                                placeholder="Enter expense identifier"
                                style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>UNIT NAME (E.G. KG, GALLON, HOUR):</label>
                            <input
                                type="text"
                                className="form-control"
                                name="unitName"
                                value={expense.unitName}
                                onChange={handleChange}
                                required
                                placeholder="Enter unit measurement"
                                style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label style={{ color: '#00e5ff', fontWeight: '800', fontSize: '0.9rem' }}>RATE PER UNIT (₹):</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="ratePerUnit"
                                value={expense.ratePerUnit}
                                onChange={handleChange}
                                required
                                placeholder="Enter base unit cost"
                                style={{ background: '#07171e', color: '#ffffff', fontWeight: '700', fontSize: '1rem', border: '1.5px solid rgba(255,255,255,0.2)' }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                            <button 
                                type="submit" 
                                className="btn btn-success flex-grow-1"
                                style={{ fontWeight: '900', padding: '12px' }}
                            >
                                Save Expense
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary flex-grow-1" 
                                onClick={() => navigate("/expense-list")}
                                style={{ fontWeight: '800', padding: '12px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </BlurAdminLayout>
    );
};

export default AgroExpenseEntry;
