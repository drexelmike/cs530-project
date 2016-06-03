var isTouchDevice = ('ontouchstart' in document.documentElement) ? true : false;

function view()
{
	this.init = function (element_type)
	{
		if(element_type == undefined) element_type = "div";
		
		this.element = document.createElement(element_type);
		this.element.obj = this;
		//document.getElementsByTagName('body')[0].appendChild(this.element);
		
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.element.style.position = "absolute";
		this._setFrame(0,0,100,100);
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.scaleZ = 1.0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = 0;
		this.rotateDeg = 0;
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.clips_to_bounds = false;
		this.use_3d = false;
		
		this.cubeEffectLength = 2000;
		this.removeFromSuperViewTimeout = null;
		
		//drag
		this.draggable = false;
		this.pinchable = false;
		this.has_pinch_effect = false;
		this.pinch_effect_expand_func = null;
		this.pinch_effect_shrink_func = null;
		this.pinch_effect_button_func = null;
		this.startDragX = 0;
		this.startDragY = 0;
		this.startDragX2 = 0;
		this.startDragY2 = 0;
		this.startPinchDistance = 0;
		this.startPinchZoom = 1.0;
		this.currentPinchDistance = 0;
		this.pinching = false;
		
		this.superView = null;
		this.superViewIsRoot = false;
		this.subViews = [];
		
		//this.setTransitionDuration("1s");
		this.setTransitionDuration("0s");
		this.setTransitionTimingFunction("ease");
	};
	
	this.setTransition = function(value)
	{
		this.element.style.WebkitTransition = value;
		this.element.style.MozTransition = value;
	};
	
	this.setTransitionProperty = function(value)
	{
		this.element.style.WebkitTransitionProperty = value;
		this.element.style.MozTransitionProperty = value;
	};
	
	this.setTransitionDuration = function(value)
	{
		this.element.style.WebkitTransitionDuration = value;
		this.element.style.MozTransitionDuration = value;
	};
	
	this.setTransitionTimingFunction = function(value)
	{
		this.element.style.WebkitTransitionTimingFunction = value;
		this.element.style.MozTransitionTimingFunction = value;
	};
	
	this.setTransform = function(value)
	{
		this.element.style.WebkitTransform = value;
		this.element.style.MozTransform = value;
	};
	
	this.makeRootView = function () 
	{
		//remove us from whoever
		this.removeFromSuperView();
		
		//add us to the root
		document.getElementsByTagName('body')[0].appendChild(this.element);
		//$('body').append( this.element );
		
		this.superViewIsRoot = true;
	}
	
	this.addSubView = function (subView) 
	{
		//remove them from whoever
		subView.removeFromSuperView();
		
		//add them to us
		this.element.appendChild(subView.element);
		
		//set their superview to us
		subView.superView = this;
		subView.superViewIsRoot = false;
		
		//add them to the list
		if(!this.hasSubview(subView)) this.subViews.push(subView);
	}
	
	this.addSubview = function (subView) { this.addSubView(subView); }
	
	this.removeFromSuperView = function () 
	{ 
		if(this.superViewIsRoot) document.getElementsByTagName('body')[0].removeChild(this.element);
		if(this.superView != null) 
		{
			for(var i=0;i<this.superView.subViews.length;i++)
				if(this.superView.subViews[i] == this)
				{
					this.superView.subViews.splice(i, 1);
					i--;
				}
				
			this.superView.element.removeChild(this.element); 
		}
		
		this.superView = null;
		this.superViewIsRoot = false;
	}
	
	this.removeFromSuperview = function () { this.removeFromSuperView(); }
	
	this.removeAllSubviews = function()
	{
		while(this.subViews.length) this.subViews[0].removeFromSuperView();
	}
	
	this.hasSubview = function(the_view)
	{
		for(var i=0;i<this.subViews.length;i++)
			if(this.subViews[i] == the_view) return true;
		
		return false;
	}
	
	this._setFrame = function (x, y, w, h)
	{
		if(x != undefined) this.x = x;
		if(y != undefined) this.y = y;
		if(w != undefined) this.w = w;
		if(h != undefined) this.h = h;
		this.element.style.left   = this.x + "px";
		this.element.style.top    = this.y + "px";
		this.element.style.width  = this.w + "px";
		this.element.style.height = this.h + "px";
		
		//update clipping
		this.clipToBounds(this.clips_to_bounds);
	};
	this.setFrame = function (x, y, w, h) { this._setFrame(x,y,w,h); }
	this.setX = function(val) { this.x = val; this.element.style.left = val + "px"; this.clipToBounds(this.clips_to_bounds); }
	this.setY = function(val) { this.y = val; this.element.style.top = val + "px"; this.clipToBounds(this.clips_to_bounds); }
	this.setW = function(val) { this.w = val; this.element.style.width = val + "px"; this.clipToBounds(this.clips_to_bounds); }
	this.setH = function(val) { this.h = val; this.element.style.height = val + "px"; this.clipToBounds(this.clips_to_bounds); }
	
	this.getFrame = function()
	{
		var frame = {};
		
		frame.x = this.x;
		frame.y = this.y;
		frame.w = this.w;
		frame.h = this.h;
		
		return frame;
	}
	
	this.centerInSuperView = function()
	{
		var superview_w = 1024;
		var superview_h = 768;
		
		if(this.superView != null)
		{
			superview_w = this.superView.w;
			superview_h = this.superView.h;
		}
		
		this.setFrame((superview_w-this.w)/2,(superview_h-this.h)/2, this.w, this.h);
	}
	
	this.ellipseOverflow = function (value)
	{
		if(value)
		{
			this.element.style.whiteSpace = "nowrap";
			this.element.style.overflow = "hidden";
			this.element.style.textOverflow = "ellipsis";
		}
	}
	
	this.refreshTransform = function()
	{
		var t_string = "";
		if(this.use_3d)
		{
			t_string += "rotateX(" + this.rotateX + "deg) ";
			t_string += "rotateY(" + this.rotateY + "deg) ";
			t_string += "rotateZ(" + this.rotateZ + "deg) ";
			t_string += "scale3d(" + this.scaleX + ", " + this.scaleY + ", " + this.scaleZ + ") ";
			t_string += "translate3d(" + this.translateX + "px, " + this.translateY + "px, " + this.translateZ + "px) ";
		}
		else
		{
			t_string += "rotate(" + this.rotateDeg + "deg) ";
			t_string += "scale(" + this.scaleX + ", " + this.scaleY + ") ";
			t_string += "translate(" + this.translateX + "px, " + this.translateY + "px) ";
		}
		//console.log(t_string);
		this.setTransform(t_string);
	}
	
	this.setScrollable = function (value)
	{
		if(value) this.element.style.overflow = "auto";
		else this.element.style.overflow = "visible";
	}
	
	this.setLinearGradient = function(isTopToBottom, colors)
	{
		//example colors value = [["#1e5799", "0%"], ["#2989d8", "100%"]]
		if(!colors.length) return;
		
		if(isTopToBottom)
		{
// 			background: #1e5799; /* Old browsers */
// 			background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%); /* FF3.6+ */
// 			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-stop(50%,#2989d8), color-stop(51%,#207cca), color-stop(100%,#7db9e8)); /* Chrome,Safari4+ */
// 			background: -webkit-linear-gradient(top, #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* Chrome10+,Safari5.1+ */
// 			background: -o-linear-gradient(top, #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* Opera 11.10+ */
// 			background: -ms-linear-gradient(top, #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* IE10+ */
// 			background: linear-gradient(to bottom, #1e5799 0%,#2989d8 50%,#207cca 51%,#7db9e8 100%); /* W3C */
			var normal_str = "";
			var webkit_str = "";
			
			for(var i=0;i<colors.length;i++)
			{
				var item = colors[i];
				
				normal_str += ", " + item[0] + " " + item[1];
				webkit_str += ", " + "color-stop(" + item[1] + "," + item[0] + ")";
			}
			
			this.element.style.background = item[0];
			this.element.style.background = "-moz-linear-gradient(top" + normal_str + ")";
			this.element.style.background = "-webkit-gradient(linear, left top, left bottom" + webkit_str + ")";
			this.element.style.background = "-webkit-linear-gradient(top" + normal_str + ")";
			this.element.style.background = "-o-linear-gradient(top" + normal_str + ")";
			this.element.style.background = "-ms-linear-gradient(top" + normal_str + ")";
		}
	}
	
	this.setBackgroundImage = function (imagePath) { this.element.style.backgroundImage = "url(" + imagePath + ")"; }
	this.setBackgroundColor = function (color) { this.element.style.backgroundColor = color; }
	this.setBackgroundRepeat = function (value) { this.element.style.backgroundRepeat = value; }
	this.setBackgroundSize = function (value) { this.element.style.backgroundSize = value; }
	this.setBackgroundPosition = function (value) { this.element.style.backgroundPosition = value; }
	
	this._hide = function() { this.element.style.display = "none"; }
	this._show = function() { this.element.style.display = "block"; }
	this.Hide = function() { this._hide(); }
	this.Show = function() { this._show(); }
	this.hide = function() { this._hide(); }
	this.show = function() { this._show(); }
	this.isShown = function() { return this.element.style.display != "none"; }
	
	this.ignoresUserInteraction = function(value) 
	{ 
		if(value) this.element.style.pointerEvents = "none"; 
		else this.element.style.pointerEvents = "auto"; 
	}
	
	this.ignoresSelection = function(value)
	{
		if(value)
		{
			this.element.style.WebkitTouchCallout = "none";
			this.element.style.WebkitUserSelect = "none";
			this.element.style.KhtmlUserSelect = "none";
			this.element.style.MozUserSelect = "none";
			this.element.style.MsUserSelect = "none";
			this.element.style.userSelect = "none";
		}
	}
	
	this.clipToBounds = function(value)
	{
		if(value) this.element.style.clip = "rect(0px," + this.element.style.width + "," + this.element.style.height + ",0px)";
		else this.element.style.clip = "auto";
		
		this.clips_to_bounds = value;
	}
	
	//isTouchDevice = false;
	
	//this.setClickedFunc = function (func) { if(!isTouchDevice) this.element.onclick = func; else this.element.ontouchdown = func; };
	this.setClickedFunc = function (func) { this.element.onclick = func; };
	this.setMouseDownFunc = function (func) { if(isTouchDevice) this.element.ontouchstart = func; else this.element.onmousedown = func; };
	this.setMouseUpFunc = function (func) { if(isTouchDevice) this.element.ontouchend = func; else this.element.onmouseup = func; };
	
	this.cubeLeftOut = function()
	{
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.w/2;
		self.refreshTransform();
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateY = -90;
			self.refreshTransform();
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, self.cubeEffectLength);
	}
	
	this.cubeLeftIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = 90;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.w/2;
		self.refreshTransform();
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateY = 0;
			self.refreshTransform();
		}, 50);
	}
	
	this.cubeRightOut = function()
	{
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.w/2;
		self.refreshTransform();
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateY = 90;
			self.refreshTransform();
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, self.cubeEffectLength);
	}
	
	this.cubeRightIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = -90;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.w/2;
		self.refreshTransform();
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateY = 0;
			self.refreshTransform();
		}, 50);
	}
	
	this.cubeUpOut = function()
	{
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.h/2;
		self.refreshTransform();
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateX = 90;
			self.refreshTransform();
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, self.cubeEffectLength);
	}
	
	this.cubeUpIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = -90;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.h/2;
		self.refreshTransform();
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateX = 0;
			self.refreshTransform();
		}, 50);
	}
	
	this.cubeDownOut = function()
	{
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.h/2;
		self.refreshTransform();
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateX = -90;
			self.refreshTransform();
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, self.cubeEffectLength);
	}
	
	this.cubeDownIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = true;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.rotateX = 90;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.translateZ = this.h/2;
		self.refreshTransform();
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration(self.cubeEffectLength + "ms");
			self.setTransitionProperty("all");
			self.rotateX = 0;
			self.refreshTransform();
		}, 50);
	}
	
	this.zoomLargeIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.scaleX = 1.4;
		this.scaleY = 1.4;
		this.refreshTransform();
		this.element.style.opacity = 0.0;
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.scaleX = 1.0;
			self.scaleY = 1.0;
			self.refreshTransform();
			self.element.style.opacity = 1.0;
		}, 50);
	}
	
	this.zoomSmallIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.scaleX = 0.2;
		this.scaleY = 0.2;
		this.refreshTransform();
		this.element.style.opacity = 0.0;
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.scaleX = 1.0;
			self.scaleY = 1.0;
			self.refreshTransform();
			self.element.style.opacity = 1.0;
		}, 50);
	}
	
	this.zoomLargeOut = function()
	{
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.refreshTransform();
		
		setTimeout(function() 
		{
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.scaleX = 1.4;
			self.scaleY = 1.4;
			self.refreshTransform();
			self.element.style.opacity = 0.0;
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, 500);
	}
	
	this.zoomSmallOut = function()
	{
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.scaleX = 1.0;
		this.scaleY = 1.0;
		this.refreshTransform();
		
		setTimeout(function() 
		{
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.scaleX = 0.2;
			self.scaleY = 0.2;
			self.refreshTransform();
			self.element.style.opacity = 0.0;
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, 500);
	}
	
	this.fadeIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		this.element.style.opacity = 0.0;
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.element.style.opacity = 1.0;
		}, 50);
	}
	
	this.fadeOut = function()
	{
		var self = this;
		this.setTransitionDuration("0ms");
		this.setTransitionProperty("none");
		
		setTimeout(function() 
		{
			self.setTransitionDuration("450ms");
			self.setTransitionProperty("all");
			self.element.style.opacity = 0.0;
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() { self.removeFromSuperView(); }, 500);
	}
	
	this.slideOut = function()
	{
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("450ms");
		this.setTransitionProperty("all");
		this.translateX = 0;
		this.refreshTransform();
		
		setTimeout(function() 
		{
			self.translateX = -self.w;
			self.refreshTransform();
			self.element.style.opacity = 0.0;
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() 
		{ 
			self.removeFromSuperView(); 
			self.element.style.opacity = 1; 
			self.translateX = 0;
			self.refreshTransform();
		}, 500);
	}
	
	this.slideOutToRight = function()
	{
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("450ms");
		this.setTransitionProperty("all");
		this.translateX = 0;
		this.refreshTransform();
		
		setTimeout(function() 
		{
			self.translateX = self.w;
			self.refreshTransform();
			self.element.style.opacity = 0.0;
		}, 50);
		
		//remove from super afterwards
		clearTimeout(this.removeFromSuperViewTimeout);
		this.removeFromSuperViewTimeout = setTimeout(function() 
		{ 
			self.removeFromSuperView(); 
			self.element.style.opacity = 1; 
			self.translateX = 0;
			self.refreshTransform();
		}, 500);
	}
	
	this.slideIn = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("450ms");
		this.setTransitionProperty("all");
		this.translateX = self.w;
		this.refreshTransform();
		this.element.style.opacity = 0.0;
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.translateX = 0;
			self.refreshTransform();
			self.element.style.opacity = 1.0;
		}, 50);
	}
	
	this.slideInFromLeft = function(into_view)
	{
		clearTimeout(this.removeFromSuperViewTimeout);
		
		var self = this;
		this.use_3d = false;
		this.setTransitionDuration("450ms");
		this.setTransitionProperty("all");
		this.translateX = -self.w;
		this.refreshTransform();
		this.element.style.opacity = 0.0;
		
		//add us to them
		into_view.addSubView(self);
		
		setTimeout(function() 
		{
			//make the move
			self.translateX = 0;
			self.refreshTransform();
			self.element.style.opacity = 1.0;
		}, 50);
	}
	
	this.setId = function(style_name) { this.element.setAttribute("id", style_name); }
	
	this.setToFront = function()
	{
		if(this.superView == null) return;
		
		var old_superView = this.superView;
		
		this.removeFromSuperView();
		old_superView.addSubView(this);
	}
	
	this.checkInteractable = function()
	{
		var self = this;
		if(this.pinchable || this.draggable || this.has_pinch_effect) this.setMouseDownFunc( function(event){ self.startDrag(event); } );
	}
	
	this.setPinchable = function(value)
	{
		this.pinchable = value;
		this.checkInteractable();
	}
	
	this.setDraggable = function(value)
	{
		this.draggable = value;
		this.checkInteractable();
	}
	
	this.setHasPinchEffect = function(value)
	{
		this.has_pinch_effect = value;
		this.checkInteractable();
	}
	
	this.startDrag = function(event)
	{
		var self = this;
		
		event.stopPropagation();
		event.preventDefault();
		
		//console.log("startDrag " + event.type + " " + event.touches.length);
		
		//this.setToFront();

		//if(isTouchDevice)
		if(event.type == "touchstart" || event.type == "touchdown")
		{
			if(event.touches.length == 1)
			{
				this.startDragX = event.touches[0].pageX;
				this.startDragY = event.touches[0].pageY;
			}
			else if(event.touches.length == 2)
			{
				this.startDragX2 = event.touches[1].pageX;
				this.startDragY2 = event.touches[1].pageY;
			}
		}
		else
		{
			this.startDragX = event.pageX;
			this.startDragY = event.pageY;
		}

		
		this.setTransition("none");
		
		if (isTouchDevice)
		{
			document.ontouchmove = function (event) { self.doDrag(event, self); };
			document.ontouchend = function (event) { self.endDrag(event, self); };
		}
		else
		{
			document.onmousemove = function (event) { self.doDrag(event, self); };
			document.onmouseup = function (event) { self.endDrag(event, self); };
		}
	}
	
	this.doDrag = function(event, self)
	{
		event.stopPropagation();
		event.preventDefault();
		
		//console.log("event.touches.length + " + event.touches.length);
		//console.log("event.changedTouches.length + " + event.changedTouches.length);
		//console.log("event.targetTouches.length + " + event.targetTouches.length);
		//console.log("-----------------------------------");
		
		if(event.type == "touchmove" && event.touches.length > 1)
			this.currentPinchDistance = this.distance2D(event.touches[0].pageX, event.touches[0].pageY, event.touches[1].pageX, event.touches[1].pageY);
		
		if(self.pinchable && event.type == "touchmove" && event.touches.length >= 2)
		{
			self.doPinchAction(event);
			return;
		}
		else self.pinching = false;
		
		if(self.draggable)
		{
			self.doDragAction(event);
			return;
		}
	}
	
	this.doDragAction = function(event)
	{
		var locX = event.pageX;
		var locY = event.pageY;
		
		//if(isTouchDevice)
		if(event.type == "touchmove")
		{
			locX = event.touches[0].pageX;
			locY = event.touches[0].pageY;
		}
		
		var dx = locX - this.startDragX;
		var dy = locY - this.startDragY;
		
		//console.log("doDrag X " + locX);
		//console.log("doDrag Y " + locY);
		
		//this.translateX += dx;
		//this.translateY += dy;
		//this.refreshTransform();
		
		this.setX(this.x += dx);
		this.setY(this.y += dy);
		
		this.startDragX = locX;
		this.startDragY = locY;
	}
	
	this.distance2D = function( x1, y1, x2, y2 )
	{
		var xs = 0;
		var ys = 0;

		xs = x1 - x2;
		xs = xs * xs;

		ys = y1 - y2;
		ys = ys * ys;

		return Math.sqrt( xs + ys );
	}
	
	this.doPinchAction = function(event)
	{
		//function assumes there are two touches going on
		if(event.touches.length < 2)
		{
			this.pinching = false;
			return;
		}
		
		var current_distance = this.distance2D(event.touches[0].pageX, event.touches[0].pageY, event.touches[1].pageX, event.touches[1].pageY);
		
		//init pinching?
		if(this.pinching == false)
		{
			this.startPinchDistance = current_distance;
			this.startPinchZoom = this.scaleX;
			
			this.pinching = true;
		}
		
		var dist_diff = current_distance - this.startPinchDistance;
		var dist_change = current_distance / this.startPinchDistance;
		
		this.scaleX = this.startPinchZoom * dist_change;
		this.scaleY = this.startPinchZoom * dist_change;
		this.refreshTransform();
	}
	
	this.endDrag = function(event, self)
	{
		//console.log("endDrag " + event.type + " " + event.touches.length);
		
		//do a pinch effect?
		if(this.has_pinch_effect && event.type == "touchend")
		{
			if(event.touches.length > 0)
			{
				var first_distance = this.distance2D(this.startDragX, this.startDragY, this.startDragX2, this.startDragY2);
				
				if(this.currentPinchDistance - first_distance < 0)
				{
					if(this.pinch_effect_shrink_func) this.pinch_effect_shrink_func(event);
				}
				else
				{
					if(this.pinch_effect_expand_func) this.pinch_effect_expand_func(event);
				}
			}
			else if(this.pinch_effect_button_func) this.pinch_effect_button_func(event);
		}
		
		if (isTouchDevice)
		{
			document.ontouchmove = null;
			document.ontouchend = null;
		}
		else
		{
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
	
	//init view
	this.init();
}
