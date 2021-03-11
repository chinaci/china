$(function(){

  $(".lg").bind("click", function(){
    huoniao.login();
  });

  //查看联系方式
  $(".ck").bind("click", function(){
    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    $.dialog.confirm('确定要查看该简历的联系方式吗？', function(){
      $.ajax({
        url: masterDomain + "/include/ajax.php?service=job&action=viewResume&id="+id,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          if(data.state == 100){
            location.reload();
          }else{
            $.dialog.tips(data.info, 3, 'error.png');
          }
        },
        error: function(){
          t.removeClass("disabled");
          $.dialog.tips('网络错误，查看失败！', 3, 'error.png');
        }
      });
    });

  });


  //邀请面试
  $("#yq, .yqms").bind("click", function(){
    var t = $(this);
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    t.addClass("disabled");

    $.ajax({
      url: masterDomain + "/include/ajax.php?service=job&action=post&com=1",
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        t.removeClass("disabled");
        if(data.state == 100){

          if(data.info.pageInfo.totalCount == 0){
            $.dialog.tips("您还未发布职位，无法邀请！", 3, 'error.png');
          }else{

            var post = [], list = data.info.list;
            post.push('<select>');
            post.push('<option value="0">请选择</option>');
            for(var i = 0; i < list.length; i++){
              post.push('<option value="'+list[i].id+'">'+list[i].title+'</option>');
            }
            post.push('</select>');

            dataInfo = $.dialog({
        			id: "dataInfo",
        			fixed: true,
        			title: "邀请面试",
        			content: '<dl class="selectPost fn-clear"><dt>选择要邀请的职位：</dt><dd>'+post.join("")+'</dd></dl>',
        			width: 450,
        			height: 120,
        			ok: function(){
                var pid = $(".selectPost select").val();
                if(pid == 0){
                  $.dialog.tips("请选择要邀请的职位！", 3, 'error.png');
                  return false;
                }else{

                  $.ajax({
                    url: masterDomain + "/include/ajax.php?service=job&action=invitation&pid="+pid+"&rid="+id,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                      if(data.state == 100){
                        $.dialog.tips('邀请成功！', 3, 'success.png');
                      }else{
                        $.dialog.tips(data.info, 3, 'error.png');
                      }
                    },
                    error: function(){
                      $.dialog.tips('网络错误，邀请失败！', 3, 'error.png');
                    }
                  });

                }
              }
        		});

          }

        }else{
          $.dialog.tips("您还未发布职位，无法邀请！", 3, 'error.png');
        }
      },
      error: function(){
        t.removeClass("disabled");
        $.dialog.tips('网络错误，操作失败！', 3, 'error.png');
      }
    });

  });


  //收藏
  $("#sc, .sc").bind("click", function(){
    var t = $(this);
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    t.addClass("disabled");

    $.ajax({
      url: masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=resume&type=add&id="+id,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        t.removeClass("disabled");
        if(data.state == 100){

          $.dialog.tips('收藏成功！', 3, 'success.png');

        }else{
          $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
        }
      },
      error: function(){
        t.removeClass("disabled");
        $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
      }
    });

  });

});

// 分享
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
