package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import edu.infosys.farmVerseApplication.bean.CropInputs;

public interface CropInputsDao {
	public void addCropInputs(CropInputs cropInputs);
	public CropInputs getCropInputsById(String cropId);
	public void deleteCropInputsById(String cropId);
}
