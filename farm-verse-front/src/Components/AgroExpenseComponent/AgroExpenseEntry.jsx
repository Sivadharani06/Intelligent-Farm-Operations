import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addAgroExpense, generateExpenseId } from "../../Services/AgroExpenseService";

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
                alert(`Agro Expense ${expense.expenseName} Added Successfully!`);
                navigate("/expense-list");
            })
            .catch((error) => {
                alert("Error Adding Expense: " + error);
            });
    };

    return (
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1605000794699-6660659dcb59?auto=format&fit=crop&w=2832&q=80')`,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px'
            }}
        >
            <div 
                className="card" 
                style={{
                    width: '100%', 
                    maxWidth: '500px', 
                    borderRadius: '24px', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden'
                }}
            >
                <div 
                    className="card-header text-center" 
                    style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '30px 20px',
                        borderBottom: 'none'
                    }}
                >
                    <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.8rem' }}>Add Agro Expense</h2>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Register base rates for resources</p>
                </div>
                <div className="card-body" style={{ padding: '40px 30px' }}>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group mb-4">
                            <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>Expense ID</label>
                            <input
                                type="text"
                                className="form-control"
                                name="expenseId"
                                value={expense.expenseId}
                                readOnly
                                style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>Expense Name (e.g. fertilizer, waterGallon)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="expenseName"
                                value={expense.expenseName}
                                onChange={handleChange}
                                required
                                placeholder="Enter expense name"
                                style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>Unit Name (e.g. Kg, Gallon, Hour)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="unitName"
                                value={expense.unitName}
                                onChange={handleChange}
                                required
                                placeholder="Enter unit name"
                                style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label style={{ fontWeight: '600', color: '#334155', marginBottom: '8px', display: 'block' }}>Rate Per Unit (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="ratePerUnit"
                                value={expense.ratePerUnit}
                                onChange={handleChange}
                                required
                                placeholder="Enter rate per unit"
                                style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}
                            />
                        </div>
                        
                        <div className="d-flex" style={{ gap: '15px', marginTop: '30px' }}>
                            <button 
                                type="submit" 
                                className="btn btn-success" 
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem' }}
                            >
                                Save Expense
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={() => navigate("/farmer-menu")}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem', background: '#64748b', border: 'none' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgroExpenseEntry;
