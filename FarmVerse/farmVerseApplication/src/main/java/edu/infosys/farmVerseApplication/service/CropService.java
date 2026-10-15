package edu.infosys.farmVerseApplication.service;
import edu.infosys.farmVerseApplication.service.FarmUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.bean.FarmCrop;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.FarmDao;

@Service
public class CropService {
	@Autowired
	private CropDao cropDao;
	@Autowired
	private FarmUserService service;
	
	@Autowired
	private FarmDao farmDao;
	
	@Autowired
	private CropExcelAuditService excelAuditService;

	public void archiveCropToExcel(Crop crop) {
		Farm farm = null;
		if (crop.getFarmId() != null) {
			try {
				farm = farmDao.getFarmById(crop.getFarmId());
			} catch (Exception ignored) {}
		}
		excelAuditService.appendCropRecord(crop, farm);
	}
	
	public String generateCropId()
	{
		Integer value=cropDao.getMaxCropId();
		if(value==null)
			value=500001;
		else
			value=value+1;
		
		String newId="C"+value;
		return newId;
	}
	public Crop setUsername(Crop crop)
	{
		String username=service.getUserId();
		crop.setUsername(username);
		return crop;
	}
	public FarmCrop setFarmCrop(Crop crop) {
		Farm farm=farmDao.getFarmById(crop.getFarmId());
		return new FarmCrop(farm,crop);
		
	}

	public void validateCropArea(Crop crop) {
		if (crop.getFarmId() == null) {
			throw new org.springframework.web.server.ResponseStatusException(
				org.springframework.http.HttpStatus.BAD_REQUEST, "Farm ID is required");
		}
		Farm farm = farmDao.getFarmById(crop.getFarmId());
		if (farm == null) {
			throw new org.springframework.web.server.ResponseStatusException(
				org.springframework.http.HttpStatus.BAD_REQUEST, "Farm not found with ID: " + crop.getFarmId());
		}
		Double farmArea = (farm.getArea() != null) ? farm.getArea() : 0.0;
		
		String username = service.getUserId();
		java.util.List<Crop> userCrops = cropDao.getCropsByUsername(username);
		double existingAllocatedArea = 0.0;
		if (userCrops != null) {
			for (Crop c : userCrops) {
				if (c.getFarmId() != null && c.getFarmId().equals(crop.getFarmId())) {
					// If updating the same crop, don't count its own existing area
					if (crop.getCropId() != null && crop.getCropId().equals(c.getCropId())) {
						continue;
					}
					if (c.getCropArea() != null) {
						existingAllocatedArea += c.getCropArea();
					}
				}
			}
		}
		
		double newCropArea = (crop.getCropArea() != null) ? crop.getCropArea() : 0.0;
		double remainingArea = farmArea - existingAllocatedArea;
		remainingArea = Math.round(remainingArea * 100.0) / 100.0;
		
		if (newCropArea > remainingArea) {
			throw new org.springframework.web.server.ResponseStatusException(
				org.springframework.http.HttpStatus.BAD_REQUEST,
				String.format("Cultivated area (%.2f Acres) exceeds available farm capacity (%.2f Acres remaining out of %.2f Acres for Plot #%d)!",
					newCropArea, Math.max(0.0, remainingArea), farmArea, crop.getFarmId())
			);
		}
	}
}
	
	


