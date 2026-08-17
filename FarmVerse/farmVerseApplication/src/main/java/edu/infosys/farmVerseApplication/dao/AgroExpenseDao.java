package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

public interface AgroExpenseDao {
	public void addAgroExpense(AgroExpense expense);
	public AgroExpense getAgroExpenseById(Integer id);
	public List<AgroExpense> getAllAgroExpenses();
	public void deleteAgroExpenseById(Integer id);
	public Integer getMaxExpenseId();
}
