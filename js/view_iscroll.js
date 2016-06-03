function view_iscroll()
{
	//inherit from view
	view.apply(this, arguments);
	
	this.init_view_iscroll = function()
	{
		var self = this;
		
		this.scroll_area = new view();
		this.addSubview(this.scroll_area);
		
		//need to override the scroll_areas setframe
		this.scroll_area.setFrame = function(x,y,w,h)
		{
			this._setFrame(x,y,w,h);
			self.iscroll.scrollerW = w;
			self.iscroll.scrollerH = h;
			self.iscroll.refresh();
		};
		
		this.iscroll = new iScroll(this.element);
		this.iscroll.refresh = new_iscroll_refresh;
		this.iscroll._scrollbar = new_iscroll__scrollbar;
	}
	
	this.setFrame = function(x,y,w,h)
	{
		this._setFrame(x,y,w,h);
		this.iscroll.wrapperW = w;
		this.iscroll.wrapperH = h;
		this.iscroll.refresh();
	}
	
	//init view
	this.init();
	this.init_view_iscroll();
}

function new_iscroll__scrollbar(dir)
{
	var doc = document;
	var cssVendor = our_iscroll_vendor ? '-' + our_iscroll_vendor.toLowerCase() + '-' : '';
	var has3d = our_iscroll_prefixStyle('perspective') in our_iscroll_dummyStyle;
	var translateZ = has3d ? ' translateZ(0)' : '';
	var m = Math;
	var hasTransform = our_iscroll_vendor !== false;
	var transform = our_iscroll_prefixStyle('transform');
	var that = this,
		bar;

	if (!that[dir + 'Scrollbar']) {
		if (that[dir + 'ScrollbarWrapper']) {
			if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
			that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
			that[dir + 'ScrollbarWrapper'] = null;
			that[dir + 'ScrollbarIndicator'] = null;
		}

		return;
	}

	if (!that[dir + 'ScrollbarWrapper']) {
		// Create the scrollbar wrapper
		bar = doc.createElement('div');

		if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
		else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

		bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

		that.wrapper.appendChild(bar);
		that[dir + 'ScrollbarWrapper'] = bar;

		// Create the scrollbar indicator
		bar = doc.createElement('div');
		if (!that.options.scrollbarClass) {
			bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
		}
		bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
		if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

		that[dir + 'ScrollbarWrapper'].appendChild(bar);
		that[dir + 'ScrollbarIndicator'] = bar;
	}

	if (dir == 'h') {
		that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
		//that.hScrollbarSize = that.wrapperW - 4;
		that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
		that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
		that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
		that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
	} else {
		//that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
		that.vScrollbarSize = that.wrapperH - 4;
		that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
		that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
		that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
		that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
	}

	// Reset position
	that._scrollbarPos(dir, true);
}

function new_iscroll_refresh() 
{
	var that = this,
		offset,
		i, l,
		els,
		pos = 0,
		page = 0;

	if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;

	//HACK - we manually set this now so it can work even if the div isn't visable yet
	//that.wrapperW = that.wrapper.clientWidth || 1;
	//that.wrapperH = that.wrapper.clientHeight || 1;
	if(that.wrapperW == undefined) that.wrapperW = 1;
	if(that.wrapperH == undefined) that.wrapperW = 1;
	if(that.scrollerW == undefined) that.scrollerW = 1;
	if(that.scrollerH == undefined) that.scrollerH = 1;

	that.minScrollY = -that.options.topOffset || 0;
	//that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
	//that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
	that.maxScrollX = that.wrapperW - that.scrollerW;
	that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
	that.dirX = 0;
	that.dirY = 0;

	if (that.options.onRefresh) that.options.onRefresh.call(that);

	that.hScroll = that.options.hScroll && that.maxScrollX < 0;
	that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

	that.hScrollbar = that.hScroll && that.options.hScrollbar;
	that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

	offset = that._offset(that.wrapper);
	that.wrapperOffsetLeft = -offset.left;
	that.wrapperOffsetTop = -offset.top;

	// Prepare snap
	if (typeof that.options.snap == 'string') {
		that.pagesX = [];
		that.pagesY = [];
		els = that.scroller.querySelectorAll(that.options.snap);
		for (i=0, l=els.length; i<l; i++) {
			pos = that._offset(els[i]);
			pos.left += that.wrapperOffsetLeft;
			pos.top += that.wrapperOffsetTop;
			that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
			that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
		}
	} else if (that.options.snap) {
		that.pagesX = [];
		while (pos >= that.maxScrollX) {
			that.pagesX[page] = pos;
			pos = pos - that.wrapperW;
			page++;
		}
		if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

		pos = 0;
		page = 0;
		that.pagesY = [];
		while (pos >= that.maxScrollY) {
			that.pagesY[page] = pos;
			pos = pos - that.wrapperH;
			page++;
		}
		if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
	}

	// Prepare the scrollbars
	that._scrollbar('h');
	that._scrollbar('v');

	if (!that.zoomed) {
		//that.scroller.style[transitionDuration] = '0';
		that.scroller.style[our_iscroll_transitionDuration] = '0';
		that._resetPos(400);
	}
}

var our_iscroll_dummyStyle = document.createElement('div').style

var our_iscroll_vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in our_iscroll_dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})();
	
function our_iscroll_prefixStyle (style) 
{
	if ( our_iscroll_vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return our_iscroll_vendor + style;
}

var our_iscroll_transitionDuration = our_iscroll_prefixStyle('transitionDuration');
