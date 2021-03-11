$(function(){

  // 选择原因
  $('#reason').scroller(
    $.extend({preset: 'select'})
  );

  $('#submit').click(function(){
    var val = $('.textarea').val();
    var t = $(this);
    if(t.hasClass("disabled")) return false;
    if (val == "") {
      showMsg(langData['siteConfig'][20][435]);
    }else {
      t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");
      $.ajax({
        url: "/include/ajax.php?service=member&action=extract",
        data: {"title": $("#reason").val(), "note": val},
        type: "POST",
        dataType: "jsonp",
        success: function (data) {
          if(data.state == 100){
            location.href = promotion;
          }else{
            alert(data.info);
            t.removeClass("disabled").html(langData['siteConfig'][19][674]);
          }
        },
        error: function(){
          alert(langData['siteConfig'][20][183]);
          t.removeClass("disabled").html(langData['siteConfig'][19][674]);
        }
      });
    }
  })

})

// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}
