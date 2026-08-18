package edu.infosys.farmVerseApplication.bean;

public class FarmCropReport {
	private Long farmId;
	  private String farmName;
	   private String soil;
	  private String cropId;
	  private String cropName;
	  private Double cropArea;
	  private String sownMonthYear;
	  private String harvestMonthYear;
	  private Double yield;
	  private Double water;
	  private Double fertilizer;
	  private Double pesticides;
	  private Double tractorHour;
	  private Double agroTools;
	  private Double waterExp;
	  private Double fertilizerExp;
	  private Double pesticidesExp;
	  private Double tractorExp;
	  private Double agroToolsExp;
	  private Double total;
	  public FarmCropReport() {
		super();
		// TODO Auto-generated constructor stub
	  }
	  public FarmCropReport(Long farmId, String farmName, String soil, String cropId, String cropName, Double cropArea,
			String sownMonthYear, String harvestMonthYear, Double yield, Double water, Double fertilizer,
			Double pesticides, Double tractorHour, Double agroTools, Double waterExp, Double fertilizerExp,
			Double pesticidesExp, Double tractorExp, Double agroToolsExp, Double total) {
		super();
		this.farmId = farmId;
		this.farmName = farmName;
		this.soil = soil;
		this.cropId = cropId;
		this.cropName = cropName;
		this.cropArea = cropArea;
		this.sownMonthYear = sownMonthYear;
		this.harvestMonthYear = harvestMonthYear;
		this.yield = yield;
		this.water = water;
		this.fertilizer = fertilizer;
		this.pesticides = pesticides;
		this.tractorHour = tractorHour;
		this.agroTools = agroTools;
		this.waterExp = waterExp;
		this.fertilizerExp = fertilizerExp;
		this.pesticidesExp = pesticidesExp;
		this.tractorExp = tractorExp;
		this.agroToolsExp = agroToolsExp;
		this.total = total;
	  }
	  
	  public FarmCropReport(Farm farm,Crop crop,CropInputs inputs,CropExpense expense,Double total) {
			super();
			this.farmId = crop.getFarmId();
			this.farmName = farm.getFarmName();
			this.soil = farm.getSoil();
			this.cropId = crop.getCropId();
			this.cropName =crop.getCropName() ;
			this.cropArea = crop.getCropArea();
			this.sownMonthYear = crop.getSownMonthYear();
			this.harvestMonthYear = crop.getHarvestMonthYear();
			this.yield =crop.getYield();
			this.water = inputs.getWaterGallon();
			this.fertilizer = inputs.getFertilizer();
			this.pesticides = inputs.getPesticides();
			this.tractorHour = inputs.getTractorHour();
			this.agroTools = inputs.getAgrotools();
			this.waterExp =expense.getWaterGallon() ;
			this.fertilizerExp = expense.getFertilizer();
			this.pesticidesExp = expense.getPesticides();
			this.tractorExp = expense.getTractorHour();
			this.agroToolsExp =expense.getAgrotools();
			this.total = total;
		  }
	  public Long getFarmId() {
		  return farmId;
	  }
	  public void setFarmId(Long farmId) {
		  this.farmId = farmId;
	  }
	  public String getFarmName() {
		  return farmName;
	  }
	  public void setFarmName(String farmName) {
		  this.farmName = farmName;
	  }
	  public String getSoil() {
		  return soil;
	  }
	  public void setSoil(String soil) {
		  this.soil = soil;
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
	  public Double getWater() {
		  return water;
	  }
	  public void setWater(Double water) {
		  this.water = water;
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
	  public Double getTractorHour() {
		  return tractorHour;
	  }
	  public void setTractorHour(Double tractorHour) {
		  this.tractorHour = tractorHour;
	  }
	  public Double getAgroTools() {
		  return agroTools;
	  }
	  public void setAgroTools(Double agroTools) {
		  this.agroTools = agroTools;
	  }
	  public Double getWaterExp() {
		  return waterExp;
	  }
	  public void setWaterExp(Double waterExp) {
		  this.waterExp = waterExp;
	  }
	  public Double getFertilizerExp() {
		  return fertilizerExp;
	  }
	  public void setFertilizerExp(Double fertilizerExp) {
		  this.fertilizerExp = fertilizerExp;
	  }
	  public Double getPesticidesExp() {
		  return pesticidesExp;
	  }
	  public void setPesticidesExp(Double pesticidesExp) {
		  this.pesticidesExp = pesticidesExp;
	  }
	  public Double getTractorExp() {
		  return tractorExp;
	  }
	  public void setTractorExp(Double tractorExp) {
		  this.tractorExp = tractorExp;
	  }
	  public Double getAgroToolsExp() {
		  return agroToolsExp;
	  }
	  public void setAgroToolsExp(Double agroToolsExp) {
		  this.agroToolsExp = agroToolsExp;
	  }
	  public Double getTotal() {
		  return total;
	  }
	  public void setTotal(Double total) {
		  this.total = total;
	  }


}
