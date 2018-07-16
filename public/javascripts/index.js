// leancloud初始化 
var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId: APP_ID,
  appKey:APP_KEY
});

// 获取数据：

var query = new AV.Query("Item");

var ItemNum = 0;

query.find({
  success: function(results) {
    // alert("Successfully retrieved " + results.length + " posts.");
      console.log(results);
    // 处理返回的结果数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];

      var attributes = results[i]['attributes'];

      var address = attributes['address'];

      var geolng = attributes['geolng'];

      var geolat = attributes['geolat'];

      var building = attributes['building'];

      var doorNum = attributes['doorNum'];

      var facility = attributes['facility'];

      var hostRate = attributes['hostRate'];

      var hostItem = attributes['hostItem'];

      var managerRate = attributes['managerRate'];

      var managerItem = attributes['managerItem'];

      var otherItem = attributes['otherItem'];

      ItemNum++;

      // alert(results[i].id);
      // alert(object.id + ' - ' + object.get('address'));

      // var html = template('Items', data);
      document.getElementById('Item-fluid').innerHTML += "<div class=\"widget-box\"><div class=\"widget-title bg_ly\"><h5>"+address+"</h5><button class=\"show-map-btn btn btn-primary icon-map-marker\"></button></div><div class=\"widget-content nopadding collapse in\" id=\"collapse"+ItemNum+"\"><ul class=\"recent-posts\"><li><div class=\"article-post\"> <span class=\"user-info\">详细地址："+building+doorNum+"</span><p><a href=\"#\"></a> </p></div></li><li><div class=\"article-post\"> <span class=\"user-info\">房东人品: "+hostRate+"分 描述："+hostItem+"</span><p><a href=\"#\"></a> </p></div></li><li><div class=\"article-post\"> <span class=\"user-info\">管理者人品： "+managerRate+"分 描述："+managerItem+"</span><p><a href=\"#\"></a> </p></div></li><li><div class=\"article-post\"> <span class=\"user-info\">房子设施："+facility+"</span><p><a href=\"#\"></a> </p></div></li><li><div class=\"article-post\"> <span class=\"user-info\">其他补充："+otherItem+"</span><p><a href=\"#\"></a> </p></div></li></ul></div><input type=\"hidden\" class=\"geolng\" value=\""+geolng+"\"/><input type=\"hidden\" class=\"geolat\" value=\""+geolat+"\"/></div>";
    }
    // var data = results;

    $(".show-map-btn").click(function(){

      var mainDiv = $(this).parent().parent();

      // alert(mainDiv);

      var thisLng = mainDiv.find("input.geolng");
      var thisLat = mainDiv.find("input.geolat");

      var thislngStr = thisLng.val();
      var thislatStr = thisLat.val();

      var map = new BMap.Map("allmap");
      map.enableScrollWheelZoom(true);
      var point = new BMap.Point(thislngStr,thislatStr);

      $('#map-container').css({"visibility":"visible"});       

      map.centerAndZoom(point,12);
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野

      if (point) {

        // $("#allmap").css("visibility":"visible");
        map.centerAndZoom(point, 16);
        map.addOverlay(new BMap.Marker(point));
      }else{
        alert("您选择地址没有解析到结果!");
      }     

      $('#closeMapBtn').mouseover(function(){
          $('#closeMapBtn').animate({
            "opacity":"0.8"
          },500);  
      });
      $('#closeMapBtn').mouseout(function(){
          $('#closeMapBtn').animate({
            "opacity":"0.5"
          },500);  
      });  

      $('#closeMapBtn').click(function(){
          $('#map-container').css({
            "visibility":"hidden"
          });  
      });    
    });
  },

  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});