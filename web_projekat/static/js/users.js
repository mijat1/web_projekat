Vue.component("users", {
	data: function () {
		    return {
		        users: [],
		        searchedUsers:[],
		        showSearched:false,
		        selectedUser:{},
		        user : {},
		        searchName:'',
		        searchSurname:'',
		        searchUsername:'',
		        userType:'',
		        gender:'',
		    }
	},
	template: ` 
<div id="korisnici">
<h2 v-bind:hidden="user!='HOST'">Pretraga gostiju</h2>
<h2 v-bind:hidden="user!='ADMIN'">Pretraga korisnika</h2>
<table>
			<tr>
				<td><input class="input" placeholder="Unesite korisnicko ime" type="text" v-model="searchUsername" name="username"/></td>
				<td><input class="input" placeholder="Unesite ime" type="text" v-model="searchName" name="name"/></td>
				<td><input class="input" placeholder="Unesite prezime" type="text" v-model="searchSurname" name="surname"/></td>
				<td v-bind:hidden="user == 'HOST'">
					<select class="select" name="userType" v-model="userType">
						<option class="option" value=""></option>
						<option class="option" value="Guest">Gost</option>
						<option class="option" value="Host">Domacin</option>
						<option class="option" value="Administrator">Administrator</option>
					</select>
				</td>
				<td>
					<select class="select" name="gender" v-model="gender">
						<option class="option" value=""></option>
						<option class="option" value="male">Muski</option>
						<option class="option" value="female">Zenski</option>
					</select>
				</td>
			</tr>
			<tr>
				<td><button class="button" v-on:click="ponistipretragu">Ponisti</button></td>
				<td><button class="button" v-on:click="searchUser">Pretrazi</button></td>		
			</tr>
</table>

<h2 v-bind:hidden="user !='HOST'">Gosti</h2>
<h2 v-bind:hidden="user !='ADMIN'">Korisnici</h2>
<table class="users">
		<tr>
			<th>Korisnicko ime</th>
			<th>Ime</th>
			<th>Prezime</th>
			<th>Pol</th>
			<th>Uloga</th>
			<th v-bind:hidden="user != 'ADMIN'">Status</th>
		</tr>
		
		<tr v-bind:hidden="showSearched" v-for="u in users" v-on:click="selectUser(u)" v-bind:class="{selected : selectedUser.username===u.username}">
			<td>{{u.username }}</td>
			<td>{{u.name }}</td>
			<td>{{u.surname }}</td>
			<td>{{(u.gender == 'male') ? 'muski' : 'zenski' }}</td>
			<td v-if="u.userType == 'Guest'">Gost</td>
			<td v-else-if="u.userType == 'Administrator'">Administrator</td>
			<td v-else>Domacin</td>
			<td v-bind:hidden="user != 'ADMIN'">{{(u.isBlocked) ? "Blokiran" : "Neblokiran"}}</td>
		</tr>
		<tr v-bind:hidden="!showSearched" v-for="u in searchedUsers" v-on:click="selectUser(u)" v-bind:class="{selected : selectedUser.username===u.username}">
			<td>{{u.username }}</td>
			<td>{{u.name }}</td>
			<td>{{u.surname }}</td>
			<td>{{(u.gender == 'male') ? 'muski' : 'zenski' }}</td>
			<td v-if="u.userType == 'Guest'">Gost</td>
			<td v-else-if="u.userType == 'Administrator'">Administrator</td>
			<td v-else>Domacin</td>
			<td v-bind:hidden="user != 'ADMIN'">{{(u.isBlocked) ? "Blokiran" : "Neblokiran"}}</td>
		</tr>
	</table>
	
	<table>
<tr>
		<td>
			<button v-bind:hidden="user != 'ADMIN'" class="button" v-on:click="blockUser">Blokiraj korisnika</button>
		</td>
		<td>
			<button v-bind:hidden="user != 'ADMIN'" class="button" v-on:click="unblockUser">Odblokiraj korisnika</button>
		</td>
</tr>
</table>
</div>
`
	, 
	mounted () {
		axios
        .get('/users/log/test')
        .then(response => {
        	if(response.data != null){
        		if(response.data.typeOfUser == "Host")
        			this.user='HOST';
        		else 
        			this.user = 'ADMIN';
        	}
        	else{
	      		  window.location.href = "#/login";
        	}
        });
		
        axios
          .get('/users')
          .then(response => (this.users = response.data));
        
        
    },
	methods : {
		searchUser : function(){
			if(this.searchName != '' || this.searchUsername != '' || this.userType != '' || this.searchSurname != '' || this.gender != ''){
				axios
				.get('/users/search/parameters', {
				    params: {
				        username: this.searchUsername,
				        name : this.searchName,
				        surname : this.searchSurname,
				        userType : this.userType,
				        gender : this.gender
				      }
				    })
				.then(response => {
					this.searchedUsers = response.data;
					this.showSearched = true;
				});
			}else{
				this.showSearched = false;
			}
		},
		selectUser : function(user){
			this.selectedUser = user;
		},
		blockUser : function(){
			if(this.selectedUser && this.selectedUser.userType != 'ADMIN' && this.selectedUser.isBlocked == false){
				axios
				.put('/users/toggleBlocked/' + this.selectedUser.username)
				.then(response =>{
					this.selectedUser.isBlocked = true;
				});
			}
		},
		unblockUser : function(){
			if(this.selectedUser && this.selectedUser.userType != 'ADMIN' && this.selectedUser.isBlocked == true){
				axios
				.put('/users/toggleBlocked/' + this.selectedUser.username)
				.then(response =>{
					this.selectedUser.isBlocked = false;
				});
			}
		},
		onChange(event) {
			if(this.searchName != '' || this.searchUsername != '' || this.userType != '' || this.searchSurname != ''){
				axios
				.get('/users/search/parameters', {
				    params: {
				        username: this.searchUsername,
				        name : this.searchName,
				        surname : this.searchSurname,
				        userType : this.userType
				      }
				    })
				.then(response => {
					this.searchedUsers = response.data;
					this.showSearched = true;
				});
			}else{
				this.showSearched = false;
			}
        },
		ponistipretragu: function(){
			this.showSearched = false;
			this.userType = '';
			this.gender = '';
			this.searchUsername = '';
			this.searchName = '';
			this.searchSurname = '';

		}
	}
	
});

