var huoniao_ = {
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
      }else if(n == 4){
        return (hour+':'+minute);
      }else if(n == 5){
        return (month+'/'+day);
      }else{
        return 0;
      }
    }
    //获取附件不同尺寸
    ,changeFileSize: function(url, to, from){
      if(url == "" || url == undefined) return "";
      if(to == "") return url;
      var from = (from == "" || from == undefined) ? "large" : from;
      var newUrl = "";
      if(hideFileUrl == 1){
        newUrl =  url + "&type=" + to;
      }else{
        newUrl = url.replace(from, to);
      }
  
      return newUrl;
    }
}

$(function () {
    var atpage = 1, pageSize = 10, isload = false;

    //信息提示框
    function showMsg(){
      var alert_tip = $(".alert_tip");
      alert_tip.show();
    }
    function closeMsg(){
      var alert_tip = $(".alert_tip");
      alert_tip.hide();
    }


    $(".wrap").delegate(".tel","click",function(){ 
        var that=$(this)
        var id   = that.attr('data-id');
        if(id){
            $.ajax({
                url: masterDomain+"/include/ajax.php?service=education&action=booking&oper=update&id="+id,
                type: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){
                        getList(1);
                    }else{
                        alert(data.info);
                    }
                },
                error: function(){
                    alert(langData['siteConfig'][20][183]);
                }
            });
        }
    });
    $(".wrap").delegate(".del","click",function(){ 
        showMsg();
        var that=$(this)
        var id   = that.attr('data-id');
        $('.yes').click(function(){
            if(id){
                $.ajax({
                    url: masterDomain+"/include/ajax.php?service=education&action=booking&oper=del&id="+id,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        if(data && data.state == 100){
                            //删除成功后移除信息层并异步获取最新列表
                            that.parents('.tutor').remove();
                            closeMsg()
                            setTimeout(function(){getList(1);}, 200);
                        }else{
                            alert(data.info);
                        }
                    },
                    error: function(){
                        alert(langData['siteConfig'][20][183]);
                    }
                });
            }
        });

        $('.no').click(function(){
            closeMsg()
        })

    });

    // 下拉加载
    $(window).scroll(function() {
        var h = $('.cont_ul').height();
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w - h;
        if ($(window).scrollTop() > scroll && !isload) {
            atpage++;
            getList();
        };
    });

    getList(1);

    function getList(tr){

        isload = true;
        if(tr){
            $(".cont_ul").html('<div class="empty">'+langData['siteConfig'][20][184]+'</div>');
        }

        $.ajax({
            url: masterDomain+"/include/ajax.php?service=education&action=bookingList&u=1&page="+atpage+"&pageSize="+pageSize,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                isload = false;
                if(data && data.state == 100){
                    $(".empty").remove();
                    var html = [], list = data.info.list, pageinfo = data.info.pageInfo;
                    for (var i = 0; i < list.length; i++) {
                        html.push('<li class="tutor fn-clear">');
                        var state = list[i].state == 1 ? langData['education'][3][28] : '<span>'+huoniao_.transTimes(list[i].pubdate, 5)+'</span><span>'+huoniao_.transTimes(list[i].pubdate, 4)+'</span>';
                        if(list[i].state==1){
                            html.push('<div class="left_b_on">'+state+'</div>');
                        }else{
                            html.push('<div class="left_b">'+state+'</div>');
                        }
                        html.push('<div class="middle_b">');
                        html.push('<h2><span>'+list[i].username+'</span><span data-id="'+list[i].id+'" class="del">'+langData['education'][3][20]+'</span></h2> ');
                        html.push('<p>'+list[i].tel+'</p>');
                        html.push('</div>');
                        html.push('<div class="right_b">');
                        html.push('<a data-id="'+list[i].id+'" class="tel" href="tel:'+list[i].tel+'"><img src="'+templets_skin+'images/education/call.png" ></a>');
                        html.push('</div>');
                        html.push('</li>');
                    }

                    $(".cont_ul").append(html.join(""));
                    isload = false;

                    if(atpage >= pageinfo.totalPage){
                        isload = true;
                        $(".cont_ul").append('<div class="empty">'+langData['marry'][5][29]+'</div>');
                    }

    				$("#total").html(pageinfo.totalCount);
                }else{
                    isload = false;
                    $(".cont_ul").html('<div class="empty">'+data.info+'</div>');
                }
            },
            error: function(){
                isload = false;
                //网络错误，加载失败
                $(".cont_ul .empty").html(''+langData['marry'][5][23]+'...').show();   
            }
        });

    }

});