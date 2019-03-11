
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

Template.content_management_details.onDestroyed(function () {
	book_listing.stop();
});

Template.content_management_details.onCreated(function eventlistOnCreated(){

});

Template.content_management_details.onRendered(function () {



    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_book_listing').DataTable();

    });  
    });  



	book_listing = Meteor.subscribe("show_content_data");
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");

		// click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);

      Meteor.call('display_reward_rates',function(error,result){
      if(error){
          console.log("Error");
      }else{
      
       console.log("rates succesfully fetched.");

       Session.set("current_reward_rate",result[0].reward_rates);
       $('#reward_rates').val(result[0].reward_rates);
       
      }
    });  

});




 Template.content_management_details.helpers({

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


Template.content_management_details.events({

    'click #add_interest': function(){
      window.location.href="/create_interest";
    },

    'click #reset_reward_point_rate': function(){
      // swal('here i am');
       $('#edit_reward_rate_frame').removeClass("loader_visiblity_block");
       $('#display_reward_rate_frame').addClass("loader_visiblity_block");
    },

    'click #edit_terms': function(){
      window.location.href="/edit_terms";
    },

    'click #edit_privacy_policy': function(){
      window.location.href="/edit_privacy_policy";
    },

    'click #edit_cancellation_policy': function(){
      window.location.href="/edit_cancellation_policy";
    },

    'click #edit_review_policy': function(){
      window.location.href="/edit_review_policy";
    },

    'click #edit_copyright_policy': function(){
      window.location.href="/edit_copyright_policy";
    },

    'click #edit_reward_policy': function(){
      window.location.href="/edit_reward_policy";
    },

    'click #edit_about_us': function(){
    	window.location.href="/edit_about_us";
    },

 'click #submit_reward_rate': function(){
		var reward_rates = $("#reward_rates").val();

    if(reward_rates == null || reward_rates == '')
              {
                $("#reward_rates").addClass('emptyfield2').focus();
                return false;
              }
    else
              {
                $("#reward_rates").removeClass('emptyfield2');
              }
// swal(' reward_rates '+reward_rates);
    $('#loader_gif').removeClass('div_hide_class');
    $('#save_text').addClass('div_hide_class');

    Meteor.call('update_reward_rates',reward_rates,function(error,result){

    $('#loader_gif').addClass('div_hide_class');
    $('#save_text').removeClass('div_hide_class');

      if(error){
        console.log("Error");
      }else{
        console.log("succesfully updated.");
       $('#edit_reward_rate_frame').addClass("loader_visiblity_block");
       $('#display_reward_rate_frame').removeClass("loader_visiblity_block");
       Session.set("current_reward_rate",reward_rates);
      }
    });  

	},

});