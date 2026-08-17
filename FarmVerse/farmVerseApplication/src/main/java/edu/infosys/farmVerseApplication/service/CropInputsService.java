package edu.infosys.farmVerseApplication.service;


import org.springframework.beans.factory.annotation.Autowired;

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.CropInputs;
import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import edu.infosys.farmVerseApplication.dao.AgroExpenseDao;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.CropInputsDao;
import edu.infosys.farmVerseApplication.dao.FarmDao;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.lang.reflect.Field;

import edu.infosys.farmVerseApplication.bean.AgroExpense;

@Service
@Transactional
public class CropInputsService {

	@Autowired
	private CropDao cropDao;
	@Autowired
	private FarmUserService farmUserService;
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
	
	public Double expenseCalculation(String cropId) {
		List<AgroExpense> expenseList=agroExpDao.getAllAgroExpenses();
		Map<String,AgroExpense> expenseMap=new HashMap<String, AgroExpense>();
		for(AgroExpense ae:expenseList) {
			expenseMap.put(ae.getExpenseName(), ae);
		}
		CropInputs cropInputs=cropInputsDao.getCropInputsById(cropId);
		
		Class<?> clazz=cropInputs.getClass();
		Field[] fields=clazz.getDeclaredFields();
		Double totValue=0.0;
		try {
		for(Field fd:fields) {
			fd.setAccessible(true);
			AgroExpense ae=expenseMap.get(fd.getName());
			if(ae!=null) {
				String val=fd.get(cropInputs).toString();
				Double perAcre=ae.getRatePerUnit()*Double.parseDouble(val);
				System.out.println(ae.getExpenseName()+"-"+ae.getRatePerUnit()+"-"+fd.get(cropInputs)+"-"+perAcre);
				totValue=totValue+perAcre;
			}
		}
		}catch(Exception ex) {}
		System.out.println("Total Cost Per Acre:"+totValue);
		return totValue;
	}
 
	
}
