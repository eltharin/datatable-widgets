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
		mydonne['footer'] = footer(settings);
		return mydonne;
	},
	
	footer = function( settings )
	{
		var oTFoot,index_colonne = 0, tab_show = [], datafooter = [];
		oTFoot = $(settings.nTFoot);
		value = '[';
		
		oTFoot.children('tr').each(function()
		{
			$(this).find('th').each(function () {
				
				if($(this).attr('colspan') > 1) {

					if($.isNumeric($(this).attr("colspan")) === false) 
					{
						index_colonne += 1;
					} 
					else 
					{
						index_colonne +=  parseInt($(this).attr("colspan"));
					}
				}
				else if ($(this).attr("rowspan") > 1) 
				{
					tab_show.push(index_colonne);
					index_colonne += 1;
				} 
				else if (tab_show.indexOf(index_colonne) !== -1) 
				{
						index_colonne += 2;
				} 
				else 
				{
						index_colonne += 1;
				}
				value += '{\"value\":\"' + $(this).text() + '\",\"colspan\":\"' + parseInt($(this).attr("colspan")) + '\",\"rowspan\":\"' + parseInt($(this).attr("rowspan")) + '\"},';
			});
			value = value.substr(0, (value.length - 1)) + "],[";
			
		});
		value = "[" + value.substr(0, (value.length - 2)) + "]";
		return value;
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
					var align = "";
					var format = "";
					var colspan = "";
					var rowspan = "";
					var showpdf = "";
					var type = "";
					var display = "";



					if ($(this).data("align") === undefined) {
						if ($(this).attr("align") === undefined) {
							align = "C";
						} else {
							align = $(this).attr("align");
						}
					} else {
						align = $(this).data("align");
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

					if ($(this).data("print") === undefined) {
						if ($(this).attr("showpdf") === undefined) {
							showpdf = "";
						} else {
							showpdf = $(this).attr("showpdf");
						}	
					} else {
						showpdf = $(this).data("print");
					}						

					if ($(this).attr("type") === undefined) {
						type = "";
					} else {
						type = $(this).attr("type");
					}

					if ($(this).data("size") === undefined) 
					{
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

					} else {
						taille = $(this).data("size");
					}								   


					if ($(this).is(':visible')) {
						display = "";
					} else {
						display = 'none';
					}

					name += '{\"name\":\"' + $(this).text() + '\",\"type\":\"' + type + '\",\"showpdf\":\"' + showpdf + '\",\"taille\":\"' + taille + '\",\"colspan\":\"' + colspan + '\",\"rowspan\":\"' + rowspan + '\",\"align\":\"' + align + '\",\"display\":\"' + display + '\",\"format\":\"' + format + '\"},';
					
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
		var rowIndex, mydata = [], rowIndextrue, $rows, id_col, index_colonne, rowsLength;
		rowIndextrue = 0;
		id_col = 0;
		index_colonne = 0;
		
		rowsLength = $rows.length;
		rowIndextrue = 0;
		
		mydata = "[";



		for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) 
		{
			mydata += "[";
			
			if(jQuery.type($rows[rowIndex]._aData) === 'object')
			{
				for (var i=0; i< $(settings.aoColumns).length; i++) 
				{
					if($rows[rowIndex]._aData[settings.aoColumns[i].data])
					{
						if($rows[rowIndex]._aData[settings.aoColumns[i].data] === null)
						{
							mydata += '"' + '",';
						}
						else
						{
							data = $rows[rowIndex]._aData[settings.aoColumns[i].data];
							if(settings.aoColumns[i].mRender !== null)
							{
								data = settings.aoColumns[i].render.display(data);
							}
							mydata += '"' + data.replace( /<([^>]*)>/g, "" )
												.replace(/\"/g, '')
												.replace(/\\/g, '\\\\')
												.replace(/\t/g, ' ')
												.replace(/\r\n/g, '</br>')
												.replace(/\r/g, '</br>')
												.replace(/\n/g, '</br>')
												.replace(/\//g, '\\\/') + '",';							
						}
					}
					else
					{
						mydata += '"' + '",';
					}
				}
			}
			else
			{
				for (var i=0; i< $rows[rowIndex]._aData.length; i++) 
				{
					data = $rows[rowIndex]._aData[i];
					if(settings.aoColumns[i].mRender !== null)
					{
						data = settings.aoColumns[i].render.display(data);
					}			
						mydata += '"' + data.replace( /<([^>]*)>/g, "" )
											.replace(/\"/g, '')
											.replace(/\\/g, '\\\\')
											.replace(/\t/g, ' ')
											.replace(/\r\n/g, '</br>')
											.replace(/\r/g, '</br>')
											.replace(/\n/g, '</br>')
											.replace(/\//g, '\\\/') + '",';
			
				}
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
		if(settings.aanFeatures.t.length === 0) {
			return;
		}

		var dom_table = $(settings.aanFeatures.t);
		tId = dom_table.attr('id');
		
		if(!dom_table.hasClass('dt-output') && !dom_table.hasClass('dt-ofp')) {
			return;
		}
		
		dom_table.before('<form method="POST" action= "/exporttable/export" id="form_output" ENCTYPE="multipart/form-data">'+
								'<input type=hidden id="'+tId+'_colonne" name="colonne" value = "" >'+
								'<input type=hidden id="'+tId+'_data" name="data" value = "" >'+
								'<input type=hidden id="'+tId+'_footer" name="footer" value = "" >'+
								'<input type=hidden id="'+tId+'_param" name="param" value = "" >'+
								'<input type=hidden id="'+tId+'_titre" name="titre" value = "" >'+
								'<input type=hidden id="'+tId+'_type" name="type" value = "" >'+
								'<div id="export">'+
								'<div id="block" style="min-height: 50px;min-width: 200px;height: auto;width: auto;overflow: hidden;position: absolute;'+
								'background-color: lightgrey;border-radius: 5px;padding: 10px;border: 2px solid black;margin-top: 25px;margin-left: 2px;display: none;">'+
								
								'<div id="choix">'+
								'<input type="radio" class="form_export" name="type_exp"  value="xl" checked> Excel'+
								'<input type="radio" class="form_export" name="type_exp" value="pdf"> Pdf'+
								'<hr></div>'+
								'Prendre les valeurs nulles : '+
								'<input type="radio" name="valeurs" value="1" checked> Oui'+
								'<input type="radio" name="valeurs" value="0"> Non<br><hr>'+
								'<div id="xl" style="display:none;">'+
								'</div>'+
								'<div id="pdf" style="display:none;">'+
								'Parametrage : '+
								'<input type="radio" class="parametrage" name="param" value="auto" checked> auto'+
								'<input type="radio" class="parametrage" name="param" value="mano"> manuel <br>'+
								'Orientation : '+
								'<input type="radio" name="orientation" class="disabler" value="L" checked disabled> paysage'+
								'<input type="radio" name="orientation" class="disabler" value="P" disabled> portrait <br>'+
								'type taille: '+
								'<input type="radio" name="type_taille" class="disabler" value="A4" checked disabled> A4'+
								'<input type="radio" name="type_taille" class="disabler" value="A3" disabled> A3<br>'+
								'</div></div>'+
								'<input type="submit" id="export_button" style="margin: 0px; border-radius: 50px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;" value="Export xl" class="bouton_bleu">'+
								'<input type="button" id="param_export" style="width: 20px;background-image: url(/pics/sort_desc.png);margin: 0px; border-radius: 50px; margin-left: 1px;border-top-left-radius: 0px;border-bottom-left-radius: 0px;"  class="bouton_bleu">'+
								
								
								
								'</form>');
				var title = dom_table.attr('pdf_title');
				var param = dom_table.attr('pdf_param');

				if (title === 'undefined'){title = '';}
				if (param === 'undefined'){param = '';}
				

				$(document).on('click', function (e)
				{   
					if($("#param_export").is(e.target) && $('#block').css('display') === 'none')
					{
						$('#block').show();
					}
					else if((!$("#block").is(e.target)  && $("#block").has(e.target).length === 0 )	
						 ||($('#block').css('display') === 'block' && $("#param_export").is(e.target))	
						 ||(!$("#block").is(e.target) && $("#block").has(e.target).length === 0  && !$("#param_export").is(e.target))) 
					{
						$('#block').hide();
					}
				});
				$(document).on('click', '.parametrage', function ()
				{
					if($(this).val()==="mano")
					{
						$('.disabler').prop('disabled', false);
					
					}
					else
					{
						$('.disabler').prop("disabled", true);
					}
				});
				
				$(document).on('click', '.form_export', function ()
				{
					$('#xl').hide();
					$('#pdf').hide();
					$('#'+$(this).val()).show();
					$('#export_button').val('Export ' + $(this).val());
				});

				$(document).on('click', '#export_button', function ()
				{
					mydonnee = setup(settings);

					$("#"+tId+"_data").attr("value", mydonnee['data']);
					$("#"+tId+"_colonne").attr("value",mydonnee['header']);
					$("#"+tId+"_footer").attr("value",mydonnee['footer']);
					$("#"+tId+"_titre").attr("value",title);
					$("#"+tId+"_param").attr("value",param);
					if($('#export_button').val()==='Export xl')
					{
						$("#"+tId+"_type").attr("value","excel");
					}
					else
					{
						$("#"+tId+"_type").attr("value","pdf");
					}
				});
	};
})(window, document, jQuery);


