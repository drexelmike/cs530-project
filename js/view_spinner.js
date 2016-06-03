function view_spinner()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_spinner = function()
	{
		//hack to get the keyframe in
		if(!called_view_spinner_init)
	    {
	        called_view_spinner_init = true;
	        view_spinner_init_keyframe();
	    }
		
		var line_amount = 12;
		this.lines = [];
		for(var i=0;i<line_amount;i++)
		{
			var the_line = new view();
			
			the_line.element.style.width = "24%";
			the_line.element.style.height = "7%";
			the_line.element.style.top = "50%";
			the_line.element.style.left = "50%";
			
			the_line.setBackgroundColor("black");
			
			the_line.element.style.webkitTransformOrigin = "0 50%";
			the_line.element.style.webkitTransform = "rotate(" + (360 * i / line_amount) + "deg) translate(83%,0%)";
			the_line.element.style.webkitAnimationDelay = (-(line_amount-i) / line_amount) + "s";//"-.999s";
			the_line.element.style.webkitAnimationName = "view_spinner_fade";
			the_line.element.style.webkitAnimationDuration = "1s";
			the_line.element.style.webkitAnimationIterationCount = "infinite";
			the_line.element.style.borderRadius = "5px";
			the_line.element.style.webkitBoxShadow = "0 0 3px rgba(0,0,0,0.2)";
			
			this.lines.push(the_line);
			this.addSubview(the_line);
		}
	}
	
	//init view
	this.init();
	this.init_view_spinner();
}

var called_view_spinner_init = false;

function view_spinner_init_keyframe()
{
	var createdStyleTag = document.createElement("style");
	createdStyleTag.textContent = "@-webkit-keyframes view_spinner_fade{from{opacity:1;}to{opacity:0.2;}}";
	document.getElementsByTagName('body')[0].appendChild(createdStyleTag);
}
