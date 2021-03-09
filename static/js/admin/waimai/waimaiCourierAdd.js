
huoniao.choseCity($(".choseCity"),$("#cityid"),$("#search_form"));  //城市分站选择初始化
//表单提交
function checkFrom(form){

    var form = $("#shop-form"), action = form.attr("action"), data = form.serialize();
    var btn = $("#submitBtn");
    btn.attr("disabled", true);

    $.ajax({
        url: action,
        type: "post",
        data: data,
        dataType: "json",
        success: function(res){
            if(res.state == 100){
                $.dialog({
					title: '提醒',
					icon: 'success.png',
					content: '保存成功！',
					ok: function(){
                        window.scroll(0, 0);
                        location.reload();
					}
				});
            }else{
                $.dialog.alert(res.info);
                btn.attr("disabled", false);
            }
        },
        error: function(){
            $.dialog.alert("网络错误，保存失败！");
            btn.attr("disabled", false);
        }
    })

    return false;

}

//填充城市列表
huoniao.buildAdminList($("#cityid"), cityList, '请选择分站', cityid);
$(".chosen-select").chosen();
