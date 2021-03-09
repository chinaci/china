var ue = UE.getEditor('body', {'enterTag': ''});

$(function(){

    // 设置tab切换
    $('.tt li').click(function(){
        var  u = $(this);
        var index = u.index();
        $('.tab-content .tt_1').eq(index).addClass('active');
        $('.tab-content .tt_1').eq(index).siblings().removeClass('active');
        u.addClass('active');
        u.siblings('li').removeClass('active');
    })

    $('.yy li').click(function(){
      var  u = $(this);
      var index = u.index();
      $('.tab-content .yy_1').eq(index).addClass('active');
      $('.tab-content .yy_1').eq(index).siblings().removeClass('active');
      u.addClass('active');
      u.siblings('li').removeClass('active');
    })

    $('[data-rel="tooltip"]').tooltip();
    $('[data-rel="popover"]').popover();
    $('.chooseTime').timepicker($.extend($.datepicker.regional['zh-cn'], {'timeFormat':'hh:mm','hour':'09','minute':'40'}));

      jQuery('#StatisticsForm_beginDate').datepicker(jQuery.extend({
          showMonthAfterYear: false
      },
      jQuery.datepicker.regional['zh_cn'], {
          'showSecond': true,
          'changeMonth': true,
          'changeYear': true,
          'tabularLevel': null,
          'yearRange': '2013:' + new Date().getFullYear(),
          'minDate': new Date(2013, 1, 1, 00, 00, 00),
          'timeFormat': 'hh:mm:ss',
          'dateFormat': 'yy-mm-dd',
          'timeText': langData['siteConfig'][19][384],
          'hourText': langData['waimai'][6][124],
          'minuteText': langData['waimai'][6][125],
          'secondText': langData['waimai'][6][126],
          'currentText': langData['waimai'][6][127],
          'closeText': langData['siteConfig'][6][15],
          'showOn': 'focus'
      }));
      jQuery('#StatisticsForm_endDate').datepicker(jQuery.extend({
          showMonthAfterYear: false
      },
      jQuery.datepicker.regional['zh_cn'], {
          'showSecond': true,
          'changeMonth': true,
          'changeYear': true,
          'tabularLevel': null,
          'yearRange': '2013:' + new Date().getFullYear(),
          'minDate': new Date(2013, 1, 1, 00, 00, 00),
          'timeFormat': 'hh:mm:ss',
          'dateFormat': 'yy-mm-dd',
          'timeText': langData['siteConfig'][19][384],
          'hourText': langData['waimai'][6][124],
          'minuteText': langData['waimai'][6][125],
          'secondText': langData['waimai'][6][126],
          'currentText': langData['waimai'][6][127],
          'closeText': langData['siteConfig'][6][15],
          'showOn': 'focus'
      }));


      var tagenum = 100;
      $('body').delegate('.deletefield', 'click',function(){
          $(this).parents('.fatherblock').remove();
      });
      $('body').delegate('.sondeletefield', 'click',function(){
          $(this).parent('.fatherblock').remove();
      });
      $('#addpricenature').on('click',function(){
          var lenght = $('.natureblock').length;
          if(lenght>9){
              $.dialog.alert(langData['siteConfig'][27][81]);
          }
          var string = '<div class="natureblock fatherblock"><div class="fieldblock">';
          string += '<label>属性名: <input type="text" name="nature['+tagenum+'][name]" value="" style="width:80px;"/></label>';
          string += '<div class="deletefield" style="" title="'+langData['siteConfig'][26][5]+'"> '+langData['siteConfig'][6][8]+' </div>';
          string += '<div class="addsonfield" title="'+langData['siteConfig'][19][498]+'" onclick="addsonnaturepriceblock(this,'+tagenum+');"> '+langData['siteConfig'][19][498]+' </div>';
          string += '</div></div>';
          $('#natureblocklist').append(string);
          tagenum++;
      });


});


$("#food-form").submit(function(e){
    e.eventPreventDefault();
});


//表单提交
function checkFrom(form){

    var form = $("#food-form"), action = form.attr("action"), data = form.serialize();
    var btn = $("#submitBtn");

    ue.sync();

    btn.attr("disabled", true);

    $.ajax({
        url: action,
        type: "post",
        data: data,
        dataType: "json",
        success: function(res){
            if(res.state == 100){
                location.href = "waimaiFoodList.php?sid="+sid;
            }else{
                $.dialog.alert(res.info);
                btn.attr("disabled", false);
            }
        },
        error: function(){
            $.dialog.alert(langData['siteConfig'][20][253]);
            btn.attr("disabled", false);
        }
    })

    return false;

}



function addsonnaturepriceblock(obj,key){
    var string = '<div class="sonfieldblock fatherblock">';
        string += '<label>'+langData['siteConfig'][26][6]+': <input type="text" value="" name="nature['+key+'][value][]"/></label> ';
        string += '<label>'+langData['siteConfig'][19][428]+': <input type="text" value="0" name="nature['+key+'][price][]"/></label>';
        string += '<div class="sondeletefield">'+langData['siteConfig'][6][8]+'</div>';
        string += '</div>	';
        $(obj).parents('.natureblock').append(string);
}
