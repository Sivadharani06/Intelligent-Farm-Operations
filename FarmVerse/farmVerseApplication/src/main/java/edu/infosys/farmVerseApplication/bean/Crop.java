package edu.infosys.farmVerseApplication.bean;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Crop {
	@Id
	private String cropId;
	private  Long farmId;
	private String username;
	private String cropName;
	private Double cropArea;
	private String sownMonthYear;
	private String harvestMonthYear;
	private Double yield;
	@Column(columnDefinition = "TEXT")
	private String comments;
	public Crop() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

	public Crop(String cropId, Long farmId, String username, String cropName, Double cropArea, String sownMonthYear,
			String harvestMonthYear, Double yield, String comments) {
		super();
		this.cropId = cropId;
		this.farmId = farmId;
		this.username = username;
		this.cropName = cropName;
		this.cropArea = cropArea;
		this.sownMonthYear = sownMonthYear;
		this.harvestMonthYear = harvestMonthYear;
		this.yield = yield;
		this.comments = comments;
	}



	public String getCropId() {
		return cropId;
	}

	public void setCropId(String cropId) {
		this.cropId = cropId;
	}

	public Long getFarmId() {
		return farmId;
	}

	public void setFarmId(Long farmId) {
		this.farmId = farmId;
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



	public String getUsername() {
		return username;
	}



	public void setUsername(String username) {
		this.username = username;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}
	
	
}
