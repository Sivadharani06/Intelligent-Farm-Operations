package edu.infosys.farmVerseApplication.service;
import java.lang.reflect.*;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;

import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;

import edu.infosys.farmVerseApplication.bean.AgroExpense;
import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.CropExpense;
import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.bean.FarmCropReport;

import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.dao.FarmDao;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;



@Service
@Transactional
public class CropInputsService {

	@Autowired
	private CropDao cropDao;
	
	@Autowired
	private FarmDao farmDao;
	@Autowired
	private CropInputsDao cropInputsDao;
	
	@Autowired
	private AgroExpenseDao agroExpDao;


	
	
	public FarmCropInputs setFarmCropInputData(String cropId)
	{
		Crop crop=cropDao.getCropById(cropId);
		Farm farm=farmDao.getFarmById(crop.getFarmId());
		return new FarmCropInputs(crop,farm.getSoil());
		
	}
	public CropInputs setCropInputData(FarmCropInputs farmCropInputs)
	{
		CropInputs cropInputs=new CropInputs(farmCropInputs);
		cropInputs.setAgrotools(1.0);
		return cropInputs;
	}
	
	public void addCropInputs(CropInputs cropInputs) {
		cropInputsDao.addCropInputs(cropInputs);
	}

	public CropInputs getCropInputsById(String cropId) {
		return cropInputsDao.getCropInputsById(cropId);
	}

	public void deleteCropInputsById(String cropId) {
		cropInputsDao.deleteCropInputsById(cropId);
	}
	
	public FarmCropReport expenseCalculation(String cropId) {
		List<AgroExpense> expenseList=agroExpDao.getAllAgroExpenses();
		Map<String,AgroExpense> expenseMap=new HashMap<String, AgroExpense>();
 
		for(AgroExpense ae:expenseList) {
			expenseMap.put(ae.getExpenseName(), ae);
		}
		
		CropInputs cropInputs=cropInputsDao.getCropInputsById(cropId);
		Class<?> clazz=cropInputs.getClass();
		Field[] fields=clazz.getDeclaredFields();
		
		CropExpense cropExpense=new CropExpense();
		cropExpense.setCropId(cropInputs.getCropId());
 
		Double totalValue=0.0;
		
		try {
		for(Field fd:fields) {
			fd.setAccessible(true);
			String fname=fd.getName();
			if(fname.equalsIgnoreCase("cropId"))
				continue;
			AgroExpense ae=expenseMap.get(fname);
			if(ae!=null) {
				String val=fd.get(cropInputs).toString();
				Double perAcre=ae.getRatePerUnit()*Double.parseDouble(val);
				totalValue=totalValue+perAcre;
				if(fname.equalsIgnoreCase("waterGallon"))
					cropExpense.setWaterGallon(perAcre);
				else if(fname.equalsIgnoreCase("fertilizer"))
					cropExpense.setFertilizer(perAcre);
				else if(fname.equalsIgnoreCase("pesticides"))
					cropExpense.setPesticides(perAcre);
				else if(fname.equalsIgnoreCase("tractorHour"))
					cropExpense.setTractorHour(perAcre);
				else if(fname.equalsIgnoreCase("agroTools"))
					cropExpense.setAgrotools(perAcre);
			}// end of if
		}// end of  loop
		}catch(Exception ex) {}
		Crop crop= cropDao.getCropById(cropId);
		Farm farm=farmDao.getFarmById(crop.getFarmId());
		FarmCropReport fcrepo=new FarmCropReport(farm,crop,cropInputs,cropExpense,totalValue);
		return fcrepo;
	}
 
	

}
