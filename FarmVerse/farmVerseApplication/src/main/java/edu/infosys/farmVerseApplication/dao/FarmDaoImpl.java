package edu.infosys.farmVerseApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Farm;

@Repository
@Service
public class FarmDaoImpl implements FarmDao {

	@Autowired
	private FarmRepository repository;

	@Override
	public void addFarm(Farm farm) {
		repository.save(farm);
	}

	@Override
	public Farm getFarmById(Long id) {
		return repository.findById(id).get();
	}

	@Override
	public List<Farm> getFarmsByUsername(String username) {
		return repository.getFarmsByUsername(username);
	}

	@Override
	public void deleteFarmById(Long id) {
		repository.deleteById(id);
	}

	@Override
	public Long getMaxFarmId() {
		return repository.getMaxFarmId();
	}
}