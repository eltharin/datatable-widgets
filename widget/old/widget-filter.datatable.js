(function(window, document, $, undefined) {

$.fn.dataTable.ext.ofnSearch.filter = function ( settings ) {
	settings.cFilter = {
		customFilter : [],
		stateSave : [],
		counter : 0,
		html_element : {
			trFilter : null,
			component : [],
			table : [],
			thead : [],
			th : [],
			tr:[]
		},
		oId : {},
		oClasse : {},
		oColumn : 0,
		navigator:null
	};
	
	checkElem(settings);
	
	Init_Filter_Widget( settings );
	
	htmlProcess(settings);
	
	if(settings.cFilter.customFilter.length > 0)
	{
		replaceByCustomFilter(settings);
	}
	
	//write tr filter
	$(settings.cFilter.html_element.thead).append(settings.cFilter.html_element.trFilter);
	
	action(settings);

	
	
	
	// Update on each draw
	settings.aoPreDrawCallback.push( {
		"fn":function(){
			preDrawCallbackFilter(settings);
		}
	});
	settings.aoDrawCallback.push( {
		"sName" : "filter_widget",
		"fn": function () {
			drawCallbackFilter(settings);

		}
	} );
	

},


Init_Filter_Widget = function(settings){
	
	var cFilter = settings.cFilter;
	cFilter.html_element.table = settings.aanFeatures.t;
	cFilter.html_element.thead = settings.nTHead;
	cFilter.html_element.tr = $(cFilter.html_element.thead).children('tr');
	
	if(cFilter.html_element.table === undefined){
		cFilter.html_element.table = $(cFilter.html_element.thead).parent();
	}
	
	cFilter.html_element.trFilter = $('<tr class="dataTable-research"></tr>');
	cFilter.navigator = jQuery.browser;
	


	cFilter.oClasse = {
		thClasse : "dataTable-col-research",
		noFilter  : "none",
		sFilter : "dataTable-select-research",
		iFilter : "dataTable-input-research",
		custFilter : "is_customFilter",
		iClassFilter : "is_input_customFilter"
	};
	
	cFilter.html_element.th = formatTrHead(cFilter);
	
	if(settings.oInit.oFilterFunction !== undefined){
		getCustomFilterSelect( settings );
	}
	
	
},

getCustomFilterSelect = function (settings){
	var customFilter = settings.oInit.oFilterFunction;
	var cOFilter = settings.cFilter.customFilter;
	
	$.each(customFilter, function (i,v){
		cOFilter[i] = v;
	});
},

formatTrHead = function(cFilter){
	var tr = cFilter.html_element.tr, len = tr.length, filterHead=[];
	
	for (var i = 0; i < len; i++)
	{	
		for (var y = 0; y < tr.eq(i).children('th').length; y++) 
		{
			if(tr.eq(i).children('th').eq(y).attr('colspan') === 1 || tr.eq(i).children('th').eq(y).attr('colspan') === undefined)
			{
				filterHead.push(tr.eq(i).children('th').eq(y));
			}
		}
	}
	
	return filterHead;
},

htmlProcess = function (settings){
	var cFilter = settings.cFilter, 
					component=cFilter.html_element.component,  
					th = cFilter.html_element.th, 
					thLen = th.length, 
					thClasse = cFilter.oClasse.thClasse, 
					noFilter = cFilter.oClasse.noFilter, 
					sFilter= cFilter.oClasse.sFilter, 
					iFilter = cFilter.oClasse.iFilter, 
					tabOption = [], row;
	
	for (var i = 0; i < thLen; i++)
	{
		
		if(th[i].hasClass('filter-none'))
		{
			component.push($('<th idx="'+i+'" class="'+thClasse + ' '+ noFilter+'"></th>').appendTo(cFilter.html_element.trFilter));
		}
		else if(th[i].hasClass('filter-select'))
		{
			component.push($('<th idx="'+i+'" class="'+thClasse+'"><select class="'+sFilter+'"></select></th>').appendTo(cFilter.html_element.trFilter));
		}
		else
		{
			component.push($('<th idx="'+i+'" class="'+thClasse+'"><input class="'+iFilter+'" type="search"></th>').appendTo(cFilter.html_element.trFilter));
		}
	}
	
	if(component.length > 0)
	{
		for ( var i = 0 ; i < component.length; i++)
		{
			if(component[i].children().hasClass(sFilter))
			{
				$('<option value="" selected></option>').appendTo(component[i].children('select'));
				tabOption = [];
				
				for (var j = 0; j < settings.aoData.length; j++)
				{
					row = settings.oApi._fnGetCellData(settings, j, component[i].attr('idx'));
					if(row === "" )
					{
						row = "<< vide >>";
					}
					if($.inArray(row, tabOption) <= -1)
					{
						
						tabOption.push(row);
					}
				}
				
				tabOption.sort();
				
				
				for (var j = 0; j < tabOption.length; j++){
					$('<option value="'+tabOption[j]+'">'+tabOption[j]+'</option>').appendTo(component[i].children('select'));
				}
			}
		}
	}
	
},

replaceByCustomFilter = function (settings)
{
	var customFilter = settings.cFilter.customFilter, th, custFilter = settings.cFilter.oClasse.custFilter;
	
	$.each(customFilter, function(i, v){
		if(v !== undefined){
			th = settings.cFilter.html_element.component[i];
			th.children('select').children('option').remove();
			
			th.addClass(custFilter);
			
			$('<option value="" selected></option>').appendTo(th.children('select'));
			
			$.each(v, function (j,w){
				$('<option value="'+j+'">'+j+'</option>').appendTo(th.children('select'));
			});
			
		
		}
	});
},

checkIsFiltered = function (settings){
	var cFilter = settings.cFilter, component = cFilter.html_element.component, custFilter = cFilter.oClasse.custFilter, prevSearch = settings.aoPreSearchCols, iClassFilter = cFilter.oClasse.iClassFilter, regex;
	
	regex = new RegExp('[<]|[>]|[-]', 'i');
	
	for(var i = 0; i<component.length; i++)
	{
		if(component[i].hasClass(custFilter))
		{
			
			if(prevSearch[i].sSearch !== "")
			{	
				settings.aiDisplay = rangeOnTbody(settings, prevSearch[i].sSearch, i);
			}
		}
		else if(prevSearch.length > 0)
		{
			if(prevSearch[i].sSearch.match(/<<\svide\s/))
			{
				
			}
			else if(prevSearch[i] !== undefined && regex.test(prevSearch[i].sSearch))
			{
				
				if(prevSearch[i].sSearch !== "")
				{	
					
					settings.aiDisplay = rangeOnTbody(settings, prevSearch[i].sSearch, i, true);
				}
			}
		}
		
	}
	return settings.aiDisplay;
},

action = function(settings){
	var cFilter = settings.cFilter, trFilter = cFilter.html_element.trFilter,val, custFilter = cFilter.oClasse.custFilter, iClassFilter = cFilter.oClasse.iClassFilter, regex;
	
	
	if(navigator.userAgent.match(/chrome/i))
	{
		navigator.chrome = true;
	}
	else
	{
		navigator.chrome = false;
	}
		
		
	trFilter.on('keyup change', 'th', function()
	{

		if($(this).hasClass(custFilter)){
			
			settings.aiDisplay = rangeOnTbody(settings, $(this).children().val(), $(this).attr('idx'));
			
			if(settings.aiDisplay.length === 0)
			{
				settings.aiDisplay = settings.aiDisplayMaster;
			}
			
			
			settings.aoPreSearchCols[$(this).attr('idx')].sSearch = $(this).children().val();
			settings.oApi._fnDraw(settings);
		}
		else
		{
			val = $(this).children().val();
			
			if(navigator.chrome)
			{
				$(this).children('input').off('search').on('search', function()
				{
					if($(this).val() === "")
					{
						settings.aoPreSearchCols[$(this).parent().attr('idx')].sSearch = "";
						settings.oApi._fnReDraw(settings);
					}
				});
			}
			
			regex = new RegExp('[<]|[>]|[-]|[=]', 'i');
			settings.aoPreSearchCols[$(this).attr('idx')].sSearch = val;
			if(val.match(/<<\svide\s>>/))
			{
				settings.aiDisplay =  findEmpty(settings, val, $(this).attr('idx'));
				
				if(settings.aiDisplay.length === 0)
				{
					settings.aiDisplay = settings.aiDisplayMaster;
				}
				
				settings.oApi._fnDraw(settings);
			}
			else if(regex.test(val))
			{
				$(this).addClass(iClassFilter);
				settings.aiDisplay =  rangeOnTbody(settings, val, $(this).attr('idx'), true);
				if(settings.aiDisplay.length === 0)
				{
					settings.aiDisplay = settings.aiDisplayMaster;
				}
				settings.oApi._fnDraw(settings);
			}
			else
			{
				settings.oApi._fnReDraw(settings);
			}
			
			
		}

	});
},

findEmpty = function(settings, val, colId)
{
	var data = settings.aoData, row, newData=[];

	
	for( var i = 0; i < data.length; i++)
	{
		row = data[i].anCells[colId].innerHTML;
		
		if(val.match(/<<\svide\s>>/))
		{
			if(row === "")
			{
				newData.push(parseInt(data[i].idx));
			}
		}
	}
	return newData;
},

rangeOnTbody = function(settings, val, colId, isInput){
	var data = settings.aoData, custFilter = settings.cFilter.customFilter, row, newData=[], ar, regex;

	val = detectSyntax(val);
	
	for( var i = 0; i < data.length; i++)
	{
		
		row = parseInt(data[i].anCells[colId].innerHTML);
		if(isInput)
		{
			
			//console.log(val.match(/^[<|>]=?\s?[0-9]+\s?\W{2}?\s?[<|>]?=?\s?[0-9]+$/));
			//console.log(val.match(/^[<|>]=?\s?[0-9]+$/));
			if(val.match(/^[<|>]?=?\s?[0-9]|[\'\']+$/))
			{
				ar = val.split(" ");
				
				if(ar[0].match(/>=/))
				{
					if( row >= ar[1])
					{
						newData.push(parseInt(data[i].idx));
					}
				}
					else if(ar[0].match(/<=/)){
					if( row <= ar[1])
					{
						newData.push(parseInt(data[i].idx));
					}
				}
				else if(ar[0].match(/</)){
					if( row < ar[1])
					{

						newData.push(parseInt(data[i].idx));
					}
				}
				else if(ar[0].match(/>/)){
					if( row > ar[1])
					{
						newData.push(parseInt(data[i].idx));
					}
				}
				else if(ar[0].match(/=/))
				{
					if(isNaN(row))
					{
						newData.push(parseInt(data[i].idx));
					}
				}
			}
			else if(val.match(/^[0-9]+\s-\s[0-9]+$/)){
				ar = val.split(" ");
				for(var i = 0; i < data.length; i++)
				{
					row = parseInt(data[i].anCells[colId].innerHTML);
					if( row >= ar[0] && row <= ar[2])
					{

						newData.push(parseInt(data[i].idx));
					}
				}
			}
			else if(val.match(/^[<|>]|[!=]\s?[0-9]+\s?\W{2}?\s?[<|>]?=?\s?[0-9]+$/)){
				ar = val.split(" ");
				//console.log(val.match(/^[<|>]=?\s?[0-9]+\s?\W{2}?\s?[<|>]?=?\s?[0-9]+$/));
				if(ar.length === 5)
				{
					if( ar[0].match(/[>=?]|[!=]/) && ar[2].match(/\W{2}/) && (ar[3].match(/<=/) || ar[3].match(/</)) )
					{
						if(ar[0].match(/>=/))
						{
							if(ar[3].match(/<=/))
							{
								if(row >= ar[1] && row <= ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
							else if(ar[3].match(/</))
							{
								if(row >= ar[1] && row < ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
						}
						else if(ar[0].match(/>/))
						{

							if(ar[3].match(/<=/))
							{
								if(row > ar[1] && row <= ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
							else if(ar[3].match(/</))
							{
								if(row > ar[1] && row < ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
						}
						else if(ar[0].match(/!=/))
						{

							if(ar[3].match(/<=/))
							{
								if(row != ar[1] && row <= ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
							else if(ar[3].match(/</))
							{
								if(row != ar[1] && row < ar[4])
								{
									newData.push(parseInt(data[i].idx));
								}
							}
						}
					}
				}
			}	
		}
		else
		{
			$.each(custFilter, function(j, v){
				if(v !== undefined){
					$.each(v, function(k, w){
						if(val === k)
						{

							if(w(row)){
								newData.push(parseInt(data[i].idx));
							}
						}
					});
				}
			});
		}
	}
	
	return newData;
},

detectSyntax = function(val){
	var regex;
	
	regex = new RegExp('^([<|>]=?)([0-9]+)$', 'i');
	if(regex.test(val))
	{
		val = val.replace(regex, "$1 $2");
	}
	
	regex = new RegExp('^([0-9]+)(-)([0-9]+)$', 'i');
	
	if(regex.test(val))
	{
		val = val.replace(regex, "$1 $2 $3");
	}
	
	return val;
},

checkElem = function(settings){
	if(settings.aanFeatures.t === undefined)
	{
		return jQuery.error('FilterWidget : Table doesn\'t exist');
	}
	
	if(settings.nTHead === null){
		return jQuery.error('FilterWidget : Header was not found');
	}
	
	if(settings.nTBody === null){
		return jQuery.error('FilterWidget : Body was not found');
	}
},

//verify if custom filter have value
//if true, reload the data filtered
preDrawCallbackFilter = function(settings)
{
	settings.aiDisplay = checkIsFiltered(settings);	
},

drawCallbackFilter = function(settings){
	var cFilter = settings.cFilter, sSave = settings.oFeatures.bStateSave;
	//console.log(settings);
	if(sSave){
		getPreSearch(settings);
	}
},

getPreSearch = function(settings){
	var prevData = settings.aoPreSearchCols/*settings.fnStateLoadCallback(settings)*/, component = settings.cFilter.html_element.component;

	if(prevData === null){return;}

	for (var i=0; i<prevData.length; i++)
	{
		component[i].children().val(prevData[i].sSearch);
	}

},

// Subscribe the feature plug-in to DataTables, ready for use
$.fn.dataTableExt.aoFeatures.push( {
	"fnInit": function( oSettings ) {
		var F = new $.fn.dataTable.ext.ofnSearch.filter( oSettings );
	},
	"cFeature": "F",
	"sFeature": "filter"
} );


})(window, document, jQuery);

