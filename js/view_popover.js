function view_popover()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_popover = function()
	{
		var self = this;
		
		/*
		this.shadow_area = new view();
		this.shadow_area.element.style.boxShadow = "0px 0px 70px #333";
		this.addSubview(this.shadow_area);
		*/
		
		this.main_area = new view();
		//this.main_area.element.style.border = "1px solid black";
		this.main_area.element.style.borderRadius = "7px";
		//this.main_area.element.style.boxShadow = "0px 0px 30px #333";
		this.main_area.element.style.overflow = "hidden";
		this.addSubview(this.main_area);
		
		this.main_grad_area = new view();
		this.main_grad_area.element.style.border = "1px solid black";
		this.main_grad_area.element.style.borderRadius = "7px";
		//this.main_grad_area.element.style.background = "-webkit-linear-gradient(top, #7f8692 0%, #253149 20px, #101d38 21px, #09122c 100%)";
		this.main_grad_area.setLinearGradient(true, [["#7f8692", "0%"], ["#253149", "20px"], ["#101d38", "21px"], ["#09122c", "100%"]]);
		this.main_grad_area.element.style.opacity = 0.95;
		this.main_grad_area.element.style.overflow = "hidden";
		this.main_area.addSubview(this.main_grad_area);
		
		this.content_area = new view();
		this.content_area.setBackgroundColor("white");
		this.content_area.element.style.border = "1px solid black";
		//this.content_area.element.style.borderRadius = "5px";
		this.content_area.element.style.overflow = "hidden";
		this.main_area.addSubview(this.content_area);
		
		this.setClickedFunc( function() { self.hidePopover(); } );
		this.main_area.setClickedFunc( function(event) { event.stopPropagation(); } );
		
		this.hide_timeout = null;
	}
	
	this.setFrame = function(x,y,w,h)
	{
		this._setFrame(x,y,w,h);
	}
	
	this.viewIsShown = function(cv)
	{
		return (cv.superView === this.content_area);
	}
	
	this.showPopover = function(cv, w, h, bv)
	{
		if(bv) this.showPopoverAt(cv, w, h, bv.x, bv.y, bv.w, bv.h);
		else this.showPopoverAt(cv, w, h);
	}
	
	this.showPopoverAt = function(cv, w, h, bvx, bvy, bvw, bvh)
	{
		//already showing this view / screen?
		//if(this.isShown() && cv.superView == this.content_area) return;
		if(this.isShown() && this.viewIsShown(cv)) return;
		
		var bs = 6;
		var w = cv.w+bs+bs+2;
		var h = cv.h+bs+bs+2;
		var x = (this.w - w) / 2;
		var y = (this.h - h) / 2;
		
		if(bvx != undefined && bvy != undefined)
		{
			var can_go_right = false;
			var can_go_left = false;
			var can_go_above = false;
			var can_go_below = false;
			
			if(bvx > w + 40) can_go_left = true;
			if(bvy > h + 40) can_go_above = true;
			if(this.w - (bvx + bvw) > w + 40) can_go_right = true;
			if(this.h - (bvy + bvh) > h + 40) can_go_below = true;
			
			if(can_go_left)
			{
				x = bvx - w - 20;
				y = bvy + (bvh / 2) - (h / 2);
			}
			else if(can_go_right)
			{
				x = bvx + bvw + 20;
				y = bvy + (bvh / 2) - (h / 2);
			}
			else if(can_go_above)
			{
				x = bvx + (bvw / 2) - (w / 2);
				y = bvy - h - 20;
			}
			else if(can_go_below)
			{
				x = bvx + (bvw / 2) - (w / 2);
				y = bvy + bvh + 20;
			}
			
			//adjust
			if(y+h+20 > this.h) y = this.h - h - 20;
			if(y < 20) y = 20;
			if(x+w+20 > this.w) x = this.w - w - 20;
			if(x < 20) x = 20;
		}
		
		this.main_area.setFrame(x,y,w+2,h+2);
		this.main_grad_area.setFrame(0,0,w,h);
		this.content_area.setFrame(bs+1,bs+1,cv.w,cv.h);
		//this.shadow_area.setFrame(this.main_area.x+10,this.main_area.y+10,this.main_area.w-20,this.main_area.h-20);
		
		this.content_area.removeAllSubviews();
		this.content_area.addSubview(cv);
		
		this.setToFront();
		this.show();
		
		this.main_area.removeFromSuperview();
		this.main_area.zoomSmallIn(this);
		
		clearTimeout(this.hide_timeout);
		
		//hacky
		//clearTimeout(this.main_area.removeFromSuperViewTimeout);
	}
	
	this.hidePopover = function()
	{
		this._hidePopover();
	}
	
	this._hidePopover = function()
	{
		var self = this;
		
		this.main_area.zoomLargeOut();
		
		clearTimeout(this.hide_timeout);
		this.hide_timeout = setTimeout(function() { self.hide() }, 500);
		
		//wretched hack for fixing the keyboard poping up
		//set_freeze_WH(false);
		//if(this.content_area == new_note_screen) new_note_screen.text_area.text_element.blur();
	}
	
	//init view
	this.init();
	this.init_view_popover();
}
