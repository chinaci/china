$(function(){

  var atpage = 1, pageSize = 20, totalCount = 0, container = $('.member-con');

	// 判断浏览器是否是ie8
  if($.browser.msie && parseInt($.browser.version) >= 8){
    $('.app-con .down .con-box:last-child').css('margin-right','0');
    $('.wx-con .c-box:last-child').css('margin-right','0');
    $('.search .search-con input.submit').css('background','#ff313f');
    $('.maker-box .member-con .member-list:nth-child(5n)').css('margin-right','0');
    $('.footer .foot-bottom .wechat .wechat-pub:last-child').css('margin-right','0');
    $('.matchmaker .btn-con-r .btn-r-title a').css('background','#ff5d24');
    $('.matchmaker').css('border','1px solid #eee');
  }


  // 入驻红娘
  $('.matchmaker .maker-btn ul li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  });
  // 入驻红娘弹窗
  $('.join').click(function(){
    $('.desk').show();
    $('.join-maker').fadeIn(600);
  })
  $('#close').click(function(){
    $('.desk').hide();
    $('.join-maker').fadeOut(600);
  })
//国际手机号获取
  getNationalPhone();
  function getNationalPhone(){
    $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'JSONP',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li data-cn="'+list[i].name+'" data-code="'+list[i].code+'">'+list[i].name+' +'+list[i].code+'</li>');
                   }
                   $('.areaCode_wrap ul').append(phoneList.join(''));
                }else{
                   $('.areaCode_wrap ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                        $('.areaCode_wrap ul').html('<div class="loading">加载失败！</div>');
                    }

        })
  }
  //显示区号
  $('.areaCode').bind('click', function(){
    var areaWrap =$(this).closest(".join-tel").find('.areaCode_wrap');
    if(areaWrap.is(':visible')){
      areaWrap.fadeOut(300)
    }else{
      areaWrap.fadeIn(300);
      return false;
    }
  });

  //选择区号
  $('.areaCode_wrap').delegate('li', 'click', function(){
    var t = $(this), code = t.attr('data-code');
    var par = t.closest(".join-tel");
    var areaIcode = par.find(".areaCode");
    areaIcode.find('i').html('+' + code);
  });

  $('body').bind('click', function(){
    $('.areaCode_wrap').fadeOut(300);
  });

	// 提交
	var lgform = $('#subForm');
  var err = lgform.find('.error p');
  lgform.submit(function(e){
    e.preventDefault();

    err.text('').hide();
    var telnum = $('#tel-number'),
      tel = telnum.val(),
      nickname = $('#nickname'),
      briefInfo = $('#briefInfo'),
      brief = briefInfo.val(),
      submit = $('.form-submit .submit');
    var areaCode = parseInt($(".areaCode i").text().replace('+', ''));

    var litpic = $('#litpic').val();

    if(litpic == ''){
      err.text('请上传头像').show();
      return;
    }

    if(nickname.val() == ''){
      err.text('请输入您的姓名').show();
      nickname.focus();
      return;
    }

    if(tel == ''){
      console.log(tel)
      err.text('请输入您的电话号码').show();
      telnum.focus();
      return;

    }else {
	  if(areaCode == 86){
	      var reg ,h='';
	      reg = !!tel.match(/^1[23456789](\d){9}$/);
	      if (!reg) {
	        err.text('您的电话号码输入错误').show();
	        telnum.focus();
	        return;
	      }
	  }
    }
    if(brief == ''){
      err.text('请输入您的个人简介').show();
      briefInfo.focus();
      return;
    }

    submit.attr('disabled', true);
    submit.val('提交中...');

    var data = [];
    data.push('nickname='+nickname.val());
    data.push('phone='+tel);
    data.push('areaCode='+areaCode);
    data.push('profile='+brief);
    data.push('photo='+litpic);
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=joinHongNiang',
      type: 'post',
      data: data.join('&'),
      dataType: 'jsonp',
      success: function(data){
        $('#close').click();
        if(data && data.state == 100){
          $.dialog({
            title: '信息',
            icon: 'success.png',
            content: data.info,
            close: false,
            ok: function(){
            },
            cancel: function(){
            }
          });
        }else{
          submit.attr('disabled', false).val('提交');
          $.dialog.alert(data.info);
        }
      },
      error: function(){
        $('#close').click();
        submit.attr('disabled', false).val('提交');
        $.dialog.alert('网络错误，请重试！');
      }
    })

  })

  //上传单张图片
  function mysub(id){

    var data = [];
    data['mod'] = 'dating';
    data['filetype'] = 'image';
    data['type'] = 'atlas';

    $.ajaxFileUpload({
      url: "/include/upload.inc.php",
      fileElementId: id,
      dataType: "json",
      data: data,
      success: function(m, l) {
        if (m.state == "SUCCESS") {
          var path = $('.join-con .photo img').attr('data-val');
          if(path){
            delAtlasPic(path);
          }

          $('.join-con .photo img').attr({'src': m.turl});
          $('#litpic').val(m.url);

        } else {
          err.text(m.state).show();
        }
      },
      error: function() {
        err.text('网络错误，上传失败！').show();
      }
    });

  }

  //删除已上传图片
  var delAtlasPic = function(picpath){
    var g = {
      mod: "dating",
      type: "delAtlas",
      picpath: picpath,
      randoms: Math.random()
    };
    $.ajax({
      type: "POST",
      url: "/include/upload.inc.php",
      data: $.param(g)
    })
  };

  $('#image').change(function(){
    mysub('image');
  })



  function getList(tr){
      if(tr){
          atpage = 1;
      }
      container.html('<div class="loading">正在获取，请稍后</div>');
      $(".pagination").hide();

      var data = [];
      data.push('page='+atpage);
      data.push('pageSize='+pageSize);
      data.push('keywords='+keywords);

      $.ajax({
          url: masterDomain + '/include/ajax.php?service=dating&action=hnList',
          type: 'get',
          data: data.join('&'),
          dataType: 'jsonp',
          success: function(data){
              if(data && data.state == 100){
                  var html = [];
                  totalCount = data.info.pageInfo.totalCount;

                  for(var i = 0; i < data.info.list.length; i++){
                      var d = data.info.list[i];
                      var photo = d.photo ? ('<img src="'+d.photo+'" alt="" />') : ('<img src="' + staticPath + 'images/noPhoto_100.jpg" class="nophoto" alt="" />');

                      html.push('<div class="member-list">');
                      html.push('  <a href="'+d.url+'" target="_blank"><div class="img-wrap">'+photo+'</div></a>');
                      html.push('  <div class="personal-wrap">');
                      // <span>资深婚恋顾问</span>
                      html.push('    <p class="name"><a href="'+d.url+'" target="_blank">'+d.nickname+'</a></p>');
                      html.push('    <p class="tel">'+d.phone+'</p>');
                      html.push('  </div>');
                      html.push('</div>');
                  }
                  container.html(html.join(""));

                  showPageInfo();
              }else{
                  container.html('<div class="loading">没有找到符合条件的红娘~</div>');
              }
          },
          error: function(){
              container.html('<div class="loading">网络错误，请重试</div>');
          }
      })
  }

  getList();


  // 打印分类
  function showPageInfo() {
      var info = $(".pagination");
      var nowPageNum = atpage;
      var allPageNum = Math.ceil(totalCount / pageSize);
      var pageArr = [];

      info.html("").hide();

      //输入跳转
      // var redirect = document.createElement("div");
      // redirect.className = "pagination-gotopage";
      // redirect.innerHTML =
      //     '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
      // info.append(redirect);

      // //分页跳转
      // info.find(".btn").bind("click", function () {
      //     var pageNum = info.find(".inp").val();
      //     if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
      //         atpage = pageNum;
      //         getList();
      //     } else {
      //         info.find(".inp").focus();
      //     }
      // });

      var pages = document.createElement("div");
      pages.className = "page pagination-pages fn-clear";
      info.append(pages);

      //拼接所有分页
      if (allPageNum > 1) {

          //上一页
          if (nowPageNum > 1) {
              var prev = document.createElement("a");
              prev.className = "prev";
              prev.innerHTML = '上一页';
              prev.onclick = function () {
                  atpage = nowPageNum - 1;
                  getList();
              }
          } else {
              var prev = document.createElement("span");
              prev.className = "prev disabled";
              prev.innerHTML = '上一页';
          }
          info.find(".pagination-pages").append(prev);

          //分页列表
          if (allPageNum - 2 < 1) {
              for (var i = 1; i <= allPageNum; i++) {
                  if (nowPageNum == i) {
                      var page = document.createElement("span");
                      page.className = "curr";
                      page.innerHTML = i;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                  }
                  info.find(".pagination-pages").append(page);
              }
          } else {
              for (var i = 1; i <= 2; i++) {
                  if (nowPageNum == i) {
                      var page = document.createElement("span");
                      page.className = "curr";
                      page.innerHTML = i;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                  }
                  info.find(".pagination-pages").append(page);
              }
              var addNum = nowPageNum - 4;
              if (addNum > 0) {
                  var em = document.createElement("span");
                  em.className = "interim";
                  em.innerHTML = "...";
                  info.find(".pagination-pages").append(em);
              }
              for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                  if (i > allPageNum) {
                      break;
                  } else {
                      if (i <= 2) {
                          continue;
                      } else {
                          if (nowPageNum == i) {
                              var page = document.createElement("span");
                              page.className = "curr";
                              page.innerHTML = i;
                          } else {
                              var page = document.createElement("a");
                              page.innerHTML = i;
                              page.onclick = function () {
                                  atpage = Number($(this).text());
                                  getList();
                              }
                          }
                          info.find(".pagination-pages").append(page);
                      }
                  }
              }
              var addNum = nowPageNum + 2;
              if (addNum < allPageNum - 1) {
                  var em = document.createElement("span");
                  em.className = "interim";
                  em.innerHTML = "...";
                  info.find(".pagination-pages").append(em);
              }
              for (var i = allPageNum - 1; i <= allPageNum; i++) {
                  if (i <= nowPageNum + 1) {
                      continue;
                  } else {
                      var page = document.createElement("a");
                      page.innerHTML = i;
                      page.onclick = function () {
                          atpage = Number($(this).text());
                          getList();
                      }
                      info.find(".pagination-pages").append(page);
                  }
              }
          }

          //下一页
          if (nowPageNum < allPageNum) {
              var next = document.createElement("a");
              next.className = "next";
              next.innerHTML = '下一页';
              next.onclick = function () {
                  atpage = nowPageNum + 1;
                  getList();
              }
          } else {
              var next = document.createElement("span");
              next.className = "next disabled";
              next.innerHTML = '下一页';
          }
          info.find(".pagination-pages").append(next);

          info.show();

      } else {
          info.hide();
      }
  }

})
