$(function(){

	//增加一行
	$("#add").bind("click", function(){
		$("table tbody:eq(0)").append($("#trTemp").html());
	});

	//删除
	$("table").delegate(".del", "click", function(){
		var t = $(this);
		$.dialog.confirm("确定要删除吗？", function(){
			t.closest("tr").remove();
		});
	});

	//保存
	$("#save").bind("click", function(){
		var data = '[';
		$("table tbody:eq(0) tr").each(function(){
			var t = $(this), day = parseFloat(t.find("td:first-child input").val()), daytype = t.find("td:first-child select").val(), tdLength = t.find("td").length;
			data += '{"day": '+day+', "daytype": "'+daytype+'", "price" : ';
			var priceArr = [];
			t.find("td").each(function(index){
				var id = parseInt($(this).attr("data-id")), val = parseFloat($(this).find("input").val());
				if(index != 0 && index < tdLength - 1){
					priceArr.push('{"id": '+id+', "price": '+val+'}');
				}
			});
			data += '[' + priceArr.join(",") + ']},';
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
