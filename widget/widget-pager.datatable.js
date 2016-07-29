(function(window, document, $, undefined) {
	$.fn.dataTable.ext.oPagination.pager = {
		fnInit : function(oSettings, nPaging, fnCallbackDraw)
		{
			this.Init_Pager_Widget(oSettings);
			this.HtmlProcess(oSettings, nPaging);
			this.ActionClick(oSettings, fnCallbackDraw);
		},

		fnUpdate : function(oSettings,fnCallbackDraw)
		{
			if (!oSettings.aanFeatures.p) {
					return;
			}
			this.MenuLengthVal(oSettings);
			this.checkPage(oSettings);
			this.reWriteOptions();

		
			
			this.ActionChange(oSettings,fnCallbackDraw);
			this.UpdateClass();
		},
		
		Init_Pager_Widget : function(oSettings)
		{
			var len;
			this.cPager = {
				Html : {
					table : $(oSettings.aanFeatures.t),
					tId : '',
					pager : $('<form  class="pagerDataTable">'),
					IFirst : $('<img src="/pics/icons/first.png" class="first"/>'),
					IPrevious : $('<img src="/pics/icons/prev.png" class="prev"/>'),
					SPages : $('<select class="pagerDataTable_page" class="pagerdataTable_page_number"></select>'),
					INext : $('<img  src="/pics/icons/next.png" class="next"/>'),
					ILast : $('<img  src="/pics/icons/last.png" class="last"/>'),
					SOptions : []
					
				},
				val : {
					all : len === -1,
					len : oSettings._iDisplayLength,
					pages : 0,
					nbPage : 0,
					page : 0
				},
				settings : oSettings,
				hasFirstPageCallback : null,
				hasLastPageCallback : null
			};
			
			
			this.cPager.val.pages = Math.ceil(oSettings.fnRecordsDisplay() / this.cPager.val.len);
			this.cPager.val.nbPage = this.cPager.val.all ? 1 : Math.ceil(oSettings.fnRecordsDisplay() / this.cPager.val.len);
			this.cPager.val.page = this.cPager.val.all ? 0 : Math.ceil( oSettings._iDisplayStart / this.cPager.val.len );
			this.cPager.Html.tId = this.cPager.Html.table.attr('id');
			this.cPager.Html.pager.attr('id', "pager"+this.cPager.Html.tId);
			this.cPager.Html.IFirst.attr('id', this.cPager.Html.tId+"_first_page");
			this.cPager.Html.IPrevious.attr('id', this.cPager.Html.tId+"_previous_page");
			this.cPager.Html.INext.attr('id', this.cPager.Html.tId+"_next_page");
			this.cPager.Html.ILast.attr('id', this.cPager.Html.tId+"_last_page");
			
			for(var i=1; i <= this.cPager.val.nbPage; i++){
				this.cPager.Html.SOptions.push($('<option class="paginate_button" value="'+i+'">'+i+'</option>'));
			}
			
			
		},
		
		HtmlProcess : function(oSettings, nPaging)
		{
			var cPager = this.cPager;
			
			cPager.Html.pager.appendTo(nPaging);
			cPager.Html.IFirst.appendTo(cPager.Html.pager);
			cPager.Html.IPrevious.appendTo(cPager.Html.pager);
			cPager.Html.SPages.appendTo(cPager.Html.pager);
			cPager.Html.INext.appendTo(cPager.Html.pager);
			cPager.Html.ILast.appendTo(cPager.Html.pager);
		},
		
		ActionClick : function(oSettings, fnCallbackDraw)
		{
			fnClickHandler = function ( e ) {
				if ( oSettings.oApi._fnPageChange( oSettings, e.data.action ) )
				{
					fnCallbackDraw( oSettings );
				}
			};
			
			var cPager = this.cPager;
			oSettings.oApi._fnBindAction( cPager.Html.IFirst, {action:"first"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.IPrevious, {action:"previous"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.INext, {action:"next"}, fnClickHandler );
			oSettings.oApi._fnBindAction( cPager.Html.ILast, {action:"last"}, fnClickHandler );	
		},
		
		MenuLengthVal : function(oSettings)
		{
			var mLength = $(oSettings.aanFeatures.L), opts = mLength.children().children('option'), mLen = opts.length;
			for(var i=0; i < mLen; i++)
			{
				if(mLength.children().children('option').eq(i).val() == oSettings._iDisplayLength.toString())
				{
					mLength.children().children('option').eq(i).val(oSettings._iDisplayLength.toString()).attr('selected', 'selected');
				}
			}
		},
		
		checkPage : function (oSettings)
		{
			var cPager = this.cPager;
			if(!cPager.val.page > 0){
				cPager.hasFirstPageCallback = true;
			}else{
				cPager.hasFirstPageCallback = false;
			}
			if(cPager.val.page < cPager.val.nbPage-1){
				cPager.hasLastPageCallback = false;
			}else{
				cPager.hasLastPageCallback = true;
			}
			
			this.cPager.val.len = oSettings._iDisplayLength;
			this.cPager.val.pages = Math.ceil(oSettings.fnRecordsDisplay() / this.cPager.val.len);
			this.cPager.val.nbPage = this.cPager.val.all ? 1 : Math.ceil(oSettings.fnRecordsDisplay() / this.cPager.val.len);
			this.cPager.val.page = this.cPager.val.all ? 0 : Math.ceil( oSettings._iDisplayStart / this.cPager.val.len );
			
		},
		
		reWriteOptions : function()
		{
			this.cPager.Html.SOptions = [];
			
			for(var i=1; i <= this.cPager.val.nbPage; i++){
				this.cPager.Html.SOptions.push($('<option class="paginate_button" value="'+i+'">'+i+'</option>'));
			}
			
			this.cPager.Html.SPages.children('option').remove();
			for(var i = 0; i < this.cPager.val.nbPage; i++)
			{
				
				this.cPager.Html.SOptions[i].appendTo(this.cPager.Html.SPages);
			}
			this.cPager.Html.SPages.children('option').eq(this.cPager.val.page).attr('selected', 'selected');
		},
		
		ActionChange : function(oSettings, fnCallbackDraw)
		{
			this.cPager.Html.SPages.bind('change', function (e) {
				if ( oSettings.oApi._fnPageChange( oSettings, parseInt($(this).val())-1) )
				{
					fnCallbackDraw( oSettings );
				}
			});
		},
		
		UpdateClass : function ()
		{
			var tId = this.cPager.Html.tId;
			$('#'+tId+'_first_page').switchClass(this.hasFirstPageCallback, $('#'+tId+'_first_page'), 'disabled');
			$('#'+tId+'_previous_page').switchClass(this.hasFirstPageCallback, $('#'+tId+'_previous_page'), 'disabled');
			$('#'+tId+'_next_page').switchClass(this.hasLastPageCallback, $('#'+tId+'_next_page'), 'disabled');
			$('#'+tId+'_last_page').switchClass(this.hasLastPageCallback, $('#'+tId+'_last_page'), 'disabled');
		}
	},

	(function($){
		$.fn.switchClass = function (conditionCallback, elem, disabled)
		{
			if(conditionCallback){
				elem.addClass(disabled);
			}
			else
			{
				elem.removeClass(disabled);
			}
		};
	})(jQuery);
	
})(window, document, jQuery);