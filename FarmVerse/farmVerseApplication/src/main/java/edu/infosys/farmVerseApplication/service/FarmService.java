package edu.infosys.farmVerseApplication.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.dao.FarmDao;

@Service
public class FarmService {
	@Autowired
	private FarmDao farmDao;
	@Autowired
	private FarmUserService userService;
	
	public Long generateFarmId() {
		Long value=farmDao.getMaxFarmId();
		 if(value==null)
			 value=10001L;
		 else
			 value=value+1;
		
		 return value;
	}
	public List<Long> getAllFarmIdsByUser(){
		List<Farm> farmList=farmDao.getFarmsByUsername(userService.getUserId());
		List<Long> idList=new ArrayList<Long>();
		for(Farm farm:farmList) {
			idList.add(farm.getFarmId());
		}
		return idList;
	}
	

}
