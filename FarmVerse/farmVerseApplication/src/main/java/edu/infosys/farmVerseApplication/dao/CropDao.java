package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import edu.infosys.farmVerseApplication.bean.Crop;

public interface CropDao {

	public void addCrop(Crop crop);
	public Crop getCropById(String id);
	public List<Crop> getCropsByUsername(String username);
	public void deleteCropById(String id);
	public Integer getMaxCropId();
}