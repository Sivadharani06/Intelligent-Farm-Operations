package edu.infosys.farmVerseApplication.bean;

public class FarmCrop {
	
	
	
	private Long farmId;
	  private String farmName;
	  private String soil;
	  private String cropId;
	  private String cropName;
	  private Double cropArea;
	  private String sownMonthYear;
	  private String harvestMonthYear;
	  private Double yield;
	  private String comments;
	  public FarmCrop() {
		super();
		// TODO Auto-generated constructor stub
	  }
	  public FarmCrop(Long farmId, String farmName, String soil, String cropId, String cropName,
				Double cropArea, String sownMonthYear, String harvestMonthYear, Double yield, String comments) {
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
			this.comments = comments;
	  }
	  
	  
	  public FarmCrop(Farm farm,Crop crop) {
			super();
			this.farmId = crop.getFarmId();
			this.farmName = farm.getFarmName();
			this.soil = farm.getSoil();
			this.cropId = crop.getCropId();
			this.cropName = crop.getCropName();
			this.cropArea = crop.getCropArea();
			this.sownMonthYear = crop.getSownMonthYear();
			this.harvestMonthYear = crop.getHarvestMonthYear();
			this.yield = 0.0;
			this.comments="";
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
		public String getComments() {
			return comments;
		}
		public void setComments(String comments) {
			this.comments = comments;
		}
}
