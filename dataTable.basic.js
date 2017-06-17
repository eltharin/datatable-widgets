
//filter settings
$.fn.dataTable.defaults.oLanguage.sInfo = "_START_ à _END_ sur _TOTAL_ lignes";
$.fn.dataTable.defaults.oLanguage.sInfoFiltered = " (filtrage sur _MAX_ lignes) ";
$.fn.dataTable.defaults.bStateSave = false; //save filter in session storage or localStorage
$.fn.dataTable.defaults.sPaginationType = "pager";
$.fn.dataTable.defaults.lengthMenu = [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]];
$.fn.dataTable.defaults.bInfo = true;
$.fn.dataTable.defaults.ordering = true;
$.fn.dataTable.defaults.paging = true;
$.fn.dataTable.defaults.autoWidth = false;
//$.fn.dataTable.defaults.lengthChange = false;
$.fn.dataTable.defaults.sDom = "tFipL";
$.fn.dataTable.defaults.aaSorting = [];
$.fn.dataTable.defaults.aoColumnDefs=tableRender;




$(document).on( 'preInit.dt', function (e, oSettings) 
{
	datatableSettings = oSettings;
	if(!$(oSettings.nTable).hasClass('dt-pager') && !$(oSettings.nTable).hasClass('dt-ofp') && !$(oSettings.nTable).hasClass('dt-fp'))
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
	if($(oSettings.nTable).hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.numColFooter(oSettings);
	}
});	

$(document).off('plugin-init.dt').on( 'plugin-init.dt', function (e, oSettings) 
{
	if($(oSettings.nTable).hasClass('dt-output') || $(oSettings.nTable).hasClass('dt-ofp'))
	{
		new $.fn.dataTable.ext.output(oSettings);
	}
});

$(document).on( 'draw.dt', function (e, oSettings) 
{
	if($(oSettings.nTable).hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.totalizer(oSettings);
	}
});

jQuery.extend( jQuery.fn.dataTableExt.type.search, {
		date: function ( data ) 
		{
			return data.replace( /[\r\n]/g, " " )
					   .replace( /<([^>]*)>/g, "" );
		}
	} );
	

jQuery.extend( jQuery.fn.dataTableExt.oSort, 
{
	"date-pre": function ( date ) 
	{
		var date = date.replace( /<.*?>/g, "" );
		if(date.length > 0)
		{
			var pattern = new RegExp(/^(([0-9]{2})[\/\-\.]([0-9]{2})[\/\-\.](\d{4}))(\s{1}(\d{2}):(\d{2})(:(\d{2}))?)?/);
			var match = pattern.exec(date); 
			if(match !== null)
			{
				console.log(match);
				if(match[4]) {year  = match[4];} else {year = '0000';}
				if(match[3]) {month = match[3];} else {month = '00';}
				if(match[2]) {day   = match[2];} else {day = '00';}
				if(match[6]) {hour  = match[6];} else {hour = '00';}
				if(match[7]) {minut = match[7];} else {minut = '00';}
				if(match[9]) {second = match[9];} else {second = '00';}
				
				return (year + '-' + month + '-' + day + ' ' + hour + ':' + minut + ':' + second);
			}


		}
		return ('0000-00-00 00:00:00');
	},
	"date-asc": function ( a, b ) 
	{
		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},
	"date-desc": function ( a, b ) 
	{
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	}
});

$.fn.dataTableExt.ofnSearch['date'] = function ( date ) {
return date.replace( /<.*?>/g, "" );
};

$.fn.dataTableExt.ofnSearch['favoris'] = function ( date ) {
return date.replace( /<([^>]*)title="([^"]*)"([^>]*)>/g, "$2" ).replace( /<([^>]*)>/g, "" );
};


//--- Datatable new functions 
$.fn.dataTableExt.oApi.fnLoadHTML = function ( oSettings,data)
{
	oSettings.oApi._fnClearTable(oSettings);
	oSettings.oApi._fnAddTr(oSettings,data);
	oSettings.oApi._fnReDraw(oSettings,true);
};

$.fn.dataTableExt.oApi.fnLoadJSON = function ( oSettings,data)
{
	try 
	{ 
		data = $.parseJSON(data); 
	} 
	catch(err)  
	{ 
		console.log(err);
	}  
	oSettings.oApi._fnClearTable(oSettings);
	oSettings.oApi._fnAjaxUpdateDraw(oSettings,{data:data});
	oSettings.oApi._fnReDraw(oSettings,true);
};

$.fn.dataTableExt.oApi.fnGetAllObject = function ( oSettings,formid,object)
{
	var myobj=[];
	
	console.log('coucou ' + object);
	$(oSettings.aoData).each(function(k){
		$(this.nTr).find(object).each(function(){
				myobj.push(this);
		});
		
		//console.log(myobj.attr('name') + " - " + myobj.val());
		//$(formid).append('<input type="hidden" name="" value="">')
	});
	return myobj;
}
$.fn.dataTableExt.oApi.fnGetObject = function ( oSettings)
{
	console.log(oSettings);
	oSettings.oApi._fnLengthChange(oSettings,-1);
	oSettings.oApi._fnReDraw(oSettings,true);
}
