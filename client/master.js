
    Template.registerHelper('equals', function (a, b) {
      return a === b;
    });

    Template.registerHelper('!equals', function (a, b) {
      return a === b;
    });

   Template.registerHelper('calculate_time_difference', function (a) {

    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);
   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + 'h';
        }else{ 
        return Math.floor(hours) + 'h';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d";
    }else{
    return Math.floor(days) +"d";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
  }
  
});


   Template.registerHelper('calculate_time_difference_ago', function (a) {

    var dt = new Date(a);
   var millis =    new Date().getTime() - dt.getTime() ;
      var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);

   var hours = (millis / (1000 * 60 * 60)).toFixed(1);

 var days = (millis / (1000 * 60 * 60 * 24)).toFixed(1);
   if(minutes<1 && seconds<10){
    return 'now';
  }else if(minutes <1 && seconds<59 ){
    return seconds + 's ago';
   } else if(minutes>= 1 && minutes<=59) {
    return minutes + 'm ago';
  }else if(minutes>=60 && hours<24){
        if(Math.floor(hours)==1 || minutes==60){
        return Math.floor(hours) + 'h ago';
        }else{ 
        return Math.floor(hours) + 'h ago';
        }
  }else if(hours>24){
    if(Math.floor(days) == 1){
    return Math.floor(days) +"d ago";
    }else{
    return Math.floor(days) +"d ago";
    }
  }
  else{    
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds  + "  [" + a.toString('YYYY-MM-dd').slice(0,25) + "] ";
  }
  
});