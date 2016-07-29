

(function(window, document, $, undefined) {

	$.fn.dataTable.ext.totalizer = function ( oSettings ){
		var settings = oSettings;

		if(!$(settings.aanFeatures.t).hasClass('dt-totalizer')) {return;}
		
		settings.totalizer = [];
		settings.totalizer.colspan=[];
		settings.totalizer.params=[];
		
		if(oSettings.aoData.length === 0)
		{
			return jQuery.error('No data available in table !');
		}

		checkElem( settings );

		Init_Totalizer_Widget( settings );
		
	},
	
	
	
	/*Setup 
	 * 
	 * Init Processus of totalizer
	 * @param {Object} settings contain datatable config
	 * @returns {undefined}
	 */
	Init_Totalizer_Widget = function ( settings ) {
		
		var container = getContainer( settings );
		
		
		settings.totalizer.colspan = getColspan( settings, container );
		settings.totalizer.params = getColTotalizer(container);
		settings.totalizer.op = [];
		
		process( settings );
		Write( settings );
		
		
	},
	
	/*Write
	 * 
	 * @param {Object} settings
	 * Write result on the footer 
	 */
	Write = function( settings ) {
		
		var nTFoot = $(settings.nTFoot);
		var fTh = nTFoot.children('tr');
		var params = settings.totalizer.params;
		var colspan = settings.totalizer.colspan;
		
		var op = settings.totalizer.op;
		
		var _globalsum, _globalnb, _filtersum, _filternb, _viewsum, _viewnb;
		
		
		
		
		
		$.each(params, function (index, col) {
			
			for( var y = 0; y < op.length; y++) {
				
				if(op[y].colonne === col) {
					
					
					_globalsum = op[y]._globalsum;
					_globalnb = op[y]._globalnb;

					_filtersum = op[y]._filtersum;
					_filternb = op[y]._filternb;

					_viewsum = op[y]._viewsum;
					_viewnb = op[y]._viewnb;
					
					for(var i = 0; i < fTh.length ; i++) {
						
						if($(fTh[i]).hasClass('totalize-global') && _globalsum !== undefined) {		
							
							if($(fTh[i]).find('th').eq(col + colspan[i].global).hasClass('totalize-sum')) {

								$(fTh[i]).find('th').eq(col + colspan[i].global).html(_globalsum.formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].global).hasClass('totalize-avg')) {

								$(fTh[i]).find('th').eq(col + colspan[i].global).html((_globalsum/_globalnb).formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].global).hasClass('totalize-nb')) {

								$(fTh[i]).find('th').eq(col + colspan[i].global).html(_globalnb);

							}
						}
						if($(fTh[i]).hasClass('totalize-filter') && _filtersum !== undefined) {
							if($(fTh[i]).find('th').eq(col + colspan[i].filter).hasClass('totalize-sum')) {

								$(fTh[i]).find('th').eq(col + colspan[i].filter).html(_filtersum.formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].filter).hasClass('totalize-avg')) {

								$(fTh[i]).find('th').eq(col + colspan[i].filter).html((_filtersum/_filternb).formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].filter).hasClass('totalize-nb')) {

								$(fTh[i]).find('th').eq(col + colspan[i].filter).html(_filternb);

							}
						}
						if($(fTh[i]).hasClass('totalize-view') && _viewsum !== undefined) {
							
							if($(fTh[i]).find('th').eq(col + colspan[i].view).hasClass('totalize-sum')) {
								
								$(fTh[i]).find('th').eq(col + colspan[i].view).html(_viewsum.formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].view).hasClass('totalize-avg')) {

								$(fTh[i]).find('th').eq(col + colspan[i].view).html((_viewsum/_viewnb).formatNumber(2, ',', ' '));

							}
							if($(fTh[i]).find('th').eq(col + colspan[i].view).hasClass('totalize-nb')) {

								$(fTh[i]).find('th').eq(col + colspan[i].view).html(_viewnb);

							}
						}
					}
				}
			}
		});
	
	},
	
	/*Process
	 * 
	 * Create new element in settings of dataTable
	 * This element contains operation of column who are parameter
	 * @param {object} settings
	 * @returns {Object}
	 */
	process = function ( settings ) {
		var params, _globalsum, _filtersum, _viewsum, _globalnb, _filternb, _viewnb, Rlen, Row, Rows, aidisplay, colspan;
		
		params = settings.totalizer.params;
		Rlen = settings.aoData.length;
		Rows = settings.aoData;
		colspan = settings.totalizer.colspan;
		
		aidisplay = settings.aiDisplay;
		
		
		for (var m = 0; m < colspan.length; m++) {
			for( var y = 0; y < colspan.length; y++) {

					_globalsum = 0, _filtersum = 0; _viewsum = 0, _globalnb = 0, _filternb = 0, _viewnb = 0; 

					for(var line=0; line < Rlen; line++) {


						Row = Rows[line].anCells[params[y] + colspan[m].general];



						if(Row !== undefined && Row.innerHTML !== "") {

							_globalsum = (_globalsum) + parseFloat(RegReplace(Row.innerHTML));

						}
						_globalnb += 1;

						if(Rows[aidisplay[line]] !== undefined) {
							
							if(Rows[aidisplay[line]].anCells[params[y] + colspan[m].general] !== undefined && Rows[aidisplay[line]].anCells[params[y] + colspan[m].general].innerHTML !== "") {
								
								_filtersum = (_filtersum) + parseFloat(RegReplace(Rows[aidisplay[line]].anCells[params[y] + colspan[m].general].innerHTML));
								
							}
							_filternb += 1;
						}

					}

					//pour le pager 
					
					var nTBody = $(settings.nTBody);
					if(!nTBody.children().children().hasClass('dataTables_empty')) {
						var pagerData = nTBody.children();
						var PRows;

						for(var i = 0; i < pagerData.length; i++) {
							PRows = $(pagerData[i]).children('td').eq(params[y] + colspan[m].general)[0].innerHTML;

							if(PRows !== "") {
								_viewsum = (_viewsum) + parseFloat(RegReplace(PRows));
							}
							_viewnb += 1;
						}
					}
					settings.totalizer.op.push({"colonne" : params[y], "_globalsum" : _globalsum, "_globalnb" : _globalnb});
					settings.totalizer.op.push({"colonne" : params[y], "_filtersum" : _filtersum, "_filternb" : _filternb});
					settings.totalizer.op.push({"colonne" : params[y], "_viewsum" : _viewsum, "_viewnb" : _viewnb });
				
			}
			
			
			
			params = params.slice(2);

		}
		//settings.totalizer.op.push({"_globalsum" : _globalsum, "_globalnb" : _globalnb, "_filtersum" : _filtersum, "_filternb" : _filternb, "_viewsum" : _viewsum, "_viewnb" : _viewnb });
		/*settings.totalizer.op.push({"_globalsum" : _globalsum, "_globalnb" : _globalnb});
		settings.totalizer.op.push({"_filtersum" : _filtersum, "_filternb" : _filternb});
		settings.totalizer.op.push({"_viewsum" : _viewsum, "_viewnb" : _viewnb });*/
		

	},
	
	/*RegReplace
	 * 
	 * @param {String} val
	 * @returns {String}
	 */
	RegReplace = function ( val ) {
		var regex = new RegExp("[a-z]|[A-Z]|[\$€]","g");
		val = val.replace(' ', '').replace(regex, "").replace(/,/g,'.');
		return val;
	},
	
	/*getColspan
	 * 
	 * @param {Object} settings contain datatable config
	 * @returns {undefined}
	 */
	getColspan = function ( settings, container ) {
		var colspan = [];
		var _Tr = container.children('tr');
		
		for(var i = 0; i < _Tr.length; i++)
		{
			if(_Tr.eq(i).hasClass('totalize-global'))
			{

				if(_Tr.eq(i).children().attr('colspan'))
				{
					colspan.push({"ligne":i, "global":parseFloat(_Tr.eq(i).children().attr('colspan')) - 1,
												"filter":0,
												"view":0,
												"general":0});
					//colspan.global = parseFloat(_Tr.eq(i).children().attr('colspan')) - 1;
				}else{
					//colspan.global = 0;
					colspan.push({"ligne":i, "global":0,
												"filter":0,
												"view":0,
												"general":0});
				}
			}
			
			if(_Tr.eq(i).hasClass('totalize-filter'))
			{
				if(_Tr.eq(i).children().attr('colspan'))
				{
					colspan.push({"ligne":i, "filter":parseFloat(_Tr.eq(i).children().attr('colspan')) - 1,
												"global":0,
												"view":0,
												"general":0});
					//colspan.filter = parseFloat(_Tr.eq(i).children().attr('colspan')) - 1;
				}else{
					//colspan.filter = 0;
					colspan.push({"ligne":i, "filter":0,
												"global":0,
												"view":0,
												"general":0});
				}
			}

			if(_Tr.eq(i).hasClass('totalize-view'))
			{
				
				if(_Tr.eq(i).children().attr('colspan'))
				{
					colspan.push({"ligne":i, "view":parseFloat(_Tr.eq(i).children().attr('colspan')) - 1,
												"global":0,
												"filter":0,
												"general":0});
					//colspan.view = parseFloat(_Tr.eq(i).children().attr('colspan')) - 1;
				}else{
					colspan.push({"ligne":i, "view":0,
												"global":0,
												"filter":0,
												"general":0});
					//colspan.view = 0;
				}
			}
			
		
		
			if((colspan[i].global == colspan[i].filter) && (colspan[i].filter == colspan[i].view))
			{
				//cas ou toutes les tr du footer ont un colspan	
				colspan[i].general = colspan[i].global;
			}

			if(colspan[i].global > 0 && colspan[i].filter == 0 && colspan[i].view == 0 )
			{
				colspan[i].filter = colspan[i].global;
				colspan[i].view = colspan[i]. global;
				colspan[i].general = colspan[i].global;
				colspan[i].global = colspan[i].global - colspan[i].global;
			}
			else if(colspan[i].filter > 0 && colspan[i].global == 0 && colspan[i].view == 0)
			{
				colspan[i].general = colspan[i].filter;
				colspan[i].filter = colspan[i].filter - colspan[i].filter;
			}
			else if(colspan[i].view > 0 && colspan[i].global == 0 && colspan[i].filter == 0 )
			{
				colspan[i].general = colspan[i].view;
				colspan[i].view = colspan[i].view - colspan[i].view;
			}
			else if(colspan[i].filter > 0 && colspan[i].global > 0 && colspan[i].view == 0)
			{
				colspan[i].general = colspan[i].global;
				colspan[i].filter = colspan[i].filter - (colspan[i].filter * 2) + colspan[i].global;
				colspan[i].view = colspan[i].view + colspan[i].global;
				colspan[i].global = colspan[i].global - colspan[i].global;
			}
			else if(colspan[i].view > 0 && colspan[i].global > 0 && colspan[i].filter == 0)
			{
				colspan[i].general = colspan[i].global;
				colspan[i].view = colspan[i].view - (colspan[i].view * 2) + colspan[i].global;
				colspan[i].filter = colspan[i].filter + colspan[i].global;
				colspan[i].global = colspan[i].global - colspan[i].global;
			}
			else if(colspan[i].view > 0 && colspan[i].filter > 0 && colspan[i].global == 0)
			{
				colspan[i].general = colspan[i].global;
				colspan[i].view = colspan[i].view - (colspan[i].view * 2);
				colspan[i].filter = colspan[i].filter - (colspan[i].filter * 2);
				colspan[i].global = colspan[i].global - colspan[i].global;
			}
			else if(colspan[i].view > 0 && colspan[i].filter > 0 && colspan[i].global > 0)
			{
				colspan[i].general = colspan[i].global;
				colspan[i].view = (colspan[i].view - (colspan[i].view * 2)) + colspan[i].general;
				colspan[i].filter = (colspan[i].filter - (colspan[i].filter * 2)) + colspan[i].general;
				colspan[i].global = colspan[i].global - colspan[i].global;
			}
		}
		return colspan;
	},
	
	/*getColTotalizer
	 * 
	 * @param {Object} $my_th_index
	 * @returns {Object} column who contain <th> of footer or header
	 */
	getColTotalizer = function(container)
	{
		var params = [];
		
		var len;
		
		var _Tr = container.children('tr');
		var totParams; 
		
		for(var y = 0; y < _Tr.length; y++) {
			
			len = _Tr.eq(y).children('th').length;
			totParams = _Tr.eq(y).children('th');
			for(var i = 0; i < len; i++)
			{
				
				if(totParams.eq(i).hasClass("totalize-sum"))
				{
					params.push(i);
				}
				if(totParams.eq(i).hasClass("totalize-avg"))
				{
					params.push(i);

				}
				if(totParams.eq(i).hasClass("totalize-nb"))
				{
					params.push(i);

				}
			}
			
		}

		if(params.length === 0) {
			return jQuery.error('Totalizer : Not found counting class on  footer element');
		}
		else {
			return params;
		}	
	},
	
	
	/*getContainer
	 * 
	 * @param {Object} settings
	 * @returns {Object} tfoot or thead who contain initialisation class
	 */
	getContainer = function ( settings ) {
		var tfoot = $(settings.nTFoot);
		var thead = $(settings.nTHead);
		
		if(tfoot.children('tr').hasClass('totalize-param')) {
			return tfoot;
		}
		else if(thead.children('tr').hasClass('totalize-param')) {
			return thead;
		}
		else {
			return jQuery.error('Error : Try to get container failed');
		}
	},
	
	/*checkElem
	 * 
	 * @param {Object} settings contain datatable config
	 * @returns {jQuery}
	 * 
	 * Check table
	 * If thead not exists @return jQuery Error
	 * If tfoot not exists @return jQuery Error
	 * If tfoot OR thead haven't initialisation class : "totalize-param" @return jQuery Error
	 */
	checkElem = function ( settings ) {
		var table, tfoot, thead;
		
		table = settings.aanFeatures.t;
		tfoot = settings.nTFoot;
		thead = settings.nTHead;

		if($(table).hasClass('dt-totalizer')) {
			if(  tfoot === null && thead === null  ){
				return jQuery.error('Footer or header not found');
			}


			if( !$(tfoot).children('tr').hasClass('totalize-param') 
					&& !$(thead).children('tr').hasClass('totalize-param')) {
				return jQuery.error('Not found initialisation class');
			}
		}
	};
})(window, document, jQuery);

