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

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.FarmCrop;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.service.CropService;
import edu.infosys.farmVerseApplication.service.FarmUserService;

@RestController
@RequestMapping("/farmverse/")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")

public class CropController {
	@Autowired
	private CropDao cropDao;
	
	@Autowired
	private CropService service;
	
	@Autowired
	private FarmUserService userService;

	@Autowired
	private edu.infosys.farmVerseApplication.service.CropExcelAuditService excelAuditService;
	
	@PostMapping("/crop")
	public void addCrop(@RequestBody Crop crop) {
		service.validateCropArea(crop);
		Crop newCrop=service.setUsername(crop);
		service.archiveCropToExcel(newCrop);
		cropDao.addCrop(newCrop);
	}
	
	@PutMapping("/crop")
	public void updateCrop(@RequestBody Crop crop) {
		service.validateCropArea(crop);
		service.archiveCropToExcel(crop);
		cropDao.addCrop(crop);
	}
 
	@GetMapping("/crop/{id}")
	public Crop getCropById(@PathVariable String id) {
		// TODO Auto-generated method stub
		return cropDao.getCropById(id);
	}
	
	@GetMapping("/farmcrop/{id}")
	public FarmCrop getFarmCropById(@PathVariable String id) {
		Crop crop = cropDao.getCropById(id);
		return service.setFarmCrop(crop);
	}
 
	@GetMapping("/crop")
	public List<Crop> getCropsByUsername() {
		String username=userService.getUserId();
		return cropDao.getCropsByUsername(username);
	}
 
	@DeleteMapping("/crop/{id}")
	public void deleteCropById(@PathVariable String id) {
		cropDao.deleteCropById(id);
 
	}
 
	@GetMapping("/crop-id")
	public String generateCropId() {
		// TODO Auto-generated method stub
		return service.generateCropId();
	}

	@GetMapping("/crop/download-excel")
	public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadCropExcel() throws java.io.IOException {
		java.io.File file = excelAuditService.getGeneratedExcelFile();
		if (!file.exists()) {
			return org.springframework.http.ResponseEntity.notFound().build();
		}
		org.springframework.core.io.InputStreamResource resource = new org.springframework.core.io.InputStreamResource(new java.io.FileInputStream(file));
		return org.springframework.http.ResponseEntity.ok()
			.header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=crop_master_history.xlsx")
			.contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
			.contentLength(file.length())
			.body(resource);
	}
}
