package edu.infosys.farmVerseApplication.bean;


import java.util.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class FarmUser extends User {
	@Id
	private String username;
	private String password;
	private String personalName;
	private String email;
	
	public FarmUser() {
		super("abc","pqr",new ArrayList<>());
	}
	public FarmUser(String username, String password, Collection<? extends GrantedAuthority> authorities,
			String username2, String personalName2,String email2, String password2) {
		super(username, password, authorities);
		this.username = username2;
		this.password = password2;
		this.personalName = personalName2;
		this.email = email2;
		
	}
 
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPersonalName() {
		return personalName;
	}
	public void setPersonalName(String personalName) {
		this.personalName = personalName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
    
}
