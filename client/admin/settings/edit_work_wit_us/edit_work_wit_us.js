
import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
import {
  Session
} from 'meteor/session';

import swal from 'sweetalert';
import { book_details } from './../../../../import/collections/insert.js';
import { interest_list } from './../../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.edit_work_with_us_details.onDestroyed(function () {
  book_listing.stop();
});

Template.edit_work_with_us_details.onCreated(function eventlistOnCreated(){

});

Template.edit_work_with_us_details.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_book_listing').DataTable();

    });  
    });  

  book_listing = Meteor.subscribe("show_work_with_us");
  setTimeout(function () {
    $('#loading_div').addClass("loader_visiblity_block");

    // click_events();
    // $('#loading_div').addClass('loader_visiblity_block');
  }, 2000);

      Meteor.call('display_work_with_us',function(error,result){
      if(error){
          console.log("Error");
      }else{
      
       console.log("terms and conditions succesfully fetched.");

      var work_with_us_text = result[0].work_with_us_text;
      $('#work_with_us').trumbowyg('html',work_with_us_text);
       
      }
    });  

});


 Template.edit_work_with_us_details.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

     display_current_reward_rate() {
    var current_reward_rate = Session.get("current_reward_rate");
    return current_reward_rate;
  },
});

Template.edit_work_with_us_details.events({

    'click #add_interest': function(){
      window.location.href="/create_interest";
    },

    'click #reset_reward_point_rate': function(){
      // swal('here i am');
       $('#edit_reward_rate_frame').removeClass("loader_visiblity_block");
       $('#display_reward_rate_frame').addClass("loader_visiblity_block");
    },

    'click #point_management': function(){
      window.location.href="/point_management";
    },

    'click #invoice_management': function(){
      window.location.href="/invoice_management";
    },

    'click #change_content': function(){
      window.location.href="/content_listing";
    },

 'click #submit_work_with_us': function(){
    var work_with_us = $("#work_with_us").val();

    if(work_with_us == null || work_with_us == '')
              {
                $("#work_with_us").addClass('emptyfield2').focus();
                return false;
              }
    else
              {
                $("#work_with_us").removeClass('emptyfield2');
              }
// swal(' work_with_us '+work_with_us);
    $('#loader_gif').removeClass('div_hide_class');
    $('#save_text').addClass('div_hide_class');

    Meteor.call('update_work_with_us',work_with_us,function(error,result){

    $('#loader_gif').addClass('div_hide_class');
    $('#save_text').removeClass('div_hide_class');

      if(error){
        console.log("Error");
      }else{
       console.log("succesfully updated.");
       window.history.go(-1);
      }
    });  

  },

});