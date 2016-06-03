function main()
{
	document.title = "Project Philly";
	
	//make database object
	database = new project_philly_database();

	//main view
	main_view = new view();
	main_view.makeRootView();
	
	//for popovers
	main_popover = new view_popover();
	main_popover.hide();
	main_view.addSubview(main_popover);
	
	//footer widget
	footer_bar_widget = new widget_footer_bar();
	main_view.addSubview(footer_bar_widget);
	
	//view tiers
	main_popover.element.style.zIndex = 1;
	
	//screens
	main_screen = new screen_main();
	project_screen = new screen_project();
	create_user_screen = new screen_create_user();
	new_project_screen = new screen_new_project();
	edit_user_screen = new screen_edit_user();
	file_select_screen = new screen_file_select();
	change_password_screen = new screen_change_password();
	warning_screen = new screen_warning();
	edit_project_screen = new screen_edit_project();
	new_news_item_screen = new screen_new_news_item();
	
	setAppWH();
	
	//set resize event
	window.onresize = window_resize;
	
	//kill all body scrolls
	setInterval( check_body_scroll, 100);
	setInterval( check_screen_resize, 100);
	
	//load main screen
	load_screen(main_screen);
	
	setAppWH();
}

var current_screen = null;
function load_screen(the_screen)
{
	if(the_screen == current_screen) return;
	
	if(current_screen != null) 
		current_screen.removeFromSuperView();
	
	main_view.addSubview(the_screen);
	current_screen = the_screen;
	
	if(current_screen == main_screen)
		footer_bar_widget.showReturnButton(false);
	else
		footer_bar_widget.showReturnButton(true);
	
	footer_bar_widget.setToFront();
}

function check_body_scroll()
{
	if(freeze_WH) return;
	
	document.body.scrollLeft = 0;
	document.body.scrollTop = 0;
}

function check_screen_resize()
{
	var desired_w = FORCE_RESOLUTION ? FORCE_W : window.innerWidth;
	var desired_h = FORCE_RESOLUTION ? FORCE_H : window.innerHeight;
	
	if(RENDERED_W != desired_w) window_resize();
	if(RENDERED_H != desired_h) window_resize();
}

function set_freeze_WH(value)
{
	freeze_WH = value;
}

var freeze_WH = false;
function setAppWH()
{
	if(freeze_WH) return;
	
	var desired_w = FORCE_RESOLUTION ? FORCE_W : window.innerWidth;
	var desired_h = FORCE_RESOLUTION ? FORCE_H : window.innerHeight;
	
	APP_W = desired_w;
	APP_H = desired_h;
	RENDERED_W = desired_w;
	RENDERED_H = desired_h;
	
	//resize all the screens
	main_popover.setFrame(0,0,APP_W,APP_H);
	main_screen.window_resize();
	project_screen.window_resize();
	footer_bar_widget.window_resize();
	edit_project_screen.window_resize();
}

function window_resize(event) 
{
	setAppWH();
}
