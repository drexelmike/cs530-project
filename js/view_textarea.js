function view_textarea()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.setFrame = function (x, y, w, h) 
	{ 
		this._setFrame(x,y,w,h); 
		
		this.text_element.style.left   = x + "px";
		this.text_element.style.top    = y + "px";
		this.text_element.style.width  = w + "px";
		this.text_element.style.height = h + "px";
		
		this.setClickedFunc( function(event) { event.stopPropagation();  } );
		this.setMouseDownFunc( function(event) { event.stopPropagation();  } );
		this.setMouseUpFunc( function(event) { event.stopPropagation();  } );
	}
	
	this.setFocusedFunc = function (func) { this.text_element.onfocus = func; };
	this.setChangedFunc = function (func) { this.text_element.onkeyup = func; };
	this.setText = function(value) { this.text_element.value = value; }
	this.getText = function() { return this.text_element.value; }
	
	//init view
	this.init();
	
	this.text_element = document.createElement("textarea");
	this.text_element.style.border = "2px ridge #444";
	this.text_element.style.borderRadius = "5px";
	this.text_element.style.padding = "8px";
	this.text_element.style.resize = "none";
	this.element.appendChild(this.text_element);
}