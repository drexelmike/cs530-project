function screen_new_news_item()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_new_news_item = function()
	{
		var self = this;
		
		//this.setBackgroundColor("grey");
		this.setFrame(0,0,400,500);
		
		this.title_label = new view_label();
		this.title_label.setSize("20px");
		this.title_label.setText("New News Item");
		this.title_label.element.style.borderWidth = "0px 0px 4px 0px";
		this.title_label.element.style.borderStyle = "solid";
		this.title_label.element.style.padding = "10px";
		this.title_label.setFrame(0,0,this.w,20);
		this.title_label.setFrame(0,0,this.w-20,this.title_label.desiredHeight());
		this.addSubview(this.title_label);
		
		this.name_label = new view_label();
		this.name_label.setSize("20px");
		this.name_label.setText("News Title:");
		this.name_label.element.style.padding = "0px 20px";
		this.name_label.setFrame(0,this.title_label.h+40+2,this.w-20,20);
		this.addSubview(this.name_label);
		
		this.name_text = new view_textfield();
		this.name_text.setFrame(this.w-160-20,this.title_label.h+40,160);
		this.addSubview(this.name_text);
		
		this.desc_label = new view_label();
		this.desc_label.setSize("20px");
		this.desc_label.setText("News Content:");
		this.desc_label.element.style.padding = "0px 20px";
		this.desc_label.setFrame(0,this.name_label.y+50,this.w-20,20);
		this.addSubview(this.desc_label);
		
		this.desc_text = new view_textarea();
		this.desc_text.setFrame(20,this.desc_label.y+50,this.w-40,120);
		this.addSubview(this.desc_text);

		this.cancel_button = new view_button();
		this.cancel_button.setTitle("Cancel");
		this.cancel_button.setIdealSize();
		this.cancel_button.actionFunc = function() { self.doCancel(); };
		//this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.inputs[this.inputs.length-1].text.y+50);
		this.cancel_button.setFrame(this.w-this.cancel_button.w-20,this.desc_text.y+this.desc_text.h+20);
		this.addSubview(this.cancel_button);
		
		this.create_button = new view_button();
		this.create_button.setTitle("Create News Item");
		this.create_button.setIdealSize();
		this.create_button.actionFunc = function() { self.doCreate(); };
		this.create_button.setFrame(this.cancel_button.x-this.create_button.w-20,this.cancel_button.y);
		this.addSubview(this.create_button);
		
		//set height
		this.setFrame(0,0,400,this.create_button.y+this.create_button.h+20);
	}

	this.loadForEdit = function(n)
	{
		if(typeof(n) != "undefined")
		{
			this.loaded_news_item = n;
			
			this.title_label.setText("Edit News Item");
			this.name_text.setText(n.title);
			this.desc_text.setText(n.content);
			
			this.create_button.setTitle("Edit News Item");
			this.create_button.setIdealSize();
			this.create_button.setFrame(this.cancel_button.x-this.create_button.w-20,this.cancel_button.y);
		}
		else
		{
			this.loaded_news_item = null;
			
			this.title_label.setText("Create News Item");
			this.name_text.setText("");
			this.desc_text.setText("");
			
			this.create_button.setTitle("Create News Item");
			this.create_button.setIdealSize();
			this.create_button.setFrame(this.cancel_button.x-this.create_button.w-20,this.cancel_button.y);
		}
	}
	
	this.doCancel = function()
	{
		main_popover.hidePopover();
	}
	
	this.doCreate = function()
	{
		if(this.loaded_news_item == null)
		{
			var ret = database.createNewsItem(edit_project_screen.loaded_project, this.name_text.getText(), this.desc_text.getText());
			
			if(ret === true)
			{
				edit_project_screen.loadNewsArea();
				main_popover.hidePopover();
			}
			else
			{
				warning_screen.setContent(ret);
				warning_screen.prev_screen = this;
				main_popover.showPopover(warning_screen, warning_screen.w, warning_screen.h);
			}
		}
		else
		{
			var ret = database.editNewsItem(this.loaded_news_item, this.name_text.getText(), this.desc_text.getText());
			
			if(ret === true)
			{
				edit_project_screen.loadNewsArea();
				main_popover.hidePopover();
			}
			else
			{
				warning_screen.setContent(ret);
				warning_screen.prev_screen = this;
				main_popover.showPopover(warning_screen, warning_screen.w, warning_screen.h);
			}
		}
	}

	this.init();
	this.init_screen_new_news_item();
}
