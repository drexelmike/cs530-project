function screen_warning()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_warning = function()
	{
		var self = this;
		
		this.prev_screen = null;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,400,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("Warning");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		//this.title_label.setColor("white");
		//this.title_label.setAlignment("center");
		this.addSubview(this.title_label);
		
		var start_y = this.title_label.h+40;
		this.content_label = new view_label();
		this.content_label.setSize("18px");
		this.content_label.setAlignment("center");
		this.content_label.setText("Dummy Text");
		this.content_label.element.style.padding = "0px 20px";
		this.content_label.setFrame(0,start_y+2,this.w-20,20);
		this.addSubview(this.content_label);

		this.okay_button = new view_button();
		this.okay_button.setTitle("Okay");
		this.okay_button.setIdealSize();
		this.okay_button.actionFunc = function() { self.doOkay(); };
		this.okay_button.setFrame((this.w-this.okay_button.w)/2,this.content_label.y+50);
		this.addSubview(this.okay_button);

		//set height
		this.setFrame(0,0,400,this.okay_button.y+this.okay_button.h+20);
	}
	
	this.setContent = function(text)
	{
		this.content_label.setText(text);
	}
	
	this.doOkay = function()
	{
		if(this.prev_screen == null)
			main_popover.hidePopover();
		else
		{
			main_popover.showPopover(this.prev_screen, this.prev_screen.w, this.prev_screen.h);
			this.prev_screen = null;
		}
	}

	this.init();
	this.init_screen_warning();
}
