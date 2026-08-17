import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAgroExpense, generateExpenseId } from "../../Services/AgroExpenseService";
import '../../DisplayView.css';

const AgroExpenseEntry = () => {
    let navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [expense, setExpense] = useState({
        expenseId: "",
        expenseName: "",
        unitName: "",
        ratePerUnit: 0.0
    });
    
    const [flag, setFlag] = useState(false);
    const [newId, setNewId] = useState("");
    
    const setExpId = () => {
        generateExpenseId().then(response => {
            setNewId(response.data);
        }).catch(err => {
            console.error("Error generating Expense ID:", err);
        });
    };

    useEffect(() => {
        setExpId();
        setFlag(false);
    }, []);

    const onChangeHandler = (event) => {
        event.persist();
        setFlag(false);
        const name = event.target.name;
        const value = event.target.value;
        setExpense(values => ({ ...values, [name]: value }));
    };

    const saveExpense = (event) => {
        event.preventDefault();
        const expenseToSave = {
            ...expense,
            expenseId: newId,
            ratePerUnit: Number(expense.ratePerUnit)
        };
        addAgroExpense(expenseToSave).then(response => {
            setFlag(true);
        }).catch(err => {
            console.error("Error saving expense:", err);
        });
    };

    const clearAll = (event) => {
        if (event) event.preventDefault();
        setExpense({
            expenseId: "",
            expenseName: "",
            unitName: "",
            ratePerUnit: 0.0
        });
        setErrors({});
        setFlag(false);
    };

    const handleValidation = (event) => {
        event.preventDefault();
        let tempErrors = {};
        let isValid = true;

        if (!expense.expenseName || !expense.expenseName.trim()) {
            tempErrors.expenseName = "Expense name is required";
            isValid = false;
        }

        if (!expense.unitName || !expense.unitName.trim()) {
            tempErrors.unitName = "Unit name is required";
            isValid = false;
        }

        if (expense.ratePerUnit === undefined || expense.ratePerUnit === null || String(expense.ratePerUnit).trim() === "" || Number(expense.ratePerUnit) < 0) {
            tempErrors.ratePerUnit = "Rate per unit must be a valid positive number";
            isValid = false;
        }

        setErrors(tempErrors);
        if (isValid) {
            saveExpense(event);
        }
    };

    const returnBack = (event) => {
        if (event) event.preventDefault();
        navigate('/farmer-menu');
    };

    return (
        <div 
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2832&q=80')`,
                height: '100vh',
                overflowY: 'auto',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}
        >
            <div className="login-box" style={{ 
                maxWidth: '550px', 
                width: '100%',
                textAlign: 'left',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                padding: '40px'
            }}>
                <h2 className="text-center" style={{ color: '#0f172a', fontWeight: '800', marginBottom: '20px' }}>Register New Expense</h2>
                <form>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Expense ID: </label>
                        <input placeholder="Expense ID" name="expenseId" className="form-control" value={newId} readOnly style={{ borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }} />
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Expense Name: </label>
                        <input placeholder="Expense Name" name="expenseName" className="form-control" value={expense.expenseName} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.expenseName && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.expenseName}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Unit Name (e.g. Kg, Liter): </label>
                        <input placeholder="Unit Name" name="unitName" className="form-control" value={expense.unitName} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.unitName && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.unitName}</p>}
                    </div>
                    <div className="form-group text-left" style={{ marginBottom: '25px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Rate Per Unit (₹): </label>
                        <input placeholder="Rate Per Unit (₹)" name="ratePerUnit" className="form-control" type="number" step="0.01" value={expense.ratePerUnit} onChange={onChangeHandler} style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        {errors.ratePerUnit && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "4px", textAlign: "left" }}>{errors.ratePerUnit}</p>}
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-success" onClick={handleValidation} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Save</button>
                        <button className="btn btn-secondary" onClick={clearAll} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Reset</button>
                        <button className="btn btn-warning" onClick={returnBack} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Return</button>
                    </div>
                </form>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    {flag && <p style={{ color: "#047857", fontWeight: "700", background: '#d1fae5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>✅ New Expense Successfully Registered!</p>}
                </div>
            </div>
        </div>
    );
};

export default AgroExpenseEntry;
