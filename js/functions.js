function varianceColorFromPercent(VariancePercentage)
{
	if(VariancePercentage > BUDGET_PERCENT_CUTOFF)
		return "green";
	else if(VariancePercentage < -BUDGET_PERCENT_CUTOFF)
		return "red";
	else
		return "orange";
}

function varianceText(Variance, VariancePercentage)
{
	if(VariancePercentage > 0)
		return i18n.getEntry("%@ (%@) Left", [i18n.formatNumber((Math.abs(Variance) / 1000).toFixed(0)) + " K", i18n.formatNumber(Math.abs(VariancePercentage).toFixed(0)) + "%"]);
	else
		return i18n.getEntry("%@ (%@) Over", [i18n.formatNumber((Math.abs(Variance) / 1000).toFixed(0)) + " K", i18n.formatNumber(Math.abs(VariancePercentage).toFixed(0)) + "%"]);
	//return (Math.abs(Variance) / 1000).toFixed(0) + " (" + Math.abs(VariancePercentage).toFixed(0) + "%) " + (VariancePercentage > 0 ? "Left" : "Over");
}

function cc_ce_io_ids(node1, node2)
{
	var ret_obj = {};
	
	ret_obj.CCHierarchyNodeID = "";
	ret_obj.CEHierarchyNodeID = "";
	ret_obj.IOHierarchyNodeID = "";
	
	if(node1)
	{
		if(node1.HierarchyType == "CCG") ret_obj.CCHierarchyNodeID = node1.HierarchyNodeID;
		else if(node1.HierarchyType == "CEG") ret_obj.CEHierarchyNodeID = node1.HierarchyNodeID;
		else if(node1.HierarchyType == "IOG") ret_obj.IOHierarchyNodeID = node1.HierarchyNodeID;
	}
	
	if(node2)
	{
		if(node2.HierarchyType == "CCG") ret_obj.CCHierarchyNodeID = node2.HierarchyNodeID;
		else if(node2.HierarchyType == "CEG") ret_obj.CEHierarchyNodeID = node2.HierarchyNodeID;
		else if(node2.HierarchyType == "IOG") ret_obj.IOHierarchyNodeID = node2.HierarchyNodeID;
	}
	
	return ret_obj;
}

function periodToMonth(period)
{
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var n = parseInt(period + "", 10);
	
	return months[n-1];
}

function periodToQuarter(period)
{
	var n = parseInt(period + "");
	
	if(n >= 1 && n <= 3) return "Q1";
	if(n >= 4 && n <= 6) return "Q2";
	if(n >= 7 && n <= 9) return "Q3";
	if(n >= 10 && n <= 12) return "Q4";
	
	return "Q?";
}

function asOfDate()
{
	var today = new Date();
	
	var d = today.getDate();
	var m = today.toDateString().substr(4,3);//today.getMonth()+1;
	var y = today.getFullYear();
	
	return d + "-" + m + "-" + y;
	
	//return "as of " + d + "-" + m + "-" + y;
	//return "as of " + today.toDateString();
}

function zeroPad(number, length) 
{   
	var str = "" + number;
	while (str.length < length) str = "0" + str;

	return str;
}

function currentMonthPeriod()
{
	var today = new Date();
	
	return zeroPad(today.getMonth()+1, 3);
}

function random_between(high, low)
{
	var range = high-low;
	
	return (Math.random() * range) + low;
}

function get_mimetype(file_extension, default_mimetype)
{
	var mimetype = default_mimetype;
				
	if(file_extension.search(/jpg/i) != -1) mimetype = "image/jpg";
	else if(file_extension.search(/jpeg/i) != -1) mimetype = "image/jpeg";
	else if(file_extension.search(/png/i) != -1) mimetype = "image/png";
	else if(file_extension.search(/pdf/i) != -1) mimetype = "application/pdf";
	
	return mimetype;
}

function toPasswordText(message)
{
	var ret_str = "";
	
	for(var i=0;i<message.length;i++) ret_str += "*";
	
	return ret_str;
}
