
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

import { user_details } from './../../../import/collections/insert.js';
import { following_list } from './../../../import/collections/insert.js';

import { blog } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var blog_listing;

Template.followers_detail.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.followers_detail.onCreated(function eventlistOnCreated(){

});

Template.followers_detail.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

Session.set("search_query","");

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
    	setTimeout(function () {
			}, 2000);
    });  

  blog_listing = Meteor.subscribe("follow_list_all");
  
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

	  Session.set("set_followers_listing_limit",8);
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
        var old_post_count = Session.get("set_followers_listing_limit");
        var close_interval = setInterval(function () {
            $icon.show();
            // alert("update scroll...");
            Session.set("set_followers_listing_limit",Session.get("set_followers_listing_limit")+8);
              if(Session.get("set_followers_listing_limit") !=old_post_count){
              loading = false;
              clearInterval(close_interval)
            }
            
        }, 2500);
    }

 }
});

  fetch_all_followers_listing_count();

});




 Template.followers_detail.helpers({

    display_follower_list(){	
      var logged_in_user = Session.get("userId");
      var limit = Session.get("set_followers_listing_limit");

  // blog_listing = Meteor.subscribe("follow_list_follower_listing",logged_in_user,limit);


	    var result = following_list.find({following: logged_in_user,current_follow_status: 1 },{limit: limit, sort: {created_at: -1}}).fetch();
	    return result;
    },

    fetch_user_info_follower(){ 
      var user_id = this.follower;      
      var search_query = Session.get("search_query");
      const query = new RegExp(search_query,'i');  

      if(search_query == ""){
         Meteor.subscribe("user_info_based_on_id_for_community",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         return result;
      }else{
         Meteor.subscribe("user_info_based_on_id_for_community",user_id);
         var result = user_details.find({user_id: user_id,user_name: query},{sort: {created_at: -1}}).fetch();
         return result;
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
        var result = following_list.find({ "follower": this.user_id , "current_follow_status": 1 }).count();
        if(result > 1){
        return result;
        }
        else{
        return 0;
        }
    },

    show_followers_count(){
        var user_id = this.user_id
        var limit = Session.get("set_followers_listing_limit");
        Meteor.subscribe("follow_list_follower_count_for_user",user_id);

        var result = following_list.find({ "following": this.user_id , "current_follow_status": 1 }).count();
        if(result > 1){
          return result;
          }
          else{
          return 0;
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

        get_followers_count(){ 
          var count = Session.get("fetch_all_followers_listing_count");          
          return count;
    },

});

Template.followers_detail.events({
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
      var follow_user_id = this.user_id; 
      var logged_in_user = Session.get("userId");  

      swal("Are you sure you want to follow this user ?", {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Sure",
            value: "catch",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "defeat":
            swal("Pikachu fainted! You gained 500 XP!");
            break;

          case "catch":
      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
                fetch_all_followers_listing_count();
              }
          });
            break;
        }
      });
  },

      'click .click_on_unfollow':function(){
              // alert("unfollow");
      var follow_user_id = this.user_id; 
      var logged_in_user = Session.get("userId");  

      swal("Are you sure you want to unfollow this user ?", {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Sure",
            value: "catch",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "defeat":
            swal("Pikachu fainted! You gained 500 XP!");
            break;

          case "catch":
      Meteor.call('unfollow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
                fetch_all_followers_listing_count();
              }
          });
            break;
        }
      });

  },

  'click .submit_search_text':function(){
    var search_text = $("#search_text").val(); 
    var logged_in_user = Session.get("userId");
    Session.set("search_query",search_text);
  },

    "click #show_all_following":function(){ 
      Router.go("/community/following");
    },

  "click #show_all_follower":function(){ 
      Router.go("/community/followers");
    },

});


function fetch_all_followers_listing_count(){

      var logged_in_user = Session.get("userId");
      Meteor.call("fetch_all_followers_listing_count",logged_in_user,function(error,result){
          if(error){

          }else{
                      console.log(result);
                      if(result == 0){
                      console.log("case 1");

                        $("#no_followers_div").removeClass("div_hide_class");
                        $("#no_followers_loader_div").addClass("div_hide_class");
                      }
                      Session.set("fetch_all_followers_listing_count",result);
          }
  });
}
