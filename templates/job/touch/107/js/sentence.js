$(function(){
  //判断地址栏hash值 直接打开发布页面
  var hash=window.location.hash;
  if(hash == "#fabu"){
    
    $('.search-box').hide();
        $('.list').hide();
        $('.gz-address').show();
        $('.popupRightBottom').hide();
    
  }
  var id = 0;
  // 点击修改
  $('.list ul').on('click','.list_txt span',function(){
    $('.mask').show();
    $('.password').show();
    var t = $(this);
    id = t.attr('data-id');

  });
  $('.password .close').click(function(){
    $('.mask').hide();
    $('.password').hide();
  });
  $('.modify .close').click(function(){
    $('.mask').hide();
    $('.modify, .password').hide();
  });

  //点击发布
    $('.search-btn').click(function(){

        $('.search-box').hide();
        $('.list').hide();
        $('.gz-address').show();
        $('.popupRightBottom').hide();
        //areaCode 恢复默认值
        var areaCodeOld = $('.layer_list li:first-child em').text().replace('+','');
        $("#areaCode").val(areaCodeOld);
        $('.areacode_span label').text('+'+areaCodeOld);

    });
      //国际手机号获取
    getNationalPhone();
    function getNationalPhone(){
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=internationalPhoneSection",
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100){
                   var phoneList = [], list = data.info;
                   for(var i=0; i<list.length; i++){
                        phoneList.push('<li><span>'+list[i].name+'</span><em class="fn-right">+'+list[i].code+'</em></li>');
                   }
                   $('.layer_list ul').append(phoneList.join(''));
                }else{
                   $('.layer_list ul').html('<div class="loading">暂无数据！</div>');
                  }
            },
            error: function(){
                    $('.layer_list ul').html('<div class="loading">加载失败！</div>');
                }

        })
    }
    // 打开手机号地区弹出层
    $(".areacode_span").click(function(){
        $('.areacode_span').removeClass('curr');
        $(this).addClass('curr');
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        console.log(txt)
        $(".areacode_span.curr label").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code, #popupReg-captcha-mobile').hide();
        $('.mask-code').removeClass('show');
    })


    //提交
    $('#submit').bind('click', function(){
        var t = $(this);
        var title = $.trim($('#title').val()),
            note = $.trim($('#note').val()),
            people = $.trim($('#people').val()),
            contact = $.trim($('#contact').val()),
            areaCode = $.trim($('#areaCode').val()),
            password = $.trim($('#password').val());

        if(title == ''){
            alert('请输入职位名称！');
            return false;
        }

        if(note == ''){
            alert('请输入需求描述！');
            return false;
        }

        if(people == ''){
            alert('请输入联系人！');
            return false;
        }

        if(contact == ''){
            alert('请输入联系电话！');
            return false;
        }

        if(password == ''){
            alert('请输入管理密码！');
            return false;
        }

        t.attr('disabled', true);

        var action = 'put';

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=job&action='+action+'Sentence',
            data: {
                'type': type,
                'title': title,
                'note': note,
                'people': people,
                'contact': contact,
                'areaCode': areaCode,
                'password': password
            },
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){

                    var info = data.info.split('|');
                    if(info[1] == 1){
                        alert('发布成功！');
                    }else{
                        alert('发布成功，请等待管理员审核！');
                    }
                    location.reload();

                }else{
                    alert(data.info);
                    t.removeAttr('disabled');
                }
            },
            error: function(){
                alert(langData['siteConfig'][20][183]);
                t.removeAttr('disabled');
            }
        });

    });

    //关闭
    $('.popup-fabu').delegate('.goPrev', 'click', function(){
        $('.search-box').show();
        $('.list').show();
        $('.gz-address').hide();
         $('.popupRightBottom').show();
    });

  //初始加载
  getList();

  //数据列表
  function getList(tr, search){
    // 如果进行了筛选或排序，需要从第一页开始加载
    if(tr){
      atpage = 1;
      $(".list ul").html("");
    }

    $(".list ul").html("");
    $(".list ul").append('<div class="loading">加载中...</div>');

    var userid = $.cookie(cookiePre+"login_user");

    var data = [];
      data.push("type="+type);
      data.push("pageSize="+pageSize);
      data.push("page="+atpage);
      if(search){
          data.push("title=" +search);
      }
      $('.pading_txt em').text(atpage);

    $.ajax({
        url: "/include/ajax.php?service=job&action=sentence",
        data: data.join("&"),
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          if(data){
            if(data.state == 100){
              $(".list ul .loading").remove();
              var list = data.info.list, html = [];
              if(list.length > 0){
                for(var i = 0; i < list.length; i++){
                  html.push('<li>');
                  html.push('<div class="list_txt fn-clear"><span>'+list[i].title+'</span><span data-id="'+list[i].id+'"></span></div>');
                  html.push('<div class="list_title">'+list[i].note+'</div>');
                  if(userid == null || userid == ""){
                    html.push('<div class="list_info fn-clear"><span class="info_name">'+list[i].people+'</span><span class="info_phone"><a href="'+masterDomain+'/login.html">登录后显示</a></span><span class="info_t">'+list[i].pubdate+'</span></div>');
                  }else{
                    var areaCode = list[i].areaCode;
                    var code = '',code2='';
                    if(areaCode != '' && areaCode != '86'){
                      code = areaCode;
                      code2 = "+"+areaCode;
                    }
                    html.push('<div class="list_info fn-clear"><span class="info_name">'+list[i].people+'</span><span class="info_phone"><a href="tel:'+code+list[i].contact+'">'+code2+' '+list[i].contact+'</a></span><span class="info_t">'+list[i].pubdate+'</span></div>');
                  }
                  
                  html.push('</li>');
                }
                $(".list ul").append(html.join(""));
                $("#totalPage").text(data.info.pageInfo.totalPage);

                //最后一页
                if(atpage >= data.info.pageInfo.totalPage){
                  $(".list ul").append('<div class="loading">已经到最后一页了</div>');
                   $('.forward button').attr('disabled',"true")
                }
                //第一页
                
              }else{
                // 没有数据
                $(".list ul").append('<div class="loading">暂无相关信息</div>');
              }
            }else{
              // 请求失败
              $(".list ul .loading").html('<div class="loading">'+data.info+'</div>');
            }
          }else{
            //加载失败
            $(".list ul .loading").html('<div class="loading">加载失败</div>');
          }
        },
        error: function(){
          $(".list ul .loading").html('<div class="loading">网络错误，加载失败！</div>');
        }
    })
  }


// 下一页
  $('.forward button').click(function(){
    atpage++;
    $('.backoff button').removeAttr('disabled');
    getList();
  });

//上一页
  $('.backoff button').click(function(){
    atpage--;
    if(atpage <= 1 ){
       atpage = 1;
       $('.backoff button').attr('disabled',"true");
    }
    $('.forward button').removeAttr('disabled');
    getList();
  });

  //确认密码
  $(".pass_send").bind('click', function () {
    var pass = $("#pass_input").val();
    var pass_show_obj = $(".pass_show");
    if(pass == ''){
        pass_show_obj.html("请输入正确的密码");return;
    }
    if(id == 0){
        return;
    }
      $.ajax({
          url:'/include/ajax.php?service=job&action=checkPass',
          data:{
              pass : pass,
              id : id,
          },
          type:'GET',
          dataType:'json',
          success:function (data) {
                if(data.state == 100 && data.info == 'success'){

                    $.ajax({
                        url:'/include/ajax.php?service=job&action=getSentence',
                        data:{
                            id : id,
                        },
                        type:'GET',
                        dataType:'json',
                        success:function (data) {
                            var data_info = data.info;
                            $("input[name=item1]").attr('value', data_info.title);
                            $("input[name=item2]").attr('value', data_info.people);
                            $("input[name=item3]").attr('value', data_info.contact);
                            $(".Desc1").html(data_info.note);
                            if(data_info.areaCode != '' && data_info.areaCode != '86'){
                              $('.modify .areacode_span label').text('+'+data_info.areaCode);
                              $('#areaCode').val(data_info.areaCode);
                            }else{
                              $('.modify .areacode_span label').text('+86');
                              $('#areaCode').val('86');
                            }
                        }
                    })

                  $(".modify").css('display', 'block');
                }else{
                  alert(data.info);return;
                }
          }
      })
  })


    //确认修改
    $(".btn_confirm").bind('click', function () {

        $.ajax({
            url:'/include/ajax.php?service=job&action=editSentence',
            data:{
                id : id,
                password : $("#pass_input").val(),
                title : $("input[name=item1]").val(),
                people : $("input[name=item2]").val(),
                contact : $("input[name=item3]").val(),
                areaCode : $("#areaCode").val(),
                note : $(".Desc1").val(),
            },
            type:'GET',
            dataType:'json',
            success:function (data) {
                if(data.state == 100){
                    window.location.href = window.location.href;
                }else{
                    alert(data.info);return;
                }
            }
        });
    })

    //删除
    $(".btn_delete").bind('click', function () {

        $.ajax({
            url:'/include/ajax.php?service=job&action=delSentence',
            data:{
                id : id,
            },
            type:'GET',
            dataType:'json',
            success:function (data) {
                if(data.state == 100){
                    window.location.href = window.location.href;
                }else{
                    alert(data.info);return;
                }
            }
        });
    })
    //搜索
    $(".search-btn-click").click(function () {

        var key = $(".txt_search").val();
        getList(1, key);
    })


})