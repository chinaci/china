//实例化编辑器
var ue = UE.getEditor('note');

$(function(){

	huoniao.parentHideTip();

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	//举办时间
	$("#date").datetimepicker({format: 'yyyy-mm-dd', minView: 3, autoclose: true, language: 'ch'});
	$("#began").datetimepicker({format: 'hh:ii', startView: 1, autoclose: true, language: 'ch'});
	$("#end").datetimepicker({format: 'hh:ii', startView: 1, autoclose: true, language: 'ch'});

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

	//模糊匹配会员
	$("#fname").bind("input", function(){
		$("#fid").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("jobFairs.php?dopost=checkFairs", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					$("#fairsList").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'">'+data[i].title+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#fairsList")
						.css({"left": pos.left, "top": pos.top + 36, "width": t.width() + 12})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#fairsList").html("").hide();
				}
			});

		}else{
			$("#fairsList").html("").hide();
		}
    });

	$("#fairsList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id");
		$("#fname").val(name);
		$("#fid").val(id);
		$("#fairsList").html("").hide();
		checkGw();
		return false;
	});

	$(document).click(function (e) {
      var s = e.target;
      if (!jQuery.contains($("#fairsList").get(0), s)) {
          if (jQuery.inArray(s.id, "user") < 0) {
              $("#fairsList").hide();
          }
      }
  });

	$("#fname").bind("blur", function(){
		var t = $(this);
		if(t.val() != ""){
			checkGw();
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>&nbsp;');
		}
	});

	function checkGw(){
		if($("#fname").val() != ""){
			$("#fname").siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>招聘会所在会场');
		}else{
			$("#fname").siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择会场');
		}
	}

	//搜索回车提交
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

	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t   = $(this),
			id    = $("#id").val(),
			fname = $("#fname"),
			title = $("#title"),
			date  = $("#date"),
			began = $("#began"),
			end   = $("#end");

		if($.trim(fname.val()) == ""){
			huoniao.goInput(fname);
			return false;
		};

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		};

		if($.trim(date.val()) == ""){
			huoniao.goInput(date);
			return false;
		};

		if($.trim(began.val()) == ""){
			huoniao.goInput(began);
			return false;
		};

		if($.trim(end.val()) == ""){
			huoniao.goInput(end);
			return false;
		};

		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("jobFairs.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "Add"){

					huoniao.parentTip("success", "发布成功！<a href='"+data.url+"' target='_blank'>"+data.url+"</a>");
					huoniao.goTop();
					window.location.reload();

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
