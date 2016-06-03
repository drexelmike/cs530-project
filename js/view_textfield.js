function view_textfield()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_textfield = function () 
	{ 
		this.element.setAttribute("type", "text");
		this.element.style.border = "2px ridge #444";
		this.element.style.borderRadius = "5px";
		this.element.style.padding = "4px";
		
		//backwards compatibility
		this.text_element = this.element;
		
		//default height
		this.setFrame(0,0,120,30);
	}
	
	this.setFocusedFunc = function (func) { this.element.onfocus = func; };
	this.setChangedFunc = function (func) { this.element.onkeyup = func; };
	this.setText = function(value) { this.element.value = value; }
	this.getText = function() { return this.element.value; }
	this.isPasswordField = function(value) { if(value) this.element.setAttribute("type", "password"); else this.element.setAttribute("type", "text"); }
	this.isReadOnly = function(value) { if(value) this.element.setAttribute("readonly", "readonly"); else this.element.setAttribute("readonly", ""); }
	
	//init view
	this.init("input");
	this.init_view_textfield();
	
	/*
	this.setFrame = function (x, y, w, h) 
	{ 
		this._setFrame(x,y,w,44); 
		
		this.text_element.style.left   = x + "px";
		this.text_element.style.top    = y + "px";
		this.text_element.style.width  = w + "px";
		this.text_element.style.height = h + "px";
	}
	
	this.setFocusedFunc = function (func) { this.text_element.onfocus = func; };
	this.setChangedFunc = function (func) { this.text_element.onkeyup = func; };
	this.setText = function(value) { this.text_element.value = value; }
	this.getText = function() { return this.text_element.value; }
	this.isPasswordField = function(value) { if(value) this.text_element.setAttribute("type", "password"); else this.text_element.setAttribute("type", "text"); }
	this.isReadOnly = function(value) { if(value) this.text_element.setAttribute("readonly", "readonly"); else this.text_element.setAttribute("readonly", ""); }
	
	//init view
	this.init();
	
	this.text_element = document.createElement("input");
	this.text_element.setAttribute("type", "text");
	this.text_element.style.border = "2px ridge #444";
	this.text_element.style.borderRadius = "5px";
	this.text_element.style.padding = "4px";
	this.element.appendChild(this.text_element);
	*/
}