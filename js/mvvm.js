$(function(){
  setUp_keyword_table_column(3);
  var vm_table_columns=avalon.define({
    $id:"table-columns",
    head:[{
        title:"大众汽车尾气排放丑闻",
        groupId:1,
        disabled:false
      },{
        title:"美国总统选举",
        groupId:2,
        disabled:false
      },{
        title:"叙利亚战争",
        groupId:3,
        disabled:false
      },{
        title:"伊斯兰国",
        groupId:4,
        disabled:false
      }
    ],
    keywords_1:{
      academician:"academician",
      actor:"actor",
      businessman:"businessman",
      businessperson:"businessperson",
      soccer_player:"soccer_player",
      chemist:"chemist",
      teacher:"teacher"
    },
    keywords_2:{
      vegetarian:"vegetarian",
      violinist:"violinist",
      trainer:"trainer",
      spiritual_leader:"spiritual_leader",
      sovereign:"sovereign",
      writer:"writer",
      wrestler:"wrestler",
      songwriter:"songwriter"
    },
    keywords_3:{
      device:"device",
      publication:"publication",
      ship:"ship",
      memorial:"memorial",
      catastrophe:"catastrophe",
      riot:"riot",
      invasion:"invasion",
      festival:"festival"
    },
    keywords_4:{

      team:"team",
      enterprise:"enterprise",
      league:"league",
      company:"company",
      institute:"institute",
      university:"university"
    },
    selected:{
      column1:[],
      column2:[],
      column3:[],
      column4:[],
    },
    disabled_other_columns:function(e){
      //禁用其他列的方法
      var _this=$(e.target);
      if(_this.find("input[type=checkbox]:eq(0)").attr("disabled")){
        console.log("out");
        return false;
      }

      // label样式设置
      var _thisColumnClass=$(e.target).attr("class");
      if(_this.attr("data-selected")=="selected"){
        _this.attr("data-selected","");
      }else {
        _this.attr("data-selected","selected");
      }

      // console.log(_thisColumnClass);
      var pattern=/(keywords_)([0-9])+/;
      var _thisGroupIndex=_thisColumnClass.match(pattern)[2];
      // console.log(_thisGroupIndex);
      var otherColumnInput=$("#hide-tab-1 table input[type=checkbox]:not(."+_thisColumnClass+")");//获取非本列的input checkbox
      otherColumnInput.attr("disabled",true).parent().addClass("checkbox-disabled");//禁用其他列
      // console.log($("#hide-tab-1 table input[type=checkbox]:not(."+_thisColumnClass+")"));
      if(this.selected["column"+_thisGroupIndex].length===0){//检测到本列数据为空时，还原其他列
        otherColumnInput.attr("disabled",false).parent().removeClass("checkbox-disabled");
      }
      console.log($("#hide-tab-1 table input[type=checkbox][checked=true]").parent().length);
    },
    remove_from_table_selected:function(e){
      var thisKeyword=$(e.target).parent().parent().find("span:eq(1)").text();
      console.log($("#"+thisKeyword));
      $("#"+thisKeyword).trigger("click").parent().attr("data-selected","");
    },
    remove_all_selected:function(){
      var selected= this.selected;
      for (var i in selected) {
        for(var j=0;selected[i].length!==0;){
          $("#"+selected[i][j]).trigger("click").parent().attr("data-selected","");
        }
      }
    },
    submit_all_keywords:function(){

    },
    result:{

    },
    show_search:function(){
      return  isEmpty(this.result);
    },
    show_result:function(){
      return  !isEmpty(this.result);
    }
  });
  var vm_result=avalon.define({
    $id:"result",

  });
  avalon.scan(document.body);
});
function setUp_keyword_table_column(columnNum){
  $("#hide-tab-1 table>thead>tr").append("<th ms-for=\"(key,el) in @head | limitBy("+columnNum+")\" ms-attr=\"{id:@head[key].groupId}\">{{el.title}}</th>");
  for (var i = 1; i <= columnNum; i++) {
    $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\" onselectstart=\"return false\"  ms-on-click=\"@disabled_other_columns\"  ms-attr=\"{for:@keywords_"+i+"[key],class:'keywords_"+i+"'}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column"+i+"\" ms-attr=\"{id:@keywords_"+i+"[key],value:@keywords_"+i+"[key],class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
  }
}
function isEmpty(obj)
{
  for (var name in obj)
  {
    return false;
  }
  return true;
}
