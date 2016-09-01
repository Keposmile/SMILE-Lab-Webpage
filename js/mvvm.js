$(function(){
  setUp_keyword_table_column(3);
  var vm_table_columns=avalon.define({
    $id:"table-columns",
    head:[{
        title:"大众汽车尾气排放丑闻",
        groupId:1
      },{
        title:"美国总统选举",
        groupId:2
      },{
        title:"叙利亚战争",
        groupId:3
      },{
        title:"伊斯兰国",
        groupId:4
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
    remove_from_table_selected:function(e){
      var thisKeyword=$(e.target).parent().parent().find("span:eq(1)").text();
      console.log($("#"+thisKeyword));
      $("#"+thisKeyword).trigger("click");
    },
    remove_all_selected:function(){
      var selected= this.selected;
      for (var i in selected) {
        for(var j=0;selected[i].length!==0;){
          $("#"+selected[i][j]).trigger("click");
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
    $("#hide-tab-1 table>tbody>tr").append("<td><label ms-for=\"(key,el) in @keywords_"+i+"\" onselectstart=\"return false\" ms-attr=\"{for:@keywords_"+i+"[key]}\"><input  type=\"checkbox\" ms-duplex=\"@selected.column"+i+"\" ms-attr=\"{id:@keywords_"+i+"[key],value:@keywords_"+i+"[key],class:'keywords_"+i+"'}\">{{el}}</label><!-- <div>{{@selected.column1}}</div> --></td>");
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
