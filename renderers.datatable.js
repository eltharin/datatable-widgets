jQuery.fn.dataTable.render["comptaDC"] = function() {
	return {

		display: function ( d ) {
			if(d > 0)
			{
				d = Math.abs(d).toFixed(2).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
				}).replace('.', ',');;
				d += ' D';
			}
			else if(d < 0)
			{
				d = Math.abs(d).toFixed(2).replace(/./g, function(c, i, a) {
					return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c: c;
				}).replace('.', ',');
				d += ' C';
			}
			else if(d === 0)
			{
				d = '0,00 D';
			}
			else
			{
				d = '';
			}
			return d;
		}
	};
};

var tableRender = [];

$(document).ready(function()
{
	$("thead > tr > th").each(function(index, data)
	{
		if($(data).hasClass('comptaDC'))
		{
			found = $.map(tableRender, function(val) {
				if(val.targets === "comptaDC")
				{
					return 0;
				};
			});
			if(found.length === 0)
			{
				tableRender.push({ targets : "comptaDC" , render :  $.fn.dataTable.render.comptaDC()});
			}
		}
	});
});