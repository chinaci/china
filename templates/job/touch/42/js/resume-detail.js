$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.main').css('margin-top', 'calc(1.1rem + 20px)');
	}

  //查看联系方式
  $(".ck").bind("click", function(){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html'
      return false;
    }

    if(confirm('确定要查看该简历的联系方式吗？')){
      $.ajax({
        url: masterDomain + "/include/ajax.php?service=job&action=viewResume&id="+id,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          if(data.state == 100){
            location.reload();
          }else{
            alert(data.info);
          }
        },
        error: function(){
          t.removeClass("disabled");
          alert('网络错误，查看失败！');
        }
      });

  };
});

  //邀请面试
  $(".yqms").bind("click", function(){
    alert('您还未发布职位，无法邀请！');
  });


  $("#postlist").change(function(){
    var t = $(this), pid = t.val();
    if(!pid) return false;
    $.ajax({
      url: masterDomain + "/include/ajax.php?service=job&action=invitation&pid="+pid+"&rid="+id,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data.state == 100){
          alert('邀请成功！');
        }else{
          alert(data.info);
        }
      },
      error: function(){
        alert('网络错误，邀请失败！');
      }
    });
  })


  //收藏
  $("#sc").bind("click", function(){
    var t = $(this);
    if(t.hasClass("disabled")) return false;

    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html'
      return false;
    }

    t.addClass("disabled");
    var type = t.hasClass("has") ? "del" : "add";

    $.ajax({
      url: masterDomain + "/include/ajax.php?service=member&action=collect&module=job&temp=resume&type="+type+"&id="+id,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        t.removeClass("disabled");
        if(data.state == 100){

          if(type == "add"){
            t.find('.liked').css('display','block');
            t.find('.like').hide();
          }else{
            t.find('.liked').hide;
            t.find('.like').show();
          }
          t.toggleClass('has');

        }else{
          // $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
          alert('网络错误，收藏失败！')
        }
      },
      error: function(){
        t.removeClass("disabled");
        // $.dialog.tips('网络错误，收藏失败！', 3, 'error.png');
        alert('网络错误，收藏失败！')
      }
    });

  });

})
