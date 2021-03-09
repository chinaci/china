$(function(){

  var page = 1, pageSize = 10, isload = false;

  function getComment(tr){
    if(tr){
      page = 1;
      isload = false;
      $('.showlist').html('');
    }
    var where = $('.goodMark li.active').data('id');
    where = where ? '&'+where : '';

    isload = true;

    var data = [];
    data.push('type='+type);
    data.push('aid='+aid);
    data.push('oid='+oid);
    data.push('page='+page);
    data.push('pageSize='+pageSize);

    data = data.join("&") + where;

    $.ajax({
        url: masterDomain + '/include/ajax.php?service=member&action=getComment&' + data,
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
          if(data && data.state == 100){
              var list = data.info.list;
              var pageInfo = data.info.pageInfo;
              var html = [];
              for(var i = 0; i < list.length; i++){
                  var d = list[i];
                  if(d.content == '' && d.pics.length == 0) continue;

                  html.push('<li class="fn-clear" data-id="'+d.id+'" data-url="comdetail.html">');
                  html.push('    <div class="lileft">');
                  html.push('        <a href="javascript:;" class="headImg">');
                  html.push('            <img src="'+(d.user.photo ? d.user.photo : (staticPath + 'images/noPhoto_60.jpg') )+'" alt="">');
                  html.push('        </a>');
                  html.push('    </div>');
                  html.push('    <div class="liCon">');
                  html.push('        <h4 class="fn-clear">'+d.user.nickname+' <span>'+huoniao.transTimes(d.dtime, 2).replace(/-/g, '.')+'</span></h4>');
                  html.push('        <div class="conInfo">');
                  html.push('          <a href="comdetail-'+d.id+'.html" class="link">');
                  html.push('            <p>'+d.content.replace(/\n/g, '<br>')+'</p>');
                  if(d.pics.length){
                      html.push('            <div class="comPic">');
                      html.push('                <div class="wrapper fn-clear">');
                      html.push('          <div class="my-gallery comment-pic-slide" itemscope="" itemtype="" data-pswp-uid="1">');
                      html.push('              <div class="swiper-wrapper">');

                      for(var n = 0; n < d.pics.length; n++){
                          html.push('                  <figure itemprop="associatedMedia" itemscope="" itemtype="" class="swiper-slide">');
                          html.push('                        <div itemprop="contentUrl" data-size="800x800" class="picarr" id="pic0">');
                          html.push('                          <img src="'+d.pics[n]+'" itemprop="thumbnail" alt="Image description">');
                          html.push('                        </div>');
                          html.push('                   </figure>');
                      }
                      html.push('              </div>');
                      html.push('          </div>');
                      html.push('        </div>');
                      html.push('                <span class="vmark picNum">'+d.pics.length+'张</span>');
                      html.push('            </div>');
                  }
                  html.push('         </a>');
                  html.push('            <div class="conBottom">');
                  if(d.is_self != "1"){
                      html.push('                <span class="like'+(d.zan_has == "1" ? " like1" : "")+'"><i></i><em>'+d.zan+'</em></span>');
                  }
                  html.push('                <a href="comdetail-'+d.id+'.html"><span class="comment"><i></i><em>评论</em></span></a>');
                  html.push('            </div>');
                  html.push('        </div>');
                  html.push('    </div>');
                  html.push('</li>');
              }
              $('.comment_total').text(pageInfo.totalCount);
              $('#comment_good').text(pageInfo.sco4 + pageInfo.sco5);
              $('#comment_middle').text(pageInfo.sco2 + pageInfo.sco3);
              $('#comment_bad').text(pageInfo.sco1);
              $('#comment_pic').text(pageInfo.pic);

              $('.proBox').each(function(i){
                  var t = $(this), s = t.find('s'), num = t.find('.num'), r = 0, n = 0;
                  if(i == 0){
                      n = pageInfo.sco5;
                  }else if(i == 1){
                      n = pageInfo.sco4;
                  }else if(i == 2){
                      n = pageInfo.sco3;
                  }else if(i == 3){
                      n = pageInfo.sco2;
                  }else if(i == 4){
                      n = pageInfo.sco1;
                  }
                  r = (n / pageInfo.totalCount * 100).toFixed(2);
                  s.width(r + '%');
                  num.text(n > 999 ? '999+' : n);
              })

              $('#comment_good_ratio').text(parseInt((pageInfo.sco4+pageInfo.sco5)/pageInfo.totalCount*100 ) + '%');
              $('.showlist').append(html.join(""));

              if(pageInfo.totalPage > page){
                isload = false;
              }else{
                $('.loading').text('已加载全部数据');
              }
          }else{
            $('.loading').text('暂无相关信息');
          }
        }
    })
  }

  $(window).scroll(function(){
    var sct = $(window).scrollTop(), winh = $(window).height(), bh = $('body').height();
    if(!isload && winh + sct + 50 >= bh){
      page ++;
      getComment();
    }
  })

  // 全部评论
  $(".goodMark ul li").on("click",function(){
      $(this).addClass("active").siblings().removeClass("active");
      var i = $(this).index();
      $('.detailBox ul').eq(i).addClass('showlist').siblings().removeClass("showlist");
      getComment(1);
  })

  getComment();

})
