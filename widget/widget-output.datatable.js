/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function(window, document, $, undefined) {
	
	$.fn.dataTable.ext.output = function ( oSettings ) {
		var settings = oSettings;
		settings.output = [];

		
		active_output( settings );
	},
	
	setup = function ( settings ) {
		var output = settings.output, rowIndextrue, mydonne = [], $rows = [], dataheader = [];;
		
		if(settings.output === undefined) {
			return;
		}
		
		$.each(settings.aiDisplay, function (index, val) {
			$rows.push(settings.aoData[val]);
		});
		
		output.header = header( settings );
		mydonne['header'] = output.header['name'];
		mydonne['data'] = body(settings, $rows, output.header['tab_col']);

		return mydonne;
	},
	

	header = function( settings ) {
		var tab_col = [], oThead, index_colonne = 0, tab_show = [],dataheader = [];
		
		oThead = $(settings.nTHead);
		name = '[';
		
		oThead.children('tr').each(function () {
			
			if(!$(this).hasClass('dataTable-research')) {
				
				$(this).find('th').each(function () {
					
			
					if($(this).attr('colspan') > 1) {

						if($.isNumeric($(this).attr("colspan")) === false) {
								
							index_colonne += 1;
						} else {
							
							index_colonne +=  parseInt($(this).attr("colspan"));
						}
					} else if ($(this).attr("rowspan") > 1) {
							tab_show.push(index_colonne);
							index_colonne += 1;
					} else if (tab_show.indexOf(index_colonne) !== -1) {
						index_colonne += 2;
					} else {
						index_colonne += 1;
					}
					
					var taille = 0;
					var aligne = "";
					var format = "";
					var colspan = "";
					var rowspan = "";
					var showpdf = "";
					var type = "";
					var display = "";



					if ($(this).attr("aligne") === undefined) {
						aligne = "C";
					} else {
						aligne = $(this).attr("aligne");
					}

					if ($.isNumeric($(this).attr("colspan")) === false) {
						colspan = "1";
					} else {
						colspan = parseInt($(this).attr("colspan"));
					}

					if ($.isNumeric($(this).attr("rowspan")) === false) {
						rowspan = "1";
					} else {
						rowspan = parseInt($(this).attr("rowspan"));
					}

					if ($(this).attr("format") === undefined) {
						format = "";
					} else {
						format = $(this).attr("format");
					}

					if ($(this).attr("showpdf") === undefined) {
						showpdf = "";
					} else {
						showpdf = $(this).attr("showpdf");
					}						

					if ($(this).attr("type") === undefined) {
						type = "";
					} else {
						type = $(this).attr("type");
					}

					if ($(this).attr("taille") === undefined) 
					{
						if(colspan > 1)
						{
							taille = "";
						}
						else
						{
							taille = "20";
						}

					} else {
						taille = $(this).attr("taille");
					}								   


					if ($(this).is(':visible')) {
						display = "";
					} else {
						display = 'none';
					}

					name += '{\"name\":\"' + $(this).text() + '\",\"type\":\"' + type + '\",\"showpdf\":\"' + showpdf + '\",\"taille\":\"' + taille + '\",\"colspan\":\"' + colspan + '\",\"rowspan\":\"' + rowspan + '\",\"aligne\":\"' + aligne + '\",\"display\":\"' + display + '\",\"format\":\"' + format + '\"},';
					
				});
				
					name = name.substr(0, (name.length - 1)) + "],[";
			}
		});
		name = "[" + name.substr(0, (name.length - 2)) + "]";

		
		dataheader['name'] = name;
		dataheader['tab_col'] = tab_col;
		return dataheader;
	},
	
	body = function ( settings, $rows, tab_col) {
		var $cell, $cells, cellsLen, rowIndex, indx, cellIndex, mydata = [], rowIndextrue, $rows, id_col, index_colonne, rowsLength;
		
		rowIndextrue = 0;
		id_col = 0;
		index_colonne = 0;
		
		rowsLength = $rows.length;
		rowIndextrue = 0;
		
		mydata = "[";
	
		for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) 
		{
			mydata += "[";
			
			for (var i=0; i< $rows[rowIndex]._aFilterData.length; i++) {
				mydata += '"' + $rows[rowIndex]._aFilterData[i].replace(/\"/g, '')
																.replace(/\\/g, '\\\\')
																.replace(/\t/g, ' ')
																
																.replace(/\//g, '') + '",';
			}
			
			mydata = mydata.substr(0, mydata.length-1);
			mydata += "],";
					
		}

		mydata = mydata.substr(0, mydata.length -2);
		mydata += "]]";
		return mydata;
	},
	
	active_output = function ( settings )
	{
		
		var mydonnee, tId;
		if(settings.aanFeatures.t.length == 0) {
			return;
		}
		
		
		var dom_table = $(settings.aanFeatures.t);
		tId = dom_table.attr('id');
		
		if(!dom_table.hasClass('dt-output') && !dom_table.hasClass('dt-ofp')) {
			return;
		}
		
				dom_table.before('<form method="POST" action= "/exporttable/export" id="form_output" ENCTYPE="multipart/form-data">'+
								'<div><input type=hidden id="'+tId+'_colonne" name="colonne" value = "" >'+
								'<input type=hidden id="'+tId+'_data" name="data" value = "" >'+
								'<input type=hidden id="'+tId+'_param" name="param" value = "" >'+
								'<input type=hidden id="'+tId+'_titre" name="titre" value = "" >'+
								'<input type=hidden id="'+tId+'_type" name="type" value = "" >'+
								'<input type="submit" id="'+tId+'_form_xl" value="Format XL" Forid="excel" class="format bouton_bleu">'+
								'<input type="submit" id="'+tId+'_form_pdf" value="Format PDF" Forid="pdf" class="format bouton_bleu"></div></form>');
				var styles;
				styles = {"margin": "3px 4px"};
				$('#form_pdf').css(styles);
				$('#form_xl').css(styles);
				pdf_title = dom_table.attr('pdf_title');
				pdf_param = dom_table.attr('pdf_param');

				if (pdf_title == 'undefined'){pdf_title = '';}
				if (pdf_param == 'undefined'){pdf_param = '';}
				
			

				$(document).on('click', '#'+tId+'_form_xl', function ()
				{

						//dom_table.trigger('outputTablepe');
						mydonnee = setup(settings);
						
						$("#"+tId+"_data").attr("value", mydonnee['data']);
						$("#"+tId+"_colonne").attr("value",mydonnee['header']);
						$("#"+tId+"_titre").attr("value",pdf_title);
						$("#"+tId+"_param").attr("value",pdf_param);
						$("#"+tId+"_type").attr("value","excel");
				});
				$(document).on('click', '#'+tId+'_form_pdf' , function()
				{

					//dom_table.trigger('outputTablepe', true);
					mydonnee = setup(settings);
					
					
					$("#"+tId+"_data").attr("value", mydonnee['data']);
					$("#"+tId+"_colonne").attr("value",mydonnee['header']);
					$("#"+tId+"_titre").attr("value",pdf_title);
					$("#"+tId+"_param").attr("value",pdf_param);
					$("#"+tId+"_type").attr("value","pdf");
				});
	}
	
})(window, document, jQuery);


