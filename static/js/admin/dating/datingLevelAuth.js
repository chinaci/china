$(function(){

	//保存
	$("#save").bind("click", function(){
		var data = '[';
		$("table tbody:eq(0) tr").each(function(){
			var t = $(this);
			data += '[';
			var priceArr = [];
			t.find("td").each(function(index){
				var id = $(this).attr("data-id"), module = $(this).attr("data-module"), val = parseFloat($(this).find("input").val());
				if(id != undefined){
					priceArr.push('{"id": '+id+', "module": "'+module+'", "count": '+val+'}');
				}
			});
			data += priceArr.join(",") + '],';
		});
		data = data.substr(0, data.length-1);
		data += ']';

		huoniao.operaJson("?dopost=update", "data="+data, function(data){
			if(data.state == 100){
				huoniao.showTip("success", data.info, "auto");
				window.scroll(0, 0);
				setTimeout(function() {
					location.reload();
				}, 800);
			}else{
				huoniao.showTip("error", data.info, "auto");
			}
		});

	});

});
