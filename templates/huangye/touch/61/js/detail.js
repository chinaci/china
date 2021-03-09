$(function(){
    $('img').scrollLoading();

  	$('.appMapBtn').attr('href', OpenMap_URL);

	// // 分享
	// $('.share').click(function(){
  //       $('.share-list').addClass('show');
  //       $('.disk').show();
  //   })
  //   $('.cancel,.disk').click(function(){
  //       $('.share-list').removeClass('show');
  //       $('.disk').hide();
  //   })


    // 联系我们
    $('.de-list ul li').click(function(){
      	var x = $(this);
      	var index = x.index();
      	$('.ddd').eq(index).show();
      	$('.ddd').eq(index).siblings().hide();
      	x.addClass('bb');
      	x.siblings('li').removeClass('bb');
    })


    // 详尽信息
    $('.more').click(function(){
        var dom = $(this).siblings('.de-txt');
        if (dom.hasClass('hhh')) {
            dom.removeClass('hhh')
        }else{
            dom.addClass('hhh')
        }
    })
    $('.more').click(function(){
        var dom = $('.more')
        if (dom.hasClass('nic')) {
            dom.removeClass('nic')
        }else{
            dom.addClass('nic')
        }
    })

    // 商家二维码
	$('.erwei').click(function(){
        $('.disk').show();
        $('.sjew').removeClass('fn-hide');
    })
  	$('.sjew span p,.disk').click(function(){
        $('.disk').hide();
        $('.sjew').addClass('fn-hide');
    })


    // 加微信
	$('.deb-3').click(function(){
        $('.disk').show();
        $('.jweixn').removeClass('fn-hide');
    })
  	$('.jweixn span p,.disk').click(function(){
        $('.jweixn').addClass('fn-hide');
        $('.disk').hide();
    })




    // 图片浏览
  	var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }


    // --------------------------评论 s
    var atpage = 1, totalPage = 1;
    var commonTop = $('.comments-lead').offset().top - $('.head').height();

    // 上一页
    $('.fanye .fan-l').click(function(){
        if(atpage == 1) return;
        atpage--;
        getReplyList(1);
    })
    // 下一页
    $('.fanye .fan-r').click(function(){
        if(atpage == totalPage) return;
        atpage++;
        getReplyList(1);
    })

    //获取评论
    function getReplyList(go){
        var img = $('.loading').attr('data-img');
        $('.loading').html('<img src="'+img+'" alt="">').show();
        $.ajax({
            url: masterDomain+"/include/ajax.php?service=member&action=getComment&type=huangye-detail&son=1&aid="+id+"&page="+atpage+"&pageSize=5",
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

                    if(list.length > 0){
                        for(var i = 0; i < list.length; i++){
                            var src = staticPath+'images/noPhoto_100.jpg';
                            if(list[i].user.photo){
                                src = huoniao.changeFileSize(list[i].user.photo, "middle");
                            }
                            var users = '<p>'+list[i].user.nickname+'</p>';

                            html.push('<li data-id="'+list[i].id+'" data-uid="'+list[i].uid+'" data-name="'+list[i].user.nickname+'"> <a href=""><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+list[i].ftime+'</i> </div> <span>'+list[i].content+'</span> </div> </li>');

                            if(list[i].lower.list != null && list[i].lower.list!=undefined){
                                html.push(getLowerReply(list[i].lower.list, list[i].user));
                            }
                        }
                    }
                    $('.loading').hide();
                    $("#replyList ul").html(html.join(""));

                    if(go){
                        $(window).scrollTop(commonTop);
                    }

                    $('.commcount').text(pageInfo.totalCount);
                    totalPage = pageInfo.totalPage;
                    if(totalPage > 1){
                        $('.fanye').show();
                        $('.page').text(atpage+'/'+totalPage);
                    }
                }else{
                    $('.loading').html('暂无相关评论');
                    $('.fanye').hide();
                }
            }
        });
    }

    //评论子级
    function getLowerReply(arr, member){
        if(arr){
            var html = [];
            for(var i = 0; i < arr.length; i++){
                var src = staticPath+'images/noPhoto_100.jpg';
                if(arr[i].user.photo){
                    src = huoniao.changeFileSize(arr[i].user.photo, "middle");
                }

                var users = '<p>'+arr[i].user.nickname+'</p>';

                html.push('<li data-id="'+arr[i].id+'" data-uid="'+arr[i].uid+'" data-name="'+arr[i].user.nickname+'"> <a href=""><img onerror="javascript:this.src=\''+staticPath+'images/noPhoto_40.jpg\';" src="'+src+'" alt=""></a> <div class="dis-txt"> <div class="dt-lead">'+ users +'<i>'+arr[i].ftime+'</i> </div> <span>回复 '+arr[i].user.nickname+'：'+arr[i].content+'</span> </div> </li>');

                if(arr[i].lower.list != null && arr[i].lower.list!=undefined){
                    html.push(getLowerReply(arr[i].lower.list, arr[i].user));
                }
            }
            return html.join("");
        }
    }

    var first = true;
    $(window).scroll(function(){
        var wsct = $(window).scrollTop();
        if(first && wsct + $(window).height() > commonTop){
            first = false;
            getReplyList();
        }
    })

    var rid = 0, ruid = 0, runame = '', sct = 0;
    // 我要讨论
    $('.reply').click(function(){
        rid = 0;
        ruid = uid;
        runame = uname;
        replyFun();
    })
    // 发表回复
    $('#replyList').delegate(".dis-txt","click",function(){
        var t = $(this).closest('li');
        rid = t.data('id');
        ruid = t.data('uid');
        runame = t.data('name');
        replyFun();
    })

    function replyFun(){
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = masterDomain + '/login.html';
            return false;
        }

        sct = $(window).scrollTop();

        $('body').addClass('fixed');

        $('.layer').addClass('show').animate({"left":"0%"},100);

        $('.editor .img').css("display","table-cell");
    }

      //发表回复
    $(".top-r").bind("click", function(){
        var t = $(this), content = $(".textarea").html();
        if(!t.hasClass("disabled") && $.trim(content) != ""){
            t.addClass("disabled");
            if(rid=='' || rid==undefined || rid!=null){
                var url = '/include/ajax.php?service=member&action=sendComment&check=1&type=article-detail&aid=' + aid;
            }else{
                var url = '/include/ajax.php?service=member&action=replyComment&check=1&id=' + rid;
            }
            $.ajax({
                url:  url,
                data: "content="+encodeURIComponent(content),
                type: "POST",
                dataType: "json",
                success: function (data) {
                    t.removeClass("disabled");
                    if(data && data.state == 100){
                        var info = data.info;
                        $(".top-l").click();
                        $('.top-r').text('发表成功！');
                        $('.layer').animate({"left":"100%"},1,function(){
                            $('.layer').removeClass('show');

                            getReplyList();

                            t.removeClass("disabled").text('发表');
                        });
                    }else{
                        t.removeClass("disabled").text('发表');
                        alert("发表失败，请刷新重试！");
                    }
                },
                error: function(){
                    t.removeClass("disabled").text('发表');
                    alert("网络错误，发表失败，请稍候重试！");
                }
            });
        }
    });

    // 隐藏回复
    $('.top-l').click(function(){
        $('body').removeClass('fixed');
        $(window).scrollTop(sct);
        $('.layer').removeClass('show').animate({"left":"100%"},100);
        $('.layer .textarea').html('');
    })

    // 选择表情
    var memerySelection;
    $('.editor .emotion').click(function(){
        var t = $(this), box = $('.emotion-box');
        memerySelection = window.getSelection();
        if (box.css('display') == 'none') {
        $('.emotion-box').show();
        t.addClass('on');
        return false;
    }else {
        $('.emotion-box').hide();
        t.removeClass('on');
    }
    })

    $('.emotion-box li').click(function(){
        var t = $(this).find('img'), textarea = $('.textarea'), hfTextObj = textarea;
        hfTextObj.focus();
        pasteHtmlAtCaret('<img src="'+t.attr("src")+'" />');
    })

    //根据光标位置插入指定内容
    function pasteHtmlAtCaret(html) {
      var sel, range;
      if (window.getSelection) {
          sel = memerySelection;
          if (sel.getRangeAt && sel.rangeCount) {
              range = sel.getRangeAt(0);
              range.deleteContents();
              var el = document.createElement("div");
              el.innerHTML = html;
              var frag = document.createDocumentFragment(), node, lastNode;
              while ( (node = el.firstChild) ) {
                  lastNode = frag.appendChild(node);
              }
              range.insertNode(frag);
              if (lastNode) {
                  range = range.cloneRange();
                  range.setStartAfter(lastNode);
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
              }
          }
      } else if (document.selection && document.selection.type != "Control") {
          document.selection.createRange().pasteHTML(html);
      }
    }

    //光标定位到最后
    function set_focus(el){
        el=el[0];
        el.focus();
        if($.browser.msie){
            var rng;
            el.focus();
            rng = document.selection.createRange();
            rng.moveStart('character', -el.innerText.length);
            var text = rng.text;
            for (var i = 0; i < el.innerText.length; i++) {
                if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
                    result = i + 1;
                }
            }
        }else{
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    // --------------------------评论 e
};

    // execute above function
    initPhotoSwipeFromDOM('.my-gallery');



})
