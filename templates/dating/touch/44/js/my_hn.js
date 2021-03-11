$(function(){
  if(state == 0){
    showMsg.alert('您的入驻申请正在审核中，请耐心等待', 1000);
  }else if(state == 2){
    showMsg.confirm('您的入驻申请审核失败' + (fail_note ? '<br>'+fail_note : ''), {
      btn: {
        ok: '<a href="'+enter_hnUrl+'" class="ok">更改资料</a>',
      }
    });
  }
})