package edu.infosys.farmVerseApplication.bean;

public class FarmCropInputs {
	private String cropId;
	  private String cropName;
	  private Double cropArea;
	  private String soil;
	  private String sownMonthYear;
	  private String harvestMonthYear;
	  private Double yield;
	  private Double waterGallon;
	  private Double fertilizer;
	  private Double pesticides;
	  private Integer tractorHour;
	  
	  
	  
	  
	  public FarmCropInputs() {
		super();
		// TODO Auto-generated constructor stub
	}
	  public FarmCropInputs(String cropId, String cropName, Double cropArea, String soil, String sownMonthYear,
			String harvestMonthYear, Double yield, Double waterGallon, Double fertilizer, Double pesticides,
			Integer tractorHour) {
		super();
		this.cropId = cropId;
		this.cropName = cropName;
		this.cropArea = cropArea;
		this.soil = soil;
		this.sownMonthYear = sownMonthYear;
		this.harvestMonthYear = harvestMonthYear;
		this.yield = yield;
		this.waterGallon = waterGallon;
		this.fertilizer = fertilizer;
		this.pesticides = pesticides;
		this.tractorHour = tractorHour;
	  }
	  
	  public FarmCropInputs(Crop crop,String soil) {
			super();
			this.cropId = crop.getCropId();
			this.cropName = crop.getCropName();
			this.cropArea = crop.getCropArea();
			this.soil = soil;
			this.sownMonthYear = crop.getSownMonthYear();
			this.harvestMonthYear = crop.getHarvestMonthYear();
			this.yield = crop.getYield();
			this.waterGallon = 0.0;
			this.fertilizer = 0.0;
			this.pesticides = 0.0;
			this.tractorHour = 0;
		  }
	  public String getCropId() {
		  return cropId;
	  }
	  public void setCropId(String cropId) {
		  this.cropId = cropId;
	  }
	  public String getCropName() {
		  return cropName;
	  }
	  public void setCropName(String cropName) {
		  this.cropName = cropName;
	  }
	  public Double getCropArea() {
		  return cropArea;
	  }
	  public void setCropArea(Double cropArea) {
		  this.cropArea = cropArea;
	  }
	  public String getSoil() {
		  return soil;
	  }
	  public void setSoil(String soil) {
		  this.soil = soil;
	  }
	  public String getSownMonthYear() {
		  return sownMonthYear;
	  }
	  public void setSownMonthYear(String sownMonthYear) {
		  this.sownMonthYear = sownMonthYear;
	  }
	  public String getHarvestMonthYear() {
		  return harvestMonthYear;
	  }
	  public void setHarvestMonthYear(String harvestMonthYear) {
		  this.harvestMonthYear = harvestMonthYear;
	  }
	  public Double getYield() {
		  return yield;
	  }
	  public void setYield(Double yield) {
		  this.yield = yield;
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

}
