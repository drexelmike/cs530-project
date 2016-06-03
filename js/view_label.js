function view_label()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_label = function()
	{
		//default style
		this.element.style.fontFamily = "arial, helvetica";
		//this.element.style["font-weight"] = "bold";
		this.element.style.fontSize = "17px";
		//this.element.style["text-shadow"] = "1px 1px 0.05em #FFF";
		
		//none selectable
		this.ignoresSelection(true);
	}

	this.setText = function (newText) { this.element.innerHTML = newText; };
	this.setAlignment = function (newAlignment) { this.element.style.textAlign = newAlignment; }
	this.setTextAlign = function (newAlignment) { this.setAlignment(newAlignment); }
	this.setColor = function(value) { this.element.style.color = value; }
	this.setSize = function(value) { this.element.style.fontSize = value; }
	this.setBold = function(value) { if(value) this.element.style.fontWeight = "bold"; else this.element.style.fontWeight = "normal"; }
	
	this.desiredWidth = function()
	{
		var test_element = document.createElement("div");
		var width = 0;
		
		test_element.style.fontFamily = this.element.style.fontFamily;
		test_element.style.fontSize = this.element.style.fontSize;
		test_element.style.fontWeight = this.element.style.fontWeight;
		test_element.style.position = "absolute";
		
		document.getElementsByTagName('body')[0].appendChild(test_element);
		
		test_element.innerHTML = this.element.innerHTML;
		width = test_element.clientWidth + 1;
		
		document.getElementsByTagName('body')[0].removeChild(test_element);
		
		return width;
	}
	
	this.desiredHeight = function()
	{
		var test_element = document.createElement("div");
		var height = 0;
		
		test_element.style.fontFamily = this.element.style.fontFamily;
		test_element.style.fontSize = this.element.style.fontSize;
		test_element.style.fontWeight = this.element.style.fontWeight;
		test_element.style.position = "absolute";
		test_element.style.width = this.element.style.width;
		
		document.getElementsByTagName('body')[0].appendChild(test_element);
		
		test_element.innerHTML = this.element.innerHTML;
		height = test_element.clientHeight + 1;
		
		document.getElementsByTagName('body')[0].removeChild(test_element);
		
		return height;
	}
	
	this.getText = function () { return this.element.innerHTML; };
	
	//init view
	this.init();
	this.init_view_label();
}