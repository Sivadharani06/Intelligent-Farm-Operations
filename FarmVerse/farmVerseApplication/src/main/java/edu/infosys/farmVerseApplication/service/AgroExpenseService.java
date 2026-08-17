package edu.infosys.farmVerseApplication.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.AgroExpense;
import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AgroExpenseService {

	@Autowired
	private AgroExpenseDao agroExpenseDao;
	
	public AgroExpense getAgroExpenseById(Integer id) {
		return agroExpenseDao.getAgroExpenseById(id);
	}

	public void addAgroExpense(AgroExpense expense) {
		agroExpenseDao.addAgroExpense(expense);
	}

	public List<AgroExpense> getAllAgroExpenses() {
		return agroExpenseDao.getAllAgroExpenses();
	}

	public void deleteAgroExpenseById(Integer id) {
		agroExpenseDao.deleteAgroExpenseById(id);
	}

	public Integer generateExpenseId() {
		Integer id = agroExpenseDao.getMaxExpenseId();
		if (id == null) {
			return 1;
		} else {
			return id + 1;
		}
	}
}
