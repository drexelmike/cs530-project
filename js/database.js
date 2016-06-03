function project_philly_database()
{
	this.init = function()
	{
		this.users = [];
		this.projects = [];
		
		this.logged_in_user = null;
		
		//this.loadLocalStorage();
		this.loadDummyDatabase();
	}
	
	this.loadLocalStorage = function()
	{
		if(localStorage.getItem("projects") !== null) 
		{
			try { this.projects = JSON.parse(localStorage.getItem("projects")); }
			catch(e) { console.log(e); }
		}
		if(localStorage.getItem("users") !== null)
		{
			try { this.users = JSON.parse(localStorage.getItem("users")); }
			catch(e) { console.log(e); }
		}
	}
	
	this.saveLocalStorage = function()
	{
		//this function is broken atm
		return;
		
		localStorage.setItem("projects", JSON.stringify(this.projects));
		localStorage.setItem("users", JSON.stringify(this.users));
	}
	
	this.clearDatabase = function()
	{
		this.users = [];
		this.projects = [];
	}
	
	this.loadDummyDatabase = function()
	{
		this.clearDatabase();
		this.createDummyData();
		
		this.saveLocalStorage();
	}
	
	this.doLogin = function(username, password)
	{
		console.log("username:'" + username + "' password:'" + password + "'");
		
		this.doLogout();
		
		for(var i=0;i<this.users.length;i++)
		{
			var u = this.users[i];
			
			if(u.username == username && u.password == password)
			{
				this.logged_in_user = u;
				
				return true;
			}
		}
		
		return false;
	}
	
	this.doLogout = function()
	{
		this.logged_in_user = null;
	}
	
	this.createProject = function(name, description)
	{
		if(this.logged_in_user == null)
			return "Nobody is currently logged in";
		
		if(name == "")
			return "Name can not be empty";
		
		//name already exist?
		for(var i=0;i<this.projects.length;i++)
		{
			var p = this.projects[i];
			
			if(p.name == name)
				return "Project Name already exists";
		}
		
		{
			var np = this.createEmptyProject();
			
			np.name = name;
			np.description = description;
			np.members.push(this.logged_in_user);
			np.leader = this.logged_in_user;
			
			this.projects.push(np);
		}
		
		return np;
	}
	
	this.editProjectDetails = function(p, short_desc, desc)
	{
		p.short_description = short_desc;
		p.description = desc;
		
		this.saveLocalStorage();
	}
	
	this.createUser = function(name, email, username, password, password_again)
	{
		if(password != password_again)
			return "Passwords do not match";
		
		if(username == "")
			return "Username can not be empty";
		
		if(password == "")
			return "Password can not be empty";
		
		if(name == "")
			return "Name can not be empty";
		
		//username already exists?
		for(var i=0;i<this.users.length;i++)
		{
			var u = this.users[i];
			
			if(u.username == username)
				return "Username already exists";
		}
		
		//create user
		var nu = this.createEmptyUser();
		
		nu.name = name;
		nu.email = email;
		nu.username = username;
		nu.password = password;
		
		this.users.push(nu);
		
		this.logged_in_user = nu;
		
		return true;
	}
	
	this.editUser = function(name, description, email, phone_number)
	{
		if(this.logged_in_user == null)
		{
			console.log("editUser no logged in user");
			return;
		}
		
		var u = this.logged_in_user;
		
		u.name = name;
		u.description = description;
		u.email = email;
		u.phone_number = phone_number;
		
		this.saveLocalStorage();
	}
	
	this.createNewsItem = function(p, title, content)
	{
		if(title == "")
			return "Title can not be empty";
		
		if(content == "")
			return "Content can not be empty";
		
		var nn = this.createEmptyNewsItem();
		
		var today = new Date();
		
		nn.title = title;
		nn.content = content;
		nn.date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
		
		p.news_items.push(nn);
		
		return true;
	}
	
	this.editNewsItem = function(n, title, content)
	{
		if(title == "")
			return "Title can not be empty";
		
		if(content == "")
			return "Content can not be empty";
		
		n.title = title;
		n.content = content;
		
		return true;
	}
	
	this.deleteProjectNewsItem = function(p, n)
	{
		var i = p.news_items.indexOf(n);
		
		if(i != -1) p.news_items.splice(i, 1);
	}
	
	this.editUserImage = function(image)
	{
		if(this.logged_in_user == null)
		{
			console.log("editUserImage no logged in user");
			return;
		}
		
		var u = this.logged_in_user;
		
		u.image = image;
		
		this.saveLocalStorage();
	}
	
	this.createEmptyProject = function()
	{
		var ret_obj = {};
		
		ret_obj.name = "";
		ret_obj.profile_image = "";
		ret_obj.short_description = "";
		ret_obj.description = "";
		
		ret_obj.news_items = [];
		ret_obj.album = [];
		ret_obj.events = [];
		ret_obj.fundraisers = [];
		ret_obj.discussions = [];
		ret_obj.members = [];
		ret_obj.leader = null;
		
		return ret_obj;
	}
	
	this.createEmptyNewsItem = function()
	{
		var ret_obj = {};
		
		ret_obj.title = "";
		ret_obj.date = "";
		ret_obj.content = "";
		
		return ret_obj;
	}
	
	this.createDummyProject = function(name)
	{
		var ret_obj = this.createEmptyProject();
		
		ret_obj.name = name;
		if(Math.round(random_between(0,1)))
			ret_obj.short_description = "Help repaint an abandoned house in West Philly.";
		else
			ret_obj.short_description = "This is a project for turning the abandoned lot in North Philly into a garden.";
		ret_obj.description = "This is the project description. Here it is mentioned about how this project wants to either repaint an abandoned house or plant a garden in an abandoned lot etc. It will great new members and try to convince them to join and donate etc. Otherwise a lot of random stuff about what they are doing etc.";
		
		return ret_obj;
	}
	
	this.createEmptyUser = function()
	{
		var ret_obj = {};
		
		ret_obj.name = "";
		ret_obj.username = "";
		ret_obj.password = "";
		ret_obj.description = "";
		ret_obj.email = "";
		ret_obj.phone_number = "";
		ret_obj.image = "";
		
		return ret_obj;
	}
	
	this.createDummyUser = function(name, is_female)
	{
		var ret_obj = this.createEmptyUser();
		
		ret_obj.name = name;
		ret_obj.username = "user" + this.users.length;
		ret_obj.password = "pass";
		
		if(is_female)
			ret_obj.image = "images/woman.jpg";
		else
			ret_obj.image = "images/man.jpg";
		
		return ret_obj;
	}
	
	this.createDummyEvent = function(name)
	{
		var ret_obj = {};
		
		var date = Math.round(random_between(1,28));
		
		ret_obj.name = name;
		ret_obj.location = "Some Place";
		ret_obj.start_date = "5:00 PM 4/" + date + "/2016";
		ret_obj.end_date = "7:00 PM 4/" + date + "/2016";
		ret_obj.description = "A basic description of the event with enough details that everyone needs to attend etc. Without this people might not know where exactly to go, call, bring etc.";
		
		return ret_obj;
	}
	
	this.createDummyFundraiser = function(name)
	{
		var ret_obj = {};
		
		var date = Math.round(random_between(1,28));
		var goal = Math.round(random_between(5,50));
		
		ret_obj.name = name;
		ret_obj.goal = goal * 10;
		ret_obj.goal_date = "4/" + date + "/2016";
		ret_obj.link = "https://www.kickstarter.com/projects/";
		
		return ret_obj;
	}
	
	this.createDummyDiscussion = function(name)
	{
		var ret_obj = {};

		ret_obj.name = name;
		ret_obj.comments = [];
		
		var num = Math.round(random_between(3,7));
		var date = Math.round(random_between(1,3));
		
		var messages = [];
		
		messages.push("Are we sure? What if ...");
		messages.push("I was thinking that would be a great idea. When we get there then we should consider what is going to happen though.");
		messages.push("I was thinking, maybe we should ...");
		messages.push("Anyone know who the owner's phone number is? We are going to need to contact them first.");
		messages.push("Let me know if you guys need any help.");
		messages.push("I have tools if you guys need them.");
		
		for(var i=0;i<num;i++)
		{
			var nc = {};
			
			var mn = Math.round(random_between(0,messages.length-1));
			
			var ncui = Math.round(random_between(0,this.users.length-1));
			nc.user = this.users[ncui];
			nc.date = "4/" + date + "/2016";
			nc.message = messages[mn];
			
			ret_obj.comments.push(nc);
			
			date += Math.round(random_between(1,3));
		}
		
		return ret_obj;
	}
	
	this.createDummyNewsItem = function(date)
	{
		var ret_obj = this.createEmptyNewsItem();
		
		ret_obj.title = "Title";
		ret_obj.date = "4/" + date + "/2016";
		ret_obj.content = "Content";
		
		switch(Math.round(random_between(1,5)))
		{
			case 1:
				ret_obj.title = "Fundraiser goal met!!";
				break;
			case 2:
				ret_obj.title = "Materials acquired";
				break;
			case 3:
				ret_obj.title = "New fundraiser started";
				break;
			case 4:
				ret_obj.title = "Work ready to start";
				break;
			case 5:
				ret_obj.title = "Finished portion of the project";
				break;
		}
		
		switch(Math.round(random_between(1,4)))
		{
			case 1:
				ret_obj.content = "Met the lot owner today. They are okay with everyone helping to improve the place. Looks like we should be able to get started.";
				break;
			case 2:
				ret_obj.content = "If anyone can help the latest fundraiser is needed to get all the materials we need. The stuff we were using last time has run out and one the things we got broke.";
				break;
			case 3:
				ret_obj.content = "Thank you for everyone who showed up last night. We got a lot of work done. Next week if we meet up again I think it will get finished.";
				break;
			case 4:
				ret_obj.content = "We now have what we need to begin working! We will probably set up a time to meet next week at the site.";
				break;
		}
		
		return ret_obj;
	}
	
	this.createDummyData = function()
	{
		this.users.push(this.createDummyUser("Joanna Doe", true));
		this.users.push(this.createDummyUser("Ister Lawn", false));
		this.users.push(this.createDummyUser("Jane Smith", true));
		this.users.push(this.createDummyUser("John Franklin", false));
		this.users.push(this.createDummyUser("Sandy Jordan", true));
		this.users.push(this.createDummyUser("Eric Storn", false));
		this.users.push(this.createDummyUser("Mindy Lane", true));
		this.users.push(this.createDummyUser("Bob Smith", false));
		this.users.push(this.createDummyUser("Jessie Miller", true));
		this.users.push(this.createDummyUser("Mark Jenkins", false));
		this.users.push(this.createDummyUser("Lori Smith", true));
		this.users.push(this.createDummyUser("Stan Mill", false));
		this.users.push(this.createDummyUser("Susan Mord", true));
		this.users.push(this.createDummyUser("Joe Bob", false));
	
		var project_names = [];
		project_names.push( { name:"Plant Garden", count:0 });
		project_names.push( { name:"Repaint House", count:0 });
		project_names.push( { name:"Cleanup Lot", count:0 });
		project_names.push( { name:"Clean Street", count:0 });
		
		var event_names = [];
		event_names.push( "Site Work" );
		event_names.push( "Discussion Meet" );
		event_names.push( "Inspect Site" );
		event_names.push( "Meet with Owners" );
		event_names.push( "More Site Work" );
		event_names.push( "Fundraiser Event" );
		event_names.push( "Council Meet" );
		
		var fundraiser_names = [];
		fundraiser_names.push( "Buy Tools" );
		fundraiser_names.push( "Pizza" );
		fundraiser_names.push( "Meals" );
		fundraiser_names.push( "Materials" );
		fundraiser_names.push( "Paint" );
		fundraiser_names.push( "Plants" );
		fundraiser_names.push( "Hired Help" );
		
		var discussion_names = [];
		discussion_names.push( "How to start" );
		discussion_names.push( "Who all is here?" );
		discussion_names.push( "What do you think about..." );
		discussion_names.push( "How much for fundraisers?" );
		discussion_names.push( "Which lot should be first?" );
		discussion_names.push( "Anyone know how to reach the owner?" );
		discussion_names.push( "Transportation" );
		
		var proj_num = Math.round(random_between(12,18));
		
		for(var i=0;i<proj_num;i++)
		{
			var pn = Math.round(random_between(0,project_names.length-1));
			var p = project_names[pn];
			
			var new_p = this.createDummyProject(p.name + " " + (p.count + 1));
			
			//add members
			var m = Math.round(random_between(0,3));
			for(;m<this.users.length;m+=Math.round(random_between(1,3)))
				new_p.members.push(this.users[m]);
			
			//add events
			var m = Math.round(random_between(1,5));
			var ni = Math.round(random_between(1,4));
			for(var j=0;j<m;j++)
			{
				new_p.events.push(this.createDummyEvent(event_names[ni]));
				
				ni += Math.round(random_between(1,4));
				ni %= event_names.length;
			}
			
			//add fundraisers
			var m = Math.round(random_between(1,5));
			var ni = Math.round(random_between(1,4));
			for(var j=0;j<m;j++)
			{
				new_p.fundraisers.push(this.createDummyFundraiser(fundraiser_names[ni]));
				
				ni += Math.round(random_between(1,4));
				ni %= fundraiser_names.length;
			}
			
			//add discussions
			var m = Math.round(random_between(1,5));
			var ni = Math.round(random_between(1,4));
			for(var j=0;j<m;j++)
			{
				new_p.discussions.push(this.createDummyDiscussion(discussion_names[ni]));
				
				ni += Math.round(random_between(1,4));
				ni %= discussion_names.length;
			}
			
			var m = Math.round(random_between(5,12));
			for(var j=0;j<m;j++)
				new_p.album.push("images/project_dummy" + Math.round(random_between(1,5)) + ".jpg");
			
			new_p.image = new_p.album[0];
			
			var date = Math.round(random_between(1,6));
			for(;date<28;date+=Math.round(random_between(1,6)))
				new_p.news_items.push(this.createDummyNewsItem(date));
			
			new_p.leader = new_p.members[0];
				
			this.projects.push(new_p);
			
			p.count++;
		}
	}

	this.init();
}
