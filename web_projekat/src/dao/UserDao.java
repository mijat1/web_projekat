package dao;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Administrator;
import beans.Apartment;
import beans.Gender;
import beans.Guest;
import beans.Host;
import beans.ReStatus;
import beans.Reservation;
import beans.User;
import beans.TypeOfUser;
import adapterdao.RuntimeTypeAdapterFactory;

public class UserDao {

	private final String path = "./data/users.json";
	private static Gson g;

	public UserDao() {
		RuntimeTypeAdapterFactory<User> userAdapterFactory = RuntimeTypeAdapterFactory.of(User.class)
				        .registerSubtype(Guest.class)
				        .registerSubtype(Administrator.class)
				        .registerSubtype(Host.class);
		g = new GsonBuilder()
				     .registerTypeAdapterFactory(userAdapterFactory)
			         .create();
	}
	
	public List<User> GetAll() throws JsonSyntaxException, IOException{		
		return g.fromJson((Files.readAllLines(Paths.get(path),Charset.defaultCharset()).size() == 0) ? "" : Files.readAllLines(Paths.get(path),Charset.defaultCharset()).get(0), new TypeToken<List<User>>(){}.getType());
	}
	

	public User AddUser(User user) throws JsonSyntaxException, IOException {
		ArrayList<User> users = (ArrayList<User>) GetAll();
		if(users == null) {
			users = new ArrayList<User>();
		}
		users.add(user);
		SaveAll(users);
		return user;
	}
	
	public void SaveAll(Collection<User> users) throws JsonIOException, IOException{
		PrintWriter out = new PrintWriter(path);
		String str = g.toJson(users, new TypeToken<List<User>>(){}.getType());
		out.println(str);
		out.close();
	}



	public User Login(String username,String password) throws JsonSyntaxException, IOException {
		for(User user : GetAll()) {
			if(user.getUsername().equals(username) && user.getPassword().equals(password)) {
				return user;
			}
		}
		return null;
	}
	
	public User Update(User user) throws JsonSyntaxException, IOException {
		ArrayList<User> users = (ArrayList<User>) GetAll();
		for(User u : users) {
			if(u.getUsername().equals(user.getUsername())) {
				users.set(users.indexOf(u),user);
				break;
			}
		}
		SaveAll(users);
		return user;
	}
	
	public User get(String username) throws JsonSyntaxException, IOException {
		ArrayList<User> users = (ArrayList<User>) GetAll();
		if(users != null) {
			for(User u : users) {
				if(u.getUsername().equals(username)) {
					return u;
				}
			}
		}
		
		return null;
	}
	
	public void changeReservationStatus(String id, ReStatus status) throws JsonIOException, IOException {
		ArrayList<User> users = (ArrayList<User>) GetAll();
		boolean changed = false;

		for(User u : users) {
			if(u.getUserType() == TypeOfUser.Guest) {
				for(Reservation r : ((Guest)u).getReservations()) {
					if(r.getId() == Integer.parseInt(id)) {
						r.setStatus(status);
						changed = true;
						break;
					}
				}
			}
			if(changed)
				break;
		}
		SaveAll(users);
	}
	
	public List<User> GetAllByUserType(int whatToGet, String username) throws JsonSyntaxException, IOException{		
		ArrayList<User> users = (ArrayList<User>) GetAll();
		List<User> retVal = new ArrayList<User>();
		for(User u : users) {
			if(whatToGet == 1) {
				if(u instanceof Guest) {
					for(Reservation r : ((Guest)u).getReservations()) {
						if(r.getAppartment().getHost().getUsername().equals(username)) {
							if(!u.isBlocked())
								retVal.add(u);
							break;
						}
					}
				}
			}else {
				retVal.add(u);
			}
		}
	
		return retVal;
	}
	
	public boolean canUserComment(Guest user, String appartmentId) {
		if(user != null) {
			for (Reservation r : user.getReservations()) {
				if(r.getAppartment().getId() == Integer.parseInt(appartmentId) && (r.getStatus() == ReStatus.done || r.getStatus() == ReStatus.rejected)) {
					return true;
				}
			}
		}
		return false;
	}
	
	public boolean toggleBlockUser(String username) throws JsonIOException, IOException {
		ArrayList<User> users = (ArrayList<User>) GetAll();
		for(User u : users) {
			if(u.getUsername().equals(username)){
				if(u.isBlocked())
					u.setBlocked(false);
				else
					u.setBlocked(true);
				break;
			}
		}
		SaveAll(users);
		
		return true;
	}
	
	public List<User> searchUsers(String username, String name, String surname, String userType, String pol,int whatToGet, String usernameF) throws JsonSyntaxException, IOException{
		Gender gender = Gender.male;
		if(pol.equals("female"))
			gender = Gender.female;
		
		TypeOfUser tip = TypeOfUser.Guest;
		if(userType.equals("Guest"))
			tip = TypeOfUser.Guest;
		else if(userType.equals("Host"))
			tip = TypeOfUser.Host;
		else if(userType.equals("Administrator"))
			tip = TypeOfUser.Administrator;
		
		ArrayList<User> list = (ArrayList<User>) GetAllByUserType(whatToGet, usernameF);
		List<User> retVal = new ArrayList<User>();

		for(User user : list) {
			if(((!username.isEmpty()) ? user.getUsername().equals(username) : true) && ((!name.isEmpty()) ? user.getName().equals(name) : true) 
				&& ((!surname.isEmpty()) ? user.getSurname().equals(surname) : true) && ((!userType.isEmpty()) ? tip == user.getUserType() : true) && ((!pol.isEmpty()) ? gender == user.getGender() : true)) {
					retVal.add(user);
			}
		}		
		return retVal;

	}
}
