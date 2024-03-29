package controller;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import beans.Login;
import beans.Administrator;
import beans.Guest;
import beans.Host;
import beans.User;

import service.UserService;
import spark.Session;

public class UserController {
	
	private static Gson gs = new Gson();
	
	public UserController(final UserService userService) {
	
	post("/users/addGuest", (req, res) ->{ 
		
		User u = gs.fromJson(req.body(), Guest.class);
		
		return userService.Register(u);		
	});
	
	post("/users/addHost", (req, res) ->{ 		
		User u = gs.fromJson(req.body(), Host.class);		
		return userService.Register(u);		
	});
		
	get("/users/:username", (req,res) -> userService.getUser(req.params("username")));
	
	post("/users/login", (req, res) -> {
		res.type("application/json");
		User u = userService.Login(gs.fromJson(req.body(), Login.class));
		if(u != null) {
			if(!u.isBlocked()) {
				Session ss = req.session(true);
				User user = ss.attribute("user");
				if (user == null) {
					user = u;
					ss.attribute("user", user);
				}
				return gs.toJson(user);
			}
		}
		return "";
	});
	
	get("/users/log/test", (req, res) -> {
		res.type("application/json");
		Session ss = req.session(true);
		User user = ss.attribute("user");
		return gs.toJson(user);
	});
	
	get("/users/log/logout", (req, res) -> {
		res.type("application/json");
		Session ss = req.session(true);
		User user = ss.attribute("user");
		
		if (user != null) {
			ss.invalidate();
		}
		return true;
	});
	
	get("/users/apartment/cancoment/:appartmentId", (req, res) -> {
		res.type("application/json");
		Session ss = req.session(true);
		User user = ss.attribute("user");
		if(user == null || !(user instanceof Guest))
			return false;
		return userService.canUserComment((Guest)user, req.params("appartmentId"));
	});
	
	put("/users/update", (req,res)-> {
		Session ss = req.session(true);
		User user = ss.attribute("user");
		if(user instanceof Guest) {
			String a = userService.Update(gs.fromJson(req.body(), Guest.class));
			ss.attribute("user", gs.fromJson(a, Guest.class));
			return a;
		}
		else if(user instanceof Host) {
			String a =userService.Update(gs.fromJson(req.body(), Host.class));
			ss.attribute("user", gs.fromJson(a, Host.class));
			return a;
		}
		else {
			String a =userService.Update(gs.fromJson(req.body(), Administrator.class));
			ss.attribute("user", gs.fromJson(a, Administrator.class));
			return a;
		}
	});
	
	get("/users/search/parameters", (req,res) -> {
		Session ss = req.session(true);
		User user = ss.attribute("user");
		int whatToGet = -1;
		if(user instanceof Guest)
			whatToGet = 0;
		else if(user instanceof Host)
			whatToGet = 1;
		else 
			whatToGet = 2;
		return userService.searchUsers(req.queryParams("username"), req.queryParams("name"), req.queryParams("surname"), req.queryParams("userType"), req.queryParams("gender"), whatToGet, user.getUsername());
	});

	get("/users", (req,res) -> {
		
		Session ss = req.session(true);
		User user = ss.attribute("user");
		int whatToGet = -1;
		if(user instanceof Guest)
			whatToGet = 0;
		else if(user instanceof Host)
			whatToGet = 1;
		else 
			whatToGet = 2;
		return userService.GetAll(whatToGet, user.getUsername());
	});
	
	put("/users/toggleBlocked/:username", (req,res)->(userService.toggleBlockUser(req.params("username"))));
	
	
	}
}
