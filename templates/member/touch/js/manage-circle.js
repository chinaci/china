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
 var keywords = "";
$(function(){


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
                    url: "/include/ajax.php?service=circle&action=deldetail&id="+id,
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

  // 头部搜索
  $('.searchbox form').submit(function(e){
    e.preventDefault();
    keywords = $.trim($('.searchbox .keywords').val());
    getList(1);
  })
  var selectDate = function(el){
    WdatePicker({
      el: el,
      isShowClear: false,
      isShowOK: false,
      isShowToday: false,
      qsEnabled: false,
      dateFmt: 'yyyy-MM',
      maxDate: $('#month').val(),
      ychanged: function(){
        // getArticleTotal();
      },
      Mchanged: function(){
        // getArticleTotal();
      }
    });
  }
  $("#month").on('click',function(){
    selectDate("month");
    $(this).off('click');
  }).blur(function(){
    getArticleTotal();
  })

  function getArticleTotal(wait){
    var wait = wait != 0 ? 200 : 0;
    $('#total0, #total1, #total2, #total3').text('-');
    if(wait){
      setTimeout(function(){
        getArticleTotal(0);
      }, wait)
      return;
    }
    var date = $('#month').val();
    if(date == '') return;
    $.ajax({
      url: '/include/ajax.php?service=article&action=alist&u=1&buMonth='+date,
      type: 'get',
      dataType: 'json',
      success: function(res){
        if(res && res.state == 100){
          $('#total0').text(res.info.total0);
          $('#total1').text(res.info.total1);
          $('#total2').text(res.info.total2);
          $('#total3').text(res.info.total3);
        }else{
          $('#total0, #total1, #total2, #total3').text(0);
        }
      },
      error: function(){
        $('#total0, #total1, #total2, #total3').text(langData['siteConfig'][38][84]);//获取失败
      }
    })
  }

  $('#getTotal').click(function(){
    getArticleTotal();
    var t = $(this);
    if(t.hasClass('openTotal')){
      t.val(langData['siteConfig'][17][11]);//统计
      $('#list').show();
      $('.table').hide();
    }else{
      t.val(langData['siteConfig'][19][771]);//列表
      $('#list').hide();
      $('.table').show();
    }
    t.toggleClass('openTotal');
  })
 });

function getList(is){

 isload = true;


  if(is != 1){
  //  $('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
  }else{
    objId.html('');
    atpage = 1;
  }
  objId.find('.loading').remove();
  objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

  $.ajax({
    url: masterDomain+"/include/ajax.php?service=circle&action=tlist&u=1&orderby=pubdate&state="+state+"&page="+atpage+"&pageSize="+pageSize,
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
              var item        = [],
                  id          = list[i].id,
                  title       = list[i].content,
                  color       = list[i].color,
                  typeName    = list[i].typeName,
                  url         = list[i].url,
                  common      = list[i].reply,
                  litpic      = list[i].media[0],
                  click       = list[i].browse,
                  source      = list[i].username,
                  waitpay     = list[i].waitpay,
                  pubdate     = huoniao.transTimes(list[i].pubdate, 1);

              url =  list[i].state != "1" ? 'javascript:;' : url;

              html.push('<div class="item" data-id="'+id+'">');
              // if(waitpay == "0"){}
                html.push('<div class="title">');
                var apa = [];
                html.push('<span style="color:#919191;font-size: .24rem;">'+langData['siteConfig'][11][8]+'：'+pubdate+'</span>');
                var state = "";
                if(list[i].state == "0"){
                   html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][19][556]+'</span>');
                 }else if(list[i].state == "1"){
                   html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][26][73]+'</span>');
                 }else if(list[i].state == "2"){
                   html.push('<span style="color:#f9412e; font-size: .26rem; float: right;">'+langData['siteConfig'][9][35]+'</span>');
                 }
                html.push('</div>');
              
              html.push('<div class="info-item fn-clear">');
              if(litpic != "" && litpic != undefined){
                html.push('<div class="info-img fn-left"><a href="'+url+'"><img src="/include/attachment.php?f='+litpic+'" /></a></div>');
              }else{
                html.push('<div class="icontxt"></div>')
              }
              html.push('<dl><a href="'+url+'">');
              html.push('<dt>'+title+'</dt>');
              html.push('<dd class="item-area"><span><em>'+langData['siteConfig'][19][5]+'：'+source+'</em></span>');
              if(list[i].arcrank == "0"){
                  html.push('');
              }else if(list[i].state == "1"){
                  html.push('<span class="sp_comment"><em></em>'+common+'</span><span class="sp_see"><em></em>'+click+' </span>');
              }else if(list[i].ttate == "2"){
                  html.push('');
              }
              html.push('</dd>');
              var reward = langData['siteConfig'][19][397];
              if(list[i].reward.count > 0){
                reward = list[i].reward.count+langData['siteConfig'][13][26]+' '+langData['siteConfig'][13][13]+list[i].reward.amount+echoCurrency('short');
              }
              if(list[i].arcrank == "0"){
                  html.push('');
              }else if(list[i].arcrank == "1"){
                  html.push('<dd class="item-type-1"><span class="sp_reward"><em></em>'+reward+'</span></dd>');
              }else if(list[i].arcrank == "2"){
                  html.push('');
              }
              html.push('</a></dl>');
              html.push('</div>');
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
        //  showPageInfo();
        }
      }else{
        objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
        $('.count span').text(0);
      }
    }
  });
 }
