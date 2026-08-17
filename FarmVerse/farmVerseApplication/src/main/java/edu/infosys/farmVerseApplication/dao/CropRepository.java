package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.farmVerseApplication.bean.Crop;

public interface CropRepository extends JpaRepository<Crop, String> {

	
	
	
	@Query(value = "SELECT MAX(SUBSTRING(crop_id, 2):: INTEGER) FROM crop", nativeQuery = true)
	public Integer getMaxCropId();
    @Query("SELECT a FROM Crop a WHERE a.username =?1")
    public List<Crop> getCropsByUsername(String username);

}