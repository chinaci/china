$(function(){

    //地图标注
    var init = {
        popshow: function() {
            var src = "/api/map/mark.php?mod=tuan",
                address = $("#address").val(),
                lng = $("#lng").val(),
                lat = $("#lat").val();
            if(address != ""){
                src = src + "&address="+address;
            }
            if(lng != "" && lat != ""){
                src = src + "&lnglat="+lng+','+lat;
            }
            $("#markPopMap").after($('<div id="shadowlayer" style="display:block"></div>'));
            $("#markDitu").attr("src", src);
            $("#markPopMap").show();
        },
        pophide: function() {
            $("#shadowlayer").remove();
            $("#markDitu").attr("src", "");
            $("#markPopMap").hide();
        }
    };

    $(".map-pop .pop-close, #cloPop").bind("click", function(){
        init.pophide();
    });

    $("#mark").bind("click", function(){
        init.popshow();
    });

    $("#okPop").bind("click", function(){
        var doc = $(window.parent.frames["markDitu"].document),
            lng = doc.find("#lng").val(),
            lat = doc.find("#lat").val(),
            address = doc.find("#addr").val();
        $("#lng").val(lng);
        $("#lat").val(lat);
        if($("#address").val() == ""){
            $("#address").val(address).blur();
        }
        init.pophide();
    });


    var yingyeFrom = 0, yingyeTo = 6;
    var yingyeTxt = $('#yingyeTxt').val();
    var yingyeArr = [langData['siteConfig'][14][4], langData['siteConfig'][14][5], langData['siteConfig'][14][6], langData['siteConfig'][14][7], langData['siteConfig'][14][8], langData['siteConfig'][14][9], langData['siteConfig'][14][10]];
    //"周一", "周二", "周三", "周四", "周五", "周六", "周日"
    if(yingyeTxt != '' && yingyeTxt.indexOf(langData['siteConfig'][13][7]) > -1){
        yingyeTxt = yingyeTxt.split(langData['siteConfig'][13][7]);   //至
        for (var i = 0; i < yingyeArr.length; i++){
            if(yingyeArr[i] == yingyeTxt[0]){
                yingyeFrom = i;
            }
            if(yingyeArr[i] == yingyeTxt[1]){
                yingyeTo = i;
            }
        }
    }
    $("#yingyeTxt").ionRangeSlider({
        type: "double",
        grid: true,
        from: yingyeFrom,
        to: yingyeTo,
        values: yingyeArr,
        onFinish: function (data) {
            $("#yingyeTxt").val(data.from_value + langData['siteConfig'][13][7] + data.to_value);    //至
        }
    });

    var opentimeFrom = 0, opentimeTo = 6;
    var opentimeTxt = $('#opentime').val();
    var opentimeArr = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"
    ];
    if(opentimeTxt != '' && opentimeTxt.indexOf('-') > -1){
        opentimeTxt = opentimeTxt.split('-');
        for (var i = 0; i < opentimeArr.length; i++){
            if(opentimeArr[i] == opentimeTxt[0]){
                opentimeFrom = i;
            }
            if(opentimeArr[i] == opentimeTxt[1]){
                opentimeTo = i;
            }
        }
    }
    $("#opentime").ionRangeSlider({
        type: "double",
        grid: true,
        from: opentimeFrom,
        to: opentimeTo,
        values: opentimeArr,
        onFinish: function (data) {
            $("#opentime").val(data.from_value + ';' + data.to_value);
        }
    });

    getEditor("body");

    $('.radio span').bind('click', function(){
        var t = $(this);
        t.addClass('curr').siblings('span').removeClass('curr');
        t.siblings('input').val(t.data('id'));
        $('#qj_0, #qj_1').hide();
        $('#qj_' + t.data('id')).show();
    })


    $(".tags_enter").blur(function() { //焦点失去触发
        var txtvalue=$(this).val().trim();
        if(txtvalue!=''){
            addTag($(this));
        }
    }).keydown(function(event) {
        var key_code = event.keyCode;
        var txtvalue=$(this).val().trim();
        if (key_code == 13 && txtvalue != '') { //enter
            addTag($(this));
        }
        if (key_code == 32 && txtvalue!='') { //space
            addTag($(this));
        }
        if (key_code == 13) {
            return false;
        }
    });
    $(".close").live("click", function() {
        $(this).parent(".tag").remove();
    });


    $('#fabuForm').submit(function(e){
        e.preventDefault();

        if($('.uploadVideo').find('video').size() > 0) {
            $('#video').val($('.uploadVideo').find('video').attr('data-val'));
        }

        if($('#qj_type').val() == 0) {
            var qj_pics = [];
            $('.qj360').find('img').each(function(){
               var t = $(this), val = t.attr('data-val');
               qj_pics.push(val);
            });
            $('#qj_pics').val(qj_pics.join(','));
        }

        var tags = [];
        $('.tags').find('.tag').each(function(){
            var t = $(this), val = t.attr('data-val');
            tags.push(val);
        })
        $('#tag_shop').val(tags.join('|'));

        var addrid = $('.addrBtn').attr('data-id'), ids = $('.addrBtn').attr('data-ids'), cityid = 0;
        addrid = addrid === undefined ? 0 : addrid;
        cityid = ids === undefined ? 0 : ids.split(' ')[0];
        $('#addrid').val(addrid);
        $('#cityid').val(cityid);

        $('#submit').attr('disabled', true).html(langData['siteConfig'][7][9]+'...');   //保存中

        $.ajax({
            url: "/include/ajax.php?service=business&action=updateStoreConfig",
            type: "POST",
            data: $('#fabuForm').serialize(),
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){
                    alert(langData['siteConfig'][6][39]);   //保存成功
                    location.reload();
                }else{
                    alert(data.info);
                    $('#submit').attr('disabled', false).html(langData['siteConfig'][6][200]);  //重新保存
                }
            },
            error: function(){
                alert(langData['siteConfig'][6][201]);//网络错误，保存失败，请稍候重试！
                $('#submit').attr('disabled', false).html(langData['siteConfig'][6][200]);//重新保存
            }
        });

    });



})


function getEditor(id){
    ue = UE.getEditor(id, {toolbars: [['fullscreen', 'undo', 'redo', '|', 'fontfamily', 'fontsize', '|', 'forecolor', 'bold', 'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'insertorderedlist', 'insertunorderedlist', '|', 'simpleupload', 'insertimage', 'insertvideo', 'attachment', 'insertframe', 'wordimage', 'inserttable', '|', 'link', 'unlink']], initialStyle:'p{line-height:1.5em; font-size:13px; font-family:microsoft yahei;}'});
    ue.on("focus", function() {ue.container.style.borderColor = "#999"});
    ue.on("blur", function() {ue.container.style.borderColor = ""})
}


function addTag(obj) {
    var tag = obj.val();
    if (tag != '') {
        var i = 0;
        $(".tag").each(function() {
            if ($(this).text() == tag + "×") {
                $(this).addClass("tag-warning");
                setTimeout("removeWarning()", 400);
                i++;
            }
        })
        obj.val('');
        if (i > 0) { //说明有重复
            return false;
        }
        $("#tag_shop").before("<span class='tag' data-val='"+tag+"'>" + tag + "<button class='close' type='button'>×</button></span>"); //添加标签
    }
}
function removeWarning() {
    $(".tag-warning").removeClass("tag-warning");
}
