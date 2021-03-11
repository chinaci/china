$(function () {
    // 类别选择
    $('.category-box .category-list li').click(function () {
        $(this).toggleClass('active');
        var i = $(this).index();
        if(!$(this).hasClass('chose_btn')) {
            $('.filter .f-item').eq(i).toggleClass('show');
        }

        var ids = [];
        $('.category-box .category-list li').each(function(){
            if($(this).hasClass('active')){
                ids.push($(this).data('id'));
            }
        })
        $('#categoryture').val(ids.join(","));
    });

    // 添加酒店特色弹窗
    $('.filter .f-item  .btns').click(function () {
        $('.pop-bg').show();
    });
    $('.pop-bg .pop-box .btns span.cancel').click(function () {
        $('.pop-bg').hide();
        $('#hotel_t').val('');
    });
    $('.pop-bg .pop-box .btns span.sure').click(function () {
        var hotel_t = $('#hotel_t').val();
        $('#hotel_t').val('');
        var list = `
              <li> <span>`+hotel_t+`</span> <i class="btn_del"></i></li>
            `;
        $('.filter .f-item .list').append(list);
        $('.pop-bg').hide();
    });
    //删除酒店类别
    $('.filter .f-item .list').delegate('.btn_del','click',function () {
        $(this).parent().remove();
    })

    // 酒店类别筛选
    function getType(){
        $.ajax({
            type: "POST",
            url: masterDomain + "/include/ajax.php?service=marry&action=type&value=1",
            dataType: "jsonp",
            success: function(res){
                if(res.state==100 && res.info){
                    var typeSelect = new MobileSelect({
                        trigger: '.star-box ',
                        title: '',
                        wheels: [
                            {data:res.info}
                        ],
                        position:[0, 0],
                        callback:function(indexArr, data){
                            $('#type_text').val(data[0]['value']);
                            $('#typeid').val(data[0]['id']);
                        }
                        ,triggerDisplayData:false,
                    });
                }
            }
        });
    }

    getType();
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
                   var listLen = list.length;
                   var codeArea = list[0].code;
                   if(listLen == 1 && codeArea == 86){//当数据只有一条 并且这条数据是大陆地区86的时候 隐藏区号选择
                        $('.areacode_span').closest('li').hide();
                        return false;
                   }
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
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        $(".areacode_span em").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    //表单验证
    function isPhoneNo(p) {
        var pattern = /^1[23456789]\d{9}$/;
        return pattern.test(p);
    }

    $('#btn-keep').click(function (e) {
        var categoryture = $('#categoryture').val();
        var type = $('#type_text').val();
        var taoxi = $('#taoxi').val();
        var anli = $('#anli').val();
        var comname = $('#comname').val();
        var addrid =$('#addrid').val();
        var address = $('#address').val();
        var phone = $('#phone').val();

        e.preventDefault();
        var t = $("#fabuForm"), action = t.attr('data-action');
        t.attr('action', action);
        var addrid = 0, cityid = 0, r = true;

        if(categoryture == ''){
            r = false;
            showErr(''+langData['marry'][4][4]+''); //请选择分类！
            return;
        }else  if($('.hotel').hasClass('active') && type == ''){
            r = false;
            showErr(''+langData['marry'][4][5]+'');//请选择酒店类别！
            return;
        }else if($('.plan').hasClass('active')&& taoxi == ''){
            r = false;
            showErr(''+langData['marry'][4][6]+'');//套系不能为空！
            return;
        }else if($('.plan').hasClass('active')&& anli == ''){
            r = false;
            showErr(''+langData['marry'][4][7]+'');//案例不能为空！
            return;
        }else if($('.store-imgs .imgshow_box').length == 0){
            r = false;
            showErr(''+langData['marry'][4][8]+'');//请至少上传一张图片！
            return;
        }else if(!comname){
            r = false;
            showErr(''+langData['marry'][4][9]+'');//请输入公司名称！
            return;
        }else if(!address){
            r = false;
            showErr(''+langData['marry'][4][11]+'');//请填写详细地址！
            return;
        }else if(!phone){
            r = false;
            showErr(''+langData['marry'][4][12]+'');//请输入手机号！
            return;
        }
        // else  if(isPhoneNo($.trim($('#phone').val())) == false){
        //     r = false;
        //     showErr(''+langData['marry'][4][13]+'');//请输入正确的手机号！
        //     return;
        // }
        else if(!$('#price').val()){
            r = false;
            showErr(''+langData['marry'][4][14]+'');//请输入价格！
            return;
        }

        var ids = $('.gz-addr-seladdr').attr("data-ids");
        if(ids != undefined && ids != ''){
            addrid = $('.gz-addr-seladdr').attr("data-id");
            ids = ids.split(' ');
            cityid = ids[0];
        }else{
            r = false;
            showErr(langData['homemaking'][5][19]);  //请选择所在地
            return;
        }
        $('#addrid').val(addrid);
        $('#cityid').val(cityid);

        var pics = [];
        $("#fileList").find('.thumbnail').each(function(){
            var src = $(this).find('img').attr('data-val');
            pics.push(src);
        });
        $("#pics").val(pics.join(','));

        var video = [];
        $("#fileList2").find('.thumbnail').each(function(){
            var src = $(this).find('video').attr('data-val');
            video.push(src);
        });
        $("#video").val(video.join(','));

        var tags = [];
        $('.filter .f-item .list').find('li span').each(function(){
            var t = $(this), val = t.text();
            tags.push(val);
        })
        $('#tag').val(tags.join('|'));

        if(!r){
            return;
        }

        $.ajax({
			url: action,
			data: t.serialize(),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
                    showErr(data.info);
				}else{
                    showErr(data.info);
				}
			},
			error: function(){
                showErr(langData['siteConfig'][6][203]);
			}
		})

        
        
    });

    //错误提示
    var showErrTimer;
    function showErr(txt){
        showErrTimer && clearTimeout(showErrTimer);
        $(".popErr").remove();
        $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
        // $(".popErr p").css({"margin-left": -$(".popErr p").width()/2, "left": "50%"});
        $(".popErr").css({"visibility": "visible"});
        showErrTimer = setTimeout(function(){
            $(".popErr").fadeOut(300, function(){
                $(this).remove();
            });
        }, 1500);
    }




});