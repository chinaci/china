$(function(){
	//全选、反选
	$("#selectAll").bind("click", function(){
		if($(this).is(":checked")){
			$("#editform").find("input[type=checkbox]").attr("checked", true);
			$(this).next("span").html("反选");
		}else{
			$("#editform").find("input[type=checkbox]").removeAttr("checked");
			$(this).next("span").html("全选");
		}
	});
});