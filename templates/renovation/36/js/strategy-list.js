$(function(){

  $(".list-box .level2 i").bind("click", function(){
    var t = $(this), level2 = t.closest(".level2"), level3 = level2.next(".level3-box");
    if(level3.size() > 0){
      if(level2.hasClass("selected")){
        level3.stop().slideUp(150);
        level2.removeClass("selected");
      }else{
        level3.stop().slideDown(150);
        level2.addClass("selected");
      }
    }
  });

  $(".level3").each(function(){
    var t = $(this);
    if(t.hasClass("curr")){
      var box = t.closest(".level3-box");
      box.show();
      box.prev(".level2").addClass("selected");
    }
  });


});
