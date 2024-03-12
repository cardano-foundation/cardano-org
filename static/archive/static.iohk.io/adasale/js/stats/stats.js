
var adas_main_arr = new Array();
var adas_tranches_arr = new Array();
var adas_prices_arr = new Array();
var adas_owners_arr = new Array();
var adas_timeline_arr = new Array();
var adas_size_arr = new Array();
var adas_inequality_arr = new Array();



var col_switcher = new Array();
col_switcher['subject'] = 'Tickets';
col_switcher['by'] = 'Tranche';
col_switcher['currency'] = 'BTC';

var adas_keywords = new Object();
adas_keywords['en-US'] = new Object();
adas_keywords['en-US']['tickets'] = 'Tickets';
adas_keywords['en-US']['buyers'] = 'Ada voucher holders';
adas_keywords['en-US']['ada-voucher-holders'] = 'Ada voucher holders';
adas_keywords['en-US']['distributor'] = 'Distributors';
adas_keywords['en-US']['per-ticket'] = 'Per ticket';
adas_keywords['en-US']['per-ada-voucher-holder'] = 'Per Ada voucher holder';
adas_keywords['en-US']['tranche'] = 'Tranche';
adas_keywords['en-US']['tranche-1'] = 'Tranche 1';
adas_keywords['en-US']['tranche-2'] = 'Tranche 2';
adas_keywords['en-US']['tranche-3'] = 'Tranche 3';
adas_keywords['en-US']['tranche-4'] = 'Tranche 4';
adas_keywords['en-US']['all-tranches'] = 'All Tranches';
adas_keywords['en-US']['region'] = 'Region';
adas_keywords['en-US']['currency'] = 'Currency';
adas_keywords['en-US']['view'] = 'View';
adas_keywords['en-US']['count'] = 'Count';
adas_keywords['en-US']['amount'] = 'Amount';
adas_keywords['en-US']['median'] = 'Median';
adas_keywords['en-US']['mean'] = 'Mean';
adas_keywords['en-US']['min'] = 'Min';
adas_keywords['en-US']['max'] = 'Max';
adas_keywords['en-US']['all'] = 'All';
adas_keywords['en-US']['sum'] = 'Sum';
adas_keywords['en-US']['average'] = 'Average';
adas_keywords['en-US']['daily'] = 'Daily';
adas_keywords['en-US']['cumulative'] = 'Cumulative';
adas_keywords['en-US']['thin'] = 'Thin';
adas_keywords['en-US']['normal'] = 'Normal';
adas_keywords['en-US']['strong'] = 'Strong';
adas_keywords['en-US']['bold'] = 'Bold';


adas_keywords['en-US']['percent'] = 'Percent';
adas_keywords['en-US']['personal'] = 'Personal';
adas_keywords['en-US']['company'] = 'Company';
adas_keywords['en-US']['user-type'] = 'User type';
adas_keywords['en-US']['btc'] = 'BTC';
adas_keywords['en-US']['usd'] = 'USD';
adas_keywords['en-US']['ada'] = 'ADA';

adas_keywords['en-US']['japan'] = 'Japan';
adas_keywords['en-US']['other-south-korea-malaysia-'] = 'Other (South Korea, Malaysia)';
adas_keywords['en-US']['other-thailand-taiwan-malaysia-philippines-'] = 'Other (Thailand, Taiwan, Malaysia, Philippines)';
adas_keywords['en-US']['south-korea'] = 'South Korea';
adas_keywords['en-US']['china'] = 'China';
adas_keywords['en-US']['thailand'] = 'Thailand';
adas_keywords['en-US']['other-malaysia-vietnam-'] = 'Other (Malaysia, Vietnam)';
adas_keywords['en-US']['korea'] = 'Korea';
adas_keywords['en-US']['thailand-myanmar-vietnam-philipines-thaiwan'] = 'Thailand, Myanmar, Vietnam, Philipines, Thaiwan';

adas_keywords['en-US']['personal-20-29'] = 'Personal (20-29)';
adas_keywords['en-US']['personal-30-39'] = 'Personal (30-39)';
adas_keywords['en-US']['personal-40-49'] = 'Personal (40-49)';
adas_keywords['en-US']['personal-50-59'] = 'Personal (50-59)';
adas_keywords['en-US']['personal-60-69'] = 'Personal (60-69)';
adas_keywords['en-US']['personal-70'] = 'Personal (70+)';
adas_keywords['en-US']['personal-all'] = 'Personal (All)';
adas_keywords['en-US']['company-all'] = 'Company (All)';









adas_keywords['ja'] = new Object();
adas_keywords['ja']['tickets'] = 'チケット';
adas_keywords['ja']['buyers'] = 'Adaバウチャー所有者';
adas_keywords['ja']['ada-voucher-holders'] = 'Adaバウチャー所有者';
adas_keywords['ja']['distributor'] = '代理店';
adas_keywords['ja']['per-ticket'] = 'チケット毎';
adas_keywords['ja']['per-ada-voucher-holder'] = 'Adaバウチャー所有者毎';
adas_keywords['ja']['tranche'] = 'トランシェ';
adas_keywords['ja']['tranche-1'] = 'トランシェ1';
adas_keywords['ja']['tranche-2'] = 'トランシェ2';
adas_keywords['ja']['tranche-3'] = 'トランシェ3';
adas_keywords['ja']['tranche-4'] = 'トランシェ4';
adas_keywords['ja']['all-tranches'] = 'すべてのトランシェ';
adas_keywords['ja']['region'] = '領域';
adas_keywords['ja']['currency'] = '通貨';
adas_keywords['ja']['view'] = 'ビュー';
adas_keywords['ja']['count'] = 'カウント';
adas_keywords['ja']['amount'] = '量';
adas_keywords['ja']['median'] = '中央値';
adas_keywords['ja']['mean'] = '平均';
adas_keywords['ja']['min'] = '分';
adas_keywords['ja']['max'] = '最大';
adas_keywords['ja']['all'] = 'すべて';
adas_keywords['ja']['sum'] = '和';
adas_keywords['ja']['average'] = '平均';
adas_keywords['ja']['percent'] = 'パーセント';
adas_keywords['ja']['personal'] = 'パーソナル';
adas_keywords['ja']['company'] = '会社';
adas_keywords['ja']['user-type'] = 'ユーザータイプ';
adas_keywords['ja']['btc'] = 'BTC';
adas_keywords['ja']['usd'] = 'USD';
adas_keywords['ja']['ada'] = 'ADA';

adas_keywords['ja']['daily'] = '毎日';
adas_keywords['ja']['cumulative'] = '累積的な';
adas_keywords['ja']['thin'] = '薄いです';
adas_keywords['ja']['normal'] = '正常';
adas_keywords['ja']['strong'] = '強い';
adas_keywords['ja']['bold'] = '大胆な';

adas_keywords['ja']['japan'] = '日本';
adas_keywords['ja']['other-south-korea-malaysia-'] = 'その他（韓国、マレーシア）';
adas_keywords['ja']['other-thailand-taiwan-malaysia-philippines-'] = 'その他（タイ、台湾、マレーシア、フィリピン）';
adas_keywords['ja']['south-korea'] = '韓国';
adas_keywords['ja']['china'] = '中国';
adas_keywords['ja']['thailand'] = 'タイ';
adas_keywords['ja']['other-malaysia-vietnam-'] = 'その他（マレーシア、ベトナム）';
adas_keywords['ja']['korea'] = '韓国';
adas_keywords['ja']['thailand-myanmar-vietnam-philipines-thaiwan'] = 'タイ、ミャンマー、ベトナム、フィリピン、台湾';

adas_keywords['ja']['personal-nbsp-20-29-'] = 'パーソナル (20-29)';
adas_keywords['ja']['personal-nbsp-30-39-'] = 'パーソナル (30-39)';
adas_keywords['ja']['personal-nbsp-40-49-'] = 'パーソナル (40-49)';
adas_keywords['ja']['personal-nbsp-50-59-'] = 'パーソナル (50-59)';
adas_keywords['ja']['personal-nbsp-60-69-'] = 'パーソナル (60-69)';
adas_keywords['ja']['personal-nbsp-70-'] = 'パーソナル (70+)';
adas_keywords['ja']['personal-nbsp-all-'] = 'パーソナル (All)';
adas_keywords['ja']['company-nbsp-all-'] = '会社 (All)';



adas_keywords['zh-CN'] = new Object();
adas_keywords['zh-CN']['tickets'] = '单笔交易';
adas_keywords['zh-CN']['ada-voucher-holders'] = 'Ada凭证持有者';
adas_keywords['zh-CN']['buyers'] = 'Ada凭证持有者';
adas_keywords['zh-CN']['distributor'] = '分销商';
adas_keywords['zh-CN']['per-ticket'] = '单笔交易';
adas_keywords['zh-CN']['per-ada-voucher-holder'] = '单一Ada凭证持有者';
adas_keywords['zh-CN']['tranche'] = '分期';
adas_keywords['zh-CN']['tranche-1'] = '第1期';
adas_keywords['zh-CN']['tranche-2'] = '第2期';
adas_keywords['zh-CN']['tranche-3'] = '第3期';
adas_keywords['zh-CN']['tranche-4'] = '第4期';
adas_keywords['zh-CN']['all-tranches'] = '所有分期';
adas_keywords['zh-CN']['region'] = '区域';
adas_keywords['zh-CN']['currency'] = '货币';
adas_keywords['zh-CN']['view'] = '查看';
adas_keywords['zh-CN']['count'] = '数量';
adas_keywords['zh-CN']['amount'] = '数量';
adas_keywords['zh-CN']['median'] = '中值';
adas_keywords['zh-CN']['mean'] = '平均数';
adas_keywords['zh-CN']['min'] = '最小值';
adas_keywords['zh-CN']['max'] = '最大值';
adas_keywords['zh-CN']['all'] = '总数';
adas_keywords['zh-CN']['sum'] = '总和';
adas_keywords['zh-CN']['average'] = '平均';
adas_keywords['zh-CN']['percent'] = '百分比';
adas_keywords['zh-CN']['personal'] = '个人';
adas_keywords['zh-CN']['company'] = '公司';
adas_keywords['zh-CN']['user-type'] = '持有者类别';
adas_keywords['zh-CN']['btc'] = 'BTC';
adas_keywords['zh-CN']['usd'] = 'USD';
adas_keywords['zh-CN']['ada'] = 'ADA';

adas_keywords['zh-CN']['daily'] = '日常';
adas_keywords['zh-CN']['cumulative'] = '累积的';
adas_keywords['zh-CN']['thin'] = '瘦';
adas_keywords['zh-CN']['normal'] = '正常';
adas_keywords['zh-CN']['strong'] = '强大';
adas_keywords['zh-CN']['bold'] = '胆大';


adas_keywords['zh-CN']['japan'] = '日本';
adas_keywords['zh-CN']['other-south-korea-malaysia-'] = '其它(南韩、马来西亚)';
adas_keywords['zh-CN']['other-thailand-taiwan-malaysia-philippines-'] = '其它(泰国、台湾、马来西亚、菲律宾)';
adas_keywords['zh-CN']['south-korea'] = '南韩';
adas_keywords['zh-CN']['china'] = '中国';
adas_keywords['zh-CN']['thailand'] = '泰国';
adas_keywords['zh-CN']['other-malaysia-vietnam-'] = '其它(马来西亚、越南)';
adas_keywords['zh-CN']['korea'] = '南韩';
adas_keywords['zh-CN']['thailand-myanmar-vietnam-philipines-thaiwan'] = '泰国，缅甸，越南，菲律宾，台湾';

adas_keywords['zh-CN']['personal-nbsp-20-29-'] = '个人 (20-29)';
adas_keywords['zh-CN']['personal-nbsp-30-39-'] = '个人 (30-39)';
adas_keywords['zh-CN']['personal-nbsp-40-49-'] = '个人 (40-49)';
adas_keywords['zh-CN']['personal-nbsp-50-59-'] = '个人 (50-59)';
adas_keywords['zh-CN']['personal-nbsp-60-69-'] = '个人 (60-69)';
adas_keywords['zh-CN']['personal-nbsp-70-'] = '个人 (70+)';
adas_keywords['zh-CN']['personal-nbsp-all-'] = '个人 (总数)';
adas_keywords['zh-CN']['company-nbsp-all-'] = '公司 (总数)';





/*
var out = 'Early Development';
if(lang == 'ja'){ out = '初期開発';  }
if(lang == 'zh-CN'){ out = '早期发展';  }
if(lang == 'kr'){ out = '초기 개발';  }*/
var lang = jQuery("#lang_meta").attr('content');

var color_swatches = ["#3c5cb7","#2bba68","#679afd","#e4605e","#832cc3", "#e6a900", "#ea2256", "#514A68","#5E2D4D", "#31854C", "#273849", "#494C58","#273844", "#414A58","#2E2D3D", "#31454C", "#273849", "#494C58","#273849"];
var months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
var months_ja = ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
var months_zh = ["","一月","二月","游行","四月","可能","六月","七月","八月","九月","十月","十一月","十二月"];

function adas_unwrap_brackets(val){
  return val.substr(1,val.length-3);
}

function adas_unwrap_brackets_prc(val){
  return val.substr(1,val.length-4);
}

function adas_class_toggle(cls,tgl) {
    jQuery(cls).toggleClass(tgl);
}

function adas_add_zero(val){
  if(val < 10){
    return '0'+val;
  }else{
    return val;
  }
}

function adas_keywords_fun(val){
  if(lang == undefined){
    lang = 'en-US';
  }
  if(adas_keywords[lang][adas_slug(val)] != undefined){
    return adas_keywords[lang][adas_slug(val)];
  }else{
    return val;
  }
}


function adas_date_format(dat) {
  var formated = dat.split('-');
  var out = formated[2]+'. '+months[formated[1]]+' '+formated[0];

  if(lang == 'ja' || lang == 'zh-CN'){
    out = formated[0]*1+'年'+formated[2]*1+'月'+formated[1]*1+'日';
  }

  return out;
}

function adas_commas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function adas_slug(str) {
    var re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric
    var re2 = /^-*|-*jQuery/g;     // get rid of any leading/trailing dashes
    str = str.replace(re, '-');  // perform the 1st regexp
    return str.replace(re2, '').toLowerCase(); // ..aaand the second + return lowercased result
}

function adas_pie(inner,radius,colors,arr){
  return '\
  <span class="nodesktop"><span data-peity=\'{ "fill": ['+colors+'], "innerRadius": '+(inner/3)+', "radius": '+(radius/3)+' }\' class="pie">'+arr.join(',')+'</span></span>\
  <span class="nomobile"><span data-peity=\'{ "fill": ['+colors+'], "innerRadius": '+inner+', "radius": '+radius+' }\' class="pie">'+arr.join(',')+'</span></span>\
  ';
}



/*
//////////////////////////////////////////////////////////////////////////////////////////
MAIN
//////////////////////////////////////////////////////////////////////////////////////////
*/




function adas_main_col_arr(key){
  var out_arr = [];
  for(var i = 0;i < adas_main_arr.length;i++){
    if(key == 'subject'){
      if(jQuery.inArray(adas_main_arr[i].gsx$subject.$t,out_arr) == -1){
        out_arr.push(adas_main_arr[i].gsx$subject.$t);
      }
    }
    if(key == 'by'){
      if(col_switcher['subject'] == adas_main_arr[i].gsx$subject.$t){
        if(jQuery.inArray(adas_main_arr[i].gsx$by.$t,out_arr) == -1){
          out_arr.push(adas_main_arr[i].gsx$by.$t);
        }
      }
    }
    if(key == 'view'){
      if(jQuery.inArray(adas_main_arr[i].gsx$view.$t,out_arr) == -1){
        out_arr.push(adas_main_arr[i].gsx$view.$t);
      }
    }
    if(key == 'count'){
      if(jQuery.inArray(adas_main_arr[i].gsx$count.$t,out_arr) == -1){
        out_arr.push(adas_main_arr[i].gsx$count.$t);
      }
    }
  }
  return out_arr;
}

function adas_main_col_switcher(key){
  var col_arr = adas_main_col_arr(key);
  var out_arr = [];
  for(var i = 0;i < col_arr.length;i++){
    if(col_arr[i]){
      if(col_arr[i] != 'All'){
        var active = '';
        if(col_switcher[key] == col_arr[i]){
          active = 'active';
        }
        var tit = col_arr[i];
        if(col_arr[i] == 'Buyers'){
          tit = 'Ada voucher holders';
        }
        out_arr.push('<button type="button" class="btn btn-default '+key+' '+active+'" onclick="adas_main_set_current(this,\''+key+'\')" rel="'+tit+'">'+adas_keywords_fun(tit)+'</button>');
      }
    }
  }
  var size_cls = 'btn-group-xs';
  if(key == 'subject'){
    size_cls = '';
  }
  var out = '\
  <div class="btn-group '+size_cls+'" role="group" aria-label="'+key+'">\
  '+out_arr.join('')+'\
  </div>\
  ';

  return out;
}

function adas_main_set_current(what,varval){
  var val = jQuery(what).attr('rel');
  if(val == 'Ada voucher holders'){
    val = 'Buyers'
  }
  if(val == 'Distributors'){
    val = 'Distributor'
  }
  col_switcher[varval] = val;

  //jQuery(".salestats.main ."+varval).removeClass('active');
  jQuery(what).parent().find('.active').removeClass('active');
  jQuery(what).addClass('active');
  jQuery(".salestats.main").attr('class','salestats main');



  if(varval == 'subject'){
    if(val == 'Buyers'){
      col_switcher['by'] = 'Region';
    }else{
      col_switcher['by'] = 'Tranche';
    }
  }

  if(col_switcher['subject'] == 'Distributor'){
    col_switcher['currency'] = 'BTC';
    //jQuery(".salestats.main .panel-load").attr('class','panel-load distributor');
    jQuery(".salestats.main").attr('class','salestats main distributor');
  }
  //console.log(val+''+varval);
  //jQuery(".salestats.main .panel-load").addClass('active');
  adas_main_load();
}


function adas_main_small_label(str){
  if(str.length > 25){
    if(lang == 'eu-US'){
      return '<span class="small">'+str+'</span>';
    }else{
      return str;
    }
  }else{
    return str;
  }
}

function adas_main_unwrap_and_pie(val,inner, outer){
  return adas_main_pie(val,inner, outer)+' <span>'+val.substr(1,val.length-2)+'</span> ';
}

function adas_main_pie(val,inner, outer){
  var num = val.substr(1,val.length-3);
  return '<span data-peity=\'{ "fill": ["#eeeeee", "rgba(200,200,200,0.3)"], "innerRadius": '+inner+', "radius": '+outer+' }\' class="pie">'+num+'/100</span>';
}


function adas_main_big_pie(tit,arr,inner,radius,colors_arr,symbol){
  var title = '';
  var pie = '';
  var legend = '';
  var data_arr = new Array();
  var total = 0;
  for(var i = 0;i < arr.length;i++){
    total += arr[i]['val']*1;
  }
  for(var i = 0;i < arr.length;i++){
    data_arr.push(arr[i]['val']);
    //console.log(arr[i]['prc']);
    var prc = (arr[i]['val']*1)/(total/100);

    legend += ' <li class="part" style="border-color:'+colors_arr[i]+'"><b>'+adas_keywords_fun(arr[i]['tit'])+'</b> - '+symbol+' <strong>'+arr[i]['val']+'</strong> - '+prc.toString().substr(0,4)+'%</li> ';
  }
  var colors = '"'+colors_arr.join('", "')+'"';

  pie = adas_pie(inner,radius,colors,data_arr);
  legend = '<ul class="legend">'+legend+'</ul>';


  title = '<h4>'+adas_keywords_fun(tit)+'</h4>';
  return '<span class="chart">'+title+pie+legend+'</span>';
}



function adas_main_row(view,count,countpercent,btcmedian,btcmean,btcmax,btcmin,btcsum,btcpercent,currency,rowclass,count_icn){
  var out = '<tr class="'+rowclass+'">\
    <td width="12%">'+adas_keywords_fun(adas_main_small_label(view))+'</td><td width="11%">'+count_icn+'&nbsp;'+count+'</td>\
    <td width="11%">'+currency+'&nbsp;'+btcmedian+'</td><td width="11%">'+currency+'&nbsp;'+btcmean+'</td><td width="11%">'+currency+'&nbsp;'+btcmin+'</td><td width="11%">'+currency+'&nbsp;'+btcmax+'</td>\
    <td width="11%">'+currency+'&nbsp;'+btcsum+'</td>\
    </tr>';
    return out;
}


function adas_main_load_items(){
  var out = '';

  var pie_count = '';
  var pie_sum = '';
  var pie_count_arr = new Array();
  var pie_sum_arr = new Array();

  for(var i = 0;i < adas_main_arr.length;i++){
    var count_icon = '<em class="fa fa-user"></em>';
    if(col_switcher['subject'] == 'Tickets'){
      count_icon = '<em class="fa fa-ticket"></em>';
    }
    if(col_switcher['subject'] == 'Distributor'){
      count_icon = '<em class="fa fa-truck"></em>';
    }
    if(adas_main_arr[i].gsx$subject.$t == col_switcher['subject']){
      var currency_symbol = '<em class="currency_symbol fa fa-bitcoin"></em>';
      if(adas_main_arr[i].gsx$by.$t == col_switcher['by']){

        var pie_count_obj = new Object();
        var pie_sum_obj = new Object();
        pie_count_obj['val'] = adas_main_arr[i].gsx$count.$t;
        pie_count_obj['tit'] = adas_main_arr[i].gsx$view.$t;
        pie_count_arr.push(pie_count_obj);

        var sufix = '';
        if(col_switcher['subject'] == 'Buyers'){
          if(col_switcher['by'] == 'User type'){
            sufix = '&nbsp;('+adas_main_arr[i].gsx$detail.$t+')';
          }
        }
        if(col_switcher['currency'] == 'BTC'){
          pie_sum_obj['val'] = adas_main_arr[i].gsx$btcsum.$t;
          pie_sum_obj['tit'] = adas_main_arr[i].gsx$view.$t;
          pie_sum_arr.push(pie_sum_obj);
          out += adas_main_row(adas_main_arr[i].gsx$view.$t+''+sufix,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$btcmedian.$t,adas_main_arr[i].gsx$btcmean.$t,adas_main_arr[i].gsx$btcmin.$t,adas_main_arr[i].gsx$btcmax.$t,adas_main_arr[i].gsx$btcsum.$t,adas_main_arr[i].gsx$btcpercent.$t,currency_symbol,'',count_icon);
        }
        if(col_switcher['currency'] == 'USD'){
          pie_sum_obj['val'] = adas_main_arr[i].gsx$usdsum.$t;
          pie_sum_obj['tit'] = adas_main_arr[i].gsx$view.$t;
          pie_sum_arr.push(pie_sum_obj);
          currency_symbol = '<em class="currency_symbol fa fa-dollar"></em>';
          out += adas_main_row(adas_main_arr[i].gsx$view.$t+''+sufix,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$usdmedian.$t,adas_main_arr[i].gsx$usdmean.$t,adas_main_arr[i].gsx$usdmin.$t,adas_main_arr[i].gsx$usdmax.$t,adas_main_arr[i].gsx$usdsum.$t,adas_main_arr[i].gsx$usdpercent.$t,currency_symbol,'',count_icon);
        }
        if(col_switcher['currency'] == 'ADA'){
          pie_sum_obj['val'] = adas_main_arr[i].gsx$adasum.$t;
          pie_sum_obj['tit'] = adas_main_arr[i].gsx$view.$t;
          pie_sum_arr.push(pie_sum_obj);
          currency_symbol = '<em class="currency_symbol fa-ada"></em>';
          out += adas_main_row(adas_main_arr[i].gsx$view.$t+''+sufix,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$adamedian.$t,adas_main_arr[i].gsx$adamean.$t,adas_main_arr[i].gsx$adamin.$t,adas_main_arr[i].gsx$adamax.$t,adas_main_arr[i].gsx$adasum.$t,adas_main_arr[i].gsx$adapercent.$t,currency_symbol,'',count_icon);
        }
      }

      if(adas_main_arr[i].gsx$by.$t == 'All'){
        if(col_switcher['currency'] == 'BTC'){
          out += adas_main_row(adas_main_arr[i].gsx$view.$t,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$btcmedian.$t,adas_main_arr[i].gsx$btcmean.$t,adas_main_arr[i].gsx$btcmin.$t,adas_main_arr[i].gsx$btcmax.$t,adas_main_arr[i].gsx$btcsum.$t,adas_main_arr[i].gsx$btcpercent.$t,currency_symbol,'all',count_icon);
        }
        if(col_switcher['currency'] == 'USD'){
          currency_symbol = '<em class="currency_symbol fa fa-dollar"></em>';
          out += adas_main_row(adas_main_arr[i].gsx$view.$t,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$usdmedian.$t,adas_main_arr[i].gsx$usdmean.$t,adas_main_arr[i].gsx$usdmin.$t,adas_main_arr[i].gsx$usdmax.$t,adas_main_arr[i].gsx$usdsum.$t,adas_main_arr[i].gsx$usdpercent.$t,currency_symbol,'all',count_icon);
        }
        if(col_switcher['currency'] == 'ADA'){
          currency_symbol = '<em class="currency_symbol fa-ada"></em>';
          out += adas_main_row(adas_main_arr[i].gsx$view.$t,adas_main_arr[i].gsx$count.$t,adas_main_arr[i].gsx$countpercent.$t,adas_main_arr[i].gsx$adamedian.$t,adas_main_arr[i].gsx$adamean.$t,adas_main_arr[i].gsx$adamin.$t,adas_main_arr[i].gsx$adamax.$t,adas_main_arr[i].gsx$adasum.$t,adas_main_arr[i].gsx$adapercent.$t,currency_symbol,'all',count_icon);
        }
      }

    }
  }

  out = '<tr class="leg">\
    <th width="120"><span class="view">'+adas_keywords_fun('View')+'</span></th><th>'+adas_keywords_fun('Count')+'</th>\
    <th>'+adas_keywords_fun('Median')+'</th><th>'+adas_keywords_fun('Mean')+'</th><th>'+adas_keywords_fun('Max')+'</th><th>'+adas_keywords_fun('Min')+'</th>\
    <th>'+adas_keywords_fun('Sum')+'</th>\
    </tr>'+out;



  var pies = '';
  pies += adas_main_big_pie(col_switcher['subject'],pie_count_arr,30,80,color_swatches,'<em class="fa fa-user"></em>');
  pies += adas_main_big_pie(col_switcher['currency'],pie_sum_arr,30,80,color_swatches,currency_symbol);
  jQuery(".salestats.main .pies").html(pies);

  out = '<table class="adastats">'+out+'</table>';
  jQuery(".salestats.main .panel-load").html(out);
  jQuery("span.pie").peity("pie");
}


function adas_main_load(){
  //jQuery("#roadmap-load").html('');
  var btc_cls = '';
  if(col_switcher['currency'] == 'BTC'){
    btc_cls = 'active';
  }
  var usd_cls = '';
  if(col_switcher['currency'] == 'USD'){
    usd_cls = 'active';
  }
  var ada_cls = '';
  if(col_switcher['currency'] == 'ADA'){
    ada_cls = 'active';
  }
  var out = '\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <div class="row tools">\
        <div class="col-lg-5 first">\
          '+adas_main_col_switcher('subject')+'\
        </div>\
        <div class="col-lg-7 second text-right">\
          '+adas_main_col_switcher('by')+'\
          &nbsp;\
          <div class="btn-group btn-group-xs currencies" role="group" aria-label="currency">\
            <button type="button" class="btn btn-default currency btc '+btc_cls+'" onclick="adas_main_set_current(this,\'currency\')" rel="BTC">BTC</button><button type="button" class="btn btn-default currency usd '+usd_cls+'" onclick="adas_main_set_current(this,\'currency\')" rel="USD">USD</button><button type="button" class="btn btn-default currency ada '+ada_cls+'" onclick="adas_main_set_current(this,\'currency\')" rel="ADA">ADA</button>\
          </div>\
        </div>\
      </div>\
      <div class="pies text-center"></div>\
    </div>\
    <div class="panel-load"></div>\
    <!--<div class="panel-body"></div>-->\
  </div>\
  ';

  jQuery(".salestats.main").html(out);
  adas_main_load_items();
}



/*
//////////////////////////////////////////////////////////////////////////////////////////
TRANCHES
//////////////////////////////////////////////////////////////////////////////////////////
*/




function adas_tranches_load(){
  var charts = '\
  <div class="pies text-center">'+adas_tranche_pie(adas_keywords[lang][adas_slug('All tranches')],adas_tranche_arr(0),70,150,[color_swatches[0], color_swatches[1],color_swatches[3],color_swatches[4]])+'</div>\
  <div class="pies_small text-center">\
  '+adas_tranche_pie(adas_keywords_fun('Tranche 1'),adas_tranche_arr(1),30,90,color_swatches)+'\
  '+adas_tranche_pie(adas_keywords_fun('Tranche 2'),adas_tranche_arr(2),30,90,color_swatches)+'\
  '+adas_tranche_pie(adas_keywords_fun('Tranche 3'),adas_tranche_arr(3),30,90,color_swatches)+'\
  '+adas_tranche_pie(adas_keywords_fun('Tranche 4'),adas_tranche_arr(4),30,90,color_swatches)+'\
  </div>';
  jQuery(".salestats.tranches").html(charts);
  jQuery("span.pie").peity("pie");
}





function adas_tranche_pie(tit,arr,inner,radius,colors_arr){
  var title = '';
  var pie = '';
  var legend = '';
  var data_arr = new Array();
  var total = 0;
  for(var i = 0;i < arr.length;i++){
    total += arr[i]['btc']*1;
  }
  for(var i = 0;i < arr.length;i++){
    data_arr.push(arr[i]['btc']);
    //console.log(arr[i]['prc']);
    var prc = (arr[i]['btc']*1)/(total/100);

    legend += ' <li class="part" style="border-color:'+colors_arr[i]+'"><b>'+adas_keywords_fun(arr[i]['tit'])+'</b> - <em class="fa fa-user"></em> <strong>'+arr[i]['btc']+'</strong> - '+prc.toString().substr(0,4)+'%</li> ';
  }
  var colors = '"'+colors_arr.join('", "')+'"';

  pie = adas_pie(inner,radius,colors,data_arr);

  legend = '<ul class="legend">'+legend+'</ul>';


  title = '<h4>'+tit+'</h4>';
  return '<span class="chart">'+title+pie+legend+'</span>';
}



function adas_tranche_arr(val){
  var out_arr = new Array();
  if(val == 0){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      if(adas_tranches_arr[i].gsx$view.$t == 'All'){
        var out_obj = new Object();
        out_obj['tit'] = adas_tranches_arr[i].gsx$tranche.$t;
        out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
        out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
        out_obj['prc'] = adas_unwrap_brackets(adas_tranches_arr[i].gsx$percent.$t);
        out_arr.push(out_obj);
      }
    }
  }
  if(val == 1){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      if(adas_tranches_arr[i].gsx$tranche.$t == 'Tranche 1'){
        if(adas_tranches_arr[i].gsx$view.$t != 'All'){
          var out_obj = new Object();
          out_obj['tit'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
          out_obj['prc'] = '';
          out_arr.push(out_obj);
        }
      }
    }
  }
  if(val == 2){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      if(adas_tranches_arr[i].gsx$tranche.$t == 'Tranche 2'){
        if(adas_tranches_arr[i].gsx$view.$t != 'All'){
          var out_obj = new Object();
          out_obj['tit'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
          out_obj['prc'] = '';
          out_arr.push(out_obj);
        }
      }
    }
  }
  if(val == 3){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      if(adas_tranches_arr[i].gsx$tranche.$t == 'Tranche 3'){
        if(adas_tranches_arr[i].gsx$view.$t != 'All'){
          var out_obj = new Object();
          out_obj['tit'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
          out_obj['prc'] = '';
          out_arr.push(out_obj);
        }
      }
    }
  }
  if(val == 4){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      if(adas_tranches_arr[i].gsx$tranche.$t == 'Tranche 4'){
        if(adas_tranches_arr[i].gsx$view.$t != 'All'){
          var out_obj = new Object();
          out_obj['tit'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
          out_obj['prc'] = '';
          out_arr.push(out_obj);
        }
      }
    }
  }
  if(val == 10){
    for(var i = 0;i < adas_tranches_arr.length;i++){
      //if(adas_tranches_arr[i].gsx$tranche.$t == 'Tranche 2'){
        if(adas_tranches_arr[i].gsx$view.$t != 'All'){
          var out_obj = new Object();
          out_obj['tit'] = ''+adas_tranches_arr[i].gsx$view.$t+', '+adas_tranches_arr[i].gsx$tranche.$t+'';
          out_obj['view'] = adas_tranches_arr[i].gsx$view.$t;
          out_obj['btc'] = adas_tranches_arr[i].gsx$btc.$t;
          out_obj['prc'] = adas_unwrap_brackets(adas_tranches_arr[i].gsx$percent.$t);
          out_arr.push(out_obj);
        }
      //}
    }
  }
  return out_arr;
}




/*
//////////////////////////////////////////////////////////////////////////////////////////
PRICES
//////////////////////////////////////////////////////////////////////////////////////////
*/






function adas_prices_proportion(val){
  var prc = ((val*1)/(price_bar_height/100));
  return (price_bar_height/100)*prc;
}

var price_bar_height = 1200;

function adas_prices_bar(item){
  var out = '';
  var tit = item.gsx$tranche.$t;

  var median = '<span class="inbar median"  style="height:'+adas_prices_proportion(item.gsx$median.$t*1)+'px;background:'+color_swatches[5]+'"><span>'+item.gsx$median.$t+'</span></span>';
  var mean = '<span class="inbar mean" style="height:'+adas_prices_proportion(item.gsx$mean.$t*1)+'px;background:'+color_swatches[1]+'"><span>'+item.gsx$mean.$t+'</span></span>';
  var max = '<span class="inbar max" style="height:'+adas_prices_proportion(item.gsx$max.$t*1)+'px;background:'+color_swatches[8]+'"><span>'+item.gsx$max.$t+'</span></span>';
  var min = '<span class="inbar min" style="height:'+adas_prices_proportion(item.gsx$min.$t*1)+'px;background:'+color_swatches[3]+'"><span>'+item.gsx$min.$t+'</span></span>';

  out = max+mean+median+min;
  return '<span class="bar">'+out+'</span>';
}

var btcprices = 'Median';

function adas_btcprice_set(obj,val){
  jQuery(".pricetranche").removeClass('active');
  jQuery(obj).addClass('active');
  btcprices = val;
  adas_btcprice_set_bars(val);
}

function adas_btcprice_set_bars(val){
  for(var i = 0;i < adas_prices_arr.length;i++){
    var price = adas_prices_arr[i].gsx$median.$t;
    if(btcprices == 'Mean'){
      price = adas_prices_arr[i].gsx$mean.$t;
    }
    if(btcprices == 'Max'){
      price = adas_prices_arr[i].gsx$max.$t;
    }
    if(btcprices == 'Min'){
      price = adas_prices_arr[i].gsx$min.$t;
    }
    if(btcprices == 'Average'){
      price = adas_prices_arr[i].gsx$average.$t;
    }
    jQuery("#inbar-"+i+" .inbar").css({height:price/3+'px'});
    jQuery("#inbar-"+i+" .prc").html('<em class="fa fa-bitcoin"></em> ' +price);
    jQuery("#inbar-"+i+" .lab").text(adas_keywords_fun('Tranche')+' '+(i+1));
  }
}

function adas_prices_load(){
  var tranche = 0;
  var bars = '';
  for(var i = 0;i < adas_prices_arr.length;i++){
    bars += '<span id="inbar-'+i+'" class="bar"><span class="inbar" style="background:'+color_swatches[i]+'"><span class="prc"></span></span><span class="lab"></span></span>';
  }
  var switcher = '\
  <div class="text-center"><div class="btn-group" role="group" aria-label="pricetranche">\
  <button type="button" class="btn btn-default pricetranche" onclick="adas_btcprice_set(this,\'Average\')">'+adas_keywords_fun('Average')+'</button><button type="button" class="btn btn-default pricetranche active" onclick="adas_btcprice_set(this,\'Median\')">'+adas_keywords_fun('Median')+'</button><button type="button" class="btn btn-default pricetranche" onclick="adas_btcprice_set(this,\'Mean\')">'+adas_keywords_fun('Mean')+'</button><button type="button" class="btn btn-default pricetranche" onclick="adas_btcprice_set(this,\'Max\')">'+adas_keywords_fun('Max')+'</button><button type="button" class="btn btn-default pricetranche" onclick="adas_btcprice_set(this,\'Min\')">'+adas_keywords_fun('Min')+'</button>\
  </div></div>';

  jQuery(".salestats.prices").html('<span class="bars">'+bars+'</span>'+switcher+'<br><br><br><br>');
  adas_btcprice_set_bars('Median');
}





/*
//////////////////////////////////////////////////////////////////////////////////////////
OWNERS
//////////////////////////////////////////////////////////////////////////////////////////
*/


var owners_pie_current = 'Personal';

function adas_owners_pie(tit,arr,inner,radius,colors_arr){
  var title = '';
  var pie = '';
  var legend = '';
  var data_arr = new Array();
  var total = 0;
  for(var i = 0;i < arr.length;i++){
    total += arr[i]['val']*1;

  }
  for(var i = 0;i < arr.length;i++){
    data_arr.push(arr[i]['val']);
    //console.log(arr[i]['prc']);
    var prc = (arr[i]['val']*1)/(total/100);

    legend += ' <li class="part" style="border-color:'+colors_arr[i]+'"><b>'+arr[i]['tit']+'</b> - <em class="fa fa-user"></em> <strong>'+arr[i]['val']+'</strong> - '+adas_unwrap_brackets(arr[i]['prc'])+'%</li> ';
  }
  //console.log(data_arr.join(','));
  var colors = '"'+colors_arr.join('", "')+'"';

  pie = adas_pie(inner,radius,colors,data_arr);
  legend = '<ul class="legend">'+legend+'</ul>';


  title = '<h4>'+tit+'</h4>';
  return '<span class="chart">'+title+pie+legend+'</span>';
}


function adas_owners_set(what,val){
  jQuery(what).parent().find('.active').removeClass('active');
  jQuery(what).addClass('active');
  owners_pie_current = val;
  ///var owners_pie_var = jQuery("#owners_pie").peity("pie");
  //owners_pie_var.text('10,12,65,14').change();
  adas_owners_load();
}


function adas_owners_load(){
  var owners = '';
  var owners_pie = '';
  var owners_arr_any = new Array();
  var owners_arr_personal = new Array();
  var owners_arr_company = new Array();

  for(var i = 0;i < adas_owners_arr.length;i++){

    if(adas_owners_arr[i].gsx$percent.$t != '100%'){
      var owners_obj_any = new Object();
      owners_obj_any['val'] = adas_owners_arr[i].gsx$all.$t;
      owners_obj_any['prc'] = adas_owners_arr[i].gsx$allprc.$t;
      owners_obj_any['tit'] = adas_owners_arr[i].gsx$percent.$t;
      owners_arr_any.push(owners_obj_any);
    }

    var owners_obj_personal = new Object();
    owners_obj_personal['val'] = adas_owners_arr[i].gsx$personal.$t;
    owners_obj_personal['prc'] = adas_owners_arr[i].gsx$personalprc.$t;
    owners_obj_personal['tit'] = adas_owners_arr[i].gsx$percent.$t;
    owners_arr_personal.push(owners_obj_personal);
    var owners_obj_company = new Object();
    owners_obj_company['val'] = adas_owners_arr[i].gsx$company.$t;
    owners_obj_company['prc'] = adas_owners_arr[i].gsx$companyprc.$t;
    owners_obj_company['tit'] = adas_owners_arr[i].gsx$percent.$t;
    owners_arr_company.push(owners_obj_company);
  }

  var pie_arr = owners_arr_personal;
  var cls_personal = '';
  var cls_company = '';
  var cls_any = '';

  if(owners_pie_current == 'Personal'){
    cls_personal = 'active';
  }
  if(owners_pie_current == 'Company'){
    pie_arr = owners_arr_company;
    cls_company = 'active';
  }
  if(owners_pie_current == 'Any type'){
    pie_arr = owners_arr_any;
    cls_any = 'active';
  }

  owners_pie += adas_owners_pie('All owners',owners_arr_any,30,115,color_swatches);
  //owners_pie += adas_owners_pie('Company',owners_arr_company,50,135,color_swatches);
  //owners_pie += adas_owners_pie('Any type',owners_arr_any,50,135,color_swatches);



  var nav = '\
  <div class="btn-group" role="group" aria-label="ownership">\
  <button type="button" class="btn btn-default ownership '+cls_personal+'" onclick="adas_owners_set(this,\'Personal\')">Personal</button>\
  <button type="button" class="btn btn-default ownership '+cls_company+'" onclick="adas_owners_set(this,\'Company\')">Company</button>\
  <button type="button" class="btn btn-default ownership '+cls_any+'" onclick="adas_owners_set(this,\'Any type\')">Any type</button>\
  </div>';

  for(var i = 0;i < adas_owners_arr.length;i++){
    owners += '<tr>\
    <td width="20%">'+adas_owners_arr[i].gsx$percent.$t+'</td>\
    <td width="10%">'+adas_owners_arr[i].gsx$all.$t+'</td><td class="prc" width="20%">'+adas_main_unwrap_and_pie(adas_owners_arr[i].gsx$allprc.$t,3,8)+'</td>\
    <td width="10%"><em class="fa fa-user"></em>&nbsp;'+adas_owners_arr[i].gsx$personal.$t+'</td><td class="prc" width="20%">'+adas_main_unwrap_and_pie(adas_owners_arr[i].gsx$personalprc.$t,3,8)+'</td>\
    <td width="10%"><em class="fa fa-black-tie"></em>&nbsp;'+adas_owners_arr[i].gsx$company.$t+'</td><td class="prc" width="10%">'+adas_main_unwrap_and_pie(adas_owners_arr[i].gsx$companyprc.$t,3,8)+'</td>\
    </tr>';
  }
  var head = '<tr><th>'+adas_keywords_fun('Percent')+'</th><th>'+adas_keywords_fun('All')+'</th><th class="prc">'+adas_keywords_fun('All')+' (%)</th><th>'+adas_keywords_fun('Personal')+'</th><th class="prc">(%)</th><th>'+adas_keywords_fun('Company')+'</th><th class="prc">(%)</th></tr>';
  jQuery(".salestats.owners").html('<div class="pies">'+owners_pie+'</div><table class="owners">'+head+owners+'</table><br>');
  //jQuery(".salestats.owners").html(owners_pie);
  jQuery("span.pie").peity("pie");
}



/*
//////////////////////////////////////////////////////////////////////////////////////////
TIMELINE
//////////////////////////////////////////////////////////////////////////////////////////
*/




var adas_timeline_currency = 'USD';
var adas_timeline_view = 'Daily';
var adas_timeline_bar_width = 1;
var adas_timeline_scale = 10000;
var adas_timeline_layout = 'thin';


function adas_timeline_layout_reset(){

  var wrap_width = (adas_timeline_arr.length*(adas_timeline_bar_width*1+1)+22);
  var wrap_offset = wrap_width-(jQuery(".salestats.timeline .bars_wrap").width()*1);
  var inwrap_width = wrap_width+wrap_offset;
  jQuery(".salestats.timeline .bars").css({ width:wrap_width+'px',left:(wrap_offset-15)});
  jQuery(".salestats.timeline .bars_inwrap").css({ width:inwrap_width+'px',marginLeft:-(wrap_offset-20)+'px'});
  //console.log(adas_timeline_bar_width+' '+wrap_width+' '+wrap_offset+' '+inwrap_width+' '+jQuery(".salestats.timeline .bars_wrap").width()+'');
  //jQuery(".salestats.timeline .bars").draggable("destroy");
  //jQuery(".salestats.timeline .bars").draggable({ axis: "x",containment: ".salestats.timeline .bars_inwrap"});
}





function adas_timeline_set(obj,val){
  if(jQuery(obj).hasClass('timeline_currency')){
    jQuery(".timeline_currency").removeClass('active');
    adas_timeline_currency = val;
  }
  if(jQuery(obj).hasClass('timeline_view')){
    jQuery(".timeline_view").removeClass('active');
    adas_timeline_view = val;
  }
  jQuery(obj).addClass('active');
  adas_timeline_set_bars();
}

function adas_timeline_width(){
  adas_timeline_bar_width = jQuery("select.timeline_width").val();
  adas_timeline_set_bars();
}

function adas_timeline_bar_click(cls,tgl) {
  jQuery(".timeline .bar.active").removeClass('active');
  jQuery(cls).toggleClass(tgl);
}


function adas_timeline_set_bars(){

  function axis_label(val,ratio){
    return  '<span class="lab" style="bottom:'+(val/ratio-7)+'px">'+adas_commas(val)+'</span>';
  }

  var axis_labels = '';
  var currency_symbol = '<em class="fa fa-dollar"></em>';
  if(adas_timeline_currency == 'ADA'){
    currency_symbol = '<em class="currency_symbol fa-ada"></em>';
  }

  jQuery(".timeline .bar").css({width:adas_timeline_bar_width+'px'});
  jQuery(".timeline .bars").attr('class','bars').addClass(adas_timeline_layout);

  adas_timeline_scale = 8000;
  axis_labels += axis_label(100000,adas_timeline_scale);
  axis_labels += axis_label(500000,adas_timeline_scale);
  axis_labels += axis_label(1000000,adas_timeline_scale);
  axis_labels += axis_label(1500000,adas_timeline_scale);
  axis_labels += axis_label(2000000,adas_timeline_scale);
  axis_labels += axis_label(2500000,adas_timeline_scale);
  axis_labels += axis_label(3000000,adas_timeline_scale);

  if(jQuery(document).width() < 768){
    adas_timeline_scale = 16000;
    axis_labels = '';
    axis_labels += axis_label(100000,adas_timeline_scale);
    axis_labels += axis_label(1000000,adas_timeline_scale);
    axis_labels += axis_label(2000000,adas_timeline_scale);
    axis_labels += axis_label(3000000,adas_timeline_scale);

  }


  if(adas_timeline_view == 'Cumulative'){
    adas_timeline_scale = 155500;
    axis_labels = '';
    axis_labels += axis_label(5000000,adas_timeline_scale);
    axis_labels += axis_label(10000000,adas_timeline_scale);
    axis_labels += axis_label(15000000,adas_timeline_scale);
    axis_labels += axis_label(20000000,adas_timeline_scale);
    axis_labels += axis_label(25000000,adas_timeline_scale);
    axis_labels += axis_label(30000000,adas_timeline_scale);
    axis_labels += axis_label(35000000,adas_timeline_scale);
    axis_labels += axis_label(40000000,adas_timeline_scale);
    axis_labels += axis_label(45000000,adas_timeline_scale);
    axis_labels += axis_label(50000000,adas_timeline_scale);
    axis_labels += axis_label(55000000,adas_timeline_scale);
    axis_labels += axis_label(60000000,adas_timeline_scale);
    if(jQuery(document).width() < 768){
      adas_timeline_scale = 155500*2;
      axis_labels = '';
      axis_labels += axis_label(5000000,adas_timeline_scale);
      axis_labels += axis_label(15000000,adas_timeline_scale);
      axis_labels += axis_label(25000000,adas_timeline_scale);
      axis_labels += axis_label(35000000,adas_timeline_scale);
      axis_labels += axis_label(45000000,adas_timeline_scale);
      axis_labels += axis_label(55000000,adas_timeline_scale);
    }

  }
  if(adas_timeline_currency == 'ADA'){
    adas_timeline_scale = 2350000;
    axis_labels = '';
    axis_labels += axis_label(50000000,adas_timeline_scale);
    axis_labels += axis_label(150000000,adas_timeline_scale);
    axis_labels += axis_label(250000000,adas_timeline_scale);
    axis_labels += axis_label(350000000,adas_timeline_scale);
    axis_labels += axis_label(450000000,adas_timeline_scale);
    axis_labels += axis_label(550000000,adas_timeline_scale);
    axis_labels += axis_label(650000000,adas_timeline_scale);
    axis_labels += axis_label(750000000,adas_timeline_scale);
    axis_labels += axis_label(850000000,adas_timeline_scale);
    if(jQuery(document).width() < 768){
      adas_timeline_scale = 2350000*2;
      axis_labels = '';
      axis_labels += axis_label(50000000,adas_timeline_scale);
      axis_labels += axis_label(250000000,adas_timeline_scale);
      axis_labels += axis_label(450000000,adas_timeline_scale);
      axis_labels += axis_label(650000000,adas_timeline_scale);
      axis_labels += axis_label(850000000,adas_timeline_scale);
    }

    if(adas_timeline_view == 'Cumulative'){
      adas_timeline_scale = 67000000;
      axis_labels = '';
      axis_labels += axis_label(1000000000,adas_timeline_scale);
      axis_labels += axis_label(5000000000,adas_timeline_scale);
      axis_labels += axis_label(9000000000,adas_timeline_scale);
      axis_labels += axis_label(13000000000,adas_timeline_scale);
      axis_labels += axis_label(17000000000,adas_timeline_scale);
      axis_labels += axis_label(21000000000,adas_timeline_scale);
      axis_labels += axis_label(25000000000,adas_timeline_scale);
      if(jQuery(document).width() < 768){
        adas_timeline_scale = 67000000*2;
        axis_labels = '';
        axis_labels += axis_label(1000000000,adas_timeline_scale);
        axis_labels += axis_label(9000000000,adas_timeline_scale);
        axis_labels += axis_label(17000000000,adas_timeline_scale);
        axis_labels += axis_label(25000000000,adas_timeline_scale);
      }
    }
  }


  for(var i = 0;i < adas_timeline_arr.length;i++){
    var d=new Date(adas_timeline_arr[i].gsx$date.$t);
    var milisecs = d.getTime();
    var date_arr = adas_timeline_arr[i].gsx$date.$t.split('-');
    var id_key = ''+date_arr[0]+'-'+date_arr[1]+'-'+adas_add_zero(date_arr[2]*1)+'';

    var price = adas_timeline_arr[i].gsx$dailyusd.$t;
    if(adas_timeline_view == 'Cumulative'){
      price = adas_timeline_arr[i].gsx$cumulativeusd.$t;
    }
    if(adas_timeline_currency == 'ADA'){
      price = adas_timeline_arr[i].gsx$dailyada.$t;
      if(adas_timeline_view == 'Cumulative'){
        price = adas_timeline_arr[i].gsx$cumulativeada.$t;
      }
    }

    jQuery("#timebar-"+id_key+" .empty").removeClass('empty');


    if(price != 0){
      var price_out = price;
      if(adas_timeline_currency == 'USD'){
        var price_arr = price.split('.');
        if(price_arr[1] != undefined){
          price_out = price_arr[0]+'.'+price_arr[1].substr(0,2);
        }
      }
      var bg_color = 'rgba(255,255,255,0.1)';

      if(adas_timeline_arr[i].gsx$tranche.$t == 1){
        bg_color = color_swatches[0];
      }
      if(adas_timeline_arr[i].gsx$tranche.$t == 2){
        bg_color = color_swatches[1];
      }
      if(adas_timeline_arr[i].gsx$tranche.$t == 3){
        bg_color = color_swatches[2];
      }
      if(adas_timeline_arr[i].gsx$tranche.$t == 4){
        bg_color = color_swatches[3];
      }


      var bar_height = price/adas_timeline_scale;
      if(bar_height < 1){
        bar_height = 1;
      }
      jQuery("#timebar-"+id_key+" .inbar").css({height:bar_height+'px',background:bg_color,width:adas_timeline_bar_width+'px'});
      //jQuery("#timebar-"+milisecs+"").attr('height', price/adas_timeline_scale);
      //jQuery("#timebar-"+milisecs+"").attr('y', (500-(price/adas_timeline_scale)));

      var buyers = adas_timeline_arr[i].gsx$counter.$t;
      if(buyers > 1){
        buyers = '<small><em class="fa fa-user"></em> '+buyers+' '+adas_keywords[lang]['buyers']+'</small>';
      }else{
        buyers = '<small><em class="fa fa-user"></em> '+buyers+' '+adas_keywords[lang]['buyer']+'</small>';
      }
      jQuery("#timebar-"+id_key+" .prc").html(' <b>'+adas_date_format(adas_timeline_arr[i].gsx$date.$t)+'</b><br>'+currency_symbol+'&nbsp;'+adas_commas(price_out)+'<br>'+buyers+'<br><small><em class="fa fa-certificate"></em> '+adas_keywords[lang]['tranche']+' '+adas_timeline_arr[i].gsx$tranche.$t+'</small>');

    }else{
      //jQuery("#timebar-"+id_key+" .inbar").addClass('empty');
      //jQuery("#timebar-"+id_key+" .prc").addClass('empty');
      jQuery("#timebar-"+id_key+" .inbar").css({height:0+'px'});
      jQuery("#timebar-"+id_key+" .prc").html(' <b>'+adas_date_format(adas_timeline_arr[i].gsx$date.$t)+'</b>');
    }

  }

  jQuery(".timeline .axis-y").html(axis_labels);
  adas_timeline_layout_reset();
}

function adas_timeline_load(){
  var timeline = '';
  /*
  for(var i = 0;i < adas_timeline_arr.length;i++){
    timeline += '<span id="timebar-'+i+'" class="bar"><span class="prc"></span><span class="inbar" style="background:rgba(200,200,200,0.5)"></span><span class="lab"></span></span>';
  }
  */
  var d=new Date('2015-10-01');
  var milisecs = d.getTime();

  for(var i = 0;i < 500;i++){
    var month_lab = '';
    var dd=new Date(milisecs);
    if(i == 0 || i == 65 || i == 127 || i == 185 || i == 244 || i == 305 || i == 370 || i == 435 || i == 500 || i == 570){
      //if(i == 0 || i == 31 || i == 65 || i == 100 || i == 127 || i == 158 || i == 185 || i == 215 || i == 244 || i == 275 || i == 305 || i == 338 || i == 370){
      month_lab = ''+months[dd.getMonth()+1]+'';
      if(lang == 'ja'){
        month_lab = ''+months_ja[dd.getMonth()+1]+'';
      }
      if(lang == 'zh-CN'){
        month_lab = ''+months_zh[dd.getMonth()+1]+'';
      }
    }


    //timeline += '<span id="timebar-'+milisecs+'" rel="'+milisecs+'" class="bar"><span class="prc empty"></span><span class="inbar empty" style="background:'+color_swatches[0]+'"></span><span class="lab">'+month_lab+'</span></span>';
    timeline += '<span id="timebar-'+dd.getFullYear()+'-'+(dd.getMonth()+1)+'-'+adas_add_zero(dd.getDate())+'" rel="'+milisecs+'" class="bar" onclick="adas_timeline_bar_click(this,\'active\')"><span class="prc empty unselectable"></span><span class="inbar empty" style="background:'+color_swatches[0]+'"></span><span class="lab unselectable">'+month_lab+'</span></span>';

    //timeline += '<rect id="timebar-'+milisecs+'" width="2" height="10" x="'+(i*3)+'" y="490" style="fill:rgb(255,0,255);" />';

    milisecs = milisecs*1+86400000;
  }

  var bar_width_select = '<div class="col-lg-2 col-sm-2"><select class="form-control timeline_width" onchange="adas_timeline_width()"><option value="1" selected="selected">'+adas_keywords[lang]['thin']+'</option><option value="3">'+adas_keywords[lang]['normal']+'</option><option value="5">'+adas_keywords[lang]['strong']+'</option><option value="7">'+adas_keywords[lang]['bold']+'</option></select></div>';

  var switcher = '\
  <div class="row controls">\
  <div class="col-lg-10 col-sm-10">\
  <div class="btn-group" role="group" aria-label="timeline_currency">\
  <button type="button" class="btn btn-default timeline_currency active" onclick="adas_timeline_set(this,\'USD\')">USD</button><button type="button" class="btn btn-default timeline_currency" onclick="adas_timeline_set(this,\'ADA\')">ADA</button>\
  </div>\
  <div class="btn-group" role="group" aria-label="timeline_view">\
  <button type="button" class="btn btn-default timeline_view active" onclick="adas_timeline_set(this,\'Daily\')">'+adas_keywords[lang]['daily']+'</button><button type="button" class="btn btn-default timeline_view" onclick="adas_timeline_set(this,\'Cumulative\')">'+adas_keywords[lang]['cumulative']+'</button>\
  </div><br><br>\
  </div>\
  '+bar_width_select+'\
  </div>';

  //jQuery(".salestats.timeline").html('<table class="timeline">'+timeline+'</table><br>');
  jQuery(".salestats.timeline").html('<div class="axis-y-over"></div><div class="axis-y"></div><div id="bars_wrap" class="bars_wrap"><div class="bars_inwrap"><div class="bars" style="width:'+(adas_timeline_arr.length*(adas_timeline_bar_width+1)+15)+'px">'+timeline+'</div></div></div> '+switcher);
  //jQuery(".salestats.timeline").html(timebar);

  /*
  var wrap_width = (adas_timeline_arr.length*(adas_timeline_bar_width+1));
  var wrap_offset = wrap_width-jQuery(".salestats.timeline .bars_wrap").width();
  var inwrap_width = wrap_width+wrap_offset;
  jQuery(".salestats.timeline .bars_inwrap").css({ width:inwrap_width+'px',marginLeft:-(wrap_offset-20)+'px'});
*/
  //adas_timeline_layout_reset();



/*
jQuery( "#slider" ).slider();

  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],
    slide: function( event, ui ) {
      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
    }
  });*/


  jQuery(".salestats.timeline .bars").draggable({ axis: "x",containment: ".salestats.timeline .bars_inwrap"});
  window.addEventListener('touchstart', function() {
    jQuery("#salestats").attr('class','touched');
    jQuery(".salestats.timeline .bars").draggable('destroy');
  });
  if(jQuery(document).width() < 768){
    jQuery(".salestats.timeline .bars").draggable('destroy');

  }

  //var offset_top = jQuery(".salestats.timeline .bars").offsetTop;
  var offset_top = jQuery(".salestats.timeline").offsetTop;
  var testDiv = document.getElementById("bars_wrap");

  jQuery(".salestats.timeline .bars").mousemove(function(e){
    //jQuery("#rule_x").css({left:e.pageX, top:e.pageY});
    console.log(testDiv.offsetTop+' '+((e.pageY*1)-testDiv.offsetTop*1));

    var middle = jQuery(".salestats.timeline .bars_wrap").width();
    var side_offsets = (jQuery(document).width()-middle)/2;

    if(e.pageX > ((middle-170)+side_offsets)){
      jQuery(".salestats.timeline").attr('class','salestats timeline labelleft');
    }else{
      jQuery(".salestats.timeline").attr('class','salestats timeline');
    }

    var bottom_offset = (((e.pageY-3) - testDiv.offsetTop) - 400)*-1;

    if(bottom_offset > 0){
      var shift_bg = 145;
      var shift_y_label = 140;
      if(jQuery(document).width() < 768){
        shift_bg = 50;
        shift_y_label = 45;
      }

      jQuery(".salestats.timeline .bars").css({backgroundPosition:'0 '+(((e.pageY*1)-testDiv.offsetTop*1)-shift_bg)+'px'});
      jQuery(".salestats.timeline .axis-y-over").css({top:(e.pageY-shift_y_label)+'px'});


      //if(bottom_offset < 400){
        jQuery(".salestats.timeline .axis-y-over").html(''+adas_commas(bottom_offset*adas_timeline_scale)+'');
      //}
    }

  });


  adas_timeline_set_bars();
}






/*
//////////////////////////////////////////////////////////////////////////////////////////
SIZE DISTRIBUTION
//////////////////////////////////////////////////////////////////////////////////////////
*/







var col_size_switcher = new Array();
col_size_switcher['by'] = 'Per ticket';
col_size_switcher['currency'] = 'BTC';



function adas_size_col_arr(key){
  var out_arr = [];
  for(var i = 0;i < adas_size_arr.length;i++){

    if(key == 'by'){
      //if(col_switcher['subject'] == adas_size_arr[i].gsx$subject.$t){
        if(jQuery.inArray(adas_size_arr[i].gsx$by.$t,out_arr) == -1){
          out_arr.push(adas_size_arr[i].gsx$by.$t);
        }
      //}
    }
    if(key == 'view'){
      if(jQuery.inArray(adas_size_arr[i].gsx$view.$t,out_arr) == -1){
        out_arr.push(adas_size_arr[i].gsx$view.$t);
      }
    }

  }
  return out_arr;
}

function adas_size_col_switcher(key){
  var col_arr = adas_size_col_arr(key);
  var out_arr = [];
  for(var i = 0;i < col_arr.length;i++){
    if(col_arr[i]){
      if(col_arr[i] != 'All'){
        var active = '';
        if(col_size_switcher[key] == col_arr[i]){
          active = 'active';
        }
        out_arr.push('<button type="button" class="btn btn-default '+key+' '+active+'" onclick="adas_size_set_current(this,\''+key+'\')" rel="'+col_arr[i]+'">'+adas_keywords_fun(col_arr[i])+'</button>');
      }
    }
  }
  var size_cls = 'btn-group-xs';
  if(key == 'subject'){
    size_cls = '';
  }
  var out = '\
  <div class="btn-group '+size_cls+'" role="group" aria-label="'+key+'">\
  '+out_arr.join('')+'\
  </div>\
  ';

  return out;
}

function adas_size_set_current(what,varval){
  var val = jQuery(what).attr('rel');
  col_size_switcher[varval] = val;
  jQuery(".salestats.size ."+varval).removeClass('active');
  jQuery(what).addClass('active');
  //console.log(val+''+varval);
  adas_size_load();
}


function adas_size_small_label(str){
  if(str.length > 20){
    return '<span class="small">'+str+'</span>';
  }else{
    return str;
  }
}

function adas_size_unwrap_and_pie(val,inner, outer){
  return adas_size_pie(val,inner, outer)+' <span>'+val.substr(1,val.length-2)+'</span> ';
}

function adas_size_pie(val,inner, outer){
  var num = val.substr(1,val.length-3);
  return '<span data-peity=\'{ "fill": ["#eeeeee", "rgba(200,200,200,0.3)"], "innerRadius": '+inner+', "radius": '+outer+' }\' class="pie">'+num+'/100</span>';
}

function adas_size_big_pie(ttt,arr,inner,radius,colors_arr,symbol,currency){
  var title = '';
  var pie = '';
  var legend = '';
  var data_arr = new Array();
  var total = 0;
  for(var i = 0;i < arr.length;i++){
    total += arr[i]['val']*1;
  }
  for(var i = 0;i < arr.length;i++){
    data_arr.push(arr[i]['val']);
    //console.log(arr[i]['prc']);
    var prc = (arr[i]['val']*1)/(total/100);
    var tit = arr[i]['tit']; //adas_keywords[lang][adas_slug(tit)]
    tit = tit.replace('amount',adas_keywords_fun('amount')); //adas_keywords[lang][adas_slug(tit)]


    legend += ' <li class="part" style="border-color:'+colors_arr[i]+'"><b>'+tit+'</b> - '+symbol+' <strong>'+arr[i]['val']+'</strong> - '+prc.toString().substr(0,4)+'% <span class="dash">–</span><br> '+currency+' '+arr[i]['amount']+' ('+adas_unwrap_brackets(arr[i]['amountprc'])+'%)</li> ';
  }
  var colors = '"'+colors_arr.join('", "')+'"';

  pie = adas_pie(inner,radius,colors,data_arr);
  legend = '<ul class="legend">'+legend+'</ul>';

  title = '<h4>'+adas_keywords_fun(ttt)+'</h4>';
  return '<span class="chart" style="">'+title+pie+legend+'</span>';
}

function adas_size_row(view,count,countpercent,currency,rowclass,count_icn){
  return '<tr class="'+rowclass+'"><td width="">'+view+'</td><td width="">'+currency+'&nbsp;'+count+'</td></tr>';
}

function adas_size_load_items(){
  var out = '';
  var pie_arr = new Array();

  for(var i = 0;i < adas_size_arr.length;i++){
    if(adas_size_arr[i].gsx$currency.$t == col_size_switcher['currency']){
      if(adas_size_arr[i].gsx$by.$t == col_size_switcher['by']){

        var count_icon = '<em class="fa fa-user"></em>';
        if(col_size_switcher['by'] == 'Per ticket'){
          count_icon = '<em class="fa fa-ticket"></em>';
        }

        var currency_symbol = '<em class="currency_symbol fa fa-bitcoin"></em>';

        if(col_size_switcher['currency'] == 'USD'){
          currency_symbol = '<em class="currency_symbol fa fa-dollar"></em>';
        }
        if(col_size_switcher['currency'] == 'ADA'){
          currency_symbol = '<em class="currency_symbol fa-ada"></em>';
        }

        var pie_obj = new Object();
        pie_obj['tit'] = adas_size_arr[i].gsx$view.$t;
        pie_obj['val'] = adas_size_arr[i].gsx$count.$t;
        pie_obj['amount'] = adas_size_arr[i].gsx$amount.$t;
        pie_obj['amountprc'] = adas_size_arr[i].gsx$amountprc.$t;
        pie_arr.push(pie_obj);

        out += adas_size_row(adas_size_arr[i].gsx$view.$t,adas_size_arr[i].gsx$count.$t,adas_size_arr[i].gsx$countprc.$t,currency_symbol,'',count_icon);

      }
    }
  }

  out = '<table class="adastats">'+out+'</table>';
  var icon = '<em class="fa fa-user"></em>';
  if(col_size_switcher['by'] == 'Per ticket'){
    icon = '<em class="fa fa-ticket"></em>';
  }
  //jQuery(".salestats.size .panel-load").html(out);
  jQuery(".salestats.size .pies").html(adas_size_big_pie(col_size_switcher['by'],pie_arr,50,110,color_swatches,icon,currency_symbol));
  jQuery("span.pie").peity("pie");
}


function adas_size_load(){
  //jQuery("#roadmap-load").html('');
  var btc_cls = '';
  if(col_size_switcher['currency'] == 'BTC'){
    btc_cls = 'active';
  }
  var usd_cls = '';
  if(col_size_switcher['currency'] == 'USD'){
    usd_cls = 'active';
  }
  var ada_cls = '';
  if(col_size_switcher['currency'] == 'ADA'){
    ada_cls = 'active';
  }
  var out = '\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <div class="row">\
        <div class="col-sm-12 second text-left">\
          '+adas_size_col_switcher('by')+'\
          &nbsp;\
          <div class="btn-group btn-group-xs" role="group" aria-label="currency">\
            <button type="button" class="btn btn-default currency '+btc_cls+'" onclick="adas_size_set_current(this,\'currency\')" rel="BTC">BTC</button><button type="button" class="btn btn-default currency '+usd_cls+'" onclick="adas_size_set_current(this,\'currency\')" rel="USD">USD</button><button type="button" class="btn btn-default currency '+ada_cls+'" onclick="adas_size_set_current(this,\'currency\')" rel="ADA">ADA</button>\
          </div>\
        </div>\
      </div>\
    </div>\
    <div class="row"><div class="col-sm-12"><div class="panel-load"></div></div><div class="col-sm-12"><div class="pies text-center"></div></div></div>\
    <!--<div class="panel-body"></div>-->\
  </div>\
  ';

  jQuery(".salestats.size").html(out);
  adas_size_load_items();
}





/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////




var inequality_col_switcher = new Array();
inequality_col_switcher['coefficient'] = 'Gini';
inequality_col_switcher['type'] = 'All';
inequality_col_switcher['section'] = 'All';





function adas_inequality_col_arr(key){
  var out_arr = [];
  for(var i = 0;i < adas_inequality_arr.length;i++){
    if(key == 'coefficient'){
      if(jQuery.inArray(adas_inequality_arr[i].gsx$coefficient.$t,out_arr) == -1){
        out_arr.push(adas_inequality_arr[i].gsx$coefficient.$t);
      }
    }
    if(key == 'type'){
      if(inequality_col_switcher['coefficient'] == adas_inequality_arr[i].gsx$coefficient.$t){
        if(jQuery.inArray(adas_inequality_arr[i].gsx$type.$t,out_arr) == -1){
          out_arr.push(adas_inequality_arr[i].gsx$type.$t);
        }
      }
    }
    if(key == 'section'){
      if(inequality_col_switcher['coefficient'] == adas_inequality_arr[i].gsx$coefficient.$t){
        if(jQuery.inArray(adas_inequality_arr[i].gsx$section.$t,out_arr) == -1){
          out_arr.push(adas_inequality_arr[i].gsx$section.$t);
        }
      }
    }
    if(key == 'section'){
      if(inequality_col_switcher['coefficient'] == adas_inequality_arr[i].gsx$coefficient.$t){
        if(jQuery.inArray(adas_inequality_arr[i].gsx$section.$t,out_arr) == -1){
          out_arr.push(adas_inequality_arr[i].gsx$section.$t);
        }
      }
    }

  }
  return out_arr;
}

function adas_inequality_col_switcher(key){
  var col_arr = adas_inequality_col_arr(key);
  var out_arr = [];
  for(var i = 0;i < col_arr.length;i++){
    if(col_arr[i]){
      //if(col_arr[i] != 'All'){
        var active = '';
        if(inequality_col_switcher[key] == col_arr[i]){
          active = 'active';
        }
        var tit = col_arr[i];
        if(col_arr[i] == 'Buyers'){
          tit = 'Ada voucher holders';
        }
        out_arr.push('<button type="button" class="btn btn-default '+key+' '+active+'" onclick="adas_inequality_set_current(this,\''+key+'\')" rel="'+tit+'">'+adas_keywords_fun(tit)+'</button>');
      //}
    }
  }
  var size_cls = 'btn-group-xs';
  if(key == 'coefficient'){
    size_cls = '';
  }
  var out = '\
  <div class="btn-group '+size_cls+' group-'+key+'" role="group" aria-label="'+key+'">\
  '+out_arr.join('')+'\
  </div>\
  ';

  return out;
}

function adas_inequality_set_current(what,varval){
  var val = jQuery(what).attr('rel');

  inequality_col_switcher[varval] = val;


  /*
  //jQuery(".salestats.main ."+varval).removeClass('active');
  jQuery(what).parent().find('.active').removeClass('active');
  jQuery(what).addClass('active');
  jQuery(".salestats.main").attr('class','salestats main');


  if(varval == 'subject'){
    if(val == 'Buyers'){
      inequality_col_switcher['by'] = 'Region';
    }else{
      inequality_col_switcher['by'] = 'Tranche';
    }
  }

  if(inequality_col_switcher['subject'] == 'Distributor'){
    inequality_col_switcher['currency'] = 'BTC';
    //jQuery(".salestats.main .panel-load").attr('class','panel-load distributor');
    jQuery(".salestats.main").attr('class','salestats main distributor');
  }
  */
  if(inequality_col_switcher['coefficient'] == 'Gini'){
    if(varval == 'type'){
      if(val == 'Endowment'){
        inequality_col_switcher['section'] = 'All';
      }
    }
  }

  //console.log(val+''+varval);
  //jQuery(".salestats.main .panel-load").addClass('active');
  adas_inequality_load();

  if(varval == 'coefficient'){
    if(val == 'Atkinson index' || val == 'Theil index'){
      jQuery(".group-section").hide(0);
    }
  }
  if(inequality_col_switcher['coefficient'] == 'Gini'){
    if(varval == 'type'){
      if(val == 'Endowment'){
        jQuery(".group-section").hide(0);
      }else{
        jQuery(".group-section").show(0);
      }
    }
  }


}


function adas_inequality_small_label(str){
  if(str.length > 25){
    if(lang == 'eu-US'){
      return '<span class="small">'+str+'</span>';
    }else{
      return str;
    }
  }else{
    return str;
  }
}

function adas_inequality_unwrap_and_pie(val,inner, outer){
  return adas_inequality_pie(val,inner, outer)+' <span>'+val.substr(1,val.length-2)+'</span> ';
}

function adas_inequality_pie(val,inner, outer){
  var num = val.substr(1,val.length-3);
  return '<span data-peity=\'{ "fill": ["#eeeeee", "rgba(200,200,200,0.3)"], "innerRadius": '+inner+', "radius": '+outer+' }\' class="pie">'+num+'/100</span>';
}


function adas_inequality_row(label,purchases,buyers,rowclass,count_icn){

  var purchases_prc = purchases;
  var buyers_prc = buyers;
  if(inequality_col_switcher['coefficient'] == 'Gini'){
    purchases_prc = adas_inequality_unwrap_and_pie(purchases_prc,4, 8);
    buyers_prc = adas_inequality_unwrap_and_pie(buyers_prc,4, 8);
  }

  var out = '<tr class="'+rowclass+'">\
    <td width="33%">'+adas_keywords_fun(adas_inequality_small_label(label))+'</td>\
    <td width="33%">'+purchases_prc+'</td>\
    <td width="33%">'+buyers_prc+'</td>\
    </tr>';
    return out;
}


function adas_inequality_load_items(){
  var out = '';

  var pie_count = '';
  var pie_sum = '';
  var pie_count_arr = new Array();
  var pie_sum_arr = new Array();

  for(var i = 0;i < adas_inequality_arr.length;i++){
    var count_icon = '<em class="fa fa-user"></em>';

    if(adas_inequality_arr[i].gsx$coefficient.$t == inequality_col_switcher['coefficient']){
      if(adas_inequality_arr[i].gsx$type.$t == inequality_col_switcher['type']){
        if(adas_inequality_arr[i].gsx$section.$t == inequality_col_switcher['section']){
          out += adas_inequality_row(adas_inequality_arr[i].gsx$view.$t,adas_inequality_arr[i].gsx$purchases.$t,adas_inequality_arr[i].gsx$buyers.$t,'',count_icon);
        }
      }
    }
  }

  out = '<tr class="leg">\
    <th>'+adas_keywords_fun('View')+'</th>\
    <th>'+adas_keywords_fun('Purchases')+'</th>\
    <th>'+adas_keywords_fun('Buyers')+'</th>\
    </tr>'+out;



  var pies = '';
  /*
  pies += adas_inequality_big_pie(col_switcher['subject'],pie_count_arr,30,80,color_swatches,'<em class="fa fa-user"></em>');
  pies += adas_inequality_big_pie(col_switcher['currency'],pie_sum_arr,30,80,color_swatches,currency_symbol);
  jQuery(".salestats.main .pies").html(pies);
*/
  out = '<table class="adastats">'+out+'</table>';
  jQuery(".salestats.inequality .panel-load").html(out);
  jQuery("span.pie").peity("pie");
}


function adas_inequality_load(){
  //jQuery("#roadmap-load").html('');
  //console.log(adas_inequality_arr);
  var btc_cls = '';

  var out = '\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <div class="row tools">\
        <div class="col-lg-5 first">\
          '+adas_inequality_col_switcher('coefficient')+'\
        </div>\
        <div class="col-lg-7 second text-right">\
          '+adas_inequality_col_switcher('type')+'\
          &nbsp;\
          '+adas_inequality_col_switcher('section')+'\
        </div>\
      </div>\
      <div class="pies text-center"></div>\
    </div>\
    <div class="panel-load"></div>\
    <!--<div class="panel-body"></div>-->\
  </div>\
  ';

  jQuery(".salestats.inequality").html(out);
  adas_inequality_load_items();
}











/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////






var adas_path = '/archive/static.iohk.io/adasale/js/stats/';
//adas_path = '/adasale/js/';




jQuery(window).load(function(){
  lang = jQuery("#lang_meta").attr('content');
  //lang = 'zh-CN';
  //alert(adas_slug("Other (Thailand, Taiwan, Malaysia, Philippines)"));

  var url_main = "https://spreadsheets.google.com/feeds/list/1Q3CHXua0DKlOpdzQ7BUmhzL6cvgcEGe4zugDyOAIIWw/od6/public/values?alt=json";
  url_main = adas_path+"main2.json";

  console.log(url_main);

  jQuery.getJSON(url_main, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_main_arr.push(this);
    });
    adas_main_load();
  });


  var url_tranches = "https://spreadsheets.google.com/feeds/list/1Aqh8TR2nhvOibIu-lJFwYhCeihscnaZ5OZDcKWJ7jYY/od6/public/values?alt=json";
  url_tranches = adas_path+"tranches3.json";

  jQuery.getJSON(url_tranches, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_tranches_arr.push(this);
    });
    adas_tranches_load();
  });

  var url_prices = "https://spreadsheets.google.com/feeds/list/1yC1CzlMGFycz9o5z4FJoab5N3cgHvOT9HhXjJXHRNA8/od6/public/values?alt=json";
  url_prices = adas_path+"prices.json";

  jQuery.getJSON(url_prices, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_prices_arr.push(this);
    });
    adas_prices_load();
  });


  var url_owners = "https://spreadsheets.google.com/feeds/list/1DpW__Ba7IMwhPUCHGYJBKc1IDpDpQqwpzoYcbC8ijGE/od6/public/values?alt=json";
  url_owners = adas_path+"owners2.json";

  jQuery.getJSON(url_owners, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_owners_arr.push(this);
    });
    adas_owners_load();
  });


  var url_timeline = "https://spreadsheets.google.com/feeds/list/1ita6b-cQqDsO1cIwd2JFkrNuyfKMjt3maVabMfMpdy8/od6/public/values?alt=json";
  url_timeline = adas_path+"timeline3.json";

  jQuery.getJSON(url_timeline, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_timeline_arr.push(this);
    });
    adas_timeline_load();
  });

  var url_size = "https://spreadsheets.google.com/feeds/list/1reKesUMtxJeQ-d_4EJbPn5FKSKc9w-gmwMQA4HK_n6M/od6/public/values?alt=json";
  url_size = adas_path+"size4.json";

  jQuery.getJSON(url_size, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_size_arr.push(this);
    });
    adas_size_load();
  });

  var url_inequality = "https://spreadsheets.google.com/feeds/list/1M_e7e3VKbEgiYkrG3_rU26CX6gseBDvBTazcCWWqWuQ/od6/public/values?alt=json";
  url_inequality = adas_path+"inequality.json";

  jQuery.getJSON(url_inequality, function(data) {
    var entry = data.feed.entry;
    jQuery(entry).each(function(){
      adas_inequality_arr.push(this);
    });
    adas_inequality_load();
  });



});

jQuery(window).resize(function(){
  adas_timeline_layout_reset();
});








/* */
