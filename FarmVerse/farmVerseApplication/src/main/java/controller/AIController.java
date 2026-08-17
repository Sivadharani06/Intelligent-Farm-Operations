package edu.infosys.farmVerseApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.aiService.ExpensePredictService;
import edu.infosys.farmVerseApplication.aiService.YieldPredictService;
import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.FarmCrop;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.service.CropInputsService;
import edu.infosys.farmVerseApplication.service.CropService;



@RestController
@RequestMapping("/farmverse/")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")
public class AIController {

	
	@Autowired
	private YieldPredictService yService;
	@Autowired
	private ExpensePredictService eService;
	@Autowired
	private CropService cService;
	@Autowired
	private CropDao cropDao;
	@Autowired
	private CropInputsService iService;
	
	
	/*@PostMapping("/yield")
	public FarmCrop getExpectedYield(@RequestBody FarmCrop farmCrop) {
        // AI processes the crop, populates yield and comments, and returns it
        return yService.predictYield(farmCrop);
    }*/
	
	
	
	@PostMapping("/yield/{id}")
	public FarmCrop getExpectedYield(@PathVariable String id) {
		Crop crop=cropDao.getCropById(id);
		FarmCrop farmCrop1=cService.setFarmCrop(crop);
		 FarmCrop farmCrop2=yService.predictYield(farmCrop1);
        crop.setYield(farmCrop2.getYield());
         cropDao.addCrop(crop);
        return farmCrop2;
    }
	
	/*@PostMapping("/predict")
    public FarmCropInputs getExpectedExpenses(@RequestBody FarmCropInputs cropInputs) {
        return eService.predictResourceExpenses(cropInputs);
    }*/
	
	@PostMapping("/predict/{id}")
    public FarmCropInputs getExpectedExpenses(@PathVariable String id) {
		FarmCropInputs farmCropInputs=iService.setFarmCropInputData(id);
        return eService.predictResourceExpenses(farmCropInputs);
    }
 
}


