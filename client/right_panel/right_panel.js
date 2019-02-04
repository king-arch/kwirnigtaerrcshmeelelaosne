
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';
import { feed }  from './../../import/collections/insert.js';

import { book_details }  from './../../import/collections/insert.js';
import { categories_selection }  from './../../import/collections/insert.js';
   import { campaign_details } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';
import swal from 'sweetalert';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;
var categories_selected;
var result_interested;

Template.right_panel.onDestroyed(function(){
  user_info_list_all.stop();
  user_info_based_on_email.stop();
  follow_list_all.stop();
  result_interested.stop();
  categories_selected.stop();

});

Template.right_panel.onRendered(function(){

   Session.set("intrest_array","");
   result_interested = Meteor.subscribe('fetch_result_interest');
   categories_selected = Meteor.subscribe('categories_selection_for_user',Session.get("userId"));

  user_info_list_all = Meteor.subscribe("user_info_list_all");
  follow_list_all = Meteor.subscribe("follow_list_all");

});

Template.right_panel.helpers({


  book_name_trimmed(){
         var logged_in_user = Session.get("userId");

         var book_name = this.book_name;
         if(book_name.length > 21){
            return book_name.slice(0, 21)+'...';
         }
         else{
            return book_name; 
         } 
  },


        check_user_profile_pic(){

      if(this.user_profile_pic){
        return this.user_profile_pic;
      }
      else{
        return '/img/avatar1.jpg';
      }

    },

      show_campaign_listing(){

      Meteor.subscribe("campaign_details_all_active");
      var result = campaign_details.find({approval_status: 1,campaign_end_date: {$gte: Date.now()} },{sort: {created_at: -1}}).fetch();
      return result;
    },

      show_user_info(){ 

      var follow_user_id = this.user_id;
      var logged_in_user = Session.get("userId");
      var admin_id = "user_admin";

      Meteor.subscribe("people_you_may_follow_listing",follow_user_id,logged_in_user);
        Meteor.subscribe("fetch_user_listing");

      var result = user_details.find({ user_id: {  $ne: logged_in_user  }}).fetch();
      var new_result = new Array();
      var count = 1;
      for(var i = 0; i < result.length; i++){
          if(count <= 5 && result[i].user_id != admin_id){
            var result2 = following_list.find({ $and: [{ "following": result[i].user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();
             if(result2[0]){

             }else{
              new_result.push(result[i]);
              count = count + 1;
             }    
          }
        }
      return new_result;
    },

    user_name_to_follow(){
      var user_name = this.user_name;
      if(user_name.length > 8){
        return user_name.slice(0, 8)+'...';
      }
      else{
        return user_name;
      }
    },

    check_if_already_following(){

      var follow_user_id = this.user_id;
      var logged_in_user = Session.get("userId");
      Meteor.subscribe("get_follow_status_with_ids",user_id,logged_in_user);
     
      var result = following_list.find({ $and: [{ "following": follow_user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();    
      if(result[0]){
        return false;
      }else{
        return true;
      }
    },

      display_books(){
         var liked_by = Session.get("userId");
         var limit = 5;
         Meteor.subscribe("fetch_book_listing_with_limit",limit);
         var result = book_details.find({},{limit: limit,sort: {created_at: -1}}).fetch();
    return result;
  },


});

Template.right_panel.events({

    "click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.book_id);  
      var url = '/book_detail/'+book_id;
            console.log(url);
            window.location.href = url;
    },
      'click .view_profile':function(){      
      // swal('captured');  
                  // console.log('captured');  
                  // console.log("this.post_by");  
            // console.log(JSON.stringify(this));
            console.log(this.user_id);
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            console.log(url);
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


  });
