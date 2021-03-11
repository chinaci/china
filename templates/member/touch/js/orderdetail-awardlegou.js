$(function(){
  
	//导航
  $('.header-r .screen').click(function(){
    var nav = $('.nav'), t = $('.nav').css('display') == "none";
    if (t) {nav.show();}else{nav.hide();}
  });

  $('.sureShou').click(function(){
  	$.ajax({
  		url: '/include/ajax.php?service=awardlegou&action=receipt&id='+id,
  		type: 'post',
  		dataType: 'json',
  		success: function(data){
  			if(data && data.state == 100){
  				alert(langData['siteConfig'][40][93]);//操作成功
  				location.reload();
  			}else{
  				alert(langData['siteConfig'][20][295]);//操作失败！
  			}
  		},
  		error: function(){
  			alert(langData['siteConfig'][31][135]);//网络错误，操作失败！
  		}
  	})
  });
  
  
  


  // 拆红包
  $(".chai").click(function(){
	  $('.hb_mask,.hb_pop').show()
  });
  
  $(".hb_mask,.hb_pop .hb_close").click(function(){
  	  $('.hb_mask,.hb_pop').hide()
  });

  /*获取红包*/
  $(".get_hb").click(function(){
	  $.ajax({
		  url: '/include/ajax.php?service=awardlegou&action=getHongbao&id='+id,
		  type: 'post',
		  dataType: 'json',
		  success: function(data){
			  if(data && data.state == 100){
				  alert(data.info);//操作成功
				  location.reload();
			  }else{
				  alert(data.info);
			  }
		  },
		  error: function(){
			  alert(langData['siteConfig'][31][135]);//网络错误，操作失败！
		  }
	  })
  })

})
