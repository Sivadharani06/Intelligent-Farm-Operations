package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

@Repository
@Service
public class AgroExpenseDaoImpl implements AgroExpenseDao {

	@Autowired
	private AgroExpenseRepository repository;

	@Override
	public void addAgroExpense(AgroExpense expense) {
		repository.save(expense);
	}

	@Override
	public AgroExpense getAgroExpenseById(Integer id) {
		return repository.findById(id).get();
	}

	@Override
	public List<AgroExpense> getAllAgroExpenses() {
		return repository.findAll();
	}

	@Override
	public void deleteAgroExpenseById(Integer id) {
		repository.deleteById(id);
	}

	@Override
	public Integer getMaxExpenseId() {
		return repository.getMaxExpenseId();
	}
}
