$(function(){
    $(document).on('click','#foodList_c0_all',function() {
        var checked=this.checked;
        $("input[name='selectorderlist\[\]']:enabled").each(function() {this.checked=checked;});
    });
    $(document).on('click', "input[name='selectorderlist\[\]']", function() {
        $('#foodList_c0_all').prop('checked', $("input[name='selectorderlist\[\]']").length==$("input[name='selectorderlist\[\]']:checked").length);
    });

    $("#typeid").change(function(){
        $(this).closest("form").submit();
    });


    //库存状态
    $(".stockStatusSwitch input").bind("click", function(){
        var input = $(this), id = input.data("id"), val = input.is(":checked") ? 1 : 0;
        $.ajax({
            url: "waimaiFoodList.php",
            type: "post",
            data: {action: "updateStockStatus", id: id, val: val},
            dataType: "json",
            success: function(res){
                if(res.state != 100){
                    $.dialog.alert(res.info);
                }
            },
            error: function(){
                $.dialog.alert("网络错误，保存失败！");
            }
        })
    });

    //商品状态
    $(".foodStatusSwitch input").bind("click", function(){
        var input = $(this), id = input.data("id"), val = input.is(":checked") ? 1 : 0;
        $.ajax({
            url: "waimaiFoodList.php",
            type: "post",
            data: {action: "updateStatus", id: id, val: val},
            dataType: "json",
            success: function(res){
                if(res.state != 100){
                    $.dialog.alert(res.info);
                }
            },
            error: function(){
                $.dialog.alert("网络错误，保存失败！");
            }
        })
    });

    //自定义属性状态
    $(".natureStatusSwitch input").bind("click", function(){
        var input = $(this), id = input.data("id"), val = input.is(":checked") ? 1 : 0;
        $.ajax({
            url: "waimaiFoodList.php",
            type: "post",
            data: {action: "updateNatureStatus", id: id, val: val},
            dataType: "json",
            success: function(res){
                if(res.state != 100){
                    $.dialog.alert(res.info);
                }
            },
            error: function(){
                $.dialog.alert("网络错误，保存失败！");
            }
        })
    });

    //删除
    $(".del").bind("click", function(){
        var t = $(this), tr = t.closest("tr"), id = t.data("id");

        $.dialog.confirm("删除后可在回收站恢复，确认要删除吗？", function(){
            $.ajax({
                url: "waimaiFoodList.php",
                type: "post",
                data: {action: "delete", id: id},
                dataType: "json",
                success: function(res){
                    if(res.state != 100){
                        $.dialog.alert(res.info);
                    }else{
                        location.reload();
                    }
                },
                error: function(){
                    $.dialog.alert("网络错误，保存失败！");
                }
            })
        })

    });


    $("#deleteSelect").bind("click", function(){
        var data = new Array();
        $("input[name='selectorderlist\[\]']:enabled").each(function (){
            if(this.checked == true){
                data.push(this.value);
            }
        });
        if(data.length > 0){

            $.dialog.confirm("删除后可在回收站恢复，确认要删除吗？", function(){
                $.ajax({
                    url: "waimaiFoodList.php",
                    type: "post",
                    data: {action: "delete", id: data.join(",")},
                    dataType: "json",
                    success: function(res){
                        if(res.state != 100){
                            $.dialog.alert(res.info);
                        }else{
                            location.reload();
                        }
                    },
                    error: function(){
                        $.dialog.alert("网络错误，保存失败！");
                    }
                })
            })
            return false;

        }else{
            $.dialog.alert("请选择要批量删除的商品!");
            return false;
        }
    })


    //上传
    function mysub(){

        var data = [];
        data['mod'] = "waimai";
        data['type'] = "file";

        $.dialog.tips('导入中...',600,'loading.gif');

        $.ajaxFileUpload({
            url: "/include/upload.inc.php",
            fileElementId: "Filedata",
            dataType: "json",
            data: data,
            success: function(m, l) {
                if (m.state == "SUCCESS") {

                    $.ajax({
                        url: "waimaiFoodList.php",
                        data: {
                            "sid": sid,
                            "action": "import",
                            "file": m.url
                        },
                        type: "post",
                        dataType: "json",
                        success: function(data){
                            if(data.state == 100){
                                location.reload();
                            }else{
                                $.dialog.tips(data.info, 1, 'error.png', function(){});
                            }
                        },
                        error: function(){
                            $.dialog.tips("导入失败！", 1, 'error.png', function(){});
                        }
                    });

                } else {
                    $.dialog.tips("上传错误！", 1, 'error.png', function(){});
                }
            },
            error: function() {
                $.dialog.tips("网络错误，上传失败！", 1, 'error.png', function(){});
            }
        });

    }

    $("#Filedata").bind("change", function(){
        if ($(this).val() == '') return;
        mysub();
    });

    // 快速编辑
    $(".fastedit").blur(function(){
        var t = $(this), id = t.closest("tr").attr("data-id"), val = $.trim(t.text()), val_ = $.trim(t.attr("data-val")), type = $.trim(t.attr("class").replace("fastedit", ""));

        if(val == "") return;

        if(type == "sort"){
            val = parseInt(val);
            if(isNaN(val)){
                t.text(val_);
                huoniao.showTip("error", "输入错误", "auto");
                return;
            }else{
                t.text(val);
            }
        }

        if(val == val_){
            huoniao.showTip("success", "信息未改变", "auto");
            return;
        }

        $.ajax({
            url: "waimaiFoodList.php",
            type: "post",
            data: {action: "fastedit", id: id, type: type, val: val},
            dataType: "json",
            success: function(res){
                if(res.state == 100){
                    huoniao.showTip("success", "修改成功！", "auto");
                    t.attr("data-val", val);
                }else{
                    t.text(val_);
                    huoniao.showTip("error", res.info, "auto");
                }
            },
            error: function(){
                t.text(val_);
                huoniao.showTip("error", "修改失败！", "auto");
            }
        })
    })

    //分类回收站
    $("#recycle").bind("click", function(){
        var href = $(this).attr("data-href");
        try {
            event.preventDefault();
            parent.addPage("waimaiFoodListDel", "waimai", "商品回收站-"+shopname, "waimai/"+href);
        } catch(e) {}
        // location.href = '?del=1';
    });
    //从回收站恢复商品
    $(".recycleback").bind("click", function(){
        var t = $(this), tr = t.closest("tr"), id = t.data("id");

        $.dialog.confirm("确定要从回收站恢复该商品吗？", function(){
            $.ajax({
                url: "waimaiFoodList.php",
                type: "post",
                data: {action: "recycleback", id: id},
                dataType: "json",
                success: function(res){
                    if(res.state != 100){
                        $.dialog.alert(res.info);
                    }else{
                        location.reload();
                    }
                },
                error: function(){
                    $.dialog.alert("网络错误，保存失败！");
                }
            })
        })
    });
    //从回收站删除商品
    $(".destory").bind("click", function(){
        var t = $(this), tr = t.closest("tr"), id = t.data("id");

        $.dialog.confirm("确定要从回收站删除该商品吗？", function(){
            $.ajax({
                url: "waimaiFoodList.php",
                type: "post",
                data: {action: "destory", id: id},
                dataType: "json",
                success: function(res){
                    if(res.state != 100){
                        $.dialog.alert(res.info);
                    }else{
                        location.reload();
                    }
                },
                error: function(){
                    $.dialog.alert("网络错误，保存失败！");
                }
            })
        })
    });



})
