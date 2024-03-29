Vue.component("apartment-details", {
	data: function () {
	    return {
	    	disabledDates : {},
	        apartment:{},
	        picture:'',
	        comment:'',
	        userType:'',
	        dateFrom : '',
	        dateTo : '',
	        grade:'',
	        error:'',
	        adress: {},
	        comments:[],
	        user:null,
	        commentError:'',
	        selectedComment:{},
	        canReserve:null,
	        canUserComment:false,
	        isActive:null
	    }
	},
	template: ` 
<div>

<div class="row">
  <div class="column" >
			
			
			<div class="containerG" ref="container">
				<a target="_blank" :href="picture">
						<img ref="expandedImg" :src="picture" style="width:80%"/>
			  	</a>
			</div>
			
			<div class="rowS">
					<div v-for="p in apartment.pictures" class="columnS">
							<img :src="p" alt="Slika apartmana" style="width:80%" v-on:click="myFunction(p)"/>
					</div>
			</div>
		</div>	
	<div class="column" >	
			<h2>Opis apartmana:</h2>
			<table id="apartmanInfo">
				<tr>
					<td>Tip: </td>
					<td class="infotext">{{(apartment.type == 'apartment') ? "Apartman" : "Soba"}}</td>
				</tr>
				<tr>
					<td>Broj soba: </td>
					<td class="infotext">{{apartment.numberOfRoom}}</td>
				</tr>
				<tr>
					<td>Maksimalan broj gostiju: </td>
					<td class="infotext">{{apartment.numberOfGuest}}</td>
				</tr>
				<tr>
					<td>Adresa: </td>
					<td class="infotext">{{adress.street + ' ' + adress.streetNumber + ', ' + adress.postNumber + ' ' + adress.city}}</td>
				</tr>
				<tr>
					<td>Cena za jednu noć: </td>
					<td class="infotext">{{apartment.priceForNight + ' dinara'}}</td>
				</tr>
				<tr>
					<td>Vreme ulaska u apartman: </td>
					<td class="infotext">{{apartment.checkInTime}}</td>
				</tr>
				<tr>
					<td>Vreme izlaska iz apartmana: </td>
					<td class="infotext">{{apartment.checkOutTime}}</td>
				</tr>			
		
		<h3>Sadržaji apartmana:</h3>
		<table>
		<tr v-for="a in apartment.amenities">
			<td>{{a.name}}</td>
		</tr>
		</table>
</div>
</div>
<div class="row">
<div class="column" >
		<table>
				<tr v-bind:hidden="userType != 'HOST'"><td colspan="2">Dodavanje perioda za izdavanje: </td></tr>
				</br>
				<tr v-bind:hidden="userType != 'HOST'">
					<td>Datum od: <vuejs-datepicker :disabled-dates="disabledDates" v-model="dateFrom"></vuejs-datepicker></td>
					<td>Datum do: <vuejs-datepicker :disabled-dates="disabledDates" v-model="dateTo"></vuejs-datepicker></td>
				</tr>
				<tr v-bind:hidden="userType != 'HOST'">
					<td colspan="2"><button class="buttonSave" v-on:click="addPeriod">Dodaj</button><br/></td>
				</tr>
				<tr v-bind:hidden="userType != 'GUEST'">
					<td colspan="2"><button class="buttonSave" v-on:click="rezervisiClick">Rezerviši</button><br/></td>
				</tr>
				</br>
				<tr v-bind:hidden="userType != 'HOST' && userType != 'ADMIN'"><td colspan="2" >Upravljanje apartmanom: </td></tr>
				<tr v-bind:hidden="userType != 'HOST' && userType != 'ADMIN'">
					<td><button class="buttonSave" v-on:click="izmeniClick">Izmeni</button><br/></td>
					<td><button class="buttonSave" v-on:click="deleteClick">Izbriši</button><br/></td>
					<td v-bind:hidden="isActive === 'active'" colspan="2"><button class="buttonSave" v-on:click="activate">Aktiviraj</button><br/></td>
					<td v-bind:hidden="isActive === 'inactive'" colspan="2"><button class="buttonSave" v-on:click="deactivate">Deaktiviraj</button><br/></td>
				</tr>
				
				
				<tr>
					<p style="color: red" >{{error}}</p>
				</tr>
			</table>	
</div>	
	<div class="column" >		
<table class="komentari" v-bind:hidden="comments.length == 0">
		<h3>Komentari: </h3>
		<tr>
		<td v-bind:hidden="userType != 'HOST'">
				<button class="buttonSave" v-on:click="disableComment()">Skini komentar</button>
				<button class="buttonSave" v-on:click="enableComment()">Prikazi komentar</button>
		</td>
		</tr>
		<tr v-for="c in apartment.comments" v-if="c.visibleForGuest || (userType == 'HOST' || userType == 'ADMIN')" v-on:click="selectComment(c)" v-bind:class="{selected : selectedComment.id===c.id}">
			<td class="apartview" style="width:100%">
				<table>
					<tr><td style="color:rgb(102, 153, 153)">{{"Ocena: " + c.grade}}</td><td v-bind:hidden="userType != 'HOST'">{{(c.visibleForGuest) ? 'Vidljiv' : 'Nevidljiv'}}</td</tr>
					<tr><td style="color:rgb(102, 153, 153)">{{"Ocenio: " + c.guest.name + ' ' + c.guest.surname}}</td></tr>
					<tr><td >{{c.text}}</td></tr>
				</table>
			</td>	
		</tr>
</table>

<table class="komentari" v-bind:hidden="!canUserComment">
		<tr>
			<td>Ocena:
				<select class="select" name="grade" style="width:100px" v-model="grade">
						<option class="option" value=""></option>
						<option class="option" value="I">1</option>
						<option class="option" value="II">2</option>
						<option class="option" value="III">3</option>
						<option class="option" value="IV">4</option>
						<option class="option" value="V">5</option>
				</select>
			</td>
		</tr>
		<tr>
			<td colspan="2"><textarea class="inputComment"  name="comment" placeholder="Unesite komentar" cols="70" rows="10" v-model="comment"></textarea></td>
		</tr>
		<tr>
			<td><button class="buttonSave" v-on:click="commentClick">Dodaj komentar</button><br/></td>
		</tr>
		<tr>
			<td colspan="2"><p style="color: red" >{{commentError}}</p></td>		
		</tr>
		
</table>
</div>
</div>
</div>		  
`, components : { 
		vuejsDatepicker
	},
	mounted () {
		axios
		.get('/apartment/' + this.$route.query.id)
		.then(response => {
			this.apartment = response.data; 
			this.adress = this.apartment.location.adress; 
			this.comments = this.apartment.comments; 
			this.picture = this.apartment.pictures[0]; 
			this.isActive= this.apartment.status;
			let ranges = [];

			for(let d of this.apartment.dateForRenting){
				ranges.push({from : new Date(d.dateFrom), to : new Date(d.dateTo)});
			}
			
			this.disabledDates["ranges"] = ranges;
			this.disabledDates["to"] = new Date();

		});
		
		axios
		.get('/users/apartment/cancoment/' + this.$route.query.id)
		.then(response => {
			if(response.data === true)
				this.canUserComment = true;
			else
				this.canUserComment = false;
		});
		
		axios
        .get('/users/log/test')
        .then(response => {
        	if(response.data == null){
        		this.canReserve=false;
        		this.userType = 'USER';
        	}
        	else{
        		this.user = response.data;
        		if(response.data.typeOfUser == "Guest"){
        			this.canReserve=true;
            		this.userType = 'GUEST';
        		}
        		else if(response.data.typeOfUser == "Host"){
        			this.canReserve=false;
            		this.userType = 'HOST';
        		}else{
        			this.canReserve = false;
            		this.userType = 'ADMIN';
        		}
        	}
        })
	},
	methods : {
		myFunction : function(imgs) {
				this.picture = imgs;
				this.$refs.expandedImg.style.display = "block";
		},
		clickSpan : function(){
			this.$refs.container.style.display='none';
		},
		rezervisiClick : function(){
			if(this.canReserve)
				window.location.href = "#/reservation?id=" + this.$route.query.id;
			else
				toast("Samo Gosti mogu rezervisati termine!");
		},
		izmeniClick: function(){
        	window.location.href = "#/editApartment?id=" + this.$route.query.id;
		},
		deleteClick: function(){
			axios
    		.delete("/apartment/" + this.$route.query.id)
    		.then(response => {
    			window.location.href= "/";
    		});
		},
		activate:function(){
			this.apartment.status='active';
			this.isActive='active'
				axios
	    		.post("/apartment/edit", this.apartment)
	    		.then(response => toast("Sadrzaj uspešno snimljen."));
		},
		deactivate:function(){
			this.apartment.status='inactive';
			this.isActive='inactive'
			
				axios
	    		.post("/apartment/edit", this.apartment)
	    		.then(response => toast("Sadrzaj uspešno snimljen."));
		},
		selectComment : function(c){
			this.selectedComment = c;
		},
		addPeriod: function(){
			this.error = '';
			if(this.dateFrom != '' && this.dateTo != ''){
				if(this.dateFrom.getTime() <= this.dateTo.getTime()){
					let datumOd = (new Date(this.dateFrom.getFullYear(),this.dateFrom.getMonth() , this.dateFrom.getDate())).getTime();
					let datumDo = (new Date(this.dateTo.getFullYear(),this.dateTo.getMonth() , this.dateTo.getDate())).getTime();
					let pom = datumOd;
					let eror = false;
					let datumi = [];
					while(pom <= datumDo){
					
						
						
						datumi.push(pom);
						pom= pom + 24*60*60*1000;
					}
					if(eror === true)
					{
						this.error = 'Unet period nije validan!';
					}else
					{
						this.apartment.dateForRenting.push({ dateFrom: datumOd , dateTo: datumDo });
						for(let a of datumi)
							this.apartment.freeDateForRenting.push(a);
						axios
			    		.post("/apartment/edit", this.apartment)
			    		.then(response => toast("Period je uspesno dodat!"));
					}
				}else{
					toast('Datum od mora biti manja od datuma do!');
				}
			}else{
				toast('Datum od i datum do se moraju uneti!');
			}
		},	
		commentClick : function(){
			this.commentError = '';
			if(this.grade == '')
				this.commentError = 'Ocena se mora uneti!';
			else if(this.comment == '')
				this.commentError = 'Komentar se mora uneti!';
			else{
				let komentar = { id:0 , guest : this.user, forApartment : this.apartment, text: this.comment, grade : this.grade, visibleForGuest : false};
				
				axios
				.post('/apartment/comment', komentar)
				.then(response =>{
					toast('Uspesno dodat komentar! Bice prikazan kada ga domacin odobri!');
					this.grade = '';
					this.comment = '';
				});
			}

		},
		disableComment : function(){
			if(this.selectedComment){
				if(this.selectedComment.visibleForGuest || this.selectedComment.visibleForGuest === undefined){
					axios
					.put('/apartment/comment/toggle/' + this.selectedComment.id)
					.then(response => {
						this.selectedComment.visibleForGuest = false;
					});
				}
			}
		},
		enableComment : function(){
			if(this.selectedComment){
				if(!this.selectedComment.visibleForGuest || this.selectedComment.visibleForGuest === undefined){
					axios
					.put('/apartment/comment/toggle/' + this.selectedComment.id)
					.then(response => {
						this.selectedComment.visibleForGuest = true;
					});
				}
			}
		}
	}
});