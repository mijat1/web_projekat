package beans;

public abstract class User {

	private String username;
	private String password;
	private String name;
	private String surname;
	private Gender gender;
	private boolean isBlocked = false;
	private TypeOfUser typeOfUser;
	
	public TypeOfUser getUserType() {
		return typeOfUser;
	}

	public void setUserType(TypeOfUser userType) {
		this.typeOfUser = userType;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public boolean isBlocked() {
		return isBlocked;
	}

	public void setBlocked(boolean blocked) {
		this.isBlocked = blocked;
	}	
	
}
