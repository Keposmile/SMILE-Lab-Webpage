$(document).ready(function() {
  $("#returnBtn").on("click",function(){
    window.location="./index.html";
  });
  // showRelationship("/data/result/tep1.json");
  var vm_result=avalon.define({
    $id:"leftDiv",
    title:"Multi-Document Semantics",
    content:[
        {
         Num:1,
         Entity:"aa",
         Neighbours:[{
           TripletOrder:1,
           Confidence:0.82,
           Subject:"Comcast",
           Relation:"aa",
           Object:"bb",
           Attribute:"attri"
         },{
             TripletOrder:1,
             Confidence:0.82,
             Subject:"Comcast",
             Relation:"aa",
             Object:"bb",
             Attribute:"attri"
         }]
       },{
         Num:2,
         Entity:"Comcast",
         Neighbours:[{
             TripletOrder:1,
             Confidence:0.82,
             Subject:"Comcast",
             Relation:"aa",
             Object:"bb",
             Attribute:"attri",
             this:"Comcast"
         },{
             TripletOrder:1,
             Confidence:0.82,
             Subject:"Comcast",
             Relation:"aa",
             Object:"bb",
             Attribute:"attri",
             this:"Comcast"
         }]
       }
    ],
    graphData:{
        nodes:[
            {
                "id": 3,
                "name": "LADY Elsie Robson",
                "numNeighbors": 14
            },
            {
                "id":4,
                "name": "Works by the Newcastle Painters Group",
                "numNeighbors": 23
            }
        ],
        links:[
            {
                "id": 11,
                "source": 3,
                "target": 4,
                "tags": [
                    {
                        "label": "will officially unveil"
                    }
                ]
            }
        ]
    },
    updateGraphData:function(url){
        showRelationship(url,vm_result.graphData);
    }
  });
  // showRelationship("/data/result/tep1.json",vm_result.graphData);
});
