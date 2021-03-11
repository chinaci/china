$(function(){

  $('#username').focus();  


  $("#username").on("input propertychange", function(){
    var t = $(this), val = t.val();
    if(val == ""){
      $(".item li").show();
    }else{
      $(".info li").each(function(){
        var item = $(this), name = item.find(".name").text();
        if(name.indexOf(val) >= 0){
          item.show();
        }else{
          item.hide();
        }
      })
    }
  })

  $(".cancel").click(function(){
    $("#username").val("");
    $(".item li").show();
  })

})