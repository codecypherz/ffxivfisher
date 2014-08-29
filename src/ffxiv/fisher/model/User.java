package ffxiv.fisher.model;

public class User {

	private String name;
	private String email;
	private boolean signedIn;
	private boolean admin;
	
	public User() {
		this(null, null, false, false);
	}
	
	public User(String name, String email, boolean signedIn, boolean admin) {
		this.name = name;
		this.email = email;
		this.signedIn = signedIn;
		this.admin = admin;
	}
	
	public String getName() {
		return name;
	}
	
	public String getEmail() {
		return email;
	}
	
	public boolean isSignedIn() {
		return signedIn;
	}
	
	public boolean isAdmin() {
		return admin;
	}
}
