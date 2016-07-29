(function(window, document, $, undefined) {
$.fn.dataTable.ext.filter = function ( settings ) {

	thead = settings.nTHead;
	settings.zfilter = [];
	
	tr = $(thead).children('tr:last');	
	
	settings.zfilter.oClasse = {
		thClasse : "dataTable-col-research",
		noFilter  : "none",
		sFilter : "dataTable-select-research",
		iFilter : "dataTable-input-research",
		custFilter : "is_customFilter",
		iClassFilter : "is_input_customFilter"
	};
	settings.zfilter.cols = [];
	
	settings.zfilter.trFilter = $('<tr class="dataTable-research"></tr>');
	$(thead).append(settings.zfilter.trFilter);
	
	settings.aoInitComplete.push( {
		"sName" : "filter_widget",
		"fn": function (settings) {
	
			oClasse = settings.zfilter.oClasse;
			trFilter = settings.zfilter.trFilter;
			
			settings.zfilter.trFilter = $('<tr class="dataTable-research"></tr>');
			
			th = formatTrHead(tr);
			

			var thLen = th.length;

			for (var i = 0; i < thLen; i++)
			{
				
				if(th[i].hasClass('filter-none'))
				{
					th.push($('<th idx="'+i+'" class="'+oClasse.thClasse + ' '+ oClasse.noFilter+'"></th>').appendTo(trFilter));
				}
				else if(th[i].hasClass('filter-select'))
				{
					settings.zfilter.cols[i] = "";
					settings.aoPreSearchCols[i].exactSearch = true;
					var myth = $('<th idx="'+i+'" class="'+oClasse.thClasse+'"></th>').appendTo(trFilter);
					var column = this.api().column(i);
					th.push(myth);
					var select = $('<select class="'+oClasse.sFilter+'"></select>')
					select.appendTo(myth)
							.on( 'change', function () {
										settings.zfilter.cols[$(this).parent().attr('idx')] = $(this).val();
										settings.oApi._fnReDraw(settings);
									} );
					
					valvide= false;
					column.data().unique().sort().each( function ( d, j ) 
					{
						if(d !== null && d !== "" && d !== " ")
						{
							select.append( '<option value="'+d+'">'+d+'</option>' )
						}
						else
						{
							valvide= true;
						}	
					} );
					
					
					if(valvide){$('<option value="<<vide>>">&lt;&lt;vide&gt;&gt;</option>').prependTo(select);}
					$('<option value="" selected="selected"></option>').prependTo(select);
				}
				else
				{
					//settings.zfilter.cols[i] = "";
					settings.aoPreSearchCols[i].exactSearch = false;
					var myth = ($('<th idx="'+i+'" class="'+oClasse.thClasse+'"></th>').appendTo(trFilter));
					th.push(myth);
					var column = this.api().column(i);
					
					var input = $('<input class="'+oClasse.iFilter+'" type="search">');
					input.appendTo(myth)
							.on( 'change keyup search', function () {
									if($(this).val().match(/[\<\>\!\=]/g))
									{
										settings.zfilter.cols[$(this).parent().attr('idx')] = $(this).val();
										settings.aoPreSearchCols[$(this).parent().attr('idx')].sSearch = "";
										settings.oApi._fnReDraw(settings);
									}
									else
									{
										settings.zfilter.cols[$(this).parent().attr('idx')] = "";
										settings.aoPreSearchCols[$(this).parent().attr('idx')].sSearch = $(this).val();
										settings.oApi._fnReDraw(settings);
									}
										
									} );
				}
			}
	
	}
	} );
	
	
	$.fn.dataTableExt.afnFiltering.push
	(
        function (oSettings, aData, iDataIndex) 
		{
			val_return = true;
			$(oSettings.zfilter.cols).each(
			function(index,value)
			{
				if(value == "<<vide>>")
				{
					if(aData[index] !== null && aData[index] !== "" && aData[index] !== " ")
					{
						val_return = false;
					}	
				}
				else if(value !== "" && value !== undefined)
				{
					if(settings.aoPreSearchCols[index].exactSearch)
					{
						if(value != aData[index])
						{
							val_return = false;
						}
					}
					else if(settings.zfilter.cols[index] != "")
					{
						str = settings.zfilter.cols[index].replace(" ","");
						if(str.substring(0,2) == ">=")
						{
							if(!(aData[index] >= str.substring(2)))
							{
								val_return = false;
							}
						}
						else if(str.substring(0,1) == ">")
						{
							if(!(aData[index] > str.substring(1)))
							{
								val_return = false;
							}
						}
						else if(str.substring(0,2) == "<=")
						{
							if(!(aData[index] <= str.substring(2)))
							{
								val_return = false;
							}
						}
						else if(str.substring(0,1) == "<")
						{
							if(!(aData[index] < str.substring(1)))
							{
								val_return = false;
							}
						}
						else if(str.substring(0,2) == "==")
						{
							if(!(aData[index] == str.substring(2)))
							{
								val_return = false;
							}
						}
						else if(str.substring(0,2) == "!=")
						{
							if(!(aData[index] != str.substring(2)))
							{
								val_return = false;
							}
						}
					}
					else
					{
						if(!aData[index].match(new RegExp(value)))
						{
							val_return = false;
						}
					}
				}
				
			}
			);
			
			return val_return;
        }
    );
	
},
formatTrHead = function(tr){
	var len = tr.length, filterHead=[];
	
	for (var i = 0; i < len; i++)
	{	
		for (var y = 0; y < tr.eq(i).children('th').length; y++) 
		{
				filterHead.push(tr.eq(i).children('th').eq(y));
		}
	}
	return filterHead;
}

})(window, document, jQuery);

