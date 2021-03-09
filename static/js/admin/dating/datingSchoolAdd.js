//实例化编辑器
var ue = UE.getEditor('content');

$(function(){

    //填充分站列表
     huoniao.choseCity($(".choseCity"),$("#cityid"));
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

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
        id           = $("#id").val(),
        cityid       = $("#cityid").val(),
        title        = $("#title"),
        litpic       = $("#litpic").val(),
        typeid       = $("#typeid").val();

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

		if(typeid == "" || typeid == 0){
			$.dialog.alert("请选择分类！");
			return false;
		};

		ue.sync();

		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("datingSchool.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
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
