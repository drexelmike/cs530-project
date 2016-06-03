function screen_create_user()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_create_user = function()
	{
		var self = this;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,400,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("Create New User");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		//this.title_label.setColor("white");
		//this.title_label.setAlignment("center");
		this.addSubview(this.title_label);
		
		this.welcome_label = new view_label();
		this.welcome_label.setSize("30px");
		this.welcome_label.setText("Welcome!!");
		this.welcome_label.element.style.padding = "0px 20px";
		this.welcome_label.setFrame(0,0,this.w,20);
		this.welcome_label.setFrame(0,this.title_label.h+40,this.w-40,this.welcome_label.desiredHeight());
		this.addSubview(this.welcome_label);
		
		this.desc_label = new view_label();
		this.desc_label.setSize("20px");
		this.desc_label.setText("Welcome to Project Philly! With a user you will be able to create and participate in projects.");
		//this.desc_label.setTextAlign("justify");
		this.desc_label.element.style.padding = "0px 20px";
		this.desc_label.setFrame(0,0,this.w,20);
		this.desc_label.setFrame(0,this.welcome_label.y+this.welcome_label.h+20,this.w-40,this.desc_label.desiredHeight());
		this.addSubview(this.desc_label);
		
		this.inputs = [];
		
		this.inputs.push({ name:"Name:" });
		this.inputs.push({ name:"Email:" });
		this.inputs.push({ name:"Username:" });
		this.inputs.push({ name:"Password:" });
		this.inputs.push({ name:"Password Again:" });
		
		var start_y = this.desc_label.y+this.desc_label.h+20;
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
			if(item.name == "Password:" || item.name == "Password Again:") item.text.isPasswordField(true);
			this.addSubview(item.text);
			
			start_y += 50;
		}
		
		this.cancel_button = new view_button();
		this.cancel_button.setTitle("Cancel");
		this.cancel_button.setIdealSize();
		this.cancel_button.actionFunc = function() { self.doCancel(); };
		this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.inputs[this.inputs.length-1].text.y+50);
		this.addSubview(this.cancel_button);
		
		this.create_button = new view_button();
		this.create_button.setTitle("Create User");
		this.create_button.setIdealSize();
		this.create_button.actionFunc = function() { self.doCreate(); };
		this.create_button.setFrame(this.cancel_button.x-this.create_button.w-20,this.cancel_button.y);
		this.addSubview(this.create_button);
		
		//set height
		this.setFrame(0,0,400,this.create_button.y+this.create_button.h+20);
	}
	
	this.doClear = function()
	{
		for(var i=0;i<this.inputs.length;i++)
			this.inputs[i].text.setText("");
	}
	
	this.doCancel = function()
	{
		main_popover.hidePopover();
	}
	
	this.doCreate = function()
	{
		var ret = database.createUser(
			this.inputs[0].text.getText(),
			this.inputs[1].text.getText(),
			this.inputs[2].text.getText(),
			this.inputs[3].text.getText(),
			this.inputs[4].text.getText()
		);
		
		if(ret === true)
		{
			footer_bar_widget.showLoggedInArea(true);
			main_popover.hidePopover();
		}
		else
		{
			warning_screen.setContent(ret);
			warning_screen.prev_screen = this;
			main_popover.showPopover(warning_screen, warning_screen.w, warning_screen.h);
		}
	}

	this.init();
	this.init_screen_create_user();
}
