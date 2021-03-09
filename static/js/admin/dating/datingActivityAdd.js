//实例化编辑器
var ue = UE.getEditor('content');

$(function(){

    //填充城市列表
    huoniao.buildAdminList($("#cityid"), cityList, '请选择分站', cityid);
    $(".chosen-select").chosen();


    huoniao.parentHideTip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

    var init = {
      //菜单递归分类
      selectTypeList: function(){
        var typeList = [];
        typeList.push('<ul class="dropdown-menu">');
        typeList.push('<li><a href="javascript:;" data-id="0">选择分类</a></li>');

        var l=typeListArr.length;
        for(var i = 0; i < l; i++){
          (function(){
            var jsonArray =arguments[0], jArray = jsonArray.lower, cl = "";
            if(jArray.length > 0){
              cl = ' class="dropdown-submenu"';
            }
            typeList.push('<li'+cl+'><a href="javascript:;" data-id="'+jsonArray["id"]+'">'+jsonArray["typename"]+'</a>');
            if(jArray.length > 0){
              typeList.push('<ul class="dropdown-menu">');
            }
            for(var k = 0; k < jArray.length; k++){
              if(jArray[k]['lower'] != null){
                arguments.callee(jArray[k]);
              }else{
                typeList.push('<li><a href="javascript:;" data-id="'+jArray[k]["id"]+'">'+jArray[k]["typename"]+'</a></li>');
              }
            }
            if(jArray.length > 0){
              typeList.push('</ul></li>');
            }else{
              typeList.push('</li>');
            }
          })(typeListArr[i]);
        }

        typeList.push('</ul>');
        return typeList.join("");
      }
    };

  //填充栏目分类
  $("#typeBtn").append(init.selectTypeList());
  
  //二级菜单点击事件
  $("#typeBtn a").bind("click", function(){
    var id = $(this).attr("data-id"), title = $(this).text();
    $("#typeid").val(id);
    $("#typeBtn button").html(title+'<span class="caret"></span>');

    if(id != 0){
      $("#typeid").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
    }else{
      $("#typeid").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
    }
  });

  $("#btime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});
  $("#etime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});
	$("#deadline").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss', autoclose: true, language: 'ch'});

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});

	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});

	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	//回车提交
    $("#editform input").keyup(function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
            $("#btnSubmit").click();
        }
    });

	//标注地图
	$("#mark").bind("click", function(){
		$.dialog({
			id: "markDitu",
			title: "标注地图位置<small>（请点击/拖动图标到正确的位置，再点击底部确定按钮。）</small>",
			content: 'url:'+adminPath+'../api/map/mark.php?mod=dating&lnglat='+$("#lnglat").val()+"&city="+mapCity+"&addr="+$("#address").val(),
			width: 800,
			height: 500,
			max: true,
			ok: function(){
				var doc = $(window.parent.frames["markDitu"].document),
					lng = doc.find("#lng").val(),
					lat = doc.find("#lat").val(),
					addr = doc.find("#addr").val();
				$("#lnglat").val(lng+","+lat);
				if($("#address").val() == ""){
					$("#address").val(addr);
				}
				huoniao.regex($("#address"));
			},
			cancel: true
		});
	});

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t        = $(this),
        id       = $("#id").val(),
        cityid   = $("#cityid").val(),
        title    = $("#title"),
        litpic   = $("#litpic").val(),
        tel      = $("#tel").val(),
        btime    = $("#btime").val(),
        etime    = $("#etime").val(),
        deadline = $("#deadline").val();

    //城市
    if(cityid == '' || cityid == 0){
        $.dialog.alert('请选择城市');
        return false;
    };

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		};

		if(litpic == ""){
			huoniao.goInput($("#litpic"));
			$.dialog.alert("请上传缩略图！");
			return false;
		};

    if(tel == ""){
      huoniao.goInput($("#tel"));
      $.dialog.alert("请填写联系电话！");
      return false;
    };

    if(deadline == ""){
      huoniao.goInput($("#deadline"));
      $.dialog.alert("请选择报名截止时间！");
      return false;
    };

    if(deadline == ""){
      huoniao.goInput($("#deadline"));
      $.dialog.alert("请选择报名截止时间！");
      return false;
    };

		if(deadline == ""){
			huoniao.goInput($("#deadline"));
			$.dialog.alert("请选择报名截止时间！");
			return false;
		};

		ue.sync();

		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("datingActivity.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "add"){

					huoniao.parentTip("success", "添加成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
					huoniao.goTop();
					location.reload();

				}else{

					huoniao.parentTip("success", "修改成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
					t.attr("disabled", false);

				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		});
	});

});
