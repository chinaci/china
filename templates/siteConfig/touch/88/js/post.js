$(function(){
  //客户端发帖
  setupWebViewJavascriptBridge(function(bridge) {
    $(".t1 a").bind("click", function(event){
      event.preventDefault();
      var userid = $.cookie(cookiePre+"login_user");
  		if(userid == null || userid == ""){
  			location.href = masterDomain + "/login.html";
  			return false;
  		}
      bridge.callHandler("postTieba", {}, function(responseData) {});
    });
  });

})
