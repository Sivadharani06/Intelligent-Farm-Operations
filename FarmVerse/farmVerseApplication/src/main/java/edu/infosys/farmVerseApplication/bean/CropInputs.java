package edu.infosys.farmVerseApplication.bean;

import jakarta.persistence.Id;

import jakarta.persistence.Entity;

@Entity
public class CropInputs {
	@Id
	private String cropId;
	
	private Double waterGallon;
	private Double fertilizer;
	private Double pesticides;
	private Integer tractorHour;
	private Double agrotools;
	public CropInputs() {
		super();
		// TODO Auto-generated constructor stub
	}
	public CropInputs(String cropId, Double waterGallon, Double fertilizer, Double pesticides, Integer tractorHour,
			Double agrotools) {
		super();
		this.cropId = cropId;
		this.waterGallon = waterGallon;
		this.fertilizer = fertilizer;
		this.pesticides = pesticides;
		this.tractorHour = tractorHour;
		this.agrotools = agrotools;
	}

	public CropInputs(FarmCropInputs farmCropInputs) {
		super();
		this.cropId = farmCropInputs.getCropId();
		this.waterGallon = farmCropInputs.getWaterGallon();
		this.fertilizer = farmCropInputs.getFertilizer();
		this.pesticides = farmCropInputs.getPesticides();
		this.tractorHour = farmCropInputs.getTractorHour();
	}
	public String getCropId() {
		return cropId;
	}
	public void setCropId(String cropId) {
		this.cropId = cropId;
	}
	public Double getWaterGallon() {
		return waterGallon;
	}
	public void setWaterGallon(Double waterGallon) {
		this.waterGallon = waterGallon;
	}
	public Double getFertilizer() {
		return fertilizer;
	}
	public void setFertilizer(Double fertilizer) {
		this.fertilizer = fertilizer;
	}
	public Double getPesticides() {
		return pesticides;
	}
	public void setPesticides(Double pesticides) {
		this.pesticides = pesticides;
	}
	public Integer getTractorHour() {
		return tractorHour;
	}
	public void setTractorHour(Integer tractorHour) {
		this.tractorHour = tractorHour;
	}
	public Double getAgrotools() {
		return agrotools;
	}
	public void setAgrotools(Double agrotools) {
		this.agrotools = agrotools;
	}
	
	
	
	
	

}
