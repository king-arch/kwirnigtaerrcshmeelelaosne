
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
import { campaign_details } from './../../../import/collections/insert.js';
import { book_details } from './../../../import/collections/insert.js';
import { blog } from './../../../import/collections/insert.js';
import { book_id } from './../../../import/collections/insert.js';

import { user_details } from './../../../import/collections/insert.js';
import { notification_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var blog_listing;

Template.admin_notification_details.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.admin_notification_details.onCreated(function eventlistOnCreated(){

});

Template.admin_notification_details.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  

	// book_listing = Meteor.subscribe("fetch_book_listing");

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000); 


      Meteor.call('change_notification_seen_status',function(error,result){
        if(error){
            console.log("Error");
        }else{
            console.log("Successfully removed from my collection");
        }
      }); 
      
      
	  Session.set("set_book_listing_content_limit",7);
  var loading;

var block=0;
var $loading = $('<div class="loading"><img class="loading-icon" src="http://imageserver.webpropartners.com/AdminMedia/SpecialtyImages/CaptchaImages/loading.gif" width="25"></div>');
var $icon = $loading.find('img');

$(document).ready(function() {
  window.onscroll = function() {
      if (block === -1) {
        return;
    }
    var scrollTop = $(document).scrollTop();
    var windowHeight = $(window).height();     var bodyHeight = $(document).height() - windowHeight;
   
    var scrollPercentage = (scrollTop / bodyHeight);
    if(scrollPercentage > 0.9 && !loading) {
        loading = true;
        var old_post_count = Session.get("set_book_listing_content_limit");
        var close_interval = setInterval(function () {
            $icon.show();
            Session.set("set_book_listing_content_limit",Session.get("set_book_listing_content_limit")+6);
              if(Session.get("set_book_listing_content_limit") !=old_post_count){
              loading = false;
              clearInterval(close_interval)
            }
            
        }, 2500);
     }  
   }
  });
});

 Template.admin_notification_details.helpers({

    show_notification_listing(){ 
      var logged_in_user = Session.get("userId");
      Meteor.subscribe("notification_details_for_admin",logged_in_user);
    
      var result = notification_details.find({notification_to: 'writersmelon'},{sort: {created_at: -1}}).fetch();
      console.log('book_collections');
      console.log(result);
      return result;
    },
    
          fetch_user_info(){
             var user_id = this.requested_by;  
             // console.log(user_id);            
             Meteor.subscribe("user_info_based_on_id",user_id);
             var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
             console.log('show requesters details');
             console.log(result);
             return result;
        },


          fetch_user_info_for_request(){ 
             var user_id = this.notification_by;

             // console.log(user_id);            
             Meteor.subscribe("user_info_based_on_id",user_id);
             var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
             // console.log('show requesters details');
             // console.log(result);
             return result;
        },

          fetch_bookname_with_campaign_id(campaign_id){ 
             // var campaign_id = this.campaign_id;  
             Meteor.subscribe("campaign_details_with_id",campaign_id);

             var result = campaign_details.find({ campaign_id: campaign_id }).fetch();
             console.log('show campaign details');
             console.log(result);
             return result;
        },


        fetch_bookname_with_campaign(){ 
             var book_id = this.book_id;  
             Meteor.subscribe("fetch_book_detail_with_id",book_id);

             var result = book_details.find({ book_id: book_id }).fetch();
             console.log('show Book details');
             console.log(result);
             return result;
        },


          fetch_blog_name(blog_id){ 
             // var blog_id = this.blog_id;  
             console.log('blog_id');
             console.log(blog_id);
             Meteor.subscribe("fetch_blog_content_with_blog_id",blog_id);

             var result = blog.find({ blog_id: blog_id }).fetch();
             console.log('show blog details');
             console.log(result);
             return result;
        },

          fetch_user_info_for_follow(){ 
             var notification_by = this.notification_by;  
             Meteor.subscribe("user_info_based_on_id",notification_by);

             var result = user_details.find({ user_id: notification_by }).fetch();
             console.log('show follower details');
             console.log(result);
             return result;
        },

        //   make_highlighted(){ 
        //      var notification_status = this.notification_status;  
        //      var notification_id = this.notification_id;  
        //      if(notification_status == 1){
        //       $('#'+notification_id).addClass("highlight");
        //      }else{
        //       return false;
        //      }
        // },

});

Template.admin_notification_details.events({

    // 'click .view_profile':function(){  
    //         // swal("clicked");    
    //         var user_id = Base64.encode(this.user_id);  
    //         if(this.user_id == Session.get("userId")){
    //           var url = '/profile';
    //         }else{
    //           var url = '/view_profile/'+user_id;
    //         }
    //         window.location.href = url;
    // }, 

  "click #remove_to_my_collections":function(){ 
    var logged_in_user = Session.get("userId");
    var book_id = this.book_id;

    var adding_status = 0;
    var adding_id = 'adding_id_'+Math.floor((Math.random() * 2465789) + 1);

    Meteor.call('add_to_my_collections',logged_in_user,book_id,adding_status,adding_id,function(error,result){
        if(error){
            swal("Error");
        }else{
            swal("Successfully removed from my collection");
        }
      });  
    },

    "click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.campaign_id);  
      var url = '/campaign_detail/'+book_id;
            console.log(url);
            window.location.href = url;
    },

    "click .go_to_blog_detail":function(){ 
      var blog_id = Base64.encode(this.blog_id);  
      var url = '/admin_blog_detail/'+blog_id;
            console.log(url);
            window.location.href = url;
    },

});