package edu.infosys.farmVerseApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.bean.AgroExpense;
import edu.infosys.farmVerseApplication.service.AgroExpenseService;

@RestController
@RequestMapping("/farmverse/")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")
public class AgroController {

	@Autowired
	private AgroExpenseService service;
	
	@PostMapping("/exp")
	public void addAgroExpense(@RequestBody AgroExpense expense) {
		service.addAgroExpense(expense);
	}
		
	@PutMapping("/exp")
	public void updateAgroExpense(@RequestBody AgroExpense expense) {
		service.addAgroExpense(expense);
	}
	
	@GetMapping("/getexp/{id}")
	public AgroExpense getAgroExpenseById(@PathVariable Integer id) {
		return service.getAgroExpenseById(id);
	}

	@GetMapping("/getexp")
	public List<AgroExpense> getAllAgroExpenses() {
		return service.getAllAgroExpenses();
	}

	@DeleteMapping("/agroexp/{id}")
	public void deleteAgroExpenseById(@PathVariable Integer id) {
		service.deleteAgroExpenseById(id);
	}
	
	@GetMapping("/expid")
	public Integer generateExpenseId() {
		return service.generateExpenseId();
	}

}
