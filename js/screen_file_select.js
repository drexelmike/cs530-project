function screen_file_select()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_file_select = function()
	{
		var self = this;
		
		this.return_screen = null;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,300,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("Select File");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		this.addSubview(this.title_label);
		
		this.file_selector = new view_file_select();
		this.file_selector.element.style.padding = "0px 20px";
		this.file_selector.setFrame(0,this.title_label.h+40+2,this.w-20,20);
		this.addSubview(this.file_selector);

		this.cancel_button = new view_button();
		this.cancel_button.setTitle("Cancel");
		this.cancel_button.setIdealSize();
		this.cancel_button.actionFunc = function() { self.doCancel(); };
		this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.file_selector.y+this.file_selector.h+20);
		this.addSubview(this.cancel_button);
		
		this.use_button = new view_button();
		this.use_button.setTitle("Use File");
		this.use_button.setIdealSize();
		this.use_button.actionFunc = function() { self.doUseFile(); };
		this.use_button.setFrame(this.cancel_button.x-this.use_button.w-20,this.cancel_button.y);
		this.addSubview(this.use_button);
		
		//set height
		this.setFrame(0,0,this.w,this.use_button.y+this.use_button.h+20);
	}
	
	this.doCancel = function()
	{
		if(this.return_screen != null)
			main_popover.showPopover(this.return_screen, this.return_screen.w, this.return_screen.h);
	}
	
	this.doUseFile = function()
	{
		if(this.return_screen != null)
		{
			if(typeof(this.return_screen.useFile) != "undefined")
				this.return_screen.useFile(this.file_selector.getFile());
			
			main_popover.showPopover(this.return_screen, this.return_screen.w, this.return_screen.h);
		}
	}

	this.init();
	this.init_screen_file_select();
}
