
//filter settings
$.fn.dataTable.defaults.oLanguage.sInfo = "_START_ à _END_ sur _TOTAL_ lignes";
$.fn.dataTable.defaults.oLanguage.sInfoFiltered = " (filtrage sur _MAX_ lignes) ";
$.fn.dataTable.defaults.bStateSave = false; //save filter in session storage or localStorage
$.fn.dataTable.defaults.sPaginationType = "pager";
$.fn.dataTable.defaults.lengthMenu = [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]];
$.fn.dataTable.defaults.sDom = "FtipL";
$.fn.dataTable.defaults.bInfo = true;
$.fn.dataTable.defaults.ordering = true;
$.fn.dataTable.defaults.paging = true;
//$.fn.dataTable.defaults.lengthChange = false;


$(document).on( 'preInit.dt', function (e, oSettings) 
{
	if(!$(oSettings.nTable).hasClass('dt-pager') && !$(oSettings.nTable).hasClass('dt-ofp') || $(oSettings.nTable).hasClass('dt-fp'))
	{
		$('#'+oSettings.sTableId+'_info').remove();
		$('#'+oSettings.sTableId+'_paginate').remove();
	}

	if(!$(oSettings.nTable).hasClass('dt-nosort'))
	{
		oSettings.oFeatures.bSort = true;
	}

	if($(oSettings.nTable).hasClass('dt-json'))
	{
		new $.fn.dataTable.ext.json(oSettings);
	}
	if($(oSettings.nTable).hasClass('dt-filter') || $(oSettings.nTable).hasClass('dt-fp') || $(oSettings.nTable).hasClass('dt-ofp'))
	{
		new $.fn.dataTable.ext.filter(oSettings);
	}
	
});	
	
$(document).off('plugin-init.dt').on( 'plugin-init.dt', function (e, oSettings) 
{
	//RewriteHeader($('.datatable'));
	if($(oSettings.nTable).hasClass('dt-output') || $(oSettings.nTable).hasClass('dt-ofp'))
	{
		new $.fn.dataTable.ext.output(oSettings);
	}
} );

$(document).on( 'draw.dt', function (e, oSettings) 
{
	if($(oSettings.nTable).hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.totalizer(oSettings);
	}

} );

jQuery.extend( jQuery.fn.dataTableExt.type.search, {
		date: function ( data ) {
			return data.replace( /[\r\n]/g, " " )
						.replace( /<.*>/g, "" );
		}
	} );
	

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
"date-pre": function ( date ) {
	
var date = date.replace(" ", "").replace( /<.*?>/g, "" );
if(date.length > 0)
{
	if (date.indexOf('.') > 0) {var eu_date = date.split('.');} 
	else if (date.indexOf('-') > 0) {var eu_date = date.split('-');} 
	else {var eu_date = date.split('/');}

	/*year*/
	if (eu_date[2]) 
	{
		var year = eu_date[2];
	} 
	else 
	{
		var year = '0000';
	}
	
	/*month*/
	if (eu_date[1]) 
	{
		var month = eu_date[1];
		if (month.length == 1) 
		{
			month = "0" + month;
		}
	} 
	else 
	{
		var month = '00';
	}
	
	
	/*day*/
	var day = eu_date[0];
	if (day.length == 1) 
	{
		day = "0" + day;
	}
	
	return (year + '-' + month + '-' + day);
}
return ('0000-00-00');
},
"date-asc": function ( a, b ) {
return ((a < b) ? -1 : ((a > b) ? 1 : 0));
},
"date-desc": function ( a, b ) {
return ((a < b) ? 1 : ((a > b) ? -1 : 0));
}
});
