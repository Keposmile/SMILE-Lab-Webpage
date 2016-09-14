$(document).ready(function() {
  $("#returnBtn").on("click",function(){
    window.location="./index.html"
  });
  showRelationship("/data/result/temp.json");
  var vm_result=avalon.define({
    $id:"leftDiv",
    title:"??爱看桑看",
    content:[
      {
        title:"1",
        Triplets:[
          {
            "TripletOrder":2,
            "Confidence":0.97,
            "Subject":"One of them",
            "Relation":"is",
            "Object":"the garage door",
            "Attribute":"attri"
          }
        ]
      },
      {
        title:"2",
        Triplets:[
          {
            "TripletOrder":2,
            "Confidence":0.97,
            "Subject":"One of them",
            "Relation":"is",
            "Object":"the garage door",
            "Attribute":"attri"
          }
        ]
      }
    ],
  });
});
