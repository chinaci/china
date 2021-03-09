$(function () {
    var hasLoadGt = false;
    var getYzmBtn = null;
    var getYzmType = '';

    $(".form-input").submit(function (e) {
        e.preventDefault();
        var f = $(this),
            t = f.find("#submit"),
            loupan = f.find("#selectTypeText"),
            phone = f.find(".tel-text"),
            vcode = f.find("#number"),
            nickname = f.find('.nickname'),
            r = true;

        if (loupan.text() == "" || loupan.text() == "请选择") {
            r = false;
            alert('请选择意向楼盘');
            return false;
        }
        if (nickname.val() == "") {
            r = false;
            nickname.focus();
            nickname.attr('placeholder', '请输入您的姓名');
        } else if (phone.val() == "") {
            r = false;
            phone.focus();
            phone.attr('placeholder', '请输入手机号码');
        }
        if (!r) return;
    })


    $.ajax({
        url: masterDomain + "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function (data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: "bind",
                width: '312px'
            }, handlerPopupFpwd);
        }
    });
    var sendSmsData = [];

    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd) {
        captchaObjFpwd.onSuccess(function () {
            var validate = captchaObjFpwd.getValidate();
            sendSmsData.push('geetest_challenge=' + validate.geetest_challenge);
            sendSmsData.push('geetest_validate=' + validate.geetest_validate);
            sendSmsData.push('geetest_seccode=' + validate.geetest_seccode);
            sendSmsFunc();
        });

        $(document).on('click', '.sendvdimgck', function () {
            var a = $(this);
            getYzmBtn = a;
            if (!returnCheckPhone(a)) return;
            //发送验证码
            if (geetest) {
                captchaObjFpwd.verify();
            } else {
                sendSmsFunc();
            }

        });

    };


    function sendSmsFunc() {
        var tel = $(".tel-text").val();
        // var areaCode = $(".areaCode i").text().replace('+', '');
        var areaCode = 86;
        var sendSmsUrl = "/include/ajax.php?service=siteConfig&action=getPhoneVerify";

        sendSmsData.push('type=sms_login');
        sendSmsData.push('areaCode=' + areaCode);
        sendSmsData.push('phone=' + tel);
        sendSmsData.push('terminal=mobile');

        $.ajax({
            url: sendSmsUrl,
            data: sendSmsData.join('&'),
            type: 'POST',
            dataType: 'json',
            success: function (res) {
                if (res.state == 101) {
                    alert(res.info);
                } else {
                    returnDJS(getYzmBtn, 60);
                }
            }
        })
    }

    // 用户名验证
    function returnCheckPhone(o, flag) {
        var t = o, form = $('#loginForm'), oaccount = form.find('.tel-text'), account = $.trim(oaccount.val());
        var r = true;

        if (account == '') {
            r = false;
            oaccount.attr('placeholder', '请输入手机号码');
            oaccount.focus();
        } else {
            var reg, h = '';
            reg = !!account.match(/^1[34578](\d){9}$/);
            if (!reg) {
                $('.num-tip').html('手机号输入错误').show();
                oaccount.focus();
                r = false;
            } else {
                oaccount.attr('placeholder', '');
            }
        }
        if (flag == 1) {
            var code = $(".form-input .see .code").find(".number");
            console.log(code.val())
            if (code.val() == '') {
                code.attr('placeholder', '请输入验证码');
                r = false;
            }
        }
        console.log(r)
        return r;
    }

    //倒计时
    var ct;

    function returnDJS(obj, time) {
        obj.attr('disabled', true);
        obj.css('background', '#eee');
        ct = setInterval(function () {
            obj.text(--time + 's');
            if (time <= 0) {
                clearInterval(ct);
                obj.text('获取').removeClass('loading');
                obj.attr('disabled', false);
                obj.css('background', '#f1370b');
            }
        }, 1000)
    }


    //预约看房累计人数
    $.ajax({
        url: masterDomain + '/include/ajax.php?service=house&action=bookingList',
        data: '',
        dataType: 'json',
        type: 'get',
        success: function (data) {
            console.log(data);
            if (data.state == 100) {
                var count = data.info.pageInfo.totalCount;
                $(".buy-right .add span").text(count);
            } else if (data.state == 101) {
                $(".buy-right .add span").text(0);
            }

        }
    })

    //预约
    $(".booking").click(function () {

        var a = $(this);
        if (!returnCheckPhone(a, 1)) return;

        var url = masterDomain + '/include/ajax.php?service=house&action=booking';
        var tel = $.trim($(".tel-text").val());
        var loupan = $("#selectTypeText").text();
        var name = $.trim($(".name-text").val());
        var code = $(".form-input .see .code").find(".number").val();
        $.ajax({
            url: url,
            type: 'get',
            data: {
                loupan: loupan,
                name: name,
                mobile: tel,
                flag: '1',
                code: code,
            },
            dataType: 'json',
            success: function (data) {
                if (data.state == 100) {
                    alert("预约成功！");
                    window.location.href = window.location.href;
                } else {
                    alert(data.info);
                }
            }
        })


    })
})
