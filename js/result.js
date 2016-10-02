$(document).ready(function() {
  $("#returnBtn").on("click",function(){
    window.location="./index.html"
  });
  showRelationship("/data/result/temp.json");
  var vm_result=avalon.define({
    $id:"leftDiv",
    title:"Multi-Document Semantics",
    content:[
      {
        title:"1",
        Triplets:[
          {
            "Confidence":0.97,
            "Subject":"One of them",
            "Relation":"is",
            "Attribute":"attri"
          }
        ]
      },
      {
        title:"2",
        Triplets:[
          {
            "Confidence":0.97,
            "Subject":"One of them",
            "Relation":"is",
            "Object":"the garage door",
          }
        ]
      }
    ],
  });
});
