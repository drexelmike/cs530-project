function screen_project()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_project = function()
	{
		var self = this;
		
		this.setBackgroundColor("grey");

		this.scroll_view = new view_iscroll();
		this.addSubview(this.scroll_view);
		
		this.setup_title();
		this.setup_nav();
		this.setup_members_area();
		this.setup_news_area();
		this.setup_album_area();
		this.setup_event_area();
		this.setup_fundraiser_area();
		this.setup_discussion_area();
		
		this.load_dummy_data();
		
		this.loaded_project = null;
		
		this.area_shown = null;
		this.showArea(this.news_area);
	}
	
	this.load_dummy_data = function()
	{
		var self = this;
		
		//nav 
		this.create_dummy_nav_items(this.nav_area.events_area.area_texts, "Event ", function() { self.showArea(self.event_area); });
		this.create_dummy_nav_items(this.nav_area.fundraisers_area.area_texts, "Fundraiser ", function() { self.showArea(self.fundraiser_area); });
		this.create_dummy_nav_items(this.nav_area.discussions_area.area_texts, "Discussion ", function() { self.showArea(self.discussion_area); });
		this.create_dummy_members();
		this.create_dummy_news();
		this.create_dummy_comments();
		this.create_dummy_album();
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
		this.title_area.title_label.element.style.cursor = "pointer";
		this.title_area.title_label.setClickedFunc( function() { self.showArea(self.news_area); } );
		this.title_area.addSubview(this.title_area.title_label);
		
		this.title_area.edit_button = new view_button();
		this.title_area.edit_button.setTitle("Edit Project");
		this.title_area.edit_button.setIdealSize();
		this.title_area.edit_button.actionFunc = function() { self.doEditProject(); };
		this.title_area.addSubview(this.title_area.edit_button);
	}
	
	this.create_nav_common = function(title)
	{
		var ret_obj = {};
		
		ret_obj.title_label = new view_label();
		ret_obj.title_label.setSize("20px");
		ret_obj.title_label.setText(title);
		ret_obj.title_label.element.style.padding = "0px 20px";
		this.nav_area.addSubview(ret_obj.title_label);
		
		ret_obj.area_texts = [];

		ret_obj.area_div = new view();
		ret_obj.area_div.element.style.borderWidth = "0px 0px 4px 0px";
		ret_obj.area_div.element.style.borderStyle = "solid";
		this.nav_area.addSubview(ret_obj.area_div);
		
		return ret_obj;
	}
	
	this.create_nav_item = function(text, actionFunc)
	{
		var ret_obj = new view_label();
		
		ret_obj.setSize("16px");
		ret_obj.setText(text);
		//new_text.setAlignment("center");
		ret_obj.element.style.padding = "0px 30px";
		ret_obj.element.style.cursor = "pointer";
		ret_obj.setClickedFunc( actionFunc );
		
		return ret_obj;
	}
	
	this.create_dummy_nav_items = function(area_texts, name, actionFunc)
	{
		var num = Math.round(random_between(1,5));
		
		for(var i=0;i<num;i++)
		{
			var new_text = this.create_nav_item(name + (i+1), actionFunc);
			this.nav_area.addSubview(new_text);
			area_texts.push(new_text);
		}
	}
	
	this.setup_nav = function()
	{
		var self = this;
		
		this.nav_area = new view();
		this.nav_area.setBackgroundColor("white");
		this.nav_area.element.style.border = "4px solid";
		//this.title_area.element.style.boxSizing = "border-box";
		this.scroll_view.scroll_area.addSubview(this.nav_area);
		
		//photo area
		{
			this.nav_area.photos_label = new view_label();
			this.nav_area.photos_label.setSize("20px");
			this.nav_area.photos_label.setText("Photos");
			this.nav_area.photos_label.element.style.padding = "0px 20px";
			this.nav_area.addSubview(this.nav_area.photos_label);
			
			this.nav_area.photo_b = new view();
			this.nav_area.photo_b.element.style.border = "2px dotted";
			this.nav_area.photo_b.element.style.boxSizing = "border-box";
			this.nav_area.addSubview(this.nav_area.photo_b);
			
			this.nav_area.photo = new view();
			this.nav_area.photo.setBackgroundImage("images/project_dummy" + Math.round(random_between(1,5)) + ".jpg");
			this.nav_area.photo.element.style.backgroundSize = "cover";
			this.nav_area.photo.element.style.backgroundRepeat = "no-repeat";
			this.nav_area.photo.element.style.backgroundPosition = "center";
			this.nav_area.photo.element.style.cursor = "pointer";
			this.nav_area.photo.setClickedFunc( function() { self.showArea(self.album_area); } );
			this.nav_area.addSubview(this.nav_area.photo);
			
			this.nav_area.photo_count_label = new view_label();
			this.nav_area.photo_count_label.setSize("16px");
			this.nav_area.photo_count_label.setText("23 Photos in Album");
			this.nav_area.photo_count_label.setAlignment("center");
			this.nav_area.photo_count_label.element.style.cursor = "pointer";
			this.nav_area.photo_count_label.setClickedFunc( function() { self.showArea(self.album_area); } );
			this.nav_area.addSubview(this.nav_area.photo_count_label);
			
			this.nav_area.photo_div = new view();
			this.nav_area.photo_div.element.style.borderWidth = "0px 0px 4px 0px";
			this.nav_area.photo_div.element.style.borderStyle = "solid";
			this.nav_area.addSubview(this.nav_area.photo_div);
		}
		
		//etc
		this.nav_area.events_area = this.create_nav_common("Events");
		this.nav_area.fundraisers_area = this.create_nav_common("Fundraisers");
		this.nav_area.discussions_area = this.create_nav_common("Discussions");
		
		//hide this one
		this.nav_area.discussions_area.area_div.hide();
	}
	
	this.create_member_view = function(mo)
	{
		var nw = 200;
		
		var ret_view = new view();
		
		ret_view.image_b = new view();
		ret_view.image_b.element.style.border = "2px dotted grey";
		ret_view.image_b.element.style.boxSizing = "border-box";
		ret_view.image_b.setFrame(20,0,nw-40,120);
		ret_view.addSubview(ret_view.image_b);
		
		ret_view.image = new view();
		ret_view.image.setBackgroundImage(mo.image);
		ret_view.image.element.style.backgroundSize = "cover";
		ret_view.image.element.style.backgroundRepeat = "no-repeat";
		ret_view.image.element.style.backgroundPosition = "center";
		ret_view.image.setFrame(ret_view.image_b.x+4,ret_view.image_b.y+4,ret_view.image_b.w-8,ret_view.image_b.h-8);
		ret_view.addSubview(ret_view.image);
		
		ret_view.text = new view_label();
		ret_view.text.setSize("16px");
		ret_view.text.setText(mo.name);
		ret_view.text.setAlignment("center");
		ret_view.text.setFrame(0,ret_view.image_b.y+ret_view.image_b.h+10,nw,ret_view.text.desiredHeight());
		ret_view.addSubview(ret_view.text);
		
		ret_view.setFrame(0,0,nw,ret_view.text.y+ret_view.text.h);
		
		return ret_view;
	}
	
	this.create_dummy_members = function()
	{
		this.clear_members_area();
		
		var num = Math.round(random_between(1,5));
		
		for(var i=0;i<num;i++)
		{
			var mo = {};
			
			mo.name = "Joanna Doe " + (i+1);
			mo.name = "images/woman.jpg";
			
			var new_member = this.create_member_view(mo);
			
			this.members_area.addSubview(new_member);
			
			this.members_area.members.push(new_member);
		}
	}
	
	this.setup_members_area = function()
	{
		this.members_area = new view();
		this.members_area.setBackgroundColor("white");
		this.members_area.element.style.border = "4px solid";
		//this.title_area.element.style.boxSizing = "border-box";
		this.scroll_view.scroll_area.addSubview(this.members_area);
		
		this.members_area.members_label = new view_label();
		this.members_area.members_label.setSize("20px");
		this.members_area.members_label.setText("Members");
		this.members_area.members_label.element.style.padding = "0px 20px";
		this.members_area.addSubview(this.members_area.members_label);
		
		this.members_area.members = [];
	}
	
	this.create_news_item = function(item)
	{
		var ret_view = new view();
		
		ret_view.title = new view_label();
		ret_view.title.setSize("20px");
		ret_view.title.element.style.padding = "0px 20px";
		ret_view.title.setText(item.title + " - " + item.date);
		ret_view.addSubview(ret_view.title);
		
		ret_view.content = new view_label();
		ret_view.content.setSize("16px");
		ret_view.content.element.style.padding = "0px 20px";
		ret_view.content.setText(item.content);
		ret_view.addSubview(ret_view.content);
		
		ret_view.news_div = new view();
		ret_view.news_div.element.style.borderWidth = "0px 0px 2px 0px";
		ret_view.news_div.element.style.borderStyle = "dotted";
		ret_view.addSubview(ret_view.news_div);
		
		return ret_view;
	}
	
	this.create_dummy_news = function()
	{
		var num = Math.round(random_between(1,5));
		
		for(var i=0;i<num;i++)
		{
			var ni = {};
			
			ni.title = "Fundraiser goal met";
			ni.date = "4/12/2016";
			ni.content = "Next week there will be a meetup to do the painting. The fundraiser has finished and we now have enough to buy all the materials.";
			
			var new_item = this.create_news_item(ni);
			
			this.news_area.addSubview(new_item);
			this.news_area.news_items.push(new_item);
		}
	}
	
	this.setup_news_area = function()
	{
		this.news_area = new view();
		this.news_area.setBackgroundColor("white");
		this.news_area.element.style.border = "4px solid";
		//this.title_area.element.style.boxSizing = "border-box";
		this.scroll_view.scroll_area.addSubview(this.news_area);
		
		this.news_area.desc_label = new view_label();
		this.news_area.desc_label.setSize("16px");
		this.news_area.desc_label.setText("This is the project description. Here it is mentioned about how this project wants to either repaint an abandoned house or plant a garden in an abandoned lot etc. It will great new members and try to convince them to join and donate etc. Otherwise a lot of random stuff about what they are doing etc.");
		this.news_area.desc_label.element.style.padding = "0px 20px";
		this.news_area.addSubview(this.news_area.desc_label);
		
		this.news_area.desc_div = new view();
		this.news_area.desc_div.element.style.borderWidth = "0px 0px 4px 0px";
		this.news_area.desc_div.element.style.borderStyle = "solid";
		this.news_area.addSubview(this.news_area.desc_div);
		
		this.news_area.news_items = [];
		
		this.news_area.see_older_button = new view_button();
		this.news_area.see_older_button.setTitle("See Older News >>");
		this.news_area.see_older_button.setIdealSize();
		//this.news_area.see_older_button.actionFunc = function() { self.doSeeOlderNews(); };
		this.news_area.addSubview(this.news_area.see_older_button);
		
		this.news_area.hide();
	}
	
	this.create_album_image = function(image)
	{
		var self = this;
		
		var ret_view = new view();
		
		ret_view.setFrame(0,0,160,120);
		
		ret_view.image_loc = image;
		
		ret_view.image_b = new view();
		ret_view.image_b.element.style.border = "2px dotted";
		ret_view.image_b.element.style.boxSizing = "border-box";
		ret_view.image_b.setFrame(0,0,ret_view.w,ret_view.h);
		ret_view.addSubview(ret_view.image_b);
		
		ret_view.image = new view();
		ret_view.image.setBackgroundImage(ret_view.image_loc);
		ret_view.image.element.style.backgroundSize = "cover";
		ret_view.image.element.style.backgroundRepeat = "no-repeat";
		ret_view.image.element.style.backgroundPosition = "center";
		ret_view.image.element.style.cursor = "pointer";
		ret_view.image.setClickedFunc( function() { self.selectAlbumImage(ret_view); } );
		ret_view.image.setFrame(4,4,ret_view.w-8,ret_view.h-8);
		ret_view.addSubview(ret_view.image);
		
		return ret_view;
	}
	
	this.create_dummy_album = function()
	{
		var num = Math.round(random_between(5,15));
		
		for(var i=0;i<num;i++)
		{
			var new_item = this.create_album_image("images/project_dummy" + Math.round(random_between(1,5)) + ".jpg");
			
			this.album_area.addSubview(new_item);
			
			this.album_area.images.push(new_item);
		}
		
		if(num)
			this.selectAlbumImage(this.album_area.images[0]);
	}
	
	this.setup_album_area = function()
	{
		this.album_area = new view();
		this.album_area.setBackgroundColor("white");
		this.album_area.element.style.border = "4px solid";
		//this.title_area.element.style.boxSizing = "border-box";
		this.scroll_view.scroll_area.addSubview(this.album_area);
		
		this.album_area.main_image_b = new view();
		this.album_area.main_image_b.element.style.border = "2px dotted grey";
		this.album_area.main_image_b.element.style.boxSizing = "border-box";
		this.album_area.addSubview(this.album_area.main_image_b);
		
		this.album_area.main_image = new view();
		this.album_area.main_image.element.style.backgroundSize = "cover";
		this.album_area.main_image.element.style.backgroundRepeat = "no-repeat";
		this.album_area.main_image.element.style.backgroundPosition = "center";
		this.album_area.addSubview(this.album_area.main_image);
		
		this.album_area.main_div = new view();
		this.album_area.main_div.element.style.borderWidth = "0px 0px 4px 0px";
		this.album_area.main_div.element.style.borderStyle = "solid";
		this.album_area.addSubview(this.album_area.main_div);
		
		this.album_area.images = [];
		
		this.album_area.hide();
	}
	
	this.setup_event_area = function()
	{
		this.event_area = new view();
		this.event_area.setBackgroundColor("white");
		this.event_area.element.style.border = "4px solid";
		this.scroll_view.scroll_area.addSubview(this.event_area);
		
		this.event_area.title_label = new view_label();
		this.event_area.title_label.setSize("20px");
		this.event_area.title_label.setText("Event Title");
		this.event_area.title_label.element.style.padding = "0px 20px";
		this.event_area.addSubview(this.event_area.title_label);
		
		this.event_area.loc_label = new view_label();
		this.event_area.loc_label.setSize("18px");
		this.event_area.loc_label.setText("Location: Some Place");
		this.event_area.loc_label.element.style.padding = "0px 20px";
		this.event_area.addSubview(this.event_area.loc_label);
		
		this.event_area.start_label = new view_label();
		this.event_area.start_label.setSize("18px");
		this.event_area.start_label.setText("Start Date: 5:00 PM 4/6/2016");
		this.event_area.start_label.element.style.padding = "0px 20px";
		this.event_area.addSubview(this.event_area.start_label);
		
		this.event_area.end_label = new view_label();
		this.event_area.end_label.setSize("18px");
		this.event_area.end_label.setText("End Date: 7:00 PM 4/6/2016");
		this.event_area.end_label.element.style.padding = "0px 20px";
		this.event_area.addSubview(this.event_area.end_label);
		
		this.event_area.desc_label = new view_label();
		this.event_area.desc_label.setSize("16px");
		this.event_area.desc_label.setText("Today we are meeting at the site to repaint the building. If you have your own tools please bring them. otherwise tools will be provided. Some people may be working on the garden instead.");
		this.event_area.desc_label.element.style.padding = "0px 20px";
		this.event_area.addSubview(this.event_area.desc_label);
		
		this.event_area.hide();
	}
	
	this.setup_fundraiser_area = function()
	{
		this.fundraiser_area = new view();
		this.fundraiser_area.setBackgroundColor("white");
		this.fundraiser_area.element.style.border = "4px solid";
		this.scroll_view.scroll_area.addSubview(this.fundraiser_area);
		
		this.fundraiser_area.title_label = new view_label();
		this.fundraiser_area.title_label.setSize("20px");
		this.fundraiser_area.title_label.setText("Fundraiser Title");
		this.fundraiser_area.title_label.element.style.padding = "0px 20px";
		this.fundraiser_area.addSubview(this.fundraiser_area.title_label);
		
		this.fundraiser_area.goal_label = new view_label();
		this.fundraiser_area.goal_label.setSize("18px");
		this.fundraiser_area.goal_label.setText("Goal: $50");
		this.fundraiser_area.goal_label.element.style.padding = "0px 20px";
		this.fundraiser_area.addSubview(this.fundraiser_area.goal_label);
		
		this.fundraiser_area.date_label = new view_label();
		this.fundraiser_area.date_label.setSize("18px");
		this.fundraiser_area.date_label.setText("Goal Date: 4/6/2016");
		this.fundraiser_area.date_label.element.style.padding = "0px 20px";
		this.fundraiser_area.addSubview(this.fundraiser_area.date_label);
		
		this.fundraiser_area.link_label = new view_label();
		this.fundraiser_area.link_label.setSize("18px");
		this.fundraiser_area.link_label.setText("Link: http://www.kickstarter.com/etc");
		this.fundraiser_area.link_label.element.style.padding = "0px 20px";
		this.fundraiser_area.addSubview(this.fundraiser_area.link_label);
		
		this.fundraiser_area.hide();
	}
	
	this.create_comment_view = function(c)
	{
		var ret_view = new view();
		
		ret_view.main_image_b = new view();
		ret_view.main_image_b.element.style.border = "2px dotted grey";
		ret_view.main_image_b.element.style.boxSizing = "border-box";
		ret_view.addSubview(ret_view.main_image_b);
		
		ret_view.main_image = new view();
		ret_view.main_image.setBackgroundImage(c.user.image);
		ret_view.main_image.element.style.backgroundSize = "cover";
		ret_view.main_image.element.style.backgroundRepeat = "no-repeat";
		ret_view.main_image.element.style.backgroundPosition = "center";
		ret_view.addSubview(ret_view.main_image);
		
		ret_view.member_label = new view_label();
		ret_view.member_label.setSize("18px");
		ret_view.member_label.setText(c.user.name);
		ret_view.addSubview(ret_view.member_label);
		
		ret_view.date_label = new view_label();
		ret_view.date_label.setSize("18px");
		ret_view.date_label.setText(c.date);
		ret_view.date_label.setTextAlign("right");
		ret_view.addSubview(ret_view.date_label);
		
		ret_view.content_label = new view_label();
		ret_view.content_label.setSize("16px");
		ret_view.content_label.setText(c.message);
		ret_view.addSubview(ret_view.content_label);
		
		ret_view.comment_div = new view();
		ret_view.comment_div.element.style.borderWidth = "0px 0px 2px 0px";
		ret_view.comment_div.element.style.borderStyle = "dotted";
		ret_view.addSubview(ret_view.comment_div);
		
		return ret_view;
	}
	
	this.create_dummy_comments = function()
	{
		var num = Math.round(random_between(1,5));
		
		for(var i=0;i<num;i++)
		{
			var nc = {};
			
			nc.user = {};
			nc.user.name = "The Member Name";
			nc.user.image = "images/woman.jpg";
			nc.date = "4/5/2016";
			nc.message = "Are we still meeting up this tuesday? Has anyone called to see if the owner is ok with us fixing up the lot? We need to figure out where we can get some cheap materials.";
			
			var new_item = this.create_comment_view(nc);
			
			this.discussion_area.addSubview(new_item);
			
			this.discussion_area.comments.push(new_item);
		}
	}
	
	this.setup_discussion_area = function()
	{
		this.discussion_area = new view();
		this.discussion_area.setBackgroundColor("white");
		this.discussion_area.element.style.border = "4px solid";
		this.scroll_view.scroll_area.addSubview(this.discussion_area);
		
		this.discussion_area.title_label = new view_label();
		this.discussion_area.title_label.setSize("20px");
		this.discussion_area.title_label.setText("Discussion Title");
		this.discussion_area.title_label.element.style.padding = "0px 20px";
		this.discussion_area.addSubview(this.discussion_area.title_label);
		
		this.discussion_area.title_div = new view();
		this.discussion_area.title_div.element.style.borderWidth = "0px 0px 4px 0px";
		this.discussion_area.title_div.element.style.borderStyle = "solid";
		this.discussion_area.addSubview(this.discussion_area.title_div);
		
		this.discussion_area.comments = [];
		
		this.discussion_area.new_text = new view_textarea();
		this.discussion_area.addSubview(this.discussion_area.new_text);
		
		this.discussion_area.add_button = new view_button();
		this.discussion_area.add_button.setTitle("Add New Comment");
		this.discussion_area.add_button.setIdealSize();
		this.discussion_area.addSubview(this.discussion_area.add_button);
		
		this.discussion_area.hide();
	}
	
	this.load_members = function(p)
	{
		this.clear_members_area();
		
		for(var i=0;i<p.members.length;i++)
		{
			var new_member = this.create_member_view(p.members[i]);
			
			this.members_area.addSubview(new_member);
			
			this.members_area.members.push(new_member);
		}
	}
	
	this.clear_members_area = function()
	{
		for(var i=0;i<this.members_area.members.length;i++)
			this.members_area.members[i].removeFromSuperView();
			
		this.members_area.members = [];
	}
	
	this.load_nav_area = function(p)
	{
		var self = this;
		
		this.clear_nav_area();
		
		var area_texts = this.nav_area.events_area.area_texts;
		for(var i=0;i<p.events.length;i++)
		{
			var item = p.events[i];
			
			var nav_item = this.create_nav_item(item.name, function(the_item) { return function() { self.loadEvent(the_item); }; }(item) );
			
			area_texts.push(nav_item);
			this.nav_area.addSubview(nav_item);
		}
		
		var area_texts = this.nav_area.fundraisers_area.area_texts;
		for(var i=0;i<p.fundraisers.length;i++)
		{
			var item = p.fundraisers[i];
			
			var nav_item = this.create_nav_item(item.name, function(the_item) { return function() { self.loadFundraiser(the_item); }; }(item) );
			
			area_texts.push(nav_item);
			this.nav_area.addSubview(nav_item);
		}
		
		var area_texts = this.nav_area.discussions_area.area_texts;
		for(var i=0;i<p.discussions.length;i++)
		{
			var item = p.discussions[i];
			
			var nav_item = this.create_nav_item(item.name, function(the_item) { return function() { self.loadDiscussion(the_item); }; }(item) );
			
			area_texts.push(nav_item);
			this.nav_area.addSubview(nav_item);
		}
		
		//this.create_dummy_nav_items(this.nav_area.events_area.area_texts, "Event ", function() { self.showArea(self.event_area); });
		//this.create_dummy_nav_items(this.nav_area.fundraisers_area.area_texts, "Fundraiser ", function() { self.showArea(self.fundraiser_area); });
		//this.create_dummy_nav_items(this.nav_area.discussions_area.area_texts, "Discussion ", function() { self.showArea(self.discussion_area); });
	}
	
	this.clear_nav_area = function()
	{
		var area_texts;
		
		area_texts = this.nav_area.events_area.area_texts;
		for(var i=0;i<area_texts.length;i++) area_texts[i].removeFromSuperView();
		
		area_texts = this.nav_area.fundraisers_area.area_texts;
		for(var i=0;i<area_texts.length;i++) area_texts[i].removeFromSuperView();
		
		area_texts = this.nav_area.discussions_area.area_texts;
		for(var i=0;i<area_texts.length;i++) area_texts[i].removeFromSuperView();
		
		this.nav_area.events_area.area_texts = [];
		this.nav_area.fundraisers_area.area_texts = [];
		this.nav_area.discussions_area.area_texts = [];
	}
	
	this.load_album_area = function(p)
	{
		this.clear_album_area();
		
		for(var i=0;i<p.album.length;i++)
		{
			var new_item = this.create_album_image(p.album[i]);
			
			this.album_area.addSubview(new_item);
			this.album_area.images.push(new_item);
		}
		
		if(p.album.length)
			this.selectAlbumImage(this.album_area.images[0]);
	}
	
	this.clear_album_area = function()
	{
		for(var i=0;i<this.album_area.images.length;i++)
			this.album_area.images[i].removeFromSuperView();
		
		this.album_area.images = [];
	}
	
	this.load_news_area = function(p)
	{
		this.clear_news_area();
		
		this.news_area.desc_label.setText(p.description);
		
		for(var i=p.news_items.length-1;i>=0;i--)
		{
			var new_item = this.create_news_item(p.news_items[i]);
			this.news_area.addSubview(new_item);
			this.news_area.news_items.push(new_item);
		}
	}
	
	this.clear_news_area = function()
	{
		for(var i=0;i<this.news_area.news_items.length;i++)
			this.news_area.news_items[i].removeFromSuperView();
		
		this.news_area.news_items = [];
	}
	
	this.loadDiscussion = function(item)
	{
		this.discussion_area.title_label.setText(item.name);
		
		//clear current comments
		for(var i=0;i<this.discussion_area.comments.length;i++)
			this.discussion_area.comments[i].removeFromSuperView();
		
		this.discussion_area.comments = [];
		
		for(var i=0;i<item.comments.length;i++)
		{
			var new_item = this.create_comment_view(item.comments[i]);
			
			this.discussion_area.addSubview(new_item);
			this.discussion_area.comments.push(new_item);
		}
		
		this.window_resize();

		this.showArea(this.discussion_area);
	}
	
	this.loadFundraiser = function(item)
	{
		this.fundraiser_area.title_label.setText(item.name);
		this.fundraiser_area.goal_label.setText("Goal: $" + item.goal);
		this.fundraiser_area.date_label.setText("Goal Date: " + item.goal_date);
		this.fundraiser_area.link_label.setText("Link: " + item.link);
		
		this.window_resize();

		this.showArea(this.fundraiser_area);
	}
	
	this.loadEvent = function(item)
	{
		this.event_area.title_label.setText(item.name);
		this.event_area.loc_label.setText("Location: " + item.location);
		this.event_area.start_label.setText("Start Date: " + item.start_date);
		this.event_area.end_label.setText("End Date: " + item.end_date);
		this.event_area.desc_label.setText(item.description);
		
		this.window_resize();
		
		this.showArea(this.event_area);
	}
	
	this.loadProject = function(p)
	{
		this.title_area.title_label.setText(p.name);
		this.nav_area.photo.setBackgroundImage(p.image);
		
		this.load_news_area(p);
		this.load_members(p);
		this.load_nav_area(p);
		this.load_album_area(p);
		
		this.loaded_project = p;
		
		this.window_resize();
		
		this.showArea(this.news_area);
	}
	
	this.doEditProject = function()
	{
		if(this.loaded_project != null)
		{
			edit_project_screen.loadProject(this.loaded_project);
			load_screen(edit_project_screen);
		}
	}
	
	this.selectAlbumImage = function(album_image)
	{
		this.album_area.main_image.setBackgroundImage(album_image.image_loc);
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
	
	this.resize_nav_common_area = function(common_area, nw, start_y)
	{
		var ats = common_area.area_texts;
		
		common_area.title_label.setFrame(0,start_y,nw-40,common_area.title_label.desiredHeight());
		if(ats.length) 
		{
			var ct = ats[0];
			ct.setFrame(0,common_area.title_label.y+common_area.title_label.h+10,nw-60,20);
			ct.setFrame(ct.x,ct.y,ct.w,ct.desiredHeight());
		}
		for(var i=1;i<ats.length;i++)
		{
			var ct = ats[i];
			ct.setFrame(0,ats[i-1].y+ats[i-1].h+10,ats[i-1].w,ats[i-1].h);
			ct.setFrame(ct.x,ct.y,ct.w,ct.desiredHeight());
		}
		if(ats.length)
		{
			var lt = ats[ats.length-1];
			common_area.area_div.setFrame(0,lt.y+lt.h+20,nw,1);
		}
		else
			common_area.area_div.setFrame(0,common_area.title_label.y+common_area.title_label.h+20,nw,1);
	}
	
	this.resize_nav = function()
	{
		var nw = 200;
		
		//photos
		this.nav_area.photos_label.setFrame(0,20,nw-40,this.nav_area.photos_label.desiredHeight());
		this.nav_area.photo_b.setFrame(20,this.nav_area.photos_label.y+this.nav_area.photos_label.h+10,nw-40,120);
		this.nav_area.photo.setFrame(this.nav_area.photo_b.x+4,this.nav_area.photo_b.y+4,this.nav_area.photo_b.w-8,this.nav_area.photo_b.h-8);
		this.nav_area.photo_count_label.setFrame(20,this.nav_area.photo.y+this.nav_area.photo.h+10,nw-40,this.nav_area.photo_count_label.desiredHeight());
		this.nav_area.photo_div.setFrame(0,this.nav_area.photo_count_label.y+this.nav_area.photo_count_label.h+20,nw,1);
		
		//etc
		this.resize_nav_common_area(this.nav_area.events_area, nw, this.nav_area.photo_div.y+25);
		this.resize_nav_common_area(this.nav_area.fundraisers_area, nw, this.nav_area.events_area.area_div.y+25);
		this.resize_nav_common_area(this.nav_area.discussions_area, nw, this.nav_area.fundraisers_area.area_div.y+25);
		
		this.nav_area.setFrame(this.title_area.x,this.title_area.y+this.title_area.h+20,nw,this.nav_area.discussions_area.area_div.y);
	}
	
	this.resize_members_area = function()
	{
		var nw = 200;
		var ms = this.members_area.members;
		
		this.members_area.members_label.setFrame(0,20,nw-40,this.members_area.members_label.desiredHeight());
		
		if(ms.length) ms[0].setFrame(0,this.members_area.members_label.y+this.members_area.members_label.h+10);
		for(var i=1;i<ms.length;i++)
			ms[i].setFrame(0,ms[i-1].y+ms[i-1].h+10);
		
		if(ms.length)
			this.members_area.setFrame(this.title_area.x+this.title_area.w-200, this.title_area.y+this.title_area.h+20, nw, ms[ms.length-1].y+ms[ms.length-1].h+20);
		else
			this.members_area.setFrame(this.title_area.x+this.title_area.w-200, this.title_area.y+this.title_area.h+20, nw, this.members_area.members_label.y+this.members_area.members_label.h+20);
	}
	
	this.resize_news_item = function(news_item, sy, aw)
	{
		news_item.title.setFrame(0,0,aw-40,20);
		news_item.title.setFrame(0,0,aw-40,news_item.title.desiredHeight());
		news_item.content.setFrame(0,news_item.title.y+news_item.title.h+10,aw-40,20);
		news_item.content.setFrame(0,news_item.title.y+news_item.title.h+10,aw-40,news_item.content.desiredHeight());
		news_item.news_div.setFrame(0,news_item.content.y+news_item.content.h+20,aw,1);
		
		news_item.setFrame(0,sy,aw,news_item.news_div.y+5);
	}
	
	this.resize_news_area = function()
	{
		var ax = this.nav_area.x+this.nav_area.w+20+8;
		var ar = this.members_area.x-20;
		var aw = ar-ax-8;
		
		this.news_area.desc_label.setFrame(0,20,aw-40,20);
		this.news_area.desc_label.setFrame(0,20,aw-40,this.news_area.desc_label.desiredHeight());
		this.news_area.desc_div.setFrame(0,this.news_area.desc_label.y+this.news_area.desc_label.h+20,aw,1);
		
		var ncy = this.news_area.desc_div.y+5+20;
		for(var i=0;i<this.news_area.news_items.length;i++)
		{
			var ni = this.news_area.news_items[i];
			
			this.resize_news_item(ni, ncy, aw);
			
			ncy = ni.y+ni.h+20;
		}
		
		//button placement
		if(this.news_area.news_items.length)
		{
			var lni = this.news_area.news_items[this.news_area.news_items.length-1];
			
			this.news_area.see_older_button.setFrame(aw-this.news_area.see_older_button.w-20,lni.y+lni.h+20);
			this.news_area.see_older_button.show();
		}
		else
			this.news_area.see_older_button.hide();
		
		//news area height
		if(this.news_area.news_items.length)
		{
			this.news_area.setFrame(ax,this.nav_area.y,aw,this.news_area.see_older_button.y+this.news_area.see_older_button.h+20);
			
			this.news_area.desc_div.show();
		}
		else
		{
			this.news_area.setFrame(ax,this.nav_area.y,aw,this.news_area.desc_div.y);
			
			this.news_area.desc_div.hide();
		}
	}
	
	this.resize_album_area = function()
	{
		var ax = this.nav_area.x+this.nav_area.w+20+8;
		var ar = this.members_area.x-20;
		var aw = ar-ax-8;
		
		this.album_area.main_image_b.setFrame(20,20,aw-40,(aw-40) * 120 / 160);
		var ib = this.album_area.main_image_b;
		this.album_area.main_image.setFrame(ib.x+4,ib.y+4,ib.w-8,ib.h-8);
		
		this.album_area.main_div.setFrame(0,ib.y+ib.h+20,aw,1);
		
		//place individual images
		if(this.album_area.images.length)
		{
			var iw = this.album_area.images[0].w;
			var sy = this.album_area.main_div.y+5+20;
			var cols = Math.floor((aw-40) / (iw + 30));
		
			if(cols < 1) cols = 1;
			
			//console.log("APP_W - " + APP_W);
			//console.log("iw - " + iw);
			//console.log("cols - " + cols);
			
			for(var i=0;i<this.album_area.images.length;i++)
			{
				var p = this.album_area.images[i];
				var c = i % cols;
				var r = Math.floor(i / cols);
				
				//p.view.setFrame((c) * (APP_W / (cols)) + (p.view.w / 2),r * (p.view.h + 20));
				p.setFrame((c) * ((aw-40) / (cols)) + ((((aw-40) / cols) - iw) / 2) + 15,r * (p.h + 20) + sy);
				
				//console.log("c - " + c);
				//console.log("x - " + p.x);
				//console.log("y - " + p.y);
			}
		}
		
		if(this.album_area.images.length)
		{
			var li = this.album_area.images[this.album_area.images.length-1];
			
			this.album_area.setFrame(ax,this.nav_area.y,aw,li.y+li.h+20);
			
			this.album_area.main_div.show();
		}
		else
		{
			this.album_area.setFrame(ax,this.nav_area.y,aw,this.album_area.main_div.y);
			
			this.album_area.main_div.hide();
		}
	}
	
	this.resize_event_area = function()
	{
		var ax = this.nav_area.x+this.nav_area.w+20+8;
		var ar = this.members_area.x-20;
		var aw = ar-ax-8;
		
		var ll = [];
		
		ll.push(this.event_area.title_label);
		ll.push(this.event_area.loc_label);
		ll.push(this.event_area.start_label);
		ll.push(this.event_area.end_label);
		ll.push(this.event_area.desc_label);
		
		var cy = 20;
		for(var i=0;i<ll.length;i++)
		{
			var item = ll[i];
			
			item.setFrame(0,cy,aw-40,30);
			item.setFrame(0,cy,aw-40,item.desiredHeight());
			
			cy = item.y+item.h+10;
		}
		
		this.event_area.setFrame(ax,this.nav_area.y,aw,this.event_area.desc_label.y+this.event_area.desc_label.h+20);
	}
	
	this.resize_fundraiser_area = function()
	{
		var ax = this.nav_area.x+this.nav_area.w+20+8;
		var ar = this.members_area.x-20;
		var aw = ar-ax-8;
		
		var ll = [];
		
		ll.push(this.fundraiser_area.title_label);
		ll.push(this.fundraiser_area.goal_label);
		ll.push(this.fundraiser_area.date_label);
		ll.push(this.fundraiser_area.link_label);
		
		var cy = 20;
		for(var i=0;i<ll.length;i++)
		{
			var item = ll[i];
			
			item.setFrame(0,cy,aw-40,30);
			item.setFrame(0,cy,aw-40,item.desiredHeight());
			
			cy = item.y+item.h+10;
		}
		
		this.fundraiser_area.setFrame(ax,this.nav_area.y,aw,this.fundraiser_area.link_label.y+this.fundraiser_area.link_label.h+20);
	}
	
	this.resize_comment = function(comment, cy, aw)
	{
		comment.main_image_b.setFrame(20,0,160,120);
		comment.main_image.setFrame(20+4,4,160-8,120-8);
		var mlx = comment.main_image_b.x+comment.main_image_b.w+10;
		comment.member_label.setFrame(mlx, comment.main_image_b.y, aw-mlx-20,30);
		comment.member_label.setFrame(comment.member_label.x, comment.member_label.y, comment.member_label.w, comment.member_label.desiredHeight());
		comment.date_label.setFrame(comment.member_label.x, comment.member_label.y, comment.member_label.w, comment.member_label.h);
		
		comment.content_label.setFrame(comment.member_label.x, comment.member_label.y+comment.member_label.h, comment.member_label.w);
		comment.content_label.setFrame(comment.member_label.x, comment.member_label.y+comment.member_label.h, comment.member_label.w, comment.content_label.desiredHeight());
		
		var img_h = comment.main_image_b.y+comment.main_image_b.h+20;
		var con_h = comment.content_label.y+comment.content_label.h+20;
		
		if(img_h > con_h)
			comment.comment_div.setFrame(0,img_h,aw,1);
		else
			comment.comment_div.setFrame(0,con_h,aw,1);
		
		comment.setFrame(0,cy,aw,comment.comment_div.y+3);
	}
	
	this.resize_discussion_area = function()
	{
		var ax = this.nav_area.x+this.nav_area.w+20+8;
		var ar = this.members_area.x-20;
		var aw = ar-ax-8;
		
		this.discussion_area.title_label.setFrame(0,20,aw-40,30);
		this.discussion_area.title_label.setFrame(0,20,aw-40,this.discussion_area.title_label.desiredHeight());
		this.discussion_area.title_div.setFrame(0,this.discussion_area.title_label.y+this.discussion_area.title_label.h+20,aw,1);
		
		var cy = this.discussion_area.title_div.y+this.discussion_area.title_div.h+5+20;
		for(var i=0;i<this.discussion_area.comments.length;i++)
		{
			var item = this.discussion_area.comments[i];
			
			this.resize_comment(item, cy, aw);
			
			cy = item.y+item.h+20;
		}
		
		this.discussion_area.new_text.setFrame(20,cy,aw-40,80);
		
		this.discussion_area.add_button.setFrame(aw-this.discussion_area.add_button.w-20, this.discussion_area.new_text.y+this.discussion_area.new_text.h+20);
		
		this.discussion_area.setFrame(ax,this.nav_area.y,aw,this.discussion_area.add_button.y+this.discussion_area.add_button.h+20);
	}
	
	this.resize_scroll_area = function()
	{
		var sa_h = 0;
		if(this.nav_area.y+this.nav_area.h+20 > sa_h)
			sa_h = this.nav_area.y+this.nav_area.h+20;
		if(this.members_area.y+this.members_area.h+20 > sa_h)
			sa_h = this.members_area.y+this.members_area.h+20;
		if(this.news_area.isShown() && this.news_area.y+this.news_area.h+20 > sa_h)
			sa_h = this.news_area.y+this.news_area.h+20;
		if(this.album_area.isShown() && this.album_area.y+this.album_area.h+20 > sa_h)
			sa_h = this.album_area.y+this.album_area.h+20;
		if(this.event_area.isShown() && this.event_area.y+this.event_area.h+20 > sa_h)
			sa_h = this.event_area.y+this.event_area.h+20;
		if(this.fundraiser_area.isShown() && this.fundraiser_area.y+this.fundraiser_area.h+20 > sa_h)
			sa_h = this.fundraiser_area.y+this.fundraiser_area.h+20;
		if(this.discussion_area.isShown() && this.discussion_area.y+this.discussion_area.h+20 > sa_h)
			sa_h = this.discussion_area.y+this.discussion_area.h+20;
		
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
		this.resize_members_area();
		this.resize_news_area();
		this.resize_album_area();
		this.resize_event_area();
		this.resize_fundraiser_area();
		this.resize_discussion_area();
		
		this.resize_scroll_area();
	}

	this.init();
	this.init_screen_project();
}
