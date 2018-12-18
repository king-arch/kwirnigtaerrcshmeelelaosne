
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
import { user_details } from './../../../import/collections/insert.js';
import { book_details } from './../../../import/collections/insert.js';
import { promotion } from './../../../import/collections/insert.js';

import { review_details } from './../../../import/collections/insert.js';
import { blog } from './../../../import/collections/insert.js';
import { campaign_details } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var campaign_details_all;

Template.admin_dashboard_details.onDestroyed(function () {
  book_listing.stop();
	campaign_details_all.stop();
});

Template.admin_dashboard_details.onCreated(function eventlistOnCreated(){

});

Template.admin_dashboard_details.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_book_listing').DataTable();

    });  
    });  



	book_listing = Meteor.subscribe("fetch_user_listing");
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
    var campaign_details_all = Meteor.subscribe('campaign_details_all_list');
		// click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000); 

});

 Template.admin_dashboard_details.helpers({

    total_user_count(){
      Meteor.subscribe('fetch_user_listing');
      var result = user_details.find({user_role: "User"}).count();
      return result;
    },

    total_book_count(){
      Meteor.subscribe('fetch_book_listing');
      var result = book_details.find({}).count();
      return result;
    },
    total_campaign_count(){
      Meteor.subscribe('campaign_details_all_list');
      var result = campaign_details.find({approval_status: 1}).count();
      return result;
    },

    total_blogs_count(){
      Meteor.subscribe('fetch_blog_content');
      var result = blog.find({blog_status: 1}).count();
      return result;
    },

    total_promotion_count(){
      Meteor.subscribe('fetch_promotion_listing');
      var result = promotion.find({}).count();
      return result;
    },
    total_review_count(){
      Meteor.subscribe('review_details_all_pending');
      var result = review_details.find({content_type: "submit_review"}).count();
      return result;
    },

});

Template.admin_dashboard_details.events({

    'click #send_to_blog_management': function(){
      Router.go("/blog_management");
    },
    'click #send_to_user_management': function(){
      Router.go("/user_management");
    },

    'click #send_to_campaign_management': function(){
      Router.go("/campaign_listing_admin");
    },

    'click #send_to_promotion_management': function(){
      Router.go("/promotion_listing");
    },

    'click #send_to_book_management': function(){
      Router.go("/blog_listing_admin");
    },

    'click #send_to_review_management': function(){
       Router.go("/campaign_listing_admin");
    },
    
    'click #add_interest': function(){
      window.location.href="/create_interest";
    },

    'click #reset_reward_point_rate': function(){
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

    'click #edit_work_with_us': function(){
    	window.location.href="/edit_work_with_us";
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