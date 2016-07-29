//filter settings
$.fn.dataTable.defaults.oLanguage.sInfo = "_START_ à _END_ sur _TOTAL_ lignes";
$.fn.dataTable.defaults.oLanguage.sInfoFiltered = " (filtrage sur _MAX_ lignes) ";
$.fn.dataTable.defaults.bStateSave = false; //save filter in session storage or localStorage

//pager settings
$.fn.dataTable.defaults.sPaginationType = "pager";

//dom position settings
$.fn.dataTable.defaults.sDom = "FtipL";


$(document).off('preInit.dt').on( 'preInit.dt', function (e, settings) 
{
	if($('.datatable').hasClass('dt-json'))
	{
		new $.fn.dataTable.ext.json(settings);
	}
	if($('.datatable').hasClass('dt-filter'))
	{
		new $.fn.dataTable.ext.filter(settings);
	}
});

$(document).off('plugin-init.dt').on( 'plugin-init.dt', function (e, settings) 
{
	RewriteHeader($('.datatable'));
	
	if($('.datatable').hasClass('dt-output'))
	{
		new $.fn.dataTable.ext.output(settings);
	}
} );

$(document).on( 'draw.dt', function (e, settings) 
{
	if($('.datatable').hasClass('dt-totalizer'))
	{
		new $.fn.dataTable.ext.totalizer(settings);
	}

} );


jQuery.extend( jQuery.fn.dataTableExt.oSort, {
"date-pre": function ( date ) {
	
var date = date.replace(" ", "").replace( /<.*?>/g, "" );
console.log(date);
if(date.length > 0){
if (date.indexOf('.') > 0) {
/*date a, format dd.mn.(yyyy) ; (year is optional)*/
var eu_date = date.split('.');
} else {
/*date a, format dd/mn/(yyyy) ; (year is optional)*/
var eu_date = date.split('/');
}
/*year (optional)*/
if (eu_date[2]) {
var year = eu_date[2];
} else {
var year = '0000';
}
/*month*/
var month = eu_date[1];
if (month.length == 1) {
month = 0+month;
}
/*day*/
var day = eu_date[0];
if (day.length == 1) {
day = 0+day;
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


RewriteHeader = function (table) {
	
	var thead = table.children('thead');
	var tr = thead.children('tr');
	var th;
	var nTh;
	var len = table.length;
	
	for (var y = 0; y < len; y++) {
	
		for(var i = 0; i < tr.length - 1; i++) {

			th = tr.eq(i).children('th');
			
			for(var y = 0; y < th.length; y++) {
				if(!$(th[y]).hasClass('dataTable-col-research')) {
					nTh = th[y].innerHTML;
					th[y].innerHTML = "";

					$('<div class="dataTable-header-inner-first" style="position:relative;height:100%;width:100%"><div class="dataTable-header-inner">'+nTh+'</div></div>').appendTo($(th[y]));
				}
			}

		}
	}
};
