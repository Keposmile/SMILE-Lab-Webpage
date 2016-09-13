$(document).ready(function() {
  showRelationship("/data/temp.json");
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
      }
    ],
  });
});
