
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
import { content } from './../../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.point_master_details.onDestroyed(function () {
	book_listing.stop();
});

Template.point_master_details.onCreated(function eventlistOnCreated(){

});

Template.point_master_details.onRendered(function () {



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

    //   Meteor.call('display_reward_rates',function(error,result){
    //   if(error){
    //       console.log("Error");
    //   }else{
      
    //    console.log("rates succesfully fetched.");

    //    Session.set("current_reward_rate",result[0].reward_rates);
    //    $('#reward_rates').val(result[0].reward_rates);
       
    //   }
    // });  

});




 Template.point_master_details.helpers({

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
   
   show_reward_points(){

          var result = content.find({content_type: "reward_points"}).fetch();

          var new_array = new Array();     
          if(result[0]){
            new_array.push({'index': 1,'reward_release_points': 'Review submition','points_value': result[0].review_submition,'field_name': 'review_submition'});
            new_array.push({'index': 2,'reward_release_points': 'Book purchase','points_value': result[0].book_purchase,'field_name': 'book_purchase'});
            new_array.push({'index': 3,'reward_release_points': 'Blog approval','points_value': result[0].blog_approval,'field_name': 'blog_approval'});

            new_array.push({'index': 4,'reward_release_points': 'Sign up completion','points_value': result[0].signup_completion,'field_name': 'signup_completion'});
            new_array.push({'index': 5,'reward_release_points': 'Social media shared','points_value': result[0].socail_media_handle_shared,'field_name': 'socail_media_handle_shared'});
            new_array.push({'index': 6,'reward_release_points': 'Profile completion','points_value': result[0].profile_completion,'field_name': 'profile_completion'});
          }
          console.log('show new reward array');
          console.log(new_array);

          return new_array;

   },

});


Template.point_master_details.events({

    'click #add_interest': function(){
      window.location.href="/create_interest";
    },

    'click #reset_reward_point_rate': function(){
      // alert('here i am');
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

    'click .edit_reward_points': function(){
    	var new_value = $("#disaply_edit_box_"+this.index).removeClass("loader_visiblity_block");
       $("#new_value_"+this.index).val(this.points_value);
     },



 'click .submit_reward_points': function(){


    // alert(' index: '+ this.index);
    var new_value = $("#new_value_"+this.index).val();
    // alert(' index: '+ new_value);

    if (new_value == '' || new_value == undefined) {

      $("#new_value_"+this.index).addClass('empty_field').focus();
      return false;

    } else {
      $("#new_value_"+this.index).removeClass('empty_field').blur();
    }

    $('#loader_gif').removeClass('div_hide_class');
    $('#save_text').addClass('div_hide_class');

    Meteor.call('update_reward_management',this.field_name,new_value,function(error,result){

    $('#loader_gif').addClass('div_hide_class');
    $('#save_text').removeClass('div_hide_class');

      if(error){
        console.log("Error");
      }else{
        console.log("succesfully updated.");
        // $("#disaply_edit_box_"+this.index).addClass("loader_visiblity_block");
       // $('#edit_reward_rate_frame').addClass("loader_visiblity_block");
       // $('#display_reward_rate_frame').removeClass("loader_visiblity_block");
       // Session.set("current_reward_rate",reward_rates);
      }
    });  
    $("#disaply_edit_box_"+this.index).addClass("loader_visiblity_block");

  },


 'click #reset_points_to_default': function(){

    Meteor.call('reset_reward_management',function(error,result){
      if(error){
        console.log("Error");
      }else{
        console.log("succesfully updated.");
      }
    });  

	},

});