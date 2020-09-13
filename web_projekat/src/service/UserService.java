package service;
import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import adapterdao.RuntimeTypeAdapterFactory;
import beans.Login;
import beans.Administrator;
import beans.Guest;
import beans.Host;
import beans.User;
import dao.UserDao;

public class UserService {
	
	private UserDao userdao;
	private static Gson g = new Gson();
	
	public UserService(UserDao userDao) {
		this.userdao = userDao;
	}
	public User Login(Login data) {		
		try {
			return userdao.Login(data.getUsername(),data.getPassword());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;

	}
	
	public String Register(User user) throws JsonSyntaxException, IOException {
		try {
			userdao.AddUser(user);
		}  catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return g.toJson(user);		
	}
	
	public String getUser(String username) {
		try {
			return g.toJson(userdao.get(username));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return g.toJson(null);
	}
}