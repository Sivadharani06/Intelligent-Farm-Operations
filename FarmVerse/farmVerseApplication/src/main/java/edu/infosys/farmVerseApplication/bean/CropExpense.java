package edu.infosys.farmVerseApplication.bean;

public class CropExpense {
    private String cropId;
	
	
	private Double waterGallon;
	private Double fertilizer;
	private Double pesticides;
	private Double tractorHour;
	private Double agrotools;
	
	public CropExpense() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CropExpense(String cropId, Double waterGallon, Double fertilizer, Double pesticides, Double tractorHour,
			Double agrotools) {
		super();
		this.cropId = cropId;
		this.waterGallon = waterGallon;
		this.fertilizer = fertilizer;
		this.pesticides = pesticides;
		this.tractorHour = tractorHour;
		this.agrotools = agrotools;
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

	public Double getTractorHour() {
		return tractorHour;
	}

	public void setTractorHour(Double tractorHour) {
		this.tractorHour = tractorHour;
	}

	public Double getAgrotools() {
		return agrotools;
	}

	public void setAgrotools(Double agrotools) {
		this.agrotools = agrotools;
	}
	

}
