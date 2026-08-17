package edu.infosys.farmVerseApplication.service;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
 
import edu.infosys.farmVerseApplication.bean.FarmUser;
import edu.infosys.farmVerseApplication.dao.FarmUserRepository;
 
 @Service
public class FarmUserService implements UserDetailsService {
	 @Autowired
		private FarmUserRepository repository;
		
		
		private FarmUser user;
		private String userId;
		
		public FarmUser getUser() {
			return user;
		}
		
		public String getUserId() {
			return userId;
		}
		// To save a new user in database
		public void saveUser(FarmUser user) {
			repository.save(user);
		}
		
		// Validate an existing user
			@Override
		public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
			this.user=repository.findById(username).get();
			this.userId=user.getUsername();
			
			return this.user;
		}
	 

}
