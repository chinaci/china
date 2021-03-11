$(function(){
  $("#profile").on("input propertychange",function(){
    var t = $(this), val = t.val(), len = val.length, c = 0;
    if(len > 500){
      t.val(val.substr(0,500));
      c = 0;
    }else{
      c = 500 - len;
    }
    $('.txtlength span').text(c);
  }).trigger('propertychange');

  $('.save').click(function(){
    showMsg.loading();
    var profile = $.trim($('#profile').val());
    operaJson(masterDomain + '/include/ajax.php?service=dating&action=updateProfile', 'upType=5&profile='+profile, function(data){
      showMsg.alert(data.info, 1000, function(){
        window.history.go(-1);
      });
    }, true)
  })
})