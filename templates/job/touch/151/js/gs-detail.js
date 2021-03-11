$(function(){
    //放大图片
    $.fn.bigImage({
        artMainCon:".content",  //图片所在的列表标签
    });


	if (site_map == "baidu") {
		var map = new BMap.Map("map");
		map.centerAndZoom(new BMap.Point(lng, lat), 11);
		map.setCurrentCity("$detail_addr[1]");
	}else if(site_map == "google"){
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 14,
			center: new google.maps.LatLng(pageData.lat, pageData.lng),
			zoomControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		});
	}else if(site_map == "qq"){
		var map = new qq.maps.Map(document.getElementById('map'), {center: new qq.maps.LatLng(lat, lng), zoom: 18, draggable:true});
	}else if(site_map == "amap"){
		var map = new AMap.Map('map', {
			center: [lng,lat],
			zoom: 15,
		});
	}
   


    HN_Location.init(function(data){
		console.log(data)
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            $('.map_distance').hide();
        }else{
			console.log(lat+'===='+ lng+'===='+data.lat+'===='+data.lng)
            caculateLL(lat, lng, data.lat, data.lng);
            function caculateLL(lat, lng, lat2, lng2) {
                var radLat1 = lat * Math.PI / 180.0;
                var radLat2 = lat2 * Math.PI / 180.0;
                var a = radLat1 - radLat2;
                var b = lng * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;
                s = Math.round(s * 10000) / 10000;

                $(".map_distance p").html(s.toFixed(1) +'km');
            };
        }
    })


	$('.tab-box span').click(function(){
		var index = $(this).index(),
			 wrap = $('.choose-box .wrapper').eq(index);
		$(this).addClass('active').siblings().removeClass('active');
		if (wrap.css('display') == "none") {
			wrap.show().siblings().hide();
		}
	})
	// 推荐企业
	onefindList();
    function onefindList(){
        var html = [];

        $.ajax({
           url : '/include/ajax.php?service=job&action=company&property=r',
           data : '', 
           type : 'GET', 
           dataType : 'json',
           success:function (data) {
               if(data.state == 100){
                   infos = data.info.list;
                   var len = infos.length;
                   for(var i = 0; i < len; i++){
                       html.push('<li class="fn-clear">');
                       html.push('  <a href="'+infos[i].url+'">');
                       html.push('    <div class="img_user"><img src="'+infos[i].logo + '"></div>');
                       html.push('    <div class="txt_user">');
                       html.push('        <div class="txt01 fn-clear"><span>'+infos[i].title+'</span><span>'+infos[i].addr[infos[i].addr.length-1]+'</span></div>');
                       html.push('        <p class="txt02">该企业有<em>'+infos[i].pcount+'</em>个在招职位</p>');
                       html.push('        <div class="txt03"><span>'+infos[i].scale+'</span><em>|</em><span>'+infos[i].nature+'</span><em>|</em><span>'+infos[i].industry+'</span></div>');
                       html.push('     </div>');
                       // html.push('     <i></i>');
                       html.push('   </a>');
                       html.push(' </li>');
                   }
                   $('.recommend .list ul').append(html.join(""));
               }

           } 
        });

    };


	// $('img').scrollLoading();
	$('.appMapBtn').attr('href', OpenMap_URL);

	// $('img').scrollLoading();


    function auto_data_size(){
        var imgss= $("figure img");
        $("figure a").each(function() {
            var t = $(this);
            var imgs = new Image();
            imgs.src = t.attr("href");

            if (imgs.complete) {
                t.attr("data-size","").attr("data-size",imgs.width+"x"+imgs.height);
            } else {
                imgs.onload = function () {
                    t.attr("data-size","").attr("data-size",imgs.width+"x"+imgs.height);
                    imgs.onload = null;
                };
            };

        })
    };
    auto_data_size();


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
    };

    // execute above function
    initPhotoSwipeFromDOM('.my-gallery');


})
