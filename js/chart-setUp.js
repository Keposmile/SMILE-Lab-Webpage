// $(function(){
//   //Get the context of the canvas element we want to select
//   var data = {
//     labels : ["January","February","March","April","May","June","July","January","February","March","April","May","June","July"],
//     datasets : [{
//       fillColor : "rgba(220,220,220,0.5)",
//       strokeColor : "rgba(220,220,220,1)",
//       data : [65,59,90,81,56,55,40]
//     },
//     {
//       fillColor : "rgba(151,187,205,0.5)",
//       strokeColor : "rgba(151,187,205,1)",
//       data : [28,48,40,19,96,27,100]
//     }]
//   };
//   var   options = {
//     scales: {
//
//       yAxes: [{
//         stacked: false
//       }]
//     }
//   };
//   //Get context with jQuery - using jQuery's .get() method.
//   var ctx = $("#myChart").get(0).getContext("2d");
//   //This will get the first returned node in the jQuery collection.
//   var Bar = new Chart(ctx).Bar(data,options);
//   Bar.defaults = {
//
//     //Boolean - If we show the scale above the chart data
//     scaleOverlay : true,
//
//     //Boolean - If we want to override with a hard coded scale
//     scaleOverride : true,
//
//     //** Required if scaleOverride is true **
//     //Number - The number of steps in a hard coded scale
//     scaleSteps : null,
//     //Number - The value jump in the hard coded scale
//     scaleStepWidth : null,
//     //Number - The scale starting value
//     scaleStartValue : null,
//
//     //String - Colour of the scale line
//     scaleLineColor : "rgba(0,0,0,.1)",
//
//     //Number - Pixel width of the scale line
//     scaleLineWidth : 1,
//
//     //Boolean - Whether to show labels on the scale
//     scaleShowLabels : false,
//
//     //Interpolated JS string - can access value
//     scaleLabel : "<%=value%>",
//
//     //String - Scale label font declaration for the scale label
//     scaleFontFamily : "'Arial'",
//
//     //Number - Scale label font size in pixels
//     scaleFontSize : 12,
//
//     //String - Scale label font weight style
//     scaleFontStyle : "normal",
//
//     //String - Scale label font colour
//     scaleFontColor : "#666",
//
//     ///Boolean - Whether grid lines are shown across the chart
//     scaleShowGridLines : true,
//
//     //String - Colour of the grid lines
//     scaleGridLineColor : "rgba(0,0,0,0.5)",
//
//     //Number - Width of the grid lines
//     scaleGridLineWidth : 1,
//
//     //Boolean - If there is a stroke on each bar
//     barShowStroke : true,
//
//     //Number - Pixel width of the bar stroke
//     barStrokeWidth : 2,
//
//     //Number - Spacing between each of the X value sets
//     barValueSpacing : 5,
//
//     //Number - Spacing between data sets within X values
//     barDatasetSpacing : 1,
//
//     //Boolean - Whether to animate the chart
//     animation : true,
//
//     //Number - Number of animation steps
//     animationSteps : 60,
//
//     //String - Animation easing effect
//     animationEasing : "easeOutQuart",
//
//     //Function - Fires when the animation is complete
//     onAnimationComplete : null
//
//   };
//
//
// });
