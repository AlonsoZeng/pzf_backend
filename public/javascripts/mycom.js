// leancloud初始化 
var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId: APP_ID,
  appKey:APP_KEY
});

// 获取用户缓存
var currentUser = AV.User.current();
var crtUserId = currentUser.get("id");
// console.log(crtUserName);

// 获取位置
var geolocation = new BMap.Geolocation();

user_geo={
  latitude:0,
  longitude:0
}
geolocation.getCurrentPosition(function(r){
  if(this.getStatus() == BMAP_STATUS_SUCCESS){
    var mk = new BMap.Marker(r.point);
    user_geo.latitude=r.point.lat;
    user_geo.longitude=r.point.lng;
    getNearByItems(user_geo.latitude,user_geo.longitude);
    // alert('您的位置：'+user_geo.lng+','+user_geo.lat);
  }
  else {
    alert('failed'+this.getStatus());
  }        
},{enableHighAccuracy: true})

// 构造获取地理位置的函数
function getNearByItems(lat,lng){
  // 获取数据：
  var areaQuery = new AV.Query("Item");
  var point = new AV.GeoPoint(lat, lng);
  areaQuery.equalTo('Itemer', crtUserId);

  var typeQuery = new AV.Query("Item");
  typeQuery.greaterThan('submitType', 0);

  var query = AV.Query.and(areaQuery,typeQuery);  
  query.descending('createdAt');
  var ItemNum = 0;

  query.find({
    success: function(results) {
      console.log(results);
      // alert("Successfully retrieved " + results.length + " posts.");
    document.getElementById('Item-fluid').innerHTML = "";
      // 处理返回的结果数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];

      var attributes = object['attributes'];

      var id = object['id'];

      var title = attributes['title'];

      var address = attributes['address'];

      var geolng = attributes['geoPoint'].longitude;

      var geolat = attributes['geoPoint'].latitude;
      // 计算距离
      var point =  new AV.GeoPoint(user_geo.latitude,user_geo.longitude);

      var myPoint = new AV.GeoPoint({latitude:geolat,longitude:geolng});

      var distance = parseInt((myPoint.kilometersTo(point))*1000);
      
      var building = attributes['building'];

      var doorNum = attributes['doorNum'];

      var facility = attributes['facility'];

      var hostRate = attributes['hostRate'];

      var hostItem = attributes['hostItem'];

      var managerRate = attributes['managerRate'];

      var managerItem = attributes['managerItem'];

      var otherItem = attributes['otherItem'];

      ItemNum++;
      var item_setting = "";

      if(attributes['submitType']==1){
        item_setting="<a href=\"javascript:;\" class=\"item_setting item_delete\">删除</a>";
      }else{
        item_setting="<a href=\"javascript:;\" class=\"item_setting item_delete\">删除</a>"+
          "<a href=\"javascript:;\" class=\"item_setting item_publish\">发布</a>"+
          "<a href=\"javascript:;\" class=\"item_setting item_edit\">edit</a>";
      }

      document.getElementById('Item-fluid').innerHTML += 
        "<div class=\"widget-content nopadding control-group\" id=\"collapse"+ItemNum+"\">"+
          "<label class=\"control-label\">"+
            "<button class=\"show-map-btn btn btn-primary icon-map-marker\">"+distance+"m</button>"+
          "</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+title+"</span>"+
          "</div>"+
          "<label class=\"control-label\">地址：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+address+"</span>"+
          "</div>"+
          "<label class=\"control-label\">门牌号：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+building+doorNum+"</span>"+
          "</div>"+
          "<label class=\"control-label\">房东人品：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+hostRate+"分 描述："+hostItem+"</span>"+
          "</div>"+
          "<label class=\"control-label\">管理者人品：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+managerRate+"分 描述："+managerItem+"</span>"+
          "</div>"+
          "<label class=\"control-label\">房子设施：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+facility+"</span>"+
          "</div>"+
          "<label class=\"control-label\">其他补充：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+otherItem+"</span>"+
          "</div>"+
          "<div data="+id+">"+item_setting+"</div>"+
          "<input type=\"hidden\" class=\"geolng\" value=\""+geolng+"\"/>"+
          "<input type=\"hidden\" class=\"geolat\" value=\""+geolat+"\"/>"+
        "</div>";
    }
      // var data = results;

    // 为删除按钮添加事件
    $('.item_delete').click(function(){
      var cfirm = confirm("你确定要删除这条租评吗?");
      if(cfirm == true){
        var ItemId =$(this).parent().attr('data');
        var Item = AV.Object.createWithoutData('Item', ItemId);
        // 修改属性
        Item.set('submitType', 0);
        // 保存到云端
        var ItemArea = $(this).parent().parent();
        Item.save().then(function(success){
          // 删除成功
          ItemArea.remove();
          // alert("删除成功");
        }, function (error) {
          // 删除失败
          alert("delete failed")
        });
      }
    });

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
    var preBtnIndex = null;
    $(".show-map-btn").click(function(){
      var currentBtnIndex = $(this).index(".show-map-btn");
      var mainDiv = $(this).parent().parent();

      // alert(mainDiv);

      var thisLng = mainDiv.find("input.geolng");
      var thisLat = mainDiv.find("input.geolat");

      var thislngStr = thisLng.val();
      var thislatStr = thisLat.val();

      // alert(typeof(thislngStr));

      var map = new BMap.Map("allmap");
      map.enableScrollWheelZoom(true);
      var point = new BMap.Point(thislngStr,thislatStr);
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

      
      $("#selfMap").css({'visibility':'hidden'}); 
      // 优化地图显示隐藏。点击时如果地图正在打开，则判断地图显示的是不是正在查看的地点，是的话，收起地图；否则显示
      if($('#map-container').css("visibility")=='hidden'){
        $('#map-container').css({"visibility":"visible"});
      }else if(currentBtnIndex == preBtnIndex){
        $('#map-container').css({"visibility":"hidden"});
      }else{
        $('#map-container').css({"visibility":"visible"});
      }
      preBtnIndex = currentBtnIndex;
    });
  },

    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });  
}

function mapSizing(){
  $('#map-container').css({
    'position':'fixed',  
    "visibility":"hidden",
    'width':'500px',
    'height':$(window).height()-$('#navigator').height(),
    'top':$('#navigator').height(),
    'right':0,
    'z-index':'9999'
  });   
}

$(document).ready(function(){
  mapSizing();
});
$(document).resize(function(){
  mapSizing();
});