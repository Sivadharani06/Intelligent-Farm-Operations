package edu.infosys.farmVerseApplication.dao;
import edu.infosys.farmVerseApplication.bean.FarmUser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
 

public interface FarmUserRepository extends JpaRepository<FarmUser,String> {
	
	
	

}
