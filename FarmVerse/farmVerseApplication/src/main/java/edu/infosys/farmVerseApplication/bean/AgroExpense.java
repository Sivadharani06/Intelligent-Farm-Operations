package edu.infosys.farmVerseApplication.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import org.springframework.data.domain.Persistable;

@Entity
public class AgroExpense implements Persistable<Integer> {
	
	@Id
	private Integer expenseId;
	private String expenseName;
	private String unitName;
	private Double ratePerUnit;
	
	@Transient
	private boolean isNew = true;
	
	@Override
	public boolean isNew() {
		return isNew;
	}
	
	@PrePersist
	@PostLoad
	void markNotNew() {
		this.isNew = false;
	}
	
	@Override
	public Integer getId() {
		return expenseId;
	}
	
	public AgroExpense() {
		super();
	}
	public AgroExpense(Integer expenseId, String expenseName, String unitName, Double ratePerUnit) {
		super();
		this.expenseId = expenseId;
		this.expenseName = expenseName;
		this.unitName = unitName;
		this.ratePerUnit = ratePerUnit;
	}
	public Integer getExpenseId() {
		return expenseId;
	}
	public void setExpenseId(Integer expenseId) {
		this.expenseId = expenseId;
	}
	public String getExpenseName() {
		return expenseName;
	}
	public void setExpenseName(String expenseName) {
		this.expenseName = expenseName;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
	public Double getRatePerUnit() {
		return ratePerUnit;
	}
	public void setRatePerUnit(Double ratePerUnit) {
		this.ratePerUnit = ratePerUnit;
	}
}
