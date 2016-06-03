function widget_footer_bar()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_widget_footer_bar = function()
	{
		var self = this;

		//this.setBackgroundColor("grey");
		
		this.element.style.borderWidth = "4px 0px 0px 0px";
		this.element.style.borderStyle = "solid";
		
		this.setup_login_area();
		this.setup_logged_in_area();
		
		this.return_home_button = new view_button();
		this.return_home_button.setTitle("Project Philly Home");
		this.return_home_button.setIdealSize();
		this.return_home_button.actionFunc = function() { main_screen.loadProjects(database.projects); load_screen(main_screen); };
		this.addSubview(this.return_home_button);
		
		this.showLoggedInArea(false);
		this.showReturnButton(false);
	}
	
	this.setup_login_area = function()
	{
		var self = this;
		
		this.login_area = new view();
		this.addSubview(this.login_area);
		
		this.login_area.username_label = new view_label();
		this.login_area.username_label.setText("Username:");
		this.login_area.username_label.setFrame(0,0,this.login_area.username_label.desiredWidth()+0,20);
		this.login_area.addSubview(this.login_area.username_label);
		
		this.login_area.username_textfield = new view_textfield();
		this.login_area.addSubview(this.login_area.username_textfield);
		
		this.login_area.password_label = new view_label();
		this.login_area.password_label.setText("Password:");
		this.login_area.password_label.setFrame(0,0,this.login_area.password_label.desiredWidth()+0,20);
		this.login_area.addSubview(this.login_area.password_label);
		
		this.login_area.password_textfield = new view_textfield();
		this.login_area.password_textfield.isPasswordField(true);
		this.login_area.addSubview(this.login_area.password_textfield);
		
		this.login_area.login_button = new view_button();
		this.login_area.login_button.setTitle("Login");
		this.login_area.login_button.setIdealSize();
		this.login_area.login_button.actionFunc = function() { self.doLogin(); };
		this.login_area.addSubview(this.login_area.login_button);
		
		this.login_area.signup_button = new view_button();
		this.login_area.signup_button.setTitle("Signup");
		this.login_area.signup_button.setIdealSize();
		this.login_area.signup_button.actionFunc = function() { self.doCreateUser(); };
		this.login_area.addSubview(this.login_area.signup_button);
	}
	
	this.setup_logged_in_area = function()
	{
		var self = this;
		
		this.logged_in_area = new view();
		this.addSubview(this.logged_in_area);
		
		this.logged_in_area.new_project_button = new view_button();
		this.logged_in_area.new_project_button.setTitle("Create New Project");
		this.logged_in_area.new_project_button.setIdealSize();
		this.logged_in_area.new_project_button.actionFunc = function() { self.doNewProject(); };
		this.logged_in_area.addSubview(this.logged_in_area.new_project_button);
		
		this.logged_in_area.edit_button = new view_button();
		this.logged_in_area.edit_button.setTitle("Edit Member Details");
		this.logged_in_area.edit_button.setIdealSize();
		this.logged_in_area.edit_button.actionFunc = function() { self.doEditMember(); };
		this.logged_in_area.addSubview(this.logged_in_area.edit_button);
		
		this.logged_in_area.logout_button = new view_button();
		this.logged_in_area.logout_button.setTitle("Logout");
		this.logged_in_area.logout_button.setIdealSize();
		this.logged_in_area.logout_button.actionFunc = function() { self.doLogout(); };
		this.logged_in_area.addSubview(this.logged_in_area.logout_button);
	}
	
	this.doLogin = function()
	{
		var user = this.login_area.username_textfield.getText();
		var pass = this.login_area.password_textfield.getText();
		
		if(user == "" && pass == "")
		{
			user = "user0";
			pass = "pass";
		}
		
		if(user == "createdb")
		{
			database.loadDummyDatabase();
			main_screen.loadProjects(database.projects);
			return;
		}
		
		if(user == "cleardb")
		{
			database.clearDatabase();
			database.saveLocalStorage();
			main_screen.loadProjects(database.projects);
			return;
		}
		
		if(database.doLogin(user, pass))
		{
			this.showLoggedInArea(true);
			
			this.login_area.username_textfield.setText("");
			this.login_area.password_textfield.setText("");
		}
		else
		{
			console.log("failed login - '" + user + "' / '" + pass + "'");
			
			warning_screen.setContent("Incorrect username and password");
			main_popover.showPopover(warning_screen, warning_screen.w, warning_screen.h);
		}
	}
	
	this.doLogout = function()
	{
		database.doLogout();
		
		this.showLoggedInArea(false);
	}
	
	this.doCreateUser = function()
	{
		create_user_screen.doClear();
		main_popover.showPopover(create_user_screen, create_user_screen.w, create_user_screen.h);
	}
	
	this.doNewProject = function()
	{
		main_popover.showPopover(new_project_screen, new_project_screen.w, new_project_screen.h);
	}
	
	this.doEditMember = function()
	{
		edit_user_screen.loadLoggedUser();
		main_popover.showPopover(edit_user_screen, edit_user_screen.w, edit_user_screen.h);
	}
	
	this.showLoggedInArea = function(val)
	{
		if(val)
		{
			this.login_area.hide();
			this.logged_in_area.show();
		}
		else
		{
			this.login_area.show();
			this.logged_in_area.hide();
		}
	}
	
	this.showReturnButton = function(val)
	{
		if(val)
			this.return_home_button.show();
		else
			this.return_home_button.hide();
	}
	
	this.login_area_resize = function()
	{
		var la_views = [];
		
		la_views.push(this.login_area.signup_button);
		la_views.push(this.login_area.login_button);
		la_views.push(this.login_area.password_textfield);
		la_views.push(this.login_area.password_label);
		la_views.push(this.login_area.username_textfield);
		la_views.push(this.login_area.username_label);

		la_views[0].setFrame(this.w-la_views[0].w-20,(this.h-la_views[0].h)/2);
		
		for(var i=1;i<la_views.length;i++)
		{
			var cv = la_views[i];
			var pv = la_views[i-1];
			
			cv.setFrame(pv.x-cv.w-20,(this.h-cv.h)/2);
		}
	}
	
	this.logged_area_resize = function()
	{
		var la_views = [];
		
		la_views.push(this.logged_in_area.logout_button);
		la_views.push(this.logged_in_area.edit_button);
		la_views.push(this.logged_in_area.new_project_button);

		la_views[0].setFrame(this.w-la_views[0].w-20,(this.h-la_views[0].h)/2);
		
		for(var i=1;i<la_views.length;i++)
		{
			var cv = la_views[i];
			var pv = la_views[i-1];
			
			cv.setFrame(pv.x-cv.w-20,(this.h-cv.h)/2);
		}
	}
	
	this.window_resize = function()
	{
		var th = 60;
		
		this.setFrame(0,APP_H-th,APP_W,th);
		this.login_area.setFrame(0,0,this.w,this.h);
		this.logged_in_area.setFrame(0,0,this.w,this.h);
		this.return_home_button.setFrame(20,(this.h-this.return_home_button.h)/2);

		this.login_area_resize();
		this.logged_area_resize();
	}
	
	this.useH = function()
	{
		return APP_H-this.h;
	}

	this.init();
	this.init_widget_footer_bar();
}
