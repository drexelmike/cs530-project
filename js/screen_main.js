function screen_main()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_screen_main = function()
	{
		var self = this;

		this.cur_proj_list = [];
		this.p_item_w = 200;
		
		this.scroll_view = new view_iscroll();
		this.addSubview(this.scroll_view);
		
		this.title_label = new view_label();
		this.title_label.setSize("40px");
		this.title_label.setText("Project Philly");
		//this.title_label.setColor("white");
		this.title_label.setAlignment("center");
		this.scroll_view.scroll_area.addSubview(this.title_label);
		
		this.desc_label = new view_label();
		//this.desc_label.setSize("40px");
		this.desc_label.setText("Welcome to the Project Philly site. This site is dedicated to providing a platform for residents of Philadelphia so that they can indentify and participate in civil projects without waiting for the city. To begin simply either find a project that you like or start a new one. Some examples may be simply repainting an abandoned house in the neighborhood or planting a garden on an empty trashed lot. To use the fully you need to create an account. To create an account or log in see the bottom right of the page.");
		this.desc_label.setAlignment("justify");
		this.scroll_view.scroll_area.addSubview(this.desc_label);
		
		this.projects_area = new view();
		//this.projects_area.setBackgroundColor("grey");
		this.scroll_view.scroll_area.addSubview(this.projects_area);
		
		this.loadDummyProjects();
		this.loadProjects(database.projects);
	}
	
	this.window_resize = function()
	{
		var p_area_y = 20 + this.desc_label.y + this.desc_label.desiredHeight();
		var USE_H = footer_bar_widget.useH();
		
		this.setFrame(0,0,APP_W,USE_H);
		this.scroll_view.setFrame(0,0,APP_W,USE_H);
		this.title_label.setFrame(0,40,APP_W,44);
		this.desc_label.setFrame(50,100,APP_W-100,44);
		this.projects_area.setFrame(0,p_area_y,APP_W,USE_H-p_area_y);
		
		this.placeProjects();
		
		this.scroll_view.scroll_area.setFrame(0,0,APP_W,this.projects_area.y + this.projects_area.h);
	}
	
	this.createNameLabel = function(p)
	{
		var name_label = new view_label();
		
		name_label.setText(p.name);
		name_label.setColor("white");
		name_label.setBold(true);
		name_label.setAlignment("center");
		name_label.setSize("20px");
		name_label.ellipseOverflow(true);
		name_label.ignoresUserInteraction(true);
		
		return name_label;
	}
	
	this.createProjectItem = function(p)
	{
		var self = this;
		var new_item = new view();

		new_item.setFrame(0,0,this.p_item_w,300);
		//new_item.setBackgroundColor("yellow");
		
		new_item.p_image = new view();
		new_item.p_image.element.style.border = "2px dotted";
		new_item.p_image.element.style.boxSizing = "border-box";
		new_item.p_image.setFrame(0,0,new_item.w,200);
		new_item.addSubview(new_item.p_image);
		
		new_item.p_image = new view();
		new_item.p_image.setBackgroundImage(p.image);
		new_item.p_image.element.style.backgroundSize = "cover";
		new_item.p_image.element.style.backgroundRepeat = "no-repeat";
		new_item.p_image.element.style.backgroundPosition = "center";
		new_item.p_image.element.style.cursor = "pointer";
		new_item.p_image.setClickedFunc( function() { self.clickProject(p); } );
		new_item.p_image.setFrame(4,4,new_item.w-8,200-8);
		new_item.addSubview(new_item.p_image);
		
		//text border
		{
			new_item.name_label = [];
			
			var i=0;
			new_item.name_label[i] = this.createNameLabel(p);
			new_item.name_label[i].setColor("black");
			new_item.name_label[i].setFrame(0+1,new_item.p_image.h-30,new_item.w,30);
			new_item.addSubview(new_item.name_label[i]);
			
			i=1;
			new_item.name_label[i] = this.createNameLabel(p);
			new_item.name_label[i].setColor("black");
			new_item.name_label[i].setFrame(0,new_item.p_image.h-30+1,new_item.w,30);
			new_item.addSubview(new_item.name_label[i]);
			
			i=2;
			new_item.name_label[i] = this.createNameLabel(p);
			new_item.name_label[i].setColor("black");
			new_item.name_label[i].setFrame(0-1,new_item.p_image.h-30,new_item.w,30);
			new_item.addSubview(new_item.name_label[i]);
			
			i=3;
			new_item.name_label[i] = this.createNameLabel(p);
			new_item.name_label[i].setColor("black");
			new_item.name_label[i].setFrame(0,new_item.p_image.h-30-1,new_item.w,30);
			new_item.addSubview(new_item.name_label[i]);
			
			i=4;
			new_item.name_label[i] = this.createNameLabel(p);
			new_item.name_label[i].setColor("white");
			new_item.name_label[i].setFrame(0,new_item.p_image.h-30,new_item.w,30);
			new_item.addSubview(new_item.name_label[i]);
		}
		
		new_item.desc_label = new view_label();
		new_item.desc_label.setText(p.short_description);
		//new_item.desc_label.element.style.padding = "10px";
		//new_item.desc_label.element.style.whiteSpace = "nowrap";
		new_item.desc_label.element.style.overflow = "hidden";
		//new_item.desc_label.element.style.textOverflow = "ellipsis";
		new_item.desc_label.element.style.display = "-webkit-box";
		new_item.desc_label.element.style.WebkitLineClamp = 4;
		new_item.desc_label.element.style.WebkitBoxOrient = "vertical";
		new_item.desc_label.setFrame(10,new_item.p_image.h+10,new_item.w-20,new_item.h-new_item.p_image.h-30);
		new_item.addSubview(new_item.desc_label);
		
		return new_item;
	}
	
	this.clickProject = function(p)
	{
		project_screen.loadProject(p);
		load_screen(project_screen);
	}
	
	this.loadProjects = function(p_list)
	{
		console.log(p_list);
		
		this.clearCurrentProjects();

		for(var i=0;i<p_list.length;i++)
		{
			var p = p_list[i];
			var nv = this.createProjectItem(p);
			
			//p.view = this.createProjectItem(p);
			this.cur_proj_list.push(nv);
			
			this.projects_area.addSubview(nv);
		}
		
		//this.cur_proj_list = p_list;
		
		this.placeProjects();
	}
	
	this.placeProjects = function()
	{
		var cols = Math.floor((APP_W-100) / (this.p_item_w + 50));
		
		if(cols < 1) cols = 1;
		
		//console.log("APP_W - " + APP_W);
		//console.log("this.p_item_w - " + this.p_item_w);
		//console.log("cols - " + cols);
		
		for(var i=0;i<this.cur_proj_list.length;i++)
		{
			var p = this.cur_proj_list[i];
			var c = i % cols;
			var r = Math.floor(i / cols);
			
			//p.view.setFrame((c) * (APP_W / (cols)) + (p.view.w / 2),r * (p.view.h + 20));
			p.setFrame((c) * ((APP_W-100) / (cols)) + ((((APP_W-100) / cols) - this.p_item_w) / 2) + 50,r * (p.h + 20));
			
			//console.log("c - " + c);
			//console.log("x - " + p.view.x);
			//console.log("y - " + p.view.y);
		}
		
		if(this.cur_proj_list.length)
		{
			var last_p = this.cur_proj_list[this.cur_proj_list.length-1];
			
			this.projects_area.setFrame(
				this.projects_area.x, this.projects_area.y, this.projects_area.w, 
				last_p.y + last_p.h + 20);
		}
	}
	
	this.clearCurrentProjects = function()
	{
		for(var i=0;i<this.cur_proj_list.length;i++)
		{
			var p = this.cur_proj_list[i];
			
			p.removeFromSuperView();
		}
		
		this.cur_proj_list = [];
	}
	
	this.loadDummyProjects = function()
	{
		var p_list = [];
		
		for(var i=0;i<15;i++)
		{
			var new_project = {};
			
			new_project.name = "Project " + (i+1);
			new_project.image = "";//"images/project_dummy" + Math.round(random_between(1,5)) + ".jpg";
			new_project.short_description = "In this project we hope to either create a garden or repaint a home. Any skills that are needed we will teach you on the spot.";
			
			p_list.push(new_project);
		}
		
		this.loadProjects(p_list);
	}
	
	this.init();
	this.init_screen_main();
}
