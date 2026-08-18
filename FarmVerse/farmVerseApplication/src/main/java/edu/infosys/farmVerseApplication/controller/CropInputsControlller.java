package edu.infosys.farmVerseApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropReport;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.service.CropInputsService;

@RestController
@RequestMapping("/farmverse")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")
public class CropInputsControlller {
	@Autowired
	private CropInputsDao cropInputsDao;
	@Autowired
	private CropInputsService service;
	
	@PostMapping("/crop-input")
	public void addCropInputs(@RequestBody FarmCropInputs farmCropInputs)
	{
		CropInputs cropInputs=service.setCropInputData(farmCropInputs);
		cropInputsDao.addCropInputs(cropInputs);
	}
	
	
	@GetMapping("/crop-input/{id}")
	public CropInputs getCropInputsById(@PathVariable String id)
	{
		return cropInputsDao.getCropInputsById(id);
	}
	@DeleteMapping("/crop-input/{id}")
	public void deleteCropInputsById(@PathVariable String id)
	{
		cropInputsDao.deleteCropInputsById(id);
	}
	@GetMapping("/crop-exp/{id}")
	public FarmCropReport expenseCalculation(@PathVariable String id) {
		return service.expenseCalculation(id);
	}

}
