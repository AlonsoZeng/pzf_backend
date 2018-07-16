// leancloud初始化 
var APP_ID = 'CAxAvV51Ux5axTS0RcBtoOb1-gzGzoHsz';
var APP_KEY = 'w8TTlyjgG30TCq5jpqWaQPg8';
AV.init({
  appId: APP_ID,
  appKey:APP_KEY
});

// 获取用户缓存
var currentUser = AV.User.current();

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
    getNearByComments(user_geo.latitude,user_geo.longitude);
    // alert('您的位置：'+user_geo.lng+','+user_geo.lat);
  }
  else {
    alert('failed'+this.getStatus());
  }        
},{enableHighAccuracy: true})

//获取url中的参数
function getUrlParam(name) {
 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
 var r = window.location.search.substr(1).match(reg); //匹配目标参数
 if (r != null) return unescape(r[2]); return null; //返回参数值
}

// 构造获取地理位置的函数
function getNearByComments(lat,lng){
  // 获取数据：
  var idParam = getUrlParam("id");  
  var query = new AV.Query("Item");
  var point = new AV.Item(lat, lng);
  query.equalTo('poi_uid', idParam);
  query.withinKilometers('Item', point, 100.0);
  // query.find().then(function (results) {
  //     var nearbyTodos = results;
  // }, function (error) {
  // });
  var commentNum = 0;

  query.find({
    success: function(results) {
      console.log(results);
      // alert("Successfully retrieved " + results.length + " posts.");
    document.getElementById('comment-fluid').innerHTML = "";
      // 处理返回的结果数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];

      var attributes = object['attributes'];

      var id = object['id'];

      var title = attributes['title'];

      var address = attributes['address'];

      var geolng = attributes['Item'].longitude;

      var geolat = attributes['Item'].latitude;
      // 计算距离
      var point =  new AV.Item(user_geo.latitude,user_geo.longitude);

      var myPoint = new AV.Item({latitude:geolat,longitude:geolng});

      var distance = parseInt((myPoint.kilometersTo(point))*1000);
      
      var building = attributes['building'];

      var doorNum = attributes['doorNum'];

      var facility = attributes['facility'];

      var hostRate = attributes['hostRate'];

      var hostComment = attributes['hostComment'];

      var managerRate = attributes['managerRate'];

      var managerComment = attributes['managerComment'];

      var otherComment = attributes['otherComment'];

      commentNum++;

      // alert(results[i].id);
      // alert(object.id + ' - ' + object.get('address'));

      // var html = template('comments', data);
      document.getElementById('comment-fluid').innerHTML += 
        "<div class=\"widget-content nopadding control-group\" id=\"collapse"+commentNum+"\">"+
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
            "<span class=\"user-info\">"+hostRate+"分 描述："+hostComment+"</span>"+
          "</div>"+
          "<label class=\"control-label\">管理者人品：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+managerRate+"分 描述："+managerComment+"</span>"+
          "</div>"+
          "<label class=\"control-label\">房子设施：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+facility+"</span>"+
          "</div>"+
          "<label class=\"control-label\">其他补充：</label>"+
          "<div class=\"controls\">"+
            "<span class=\"user-info\">"+otherComment+"</span>"+
          "</div>"+
          "<input type=\"hidden\" class=\"geolng\" value=\""+geolng+"\"/>"+
          "<input type=\"hidden\" class=\"geolat\" value=\""+geolat+"\"/>"+          
        "</div>";
    }
      // var data = results;

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

