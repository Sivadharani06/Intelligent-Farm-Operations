package edu.infosys.farmVerseApplication.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import edu.infosys.farmVerseApplication.bean.CropInputs;

public interface CropInputsRepository  extends JpaRepository<CropInputs, String> {
	
}
