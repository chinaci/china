$(function(){
     //视频广告banner
	 var swiper = new Swiper('.banner-video', {
      pagination: {
        el: '.pagenum',
        clickable: true,
        renderBullet: function (index, className) {
          return '<li class="' + className + '">' + (index + 1) + '</li>';
        },
        autoplay: {
	      	delay:2000,
	      	disableOnInteraction: false,
	      },
      },
	});
	
	//用户关注
	$(".follow").delegate("button","click",function(e){
		e.preventDefault();
		var userid = $.cookie(cookiePre+"login_user");
	    if(userid == null || userid == ""){
	      location.href = masterDomain + '/login.html';
	      return false;
	    }

		var t=$(this),type=t.parent('.follow').hasClass('concerned-btn') ? "del" : "add";
		var uid = $(this).parent('.follow').attr('data-uid');
		$.post("/include/ajax.php?service=member&action=followMember&id="+uid, function(){
	    	if(type=="del"){
				t.parent('.follow').removeClass('concerned-btn').addClass('concern-btn');
				t.html('关注');
			}else{
				t.parent('.follow').removeClass('concern-btn').addClass('concerned-btn');
				t.html('已关注');
			}
	    });
	});
})
 