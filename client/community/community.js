
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
import { campaign_details } from './../../import/collections/insert.js';
import { book_details } from './../../import/collections/insert.js';

import { user_details } from './../../import/collections/insert.js';
import { following_list } from './../../import/collections/insert.js';

import { blog } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var blog_listing;

Template.community_detail.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.community_detail.onCreated(function eventlistOnCreated(){

});

Template.community_detail.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

Session.set("search_query","");

    // $.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
    // $.getScript("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js");
    // $.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        // $('#show_book_listing').DataTable();
			}, 2000);
    });  

	blog_listing = Meteor.subscribe("follow_list_all");
	// book_listing = Meteor.subscribe("fetch_book_listing");

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

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




 Template.community_detail.helpers({

    display_following_list(){ 
      var logged_in_user = Session.get("userId");
      var result = following_list.find({follower: logged_in_user,current_follow_status: 1 },{limit: 100,sort: {created_at: -1}}).fetch();
      return result;
    },

    display_follower_list(){	
      var logged_in_user = Session.get("userId");
	    var result = following_list.find({following: logged_in_user,current_follow_status: 1 },{limit: 100,sort: {created_at: -1}}).fetch();
	    return result;
    },

    fetch_user_info_following(){ 
      var user_id = this.following;    

      var search_query = Session.get("search_query");
      const query = new RegExp(search_query,'i');  

      if(search_query == ""){
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id,user_name: query},{sort: {created_at: -1}}).fetch();
         return result;
      }else{
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id,user_name: query},{sort: {created_at: -1}}).fetch();
         return result;
       }
    },

    fetch_user_info_follower(){ 
         var user_id = this.follower;            
      // var user_id = this.following;    

      var search_query = Session.get("search_query");
      const query = new RegExp(search_query,'i');  

      if(search_query == ""){
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         return result;
      }else{
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id,user_name: query},{sort: {created_at: -1}}).fetch();
         return result;
       }

    },

    check_if_following(){ 
         var user_id = this.user_id;            
         var logged_in_user = Session.get("userId");            
         var result = following_list.find({following: user_id,follower: logged_in_user,current_follow_status: 1}).fetch();
          
          if(result[0]){
            return true;
          }else{
            return false;
          }
    },

    user_profile_pic(){
         if(this.user_profile_pic){
          return this.user_profile_pic;
         }else{
          return "/img/avatar1.jpeg";
        }
      },

    user_cover_pic(){
         if(this.user_cover_pic){
          // console.log(this.user_cover_pic);
          return this.user_cover_pic;
         }else{
          return "/img/top-header1.jpg";
        }
      },

    user_location(){
         if(this.user_location){
          return this.user_location;
         }else{
          return "No location added.";
         }
    },

    user_name_to_follow(){
      var user_name = this.user_name;
      if(user_name.length > 15){
        return user_name.slice(0, 15)+'...';
      }
      else{
        return user_name;
      }
    },

    
user_headline_trimmed(){

  var user_headline = this.user_headline;
  if(user_headline){

  if(user_headline.length > 18){
      return user_headline.slice(0,18)+'...';
  }else{
    return user_headline;
  }
  }else{
    return 'No Headline';
  }
},

    show_following_count(){
        var logged_in_user = Session.get("userId"); 
        // console.log(this);
        // console.log(user_id);
        var result = following_list.find({ "follower": this.user_id , "current_follow_status": 1 }).count();
        if(result > 1){
        return result;
        }
        else{
        return 0;
        }
    },

    show_followers_count(){
        var logged_in_user = Session.get("userId"); 
        var result = following_list.find({ "following": this.user_id , "current_follow_status": 1 }).count();
        if(result > 1){
          return result;
          }
          else{
          return 0;
          }
    },

});

Template.community_detail.events({

    'click .view_profile':function(){      
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            window.location.href = url;
    }, 

      'click .click_on_follow':function(){
    // swal('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // swal('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },

      'click .click_on_unfollow':function(){
    // swal('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // swal('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

      Meteor.call('unfollow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },

      'click .submit_search_text':function(){
    
    var search_text = $("#search_text").val(); 
    var logged_in_user = Session.get("userId");
    
    // if(search_text == null || search_text == '')
    // {
    //   $("#search_text").addClass('emptyfield2').focus();
    //   return false;
    // }
    // else
    // {
    //   $("#search_text").removeClass('emptyfield2');
    // }
    // swal(search_text);
    Session.set("search_query",search_text);

  },

    "click #show_all_following":function(){ 
      Session.set("filter_content",0);

    },

  "click #show_all_follower":function(){ 
      Session.set("filter_content",1);
    },


    "click .change_filter_by_status":function(){ 
// alert('clicked');
// alert(Session.get("filter_content"));
    if(Session.get("filter_content") == 0){
      // alert("case 0");
       $("#show_all_following_with_check").removeClass("loader_visiblity_block");
       $("#show_all_follower").removeClass("loader_visiblity_block");

       $("#show_all_follower_with_check").addClass("loader_visiblity_block");
       $("#show_all_following").addClass("loader_visiblity_block");

       $("#div_for_following").removeClass("loader_visiblity_block");
       $("#div_for_follower").addClass("loader_visiblity_block");
         
    }
    else if(Session.get("filter_content") == 1){
    // alert("case 1");
       
       $("#show_all_follower_with_check").removeClass("loader_visiblity_block");
       $("#show_all_following").removeClass("loader_visiblity_block");

       $("#show_all_follower").addClass("loader_visiblity_block");
       $("#show_all_following_with_check").addClass("loader_visiblity_block");

       $("#div_for_following").addClass("loader_visiblity_block");
       $("#div_for_follower").removeClass("loader_visiblity_block");
    }

    },


});