package edu.infosys.farmVerseApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.dao.FarmDao;
import edu.infosys.farmVerseApplication.service.FarmService;
import edu.infosys.farmVerseApplication.service.FarmUserService;

@RestController
@RequestMapping("/farmverse/")
@CrossOrigin(origins = "http://localhost:3636", allowCredentials = "true")
public class FarmController {
	
	@Autowired
	private FarmDao farmDao;
	
	@Autowired
	private FarmService service;
	
	@Autowired
	private FarmUserService userService;
	
	@PostMapping("/farm")
	public void addFarm(@RequestBody Farm farm) {
		// TODO Auto-generated method stub
		String username=userService.getUserId();
		farm.setUsername(username);
		farmDao.addFarm(farm);
	}
		
		@PutMapping("/farm")
		public void updateFarm(@RequestBody Farm farm) {
			farmDao.addFarm(farm);
		}
		

	

	@GetMapping(("/farm/{id}"))
	public Farm getFarmById(@PathVariable Long id) {
		// TODO Auto-generated method stub
		
		return farmDao.getFarmById(id);
	}

	@GetMapping("/farm")
	public List<Farm> getFarmsByUsername() {
		String username=userService.getUserId();
		return farmDao.getFarmsByUsername(username);
 
	}

	@DeleteMapping("/farm/{id}")
	public void deleteFarmById(@PathVariable Long id) {
		// TODO Auto-generated method stub
		farmDao.deleteFarmById(id);

	}
	@GetMapping("/farm-id")
	public Long generateFarmId() {
		
		return service.generateFarmId();
	}
	@GetMapping("/farm-no")
	
		public List<Long> getAllFarmIdsByUser()
		{
			return service.getAllFarmIdsByUser();
		}
	


	
	
}
