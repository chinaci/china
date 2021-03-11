$(function () {

    $('.remarks ul li').click(function () {
        var t = $(this);
        if (!t.hasClass('active')) {
            t.addClass('active').siblings().removeClass('active');
        }
    });

    var htm = '';
    for (var i = 0; i < day; i++) {
        if (i == 0) {
            htm += '<option value="">选择日期</option>';
        } else {
            htm += '<option value="">' + month + '月' + i + '号</option>';
        }
    }
    $("#lease_day").html(htm);


    $("#lease_hour").html('        <option value="0">07:00</option>\n' +
        '        <option value="1">08:00</option>\n' +
        '        <option value="2">09:00</option>\n' +
        '        <option value="3">10:00</option>\n' +
        '        <option value="4">11:00</option>\n' +
        '        <option value="5">12:00</option>');

    $("#lease_halfa").change(function () {
        var v = $(this).val();
        if (v == 1) {
            $("#lease_hour").html('        <option value="0">07:00</option>\n' +
                '        <option value="1">08:00</option>\n' +
                '        <option value="2">09:00</option>\n' +
                '        <option value="3">10:00</option>\n' +
                '        <option value="4">11:00</option>\n' +
                '        <option value="5">12:00</option>');
        } else {
            $("#lease_hour").html('        <option value="6">13:00</option>\n' +
                '        <option value="7">14:00</option>\n' +
                '        <option value="8">15:00</option>\n' +
                '        <option value="9">16:00</option>\n' +
                '        <option value="10">17:00</option>\n' +
                '        <option value="11">18:00</option>');
        }
    })


    // 点击取消
    $('.cancel').click(function () {
        window.history.back(-1);
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
        $('.layer_code').show();
        $('.mask-code').addClass('show');
    })
    // 选中区域
    $('.layer_list').delegate('li','click',function(){
        var t = $(this), txt = t.find('em').text();
        console.log(txt)
        $(".areacode_span em").text(txt);
        $("#areaCode").val(txt.replace("+",""));

        $('.layer_code').hide();
        $('.mask-code').removeClass('show');
    })

    // 关闭弹出层
    $('.layer_close, .mask-code').click(function(){
        $('.layer_code, #popupReg-captcha-mobile').hide();
        $('.mask-code').removeClass('show');
    })

    //提示弹框
    function showTipMsg(msg) {
        /* 给出一个浮层弹出框,显示出errorMsg,2秒消失!*/
        /* 弹出层 */
        $('.protips').html(msg);
        var scrollTop = $(document).scrollTop();
        var windowTop = $(window).height();
        var xtop = windowTop / 2 + scrollTop;
        $('.protips').css('display', 'block');
        setTimeout(function () {
            $('.protips').css('display', 'none');
        }, 2000);
    }

    // 表单提交验证
    $('.sendout').click(function () {
        var title = $('#title').val();  //面试职位
        var lease_day = $('#lease_day').find("option:selected").text(); //面试时间
        var lease_halfa = $('#lease_halfa').find("option:selected").text(); //面试时间
        var lease_hour = $('#lease_hour').find("option:selected").text(); //面试时间

        var place = $('#place').val();  //面试地点
        var name = $('#name').val();  //联系人
        var phone = $('#phone').val();  //联系电话
        var areaCode = $('#areaCode').val();  //国际区号
        if (title == '' || title == 0) {
            errorMsg = "请填写面试职位";
            showTipMsg(errorMsg);
            return;
        } else if (lease_day == '') {
            errorMsg = "请填写面试日期";
            showTipMsg(errorMsg);
            return;
        } else if (place == '') {
            errorMsg = "请填写面试地点";
            showTipMsg(errorMsg);
            return;
        } else if (name == '') {
            errorMsg = "请填写联系人";
            showTipMsg(errorMsg);
            return;
        } else if (phone == '') {
            errorMsg = "请填写联系电话";
            showTipMsg(errorMsg);
            return;
        } else if (phone.length == 0) {
            errorMsg = "请填写正确的电话";
            showTipMsg(errorMsg);
            return;
        }

        var remark = $("#Desc1").val();

        $.ajax({
            url: "/include/ajax.php?service=job&action=invitation",
            type: "GET",
            data: {
                lease_day: lease_day,
                lease_halfa: lease_halfa,
                lease_hour: lease_hour,
                place: place,
                name: name,
                phone: phone,
                areaCode: areaCode,
                rid: rid,
                pid: title,
                remark: remark
            },
            dataType: "json",
            success: function (data) {
                if (data.state == 100) {
                    showTipMsg("邀请成功");
                } else {
                    showTipMsg(data.info);
                }
            }
        })

    });


})