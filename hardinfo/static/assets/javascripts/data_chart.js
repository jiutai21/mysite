function replaceStr(str) { // 正则法
  str = str.toLowerCase();
  var reg = /\b(\w)|\s(\w)|_(\w)/g; //  \b判断边界\s判断空格
  return str.replace(reg, function (m) {
    return m.toUpperCase()
  });
}

function gen_div(step) {
  for (x of step) {
    $('#content').append("<!--" + replaceStr(x) + "-->");
    $('#content').append("<div class=\"panel panel-primary\" id=\"i_" + x + "\"></div>");
    $('#i_' + x).append("<div class=\"panel-heading\" id=\"i_head_" + x + "\"></div>");
    $('#i_head_' + x).append("<h3 class=\"panel-title\">" + replaceStr(x) + "</h3>");
    $('#i_' + x).append("<div class=\"panel-body\" id=\"" + x + "_chart\"></div>");
  }
  $(".panel-heading").css('background', 'rgb(66,85,105)');
}
/***********DISK******************/
function disk_usage(disk, dd, label) {
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
function add_disk_chart(num, part) {
  $("div#disk_chart").append("<div class=\"col-md-3\" id=\"disk_chart_c" + num + "\"></div>");
  $("div#disk_chart_c" + num).append("<h3 style='text-align: center;'><i class='icon-hdd'></i> " + part + "</h3>");
  $("div#disk_chart_c" + num).append("<div id=\"disk_chart_" + num + "\"></div>");
  $("div#disk_chart_" + num).append("<canvas id=\"disk_usage" + num + "\" width=\"120\" height=\"150\"></canvas>");
}

function getDisk(url) {
  $.getJSON(url, function (ret) {
    for (var x = 0; x < ret['part_count']; x++) {
      add_disk_chart(x, ret['part' + x]);
      free = Math.floor(ret['part_free' + x]);
      usage = Math.floor(ret['part_usage' + x]);
      dd = [free, usage];
      var f_unit = 'M', u_unit = 'M';
      if (free > 1000) {
        free = (free / 1024).toFixed(2);
        f_unit = 'G';
      }
      if (usage > 1000) {
        usage = (usage / 1024).toFixed(2);
        u_unit = 'G';
      }
      label = ["Free: " + free + f_unit, "Usage: " + usage + u_unit]
      disk_usage("disk_usage" + x, dd, label);
    }
  })
}

/*************CPU************************/
function add_cpu_chart() {
  $("div#cpu_chart").append("<canvas id=\"cpu_usage\" width=\"500\" height=\"120\"></canvas>");
}

function cpu_usage(clabel, cdata, color) {
  var ctx = document.getElementById("cpu_usage").getContext("2d");
  var data = {
    labels: clabel,
    datasets: [{
      label: "CPU Usage",
      data: cdata,
      borderWidth: 1,
      backgroundColor: color,
      borderColor: color
    }]
  };
  var mychart = new Chart(ctx, {
    type: 'horizontalBar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            max: 100,
            min: 0,
            stepSize: 10
          }
        }],
        yAxes: [{
          stacked: true,
          barPercentage: 20
        }]
      }
    }
  });
}

function getCpu(url) {
  window.setInterval(function () {
    $.getJSON(url, function (ret) {
      var label = [], data = [];
      for (var i = 0; i < ret['count']; i++) {
        // console.log(ret['cpu' + i]);
        label.push("cpu" + i);
        data.push(ret['cpu' + i]);
      }
      cpu_usage(label, data, [])
    })
  }, 1000)
}
/***********Time************/
function covtime(mss) {
  var days = mss / (1000 * 60 * 60 * 24);
  var hours = (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  var minutes = (mss % (1000 * 60 * 60)) / (1000 * 60);
  var seconds = (mss % (1000 * 60)) / 1000;
  return {'day': Math.floor(days), 'hour': Math.floor(hours), 'min': Math.floor(minutes), 'sec': Math.floor(seconds)};
}
function add_boot_time() {
  $('#boot_time_chart').append("<p class=\"lead\" id=\"p_boot_time\"></p>");
  $('#boot_time_chart').append("<p class=\"lead\" id=\"p_run_time\">已经运行时间:0天0小时0分钟0秒</p>");
}
function getBtime(url) {
  add_boot_time();
  $.getJSON(url, function (ret) {
    var ntime = new Date(ret['mic']);
    $('p#p_boot_time').text("启动时间:" + ntime.toLocaleString());
    window.setInterval(function () {
      var now = getNowTime();
      var t = now.getTime();
      var cha = t - ret['mic'];
      var cc = covtime(cha);
      $('p#p_run_time').text("已经运行时间:" + cc.day + "天" + cc.hour + "小时" + cc.min + "分钟" + cc.sec + "秒");
    }, 1000)
  })
}
function getNowTime() {
  var now = new Date();
  $('#top_time').text(now.toLocaleString());
  return now;
}
/************Mem****************/
function add_mem_chart() {
  $("div#mem_chart").append("<canvas id=\"mem_usage\" width=\"200\" height=\"150\"></canvas>");
}
function mem_usage(data, label) {
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
  var mychart = new Chart(ctx, {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
function getMem(url) {
  add_mem_chart();
  $.getJSON(url, function (ret) {
    free = ret['free'].toFixed(2);
    usage = ret['usage'].toFixed(2);
    label = ['Free: ' + free + 'M', 'Usage: ' + usage + 'M'];
    data = [free, usage];
    mem_usage(data, label);
  })
}
/**********Net IO*******************/
function add_net_chart(x) {
  var la = new Array();
  for (var i = 0; i < 61; i++) {
    if (!(i % 2))
      la.push(i);
  }
  var ctx = document.getElementById(x + '_usage').getContext("2d");
  var data = {
    labels: la,
    datasets: [
      {
        label: "Download speed",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      },
      {
        label: "Upload speed",
        fill: false,
        backgroundColor: "rgba(73,92,133,0.4)",
        borderColor: "rgba(73,92,133,0.4)",
        pointRadius: 1,
        pointHitRadius: 10,
        data: []
      }
    ]
  };
  var scatterChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          stacked: true,
          ticks: {
            max: 200,
            min: 0,
            stepSize: 20
          }
        }]
      }
    }
  });
  return scatterChart;
}
function genTab(tab) {
  $('#net_chart').append("<div class=\"tabbable\" id=\"tabs_eth\"></div>");
  $('#tabs_eth').append("<ul class=\"nav nav-tabs\" id=\"nav_tab_eth\"></ul>");
  $('#tabs_eth').append("<div class=\"tab-content\" id=\"tab_content_eth\"></div>");

  for (x of tab) {
    $('#nav_tab_eth').append("<li id=\"li_tab_" + x + "\"></li>");
    $('#li_tab_' + x).append("<a href=\"#tab_panel_" + x + "\" data-toggle=\"tab\">" + x + "</a>");

    $('#tab_content_eth').append("<div class=\"tab-pane\" id=\"tab_panel_" + x + "\" style='height: 220px'></div>");
    $('#tab_panel_' + x).append("<canvas id=\"" + x + "_usage\" width=\"600\" height=\"200\"></canvas>");
  }
  $("#li_tab_"+tab[0]).attr("class");
  $("#li_tab_"+tab[0]).attr("class","active");
  var li = $("#tab_panel_"+tab[0]).attr("class");
  $("#tab_panel_"+tab[0]).attr("class",li + "active");
}
function getNetTab(url) {
  $.getJSON(url, function (ret) {
    genTab(ret['eth']);
  })
}
function getNetIO(url) {
  var chart_arr = new Array();
  $.getJSON(url, function (ret) {
    for (var x of ret.eth) {
      chart_arr[x] = add_net_chart(x);
    }
    window.setInterval(function () {
      $.getJSON(url, function (ret) {
        for (var x of ret.eth) {
          chart_arr[x].data.datasets[0].data.push(ret.recv[x]);
          chart_arr[x].data.datasets[1].data.push(ret.sent[x]);
          chart_arr[x].update();
        }
      })
    }, 1000)
  })
}
/********Hard Info**********/
function gen_table(step) {
  var len = arguments.length;
  var arg="";
  if(len == 1){
    var pro = "属性";
    var deta = "详细内容";
  }else{
    var pro = arguments[1];
    var deta = arguments[2];
  }
  if(arguments[3]){
    arg = arguments[3];
  }
  console.log(step);
  for(x of step){
    $("#"+x+"_chart").append("<table class='table table-bordered' id='table_"+x+"'></table>" );
    $("#table_"+x).append("<thead id='thead_"+x+"'></thead>");
    $("#thead_"+x).append("<tr><th>" + pro + "</th><th>" +deta+"</th>" + arg +"</tr>");
    $("#table_"+x).append("<tbody id='tbody_"+x+"'></tbody>");
  }
}
function gen_property(step,property,details) {
  $("#tbody_"+step).append("<tr><td>"+property+"</td><td>"+details+"</td></tr>");
}

function get_info(url,info,step) {
  $.getJSON(url,info,function (ret) {
    for(var x in ret){
      gen_property(step,x,ret[x]);
    }
  })
}

function gen_info(url,step) {
  for(var x of step){
    get_info(url,'p=' + x,x);
  }
}

/********Process**************/
function getProcess(url,step) {
  $.getJSON(url,function (ret) {
    for(var x in ret){
      gen_property(step,x,ret[x]);
    }
  })

  var th = $('#thead_process').find("th");
  th[0].id = "th_id_01";
  th[1].id = "th_id_02";

  $('#th_id_01').css("padding","0");
  $('#th_id_02').css("padding","0");

  set_button(url,step);
}
function set_button(url,step) {
  $('#th_id_01').click(function () {
    $.getJSON(url,function (ret) {
      $("#tbody_process").empty();
      for(var x in ret){
        gen_property(step,x,ret[x]);
      }
    })
  });
  $('#th_id_02').click(function () {
    $.getJSON(url,function (ret) {
      $("#tbody_process").empty();
      var arr = new Array();
      var name = new Array();
      for(var x in ret){
        arr[ret[x]]=x;
        name.push(ret[x]);
      }
      name.sort(function (a, b) {
//        c = a.replace(/\/.*\//,"");
//        d = b.replace(/\/.*\//,"");
        if(a.substring(0,1).toLowerCase() > b.substring(0,1).toLowerCase()){
          return 1;
        }
        return -1;
      });

      for(var x of name){
        gen_property(step,arr[x],x);
      }
    })
  });
}