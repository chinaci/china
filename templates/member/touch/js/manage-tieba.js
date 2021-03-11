/**
 * 会员中心新闻投稿列表
 * by guozi at: 20150627
 */


var uploadErrorInfo = [],
 huoniao = {

 //转换PHP时间戳
 transTimes: function(timestamp, n){
   update = new Date(timestamp*1000);//时间戳要乘1000
   year   = update.getFullYear();
   month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
   day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
   hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
   minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
   second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
   if(n == 1){
     return (year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);
   }else if(n == 2){
     return (year+'-'+month+'-'+day);
   }else if(n == 3){
     return (month+'-'+day);
   }else{
     return 0;
   }
 }

 //将普通时间格式转成UNIX时间戳
 ,transToTimes: function(timestamp){
   var new_str = timestamp.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return datum.getTime()/1000;
 }


 //判断登录成功
 ,checkLogin: function(fun){
   //异步获取用户信息
   $.ajax({
     url: masterDomain+'/getUserInfo.html',
     type: "GET",
     async: false,
     dataType: "jsonp",
     success: function (data) {
       if(data){
         fun();
       }
     },
     error: function(){
       return false;
     }
   });
 }



 //获取附件不同尺寸
 ,changeFileSize: function(url, to, from){
   if(url == "" || url == undefined) return "";
   if(to == "") return url;
   var from = (from == "" || from == undefined) ? "large" : from;
   if(hideFileUrl == 1){
     return url + "&type=" + to;
   }else{
     return url.replace(from, to);
   }
 }

 //获取字符串长度
 //获得字符串实际长度，中文2，英文1
 ,getStrLength: function(str) {
   var realLength = 0, len = str.length, charCode = -1;
   for (var i = 0; i < len; i++) {
   charCode = str.charCodeAt(i);
   if (charCode >= 0 && charCode <= 128) realLength += 1;
   else realLength += 2;
   }
   return realLength;
 }



 //删除已上传的图片
 ,delAtlasImg: function(mod, obj, path, listSection, delBtn){
   var g = {
     mod: mod,
     type: "delAtlas",
     picpath: path,
     randoms: Math.random()
   };
   $.ajax({
     type: "POST",
     cache: false,
     async: false,
     url: "/include/upload.inc.php",
     dataType: "json",
     data: $.param(g),
     success: function() {}
   });
   $("#"+obj).remove();

   if($("#"+listSection).find("li").length < 1){
     $("#"+listSection).hide();
     $("#"+delBtn).hide();
   }
 }

 //异步操作
 ,operaJson: function(url, action, callback){
   $.ajax({
     url: url,
     data: action,
     type: "POST",
     dataType: "json",
     success: function (data) {
       typeof callback == "function" && callback(data);
     },
     error: function(){

       $.post("../login.php", "action=checkLogin", function(data){
         if(data == "0"){
           huoniao.showTip("error", langData['siteConfig'][20][262]);
           setTimeout(function(){
             location.reload();
           }, 500);
         }else{
           huoniao.showTip("error", langData['siteConfig'][20][183]);
         }
       });

     }
   });
 }
}


var objId = $("#list");
$(function(){

    //客户端发帖
    setupWebViewJavascriptBridge(function(bridge) {
        $(".fabuBtn a").bind("click", function(event){
            if (device.indexOf('huoniao_Android') > -1) {
                event.preventDefault();
                var userid = $.cookie(cookiePre+"login_user");
                if(userid == null || userid == ""){
                    location.href = masterDomain + "/login.html";
                    return false;
                }
                bridge.callHandler("postTieba", {}, function(responseData) {});
            }
        });
    });

 //导航
 $('.header-r .screen').click(function(){
   var nav = $('.nav'), t = $('.nav').css('display') == "none";
   if (t) {nav.show();}else{nav.hide();}
 })


 //项目
 $(".tab .type").bind("click", function(){
   var t = $(this), id = t.attr("data-id"), index = t.index();
   if(!t.hasClass("curr") && !t.hasClass("sel")){
     state = id;
     atpage = 1;
     $('.count li').eq(index).show().siblings("li").hide();
     t.addClass("curr").siblings("li").removeClass("curr");
     $('#list').html('');
     getList(1);
   }
 });


 // 下拉加载
 $(window).scroll(function() {
   var h = $('.item').height();
   var allh = $('body').height();
   var w = $(window).height();
   var scroll = allh - w - h;
   if ($(window).scrollTop() > scroll && !isload) {
     atpage++;
     getList();
   };
 });

 getList(1);

 var M={};
 // 删除
 objId.delegate(".del", "click", function(){
   var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
   if(id){
      M.dialog = jqueryAlert({
          'title'   : '',
          'content' : langData['siteConfig'][44][98],//确定要删除吗?
          'modal'   : true,
          'buttons' :{
              '是' : function(){
                  M.dialog.close();
                  t.siblings("a").hide();
                  t.addClass("load");
                  $.ajax({
                     url: masterDomain+"/include/ajax.php?service=tieba&action=del&id="+id,
                     type: "GET",
                     dataType: "jsonp",
                     success: function (data) {
                       if(data && data.state == 100){

                         //删除成功后移除信息层并异步获取最新列表
                         objId.html('');
                         getList(1)

                       }else{
                         alert(data.info);
                         t.siblings("a").show();
                         t.removeClass("load");
                       }
                     },
                     error: function(){
                       alert(langData['siteConfig'][20][183]);
                       t.siblings("a").show();
                       t.removeClass("load");
                     }
                   });
              },
              '否' : function(){
                  M.dialog.close();
              }
          }
      })
   }
 });

 //客户端发帖
 setupWebViewJavascriptBridge(function(bridge) {
   $(".header-r a").bind("click", function(event){
     event.preventDefault();
     var userid = $.cookie(cookiePre+"login_user");
     if(userid == null || userid == ""){
       location.href = masterDomain + "/login.html";
       return false;
     }
     bridge.callHandler("postTieba", {}, function(responseData) {});
   });
 });



});

function getList(is){

isload = true;


 if(is != 1){
 // 	$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
 }else{
  atpage = 1;
}

 objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

 $.ajax({
   url: masterDomain+"/include/ajax.php?service=tieba&action=tlist&u=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
   type: "GET",
   dataType: "jsonp",
   success: function (data) {
     if(data && data.state != 200){
       if(data.state == 101){
         objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
         $('.count span').text(0);
       }else{
         var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
         //拼接列表
         if(list.length > 0){

           var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
           var param = t + "do=edit&id=";
           var urlString = editUrl + param;

           for(var i = 0; i < list.length; i++){
             var item     = [],
               id       = list[i].id,
               title    = list[i].title,
               color    = list[i].color,
               typename = list[i].typename.join("-"),
               url      = list[i].url,
               bold     = list[i].bold,
               jinghua  = list[i].jinghua,
               top      = list[i].top,
               click    = list[i].click,
               reply    = list[i].reply,
               waitpay  = list[i].waitpay,
               pubdate  = huoniao.transTimes(list[i].pubdate, 1);

             url = waitpay == "1" || list[i].state != "1" ? 'javascript:;' : url;
             html.push('<div class="item" data-id="'+id+'">');
             if(waitpay == "0"){
               html.push('<div class="title fn-clear">');
               var apa = [];
               html.push('<span style="color:#919191;font-size: .24rem;">'+langData['siteConfig'][11][8]+'：'+pubdate+'</span>');
               if(top == 1){
                 html.push('<span style="background: #66a3ff; color:#fff; padding: 0.02rem .1rem; margin-left: .2rem; font-size: .22rem;">'+langData['siteConfig'][19][762]+'</span>');
               }
               if(jinghua == 1){
                 html.push('<span style="background: #f66; color:#fff; padding:  0.02rem .1rem; margin-left: .2rem;font-size: .22rem;">'+langData['siteConfig'][19][763]+'</span>');
               }
               var arcrank = "";
               if(list[i].state == "0"){
                 html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][19][556]+'</span>');
               }else if(list[i].state == "1"){
                 html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][26][73]+'</span>');
               }else if(list[i].state == "2"){
                 html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][9][35]+'</span>');
               }
              html.push('</div>');
             }

             html.push('<div class="info-item fn-clear">');
             html.push('<a href="'+url+'" class="fn-clear" style="display:block;">');
             if(list[i].imgGroup!=0){
                html.push('<div class="info-img"><img src="'+list[i].imgGroup[0]+'"></div>')
             }else{
                html.push('<div class="icontxt"></div>')
             }
            
             html.push('<dl>');
             html.push('<dt>'+title+'</dt>');
             html.push('<dd class="item-area"><em>'+langData['siteConfig'][19][393]+'：'+typename+'</em></dd>');
             var reward = langData['siteConfig'][19][397];
             if(list[i].reward.count > 0){
              reward = list[i].reward.count+langData['siteConfig'][13][26]+' '+langData['siteConfig'][13][13]+list[i].reward.amount+echoCurrency('short');
             }

             if(list[i].state == "0"){
                html.push('');
             }else if(list[i].state == "1"){
                html.push('<dd class="item-type-1"><span class="sp_reward"><em></em>'+reward+'</span><span class="sp_comment"><em></em>'+reply+'</span><span class="sp_see"><em></em>'+click+' </span></dd>');
             }else if(list[i].state == "2"){
                html.push('');
             }
             html.push('</dl>');
             html.push('</a></div>');
             html.push('<div class="o fn-clear">');
             if(waitpay == "1"){
              html.push('<a href="javascript:;" class="delayPay">'+langData['siteConfig'][19][327]+'</a><a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>');
             }else{
               html.push('<a href="javascript:;" class="del">'+langData['siteConfig'][6][8]+'</a>');
             }
             html.push('</div>');
             html.push('</div>');
             html.push('</div>');

           }

           objId.append(html.join(""));
           $('.loading').remove();
           isload = false;

         }else{
           $('.loading').remove();
           objId.append("<p class='loading'>"+langData['siteConfig'][20][185]+"</p>");
         }

         switch(state){
           case "":
             totalCount = pageInfo.totalCount;
             break;
           case "0":
             totalCount = pageInfo.gray;
             break;
           case "1":
             totalCount = pageInfo.audit;
             break;
           case "2":
             totalCount = pageInfo.refuse;
             break;
         }


         // $("#total").html(pageInfo.totalCount);
         if(pageInfo.audit>0){
            $("#audit").show().html(pageInfo.audit);
         }else{
            $("#audit").hide();
         }
         if(pageInfo.gray>0){
            $("#gray").show().html(pageInfo.gray);
         }else{
            $("#gray").hide();
         }
         if(pageInfo.refuse>0){
            $("#refuse").show().html(pageInfo.refuse);
         }else{
            $("#refuse").hide();
         }
         
       // 	showPageInfo();
       }
     }else{
       objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
       $('.count span').text(0);
     }
   }
 });
}
