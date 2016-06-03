function screen_change_password()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_change_password = function()
	{
		var self = this;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,400,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("Change Password");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		//this.title_label.setColor("white");
		//this.title_label.setAlignment("center");
		this.addSubview(this.title_label);
		
		this.inputs = [];
		
		this.inputs.push({ name:"Current Password:" });
		this.inputs.push({ name:"Password:" });
		this.inputs.push({ name:"Password Again:" });
		
		var start_y = this.title_label.h+40;
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
			item.text.isPasswordField(true);
			item.text.setFrame(this.w-160-20,start_y,160);
			this.addSubview(item.text);
			
			start_y += 50;
		}
		
		this.cancel_button = new view_button();
		this.cancel_button.setTitle("Cancel");
		this.cancel_button.setIdealSize();
		this.cancel_button.actionFunc = function() { self.doCancel(); };
		this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.inputs[this.inputs.length-1].text.y+50);
		this.addSubview(this.cancel_button);
		
		this.change_button = new view_button();
		this.change_button.setTitle("Change Password");
		this.change_button.setIdealSize();
		this.change_button.actionFunc = function() { self.doChange(); };
		this.change_button.setFrame(this.cancel_button.x-this.change_button.w-20,this.cancel_button.y);
		this.addSubview(this.change_button);
		
		//set height
		this.setFrame(0,0,400,this.change_button.y+this.change_button.h+20);
	}
	
	this.doCancel = function()
	{
		main_popover.showPopover(edit_user_screen, edit_user_screen.w, edit_user_screen.h);
	}
	
	this.doChange = function()
	{
		main_popover.showPopover(edit_user_screen, edit_user_screen.w, edit_user_screen.h);
	}

	this.init();
	this.init_screen_change_password();
}
