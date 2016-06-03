function view_button()
{
	//inherit from view
	view.apply(this, arguments);

	this.setNormalImage = function (imagePath) { this.normalImage = imagePath; this.setBackgroundImage(imagePath); }
	this.setPressedImage = function (imagePath) { this.pressedImage = imagePath; }
	
	this.setFrame = function (x, y, w, h) 
	{ 
		this._setFrame(x,y,w,h); 
		this.title_view.setFrame(0,(h-2-20)/2,w-4,20);
	}
	
	this.setTitle = function (newText) { this.title_view.setText(newText); };
	
	this.mouseDownFunc = function(event)
	{
		//console.log("mouseDownFunc: " + event.type);
		if (!this.enabled) return;

		event.stopPropagation();
		event.preventDefault();
		
		//console.log("button.mouseDownFunc " + this.pressedImage);
		if(this.pressedImage != "") this.setBackgroundImage(this.pressedImage);
		if(this.pressedCSSFunc != null) this.pressedCSSFunc();
		
		this.is_pressed = true;
	}
	
	this.mouseUpFunc = function(event)
	{
		//console.log("mouseUpFunc: " + event.type);
		if (!this.enabled) return;
		var self = this;
		
		event.stopPropagation();
		event.preventDefault();
		
		//console.log("button.mouseUpFunc " + this.normalImage);
		if(this.normalImage != "") this.setBackgroundImage(this.normalImage);
		if(this.normalCSSFunc != null) this.normalCSSFunc();
		
		//if(this.is_pressed && this.actionFunc) setTimeout( function() { self.actionFunc() }, 0);
		if(this.is_pressed && this.actionFunc && !this.temp_disable) this.actionFunc();
		
		this.is_pressed = false;
		
		//some devices may register mouse and touch events for a quick double click
		this.temp_disable = true;
		setTimeout(function(){self.temp_disable = false;}, 100);
	}
	
	this.setIdealSize = function()
	{
		var tw = 20 + this.title_view.desiredWidth();
		this.title_view.setFrame(0,0,tw,20);
		var th = 12 + this.title_view.desiredHeight();
		
		this.setFrame(this.x,this.y,tw,th);
	}
	
	this.defaultNormalCSSFunc = function()
	{
		this.setBackgroundColor("white");
	}
	
	this.defaultPressedCSSFunc = function()
	{
		this.setBackgroundColor("grey");
	}
	
	//init view
	this.init();
	
	this.normalImage = "";
	this.pressedImage = "";
	this.normalCSSFunc = null;
	this.pressedCSSFunc = null;
	this.actionFunc = null;
	this.is_pressed = false;
	this.enabled = true;
	this.temp_disable = false;
	
	var self = this;
	var down_func = function(event) { self.mouseDownFunc(event); };
	var up_func = function(event) { self.mouseUpFunc(event); };
	//this.setMouseDownFunc( down_func );
	//this.setMouseUpFunc( up_func );
	this.element.ontouchstart = down_func;
	this.element.onmousedown = down_func;
	this.element.ontouchend = up_func;
	this.element.onmouseup = up_func;
	
	this.setClickedFunc( function(event) { event.stopPropagation(); event.preventDefault(); } );
	
	//defaults
	var self = this;
	this.element.style.border = "2px solid";
	this.element.style.boxSizing = "border-box";
	this.setBackgroundColor("white");
	this.normalCSSFunc = function() { self.defaultNormalCSSFunc(); };
	this.pressedCSSFunc = function() { self.defaultPressedCSSFunc(); };
	
	this.title_view = new view_label();
	this.title_view.element.style.textAlign = "center";
	this.title_view.element.style.fontWeight = "bold";
	this.title_view.setTransitionDuration("0ms");
	this.title_view.ignoresUserInteraction(true);
	this.addSubView(this.title_view);
}
