package edu.infosys.farmVerseApplication.dao;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.Farm;
@Repository
@Service
public class CropDaoImpl implements CropDao {

		@Autowired
		private CropRepository repository;

		@Override
		public void addCrop(Crop crop) {
			
			repository.save(crop);

		}

		@Override
		public Crop getCropById(String id) {
			
			
			return repository.findById(id).get();
		}
		@Override

		public List<Crop> getCropsByUsername(String username) {
		
		
			
			return repository.getCropsByUsername(username);
		}

		@Override
		public void deleteCropById(String id) {
			
			repository.deleteById(id);

		}

		@Override
		public Integer getMaxCropId() {
			
			return repository.getMaxCropId();
		}

		

	}



