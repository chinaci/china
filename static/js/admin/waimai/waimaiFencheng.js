$(function(){

    // $(".chosen-select").chosen();

    // //下拉选择控件
    // $(".chosen-select").chosen().change(function() {
    //     $('#searchf').submit();
    // })
	//填充分站列表
	huoniao.choseCity($(".choseCity"),$("#cityid"),$("#searchf"));  //城市分站选择初始化

    //修改分成
    $(".edit").bind("click", function(){
        var href = $(this).attr("href"), shopname = $(this).attr("data-shopname");

		try {
			event.preventDefault();
			parent.addPage("waimaiFenchengEdit", "waimai", "修改分成-"+shopname, "waimai/"+href);
		} catch(e) {}
    });


});
