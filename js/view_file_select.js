function view_file_select()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_file_select = function () 
	{ 
		this.element.setAttribute("type", "file");
	}
	
	this.getFile = function() { return this.element.value; }
	
	//init view
	this.init("input");
	this.init_view_file_select();
}