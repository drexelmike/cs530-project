function screen_edit_project()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_edit_project = function()
	{
		this.loaded_project = null;
		
		this.setBackgroundColor("grey");
		
		this.scroll_view = new view_iscroll();
		this.addSubview(this.scroll_view);
		
		this.setup_title();
		this.setup_nav();
		this.setup_main_details_area();
		this.setup_news_area();
		this.setup_album_area();
		this.setup_events_area();
		this.setup_fundraisers_area();
		this.setup_discussions_area();
		
		this.area_shown = null;
		this.showArea(this.details_area);
	}
	
	this.setup_title = function()
	{
		var self = this;
		
		this.title_area = new view();
		this.title_area.setBackgroundColor("white");
		this.title_area.element.style.border = "4px solid";
		//this.title_area.element.style.boxSizing = "border-box";
		this.scroll_view.scroll_area.addSubview(this.title_area);
		
		this.title_area.title_label = new view_label();
		this.title_area.title_label.setSize("40px");
		this.title_area.title_label.setText("The Project Name");
		this.title_area.title_label.setAlignment("center");
		this.title_area.addSubview(this.title_area.title_label);
		
		this.title_area.edit_button = new view_button();
		this.title_area.edit_button.setTitle("Return to Project");
		this.title_area.edit_button.setIdealSize();
		this.title_area.edit_button.actionFunc = function() { self.doReturnToProject(); };
		this.title_area.addSubview(this.title_area.edit_button);
	}
	
	this.create_common_title = function()
	{
		var ret_view = new view();
		
		ret_view.setBackgroundColor("white");
		ret_view.element.style.border = "4px solid";
		this.scroll_view.scroll_area.addSubview(ret_view);
		
		ret_view.title_label = new view_label();
		ret_view.title_label.setSize("20px");
		ret_view.title_label.element.style.padding = "0px 10px";
		ret_view.addSubview(ret_view.title_label);
		
		ret_view.title_div = new view();
		ret_view.title_div.element.style.borderWidth = "0px 0px 4px 0px";
		ret_view.title_div.element.style.borderStyle = "solid";
		ret_view.addSubview(ret_view.title_div);
		
		return ret_view;
	}
	
	this.setup_nav = function()
	{
		var self = this;
		var nw = 200;
		
		this.nav_area = this.create_common_title();
		
		this.nav_area.title_label.setText("Edit Options");
		this.nav_area.title_label.setFrame(0,10,nw-20,20);
		this.nav_area.title_label.setFrame(0,10,nw-20,this.nav_area.title_label.desiredHeight());
		
		this.nav_area.title_div.setFrame(0,this.nav_area.title_label.y+this.nav_area.title_label.h+10,nw,1);
		
		this.nav_area.b_list = [];
		
		this.nav_area.b_list.push({ name: "Main Details", actionFunc: function() { self.showArea(self.details_area); } });
		this.nav_area.b_list.push({ name: "News", actionFunc: function() { self.showArea(self.news_area); } });
		this.nav_area.b_list.push({ name: "Album", actionFunc: function() { self.showArea(self.album_area); } });
		this.nav_area.b_list.push({ name: "Events", actionFunc: function() { self.showArea(self.events_area); } });
		this.nav_area.b_list.push({ name: "Fundraisers", actionFunc: function() { self.showArea(self.fundraisers_area); } });
		this.nav_area.b_list.push({ name: "Discussions", actionFunc: function() { self.showArea(self.discussions_area); } });
		
		var cy = this.nav_area.title_div.y+this.nav_area.title_div.h+20+5;
		//var cy = this.nav_area.title_label.y+this.nav_area.title_label.h+20;
		for(var i=0;i<this.nav_area.b_list.length;i++)
		{
			var bi = this.nav_area.b_list[i];
			var nb = new view_button();
			
			nb.setTitle(bi.name);
			nb.setIdealSize();
			nb.actionFunc = bi.actionFunc;
			nb.setFrame(20,cy,nw-40);
			
			cy = nb.y+nb.h+20;
			
			this.nav_area.addSubview(nb);
		}
		
		//var lb = this.nav_area.b_list[this.nav_area.b_list.length-1];
		this.nav_area.setFrame(0,0,nw,cy);
	}
	
	this.setup_main_details_area = function()
	{
		var self = this;
		
		this.details_area = this.create_common_title();
		var ta = this.details_area;
		
		ta.title_label.setText("Main Details");
		
		ta.short_desc_label = new view_label();
		ta.short_desc_label.setSize("20px");
		ta.short_desc_label.setText("Short Description :");
		ta.short_desc_label.element.style.padding = "0px 20px";
		ta.addSubview(ta.short_desc_label);
		
		ta.short_desc_text = new view_textarea();
		ta.addSubview(ta.short_desc_text);
		
		ta.desc_label = new view_label();
		ta.desc_label.setSize("20px");
		ta.desc_label.setText("Main Description:");
		ta.desc_label.element.style.padding = "0px 20px";
		ta.addSubview(ta.desc_label);
		
		ta.desc_text = new view_textarea();
		ta.addSubview(ta.desc_text);
		
		ta.save_button = new view_button();
		ta.save_button.setTitle("Save Details");
		ta.save_button.setIdealSize();
		ta.save_button.actionFunc = function() { self.doSaveDetails(); };
		ta.addSubview(ta.save_button);
		
		ta.restore_button = new view_button();
		ta.restore_button.setTitle("Restore Current Values");
		ta.restore_button.setIdealSize();
		ta.restore_button.actionFunc = function() { self.doRestoreDetails(); };
		ta.addSubview(ta.restore_button);
		
		ta.hide();
	}
	
	this.setup_news_area = function()
	{
		var self = this;
		
		this.news_area = this.create_common_title();
		var ta = this.news_area;
		
		ta.title_label.setText("News");
		
		ta.news_items = [];
		
		ta.create_button = new view_button();
		ta.create_button.setTitle("Create New News Item");
		ta.create_button.setIdealSize();
		ta.create_button.actionFunc = function() { self.doCreateNews(); };
		ta.addSubview(ta.create_button);
		
		ta.hide();
	}
	
	this.setup_album_area = function()
	{
		this.album_area = this.create_common_title();
		var ta = this.album_area;
		
		ta.title_label.setText("Album");
		
		ta.hide();
	}
	
	this.setup_events_area = function()
	{
		this.events_area = this.create_common_title();
		var ta = this.events_area;
		
		ta.title_label.setText("Events");
		
		ta.hide();
	}
	
	this.setup_fundraisers_area = function()
	{
		this.fundraisers_area = this.create_common_title();
		var ta = this.fundraisers_area;
		
		this.fundraisers_area.title_label.setText("Fundraisers");
		
		ta.hide();
	}
	
	this.setup_discussions_area = function()
	{
		this.discussions_area = this.create_common_title();
		var ta = this.discussions_area;
		
		ta.title_label.setText("Discussions");
		
		ta.hide();
	}
	
	this.doSaveDetails = function()
	{
		var ta = this.details_area;
		
		database.editProjectDetails(this.loaded_project, ta.short_desc_text.getText(), ta.desc_text.getText());
	}
	
	this.doRestoreDetails = function()
	{
		if(this.loaded_project == null) return;
		
		var ta = this.details_area;
		
		ta.short_desc_text.setText(this.loaded_project.short_description);
		ta.desc_text.setText(this.loaded_project.description);
	}
	
	this.create_news_item = function(n)
	{
		var self = this;
		var ret_view = new view();
		
		ret_view.element.style.borderWidth = "0px 0px 2px 0px";
		ret_view.element.style.borderStyle = "dotted";
		
		ret_view.title = new view_label();
		ret_view.title.setSize("18px");
		ret_view.title.setText(n.title + " - " + n.date);
		ret_view.title.element.style.padding = "0px 20px";
		ret_view.addSubview(ret_view.title);
		
		ret_view.edit_button = new view_button();
		ret_view.edit_button.setTitle("Edit");
		ret_view.edit_button.setIdealSize();
		ret_view.edit_button.actionFunc = function() { self.doEditNewsItem(n); };
		ret_view.addSubview(ret_view.edit_button);
		
		ret_view.delete_button = new view_button();
		ret_view.delete_button.setTitle("Delete");
		ret_view.delete_button.setIdealSize();
		ret_view.delete_button.actionFunc = function() { self.doDeleteNewsItem(n); };
		ret_view.addSubview(ret_view.delete_button);
		
		ret_view.resize = function(nw)
		{
			ret_view.delete_button.setFrame(nw-ret_view.delete_button.w-20);
			ret_view.edit_button.setFrame(ret_view.delete_button.x-ret_view.edit_button.w-20);
			
			ret_view.title.setFrame(0,0,ret_view.edit_button.x-40);
			ret_view.title.setFrame(0,0,ret_view.edit_button.x-40,ret_view.title.desiredHeight());
			
			var uh = ret_view.title.h;
			if(ret_view.edit_button.h > uh) uh = ret_view.edit_button.h;
			uh += 20;
			
			ret_view.setFrame(0,0,nw,uh);
			
			ret_view.delete_button.setFrame(ret_view.delete_button.x, (uh - ret_view.delete_button.h) / 2);
			ret_view.edit_button.setFrame(ret_view.edit_button.x, (uh - ret_view.edit_button.h) / 2);
			ret_view.title.setFrame(ret_view.title.x, (uh - ret_view.title.h) / 2);
		};
		
		return ret_view;
	}
	
	this.loadNewsArea = function()
	{
		this.clearNewsArea();
		
		if(this.loaded_project == null) return;
		
		var ta = this.news_area;
		
		//for(var i=0;i<this.loaded_project.news_items.length;i++)
		for(var i=this.loaded_project.news_items.length-1;i>=0;i--)
		{
			var n = this.loaded_project.news_items[i];
			var ni = this.create_news_item(n);
			
			ta.news_items.push(ni);
			ta.addSubview(ni);
		}
		
		this.resize_news_area();
		this.resize_scroll_area();
	}
	
	this.clearNewsArea = function()
	{
		var ta = this.news_area;
		
		for(var i=0;i<ta.news_items.length;i++)
			ta.news_items[i].removeFromSuperView();
		
		ta.news_items = [];
	}
	
	this.loadProject = function(p)
	{
		this.title_area.title_label.setText(p.name);
		
		this.loaded_project = p;
		
		this.doRestoreDetails();
		this.loadNewsArea();
		
		this.showArea(this.details_area);
	}
	
	this.doCreateNews = function()
	{
		new_news_item_screen.loadForEdit();
		main_popover.showPopover(new_news_item_screen, new_news_item_screen.w, new_news_item_screen.h);
	}
	
	this.doEditNewsItem = function(n)
	{
		new_news_item_screen.loadForEdit(n);
		main_popover.showPopover(new_news_item_screen, new_news_item_screen.w, new_news_item_screen.h);
	}
	
	this.doDeleteNewsItem = function(n)
	{
		if(this.loaded_project == null) return;
		
		database.deleteProjectNewsItem(this.loaded_project, n);
		
		this.loadNewsArea();
	}
	
	this.doReturnToProject = function()
	{
		project_screen.loadProject(this.loaded_project);
		load_screen(project_screen);
	}
	
	this.showArea = function(the_area)
	{
		if(this.area_shown == the_area) return;
		
		if(this.area_shown != null)
			this.area_shown.hide();
		
		this.area_shown = the_area;
		this.area_shown.show();
		
		//make sure the scroll area adjusts to a new possible height
		this.resize_scroll_area();
	}
	
	this.resize_title = function()
	{
		this.title_area.title_label.setFrame(0,20,this.iw, this.title_area.title_label.desiredHeight());
		this.title_area.edit_button.setFrame(this.iw-this.title_area.edit_button.w-20,this.title_area.title_label.y+this.title_area.title_label.h+20);
		this.title_area.setFrame((APP_W-this.iw)/2-4,20-4,this.iw,this.title_area.edit_button.y+this.title_area.edit_button.h+20);
	}
	
	this.resize_nav = function()
	{
		this.nav_area.setFrame(this.title_area.x,this.title_area.y+this.title_area.h+20);
	}
	
	this.resize_common_area = function(the_area)
	{
		var x = this.nav_area.x+this.nav_area.w+20+8;
		var r = this.title_area.x+this.title_area.w+8;
		var nw = r-x-8;
		
		the_area.title_label.setFrame(0,10,nw-20,20);
		the_area.title_label.setFrame(0,10,nw-20,the_area.title_label.desiredHeight());
		the_area.title_div.setFrame(0,the_area.title_label.y+the_area.title_label.h+10,nw,1);
		
		the_area.setFrame(x,this.nav_area.y,nw);
		
		return nw;
	}
	
	this.resize_main_details_area = function()
	{
		var ta = this.details_area;
		var nw = this.resize_common_area(ta);

		var cy = ta.title_div.y+ta.title_div.h+20+5;
		ta.short_desc_label.setFrame(0,cy,nw-40,20);
		ta.short_desc_label.setFrame(0,cy,nw-40,ta.short_desc_label.desiredHeight());
		ta.short_desc_text.setFrame(20, ta.short_desc_label.y+ta.short_desc_label.h+20, nw-40, 120);
		
		cy = ta.short_desc_text.y+ta.short_desc_text.h+20;
		ta.desc_label.setFrame(0,cy,nw-40,20);
		ta.desc_label.setFrame(0,cy,nw-40,ta.desc_label.desiredHeight());
		ta.desc_text.setFrame(20, ta.desc_label.y+ta.desc_label.h+20, nw-40, 120);
		
		ta.restore_button.setFrame(nw-ta.restore_button.w-20, ta.desc_text.y+ta.desc_text.h+20);
		ta.save_button.setFrame(ta.restore_button.x-ta.save_button.w-20, ta.restore_button.y);

		ta.setFrame(ta.x,ta.y,ta.w,ta.restore_button.y+ta.restore_button.h+20);
	}
	
	this.resize_news_area = function()
	{
		var ta = this.news_area;
		var nw = this.resize_common_area(ta);
		
		var cy = ta.title_div.y+ta.title_div.h+10+5;
		for(var i=0;i<ta.news_items.length;i++)
		{
			var ni = ta.news_items[i];
			
			ni.resize(nw);
			
			ni.setFrame(0, cy);
			
			cy = ni.y+ni.h+10;
		}
		
		ta.create_button.setFrame(nw-ta.create_button.w-20, cy+10);
		
		ta.setFrame(ta.x,ta.y,ta.w,ta.create_button.y+ta.create_button.h+20);
	}
	
	this.resize_album_area = function()
	{
		var ta = this.album_area;
		var nw = this.resize_common_area(ta);
		
		ta.setFrame(ta.x,ta.y,ta.w,400);
	}
	
	this.resize_events_area = function()
	{
		var ta = this.events_area;
		var nw = this.resize_common_area(ta);
		
		ta.setFrame(ta.x,ta.y,ta.w,400);
	}
	
	this.resize_fundraisers_area = function()
	{
		var ta = this.fundraisers_area;
		var nw = this.resize_common_area(ta);
		
		ta.setFrame(ta.x,ta.y,ta.w,400);
	}
	
	this.resize_discussions_area = function()
	{
		var ta = this.discussions_area;
		var nw = this.resize_common_area(ta);
		
		ta.setFrame(ta.x,ta.y,ta.w,400);
	}
	
	this.resize_scroll_area = function()
	{
		var USE_H = footer_bar_widget.useH();
		
		var sa_h = USE_H;
		
		var ca = this.nav_area;
		if(ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		ca = this.details_area;
		if(ca.isShown() && ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		ca = this.news_area;
		if(ca.isShown() && ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		ca = this.album_area;
		if(ca.isShown() && ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		ca = this.fundraisers_area;
		if(ca.isShown() && ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		ca = this.discussions_area;
		if(ca.isShown() && ca.y+ca.h+20 > sa_h) sa_h = ca.y+ca.h+20;
		
		this.scroll_view.scroll_area.setFrame(0,0,APP_W,sa_h);
	}
	
	this.window_resize = function()
	{
		var USE_H = footer_bar_widget.useH();
		
		this.setFrame(0,0,APP_W,USE_H);
		this.scroll_view.setFrame(0,0,APP_W,USE_H);
		
		this.iw = APP_W-100;
		if(this.iw > 1000) this.iw = 1000;
		
		this.resize_title();
		this.resize_nav();
		this.resize_main_details_area();
		this.resize_news_area();
		this.resize_album_area();
		this.resize_events_area();
		this.resize_fundraisers_area();
		this.resize_discussions_area();

		this.resize_scroll_area();
	}
	
	this.init();
	this.init_screen_edit_project();
}
