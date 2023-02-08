
$(function(){
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
    });
});

$.datepicker.setDefaults({
    showOn: "both",
    buttonImageOnly: true,
    buttonImage: "calendar.gif",
    buttonText: "Calendar"
  });

  var widget = $( ".selector" ).datepicker( "widget" );

  $( ".selector" ).datepicker( "show" );

  console.log($('datepicker'));