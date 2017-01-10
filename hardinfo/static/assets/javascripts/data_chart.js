function replaceStr(str){ // 正则法
  str = str.toLowerCase();
  var reg = /\b(\w)|\s(\w)|_(\w)/g; //  \b判断边界\s判断空格
  return str.replace(reg,function(m){
    return m.toUpperCase()
  });
}

function gen_div(step) {
  for(x of step){
    $('#content').append("<!--" + replaceStr(x) + "-->");
    $('#content').append("<div class=\"panel panel-primary\" id=\"i_" + x +"\"></div>");
    $('#i_'+x).append("<div class=\"panel-heading\" id=\"i_head_" + x + "\"></div>");
    $('#i_head_'+x).append("<h3 class=\"panel-title\">" + replaceStr(x) + "</h3>");
    $('#i_'+x).append("<div class=\"panel-body\" id=\"" + x + "_chart\"></div>");
  }
  $(".panel-heading").css('background','rgb(66,85,105)');
}
/***********DISK******************/
function disk_usage(disk, dd,label) {
  var ctx = document.getElementById(disk).getContext("2d");
  var data = {
    labels: label,
    datasets: [{
      data: dd,
      backgroundColor: [
        "#36A2EB",
        "#FF6384"
      ],
    }]
  };
  var mychart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
function add_disk_chart(num) {
  $("div#disk_chart").append("<div class=\"col-md-3\" id=\"disk_chart_" + num + "\"></div>");
  $("div#disk_chart_" + num).append("<canvas id=\"disk_usage" + num + "\" width=\"120\" height=\"150\"></canvas>");
}

function getDisk(url) {
  $.getJSON(url, function (ret) {
    for (var x = 0; x < ret['part_count']; x++) {
      var y = x.toString();
      add_disk_chart(y);
      free = Math.floor(ret['part_free' + y]);
      usage = Math.floor(ret['part_usage' + y]);
      dd = [free, usage];
      var f_unit = 'M',u_unit = 'M';
      if(free > 1000){
        free = (free / 1024).toFixed(2);
        f_unit = 'G';
      }
      if(usage > 1000){
        usage = (usage / 1024).toFixed(2);
        u_unit = 'G';
      }
      label = ["Free: "+free+f_unit,"Usage: "+usage+u_unit]
      disk_usage("disk_usage" + y, dd,label);
    }
  })
}

/*************CPU************************/
function add_cpu_chart() {
  $("div#cpu_chart").append("<canvas id=\"cpu_usage\" width=\"500\" height=\"120\"></canvas>");
}

function cpu_usage(clabel,cdata,color) {
  var ctx = document.getElementById("cpu_usage").getContext("2d");
  var data = {
    labels:clabel,
    datasets: [{
      label:"CPU Usage",
      data: cdata,
      borderWidth:1,
      backgroundColor: color,
      borderColor:color
    }]
  };
  var mychart = new Chart(ctx, {
    type: 'horizontalBar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales:{
        xAxes:[{
          stacked:true,
          ticks:{
            max:100,
            min:0,
            stepSize:10
          }
        }],
        yAxes:[{
          stacked:true,
          barPercentage:20
        }]
      }
    }
  });
}

function getCpu(url) {
  $.getJSON(url,function (ret) {
    var label = [],data=[];
    for(var i=0;i<ret['count'];i++){
      console.log(ret['cpu'+i]);
      label.push("cpu"+i);
      data.push(ret['cpu'+i]);
    }
    cpu_usage(label,data,[])
  })
}
/***********Time************/
function covtime(mss) {
  var days = mss / (1000 * 60 * 60 * 24);
  var hours = (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  var minutes = (mss % (1000 * 60 * 60)) / (1000 * 60);
  var seconds = (mss % (1000 * 60)) / 1000;
  return {'day':Math.floor(days),'hour':Math.floor(hours),'min':Math.floor(minutes),'sec':Math.floor(seconds)};
}
function add_boot_time() {
  $('#boot_time_chart').append("<p class=\"lead\" id=\"p_boot_time\"></p>");
  $('#boot_time_chart').append("<p class=\"lead\" id=\"p_run_time\">已经运行时间:0天0小时0分钟0秒</p>");
}
function getBtime(url) {
  add_boot_time();
  $.getJSON(url,function (ret) {
    var ntime = new Date(ret['mic']);
    $('p#p_boot_time').text("启动时间:"+ntime.toLocaleString());
    window.setInterval(function () {
      var now = new Date();
      $('#top_time').text(now.toLocaleString());
      var t = now.getTime();
      var cha = t - ret['mic'];
      var cc = covtime(cha);
      $('p#p_run_time').text("已经运行时间:" + cc.day + "天" + cc.hour + "小时" + cc.min + "分钟" + cc.sec + "秒");
    },1000)
  })
}
/************Mem****************/
function add_mem_chart() {
  $("div#mem_chart").append("<canvas id=\"mem_usage\" width=\"200\" height=\"150\"></canvas>");
}
function mem_usage(data,label) {
  var ctx = document.getElementById("mem_usage").getContext("2d");
  var data = {
    labels: label,
    datasets: [{
      data: data,
      backgroundColor: [
        "#4BC0C0",
        "#FF6384"
      ]
    }],
  };
  var mychart = new Chart(ctx,{
    type:"pie",
    data:data,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
function getMem(url) {
  add_mem_chart();
  $.getJSON(url,function (ret) {
    free = ret['free'].toFixed(2);
    usage = ret['usage'].toFixed(2);
    label = ['Free: '+free+'M','Usage: '+usage+'M'];
    data = [free,usage];
    mem_usage(data,label);
  })
}