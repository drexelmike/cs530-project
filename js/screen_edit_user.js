function screen_edit_user()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_edit_user = function()
	{
		var self = this;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,400,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("Edit User");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		this.addSubview(this.title_label);
		
		this.welcome_label = new view_label();
		this.welcome_label.setSize("30px");
		this.welcome_label.setText("Joanna Doe");
		this.welcome_label.element.style.padding = "0px 20px";
		this.welcome_label.setFrame(0,0,this.w,20);
		this.welcome_label.setFrame(0,this.title_label.h+40,(this.w/2)-40,this.welcome_label.desiredHeight());
		this.addSubview(this.welcome_label);
		
		this.p_image = new view();
		this.p_image.element.style.border = "2px dotted grey";
		this.p_image.element.style.boxSizing = "border-box";
		this.p_image.setFrame(this.w/2,this.title_label.h+40,(this.w/2)-20,120);
		this.addSubview(this.p_image);
		
		this.profile_image = new view();
		this.profile_image.setBackgroundImage("images/woman.jpg");
		this.profile_image.element.style.backgroundSize = "cover";
		this.profile_image.element.style.backgroundRepeat = "no-repeat";
		this.profile_image.element.style.backgroundPosition = "center";
		this.profile_image.setFrame(this.p_image.x+4,this.p_image.y+4,this.p_image.w-8,this.p_image.h-8);
		this.addSubview(this.profile_image);
		
		this.desc_label = new view_label();
		this.desc_label.setSize("20px");
		this.desc_label.setText("User Description:");
		this.desc_label.element.style.padding = "0px 20px";
		this.desc_label.setFrame(0,this.p_image.y+this.p_image.h+20,this.w-40,20);
		this.addSubview(this.desc_label);
		
		this.desc_text = new view_textarea();
		this.desc_text.setFrame(20,this.desc_label.y+50,this.w-40,100);
		this.addSubview(this.desc_text);
		
		this.inputs = [];
		
		this.inputs.push({ name:"New Name:" });
		this.inputs.push({ name:"Email:" });
		this.inputs.push({ name:"Phone Number:" });
		
		var start_y = this.desc_text.y+this.desc_text.h+20;
		for(var i=0;i<this.inputs.length;i++)
		{
			var item = this.inputs[i];
			
			item.label = new view_label();
			item.label.setSize("20px");
			item.label.setText(item.name);
			item.label.element.style.padding = "0px 20px";
			item.label.setFrame(0,start_y+2,this.w-20,20);
			this.addSubview(item.label);
			
			item.text = new view_textfield();
			item.text.setFrame(this.w-160-20,start_y,160);
			this.addSubview(item.text);
			
			start_y += 50;
		}
		
		this.new_image_button = new view_button();
		this.new_image_button.setTitle("New Image");
		this.new_image_button.setIdealSize();
		this.new_image_button.actionFunc = function() { self.doNewImage(); };
		this.new_image_button.setFrame(20,this.inputs[this.inputs.length-1].text.y+50);
		this.addSubview(this.new_image_button);
		
		this.change_password_button = new view_button();
		this.change_password_button.setTitle("Change Password");
		this.change_password_button.setIdealSize();
		this.change_password_button.actionFunc = function() { self.doChangePassword(); };
		this.change_password_button.setFrame(this.new_image_button.x+this.new_image_button.w+20,this.new_image_button.y);
		this.addSubview(this.change_password_button);
		
		this.cancel_button = new view_button();
		this.cancel_button.setTitle("Cancel");
		this.cancel_button.setIdealSize();
		this.cancel_button.actionFunc = function() { self.doCancel(); };
		this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.change_password_button.y+this.change_password_button.h+20);
		this.addSubview(this.cancel_button);
		
		this.save_button = new view_button();
		this.save_button.setTitle("Save Changes");
		this.save_button.setIdealSize();
		this.save_button.actionFunc = function() { self.doSave(); };
		this.save_button.setFrame(this.cancel_button.x-this.save_button.w-20,this.cancel_button.y);
		this.addSubview(this.save_button);

		//set height
		this.setFrame(0,0,400,this.cancel_button.y+this.cancel_button.h+20);
	}
	
	this.useFile = function(new_image)
	{
		database.editUserImage(new_image);
		
		var u = database.logged_in_user;
		
		if(u != null) this.profile_image.setBackgroundImage(u.image);
		
		this.loadLoggedUser();
	}
	
	this.loadLoggedUser = function()
	{
		if(database.logged_in_user == null)
		{
			console.log("doLoadLoggedUser no logged in user!");
			return;
		}
		
		var u = database.logged_in_user;
		
		this.welcome_label.setText(u.name);
		this.profile_image.setBackgroundImage(u.image);
		this.desc_text.setText(u.description);
		this.inputs[0].text.setText(u.name);
		this.inputs[1].text.setText(u.email);
		this.inputs[2].text.setText(u.phone_number);
	}
	
	this.doNewImage = function()
	{
		file_select_screen.return_screen = this;
		main_popover.showPopover(file_select_screen, file_select_screen.w, file_select_screen.h);
	}
	
	this.doChangePassword = function()
	{
		main_popover.showPopover(change_password_screen, change_password_screen.w, change_password_screen.h);
	}
	
	this.doSave = function()
	{
		database.editUser(this.inputs[0].text.getText(),
			this.desc_text.getText(),
			this.inputs[1].text.getText(),
			this.inputs[2].text.getText());
		
		main_popover.hidePopover();
	}
	
	this.doCancel = function()
	{
		main_popover.hidePopover();
	}

	this.init();
	this.init_screen_edit_user();
}
