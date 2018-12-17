

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
import { promotion } from './../../import/collections/insert.js';
import { campaign_details } from './../../import/collections/insert.js';
import { review_details } from './../../import/collections/insert.js';
import { blog } from './../../import/collections/insert.js';

import { book_details } from './../../import/collections/insert.js';
import { notification_details } from './../../import/collections/insert.js';
import { user_details } from './../../import/collections/insert.js';
import { book_collections } from './../../import/collections/insert.js';

import { following_list } from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing_all_subscribe;
var user_details_subscribe;
var blog_listing_all_subscribe;

Template.display_search_listing.onDestroyed(function () {
  book_listing_all_subscribe.stop();
  user_details_subscribe.stop();
  blog_listing_all_subscribe.stop();
});

Template.display_search_listing.onCreated(function eventlistOnCreated(){

});

Template.display_search_listing.onRendered(function () {

      var url = window.location.href;
      var new_url = url.split("/");
      search_text = new_url[new_url.length - 1];
      Session.set("get_search_string",search_text);

      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

      book_listing_all_subscribe = Meteor.subscribe("fetch_book_listing_with_search_string",search_text);
      user_details_subscribe = Meteor.subscribe("user_info_listing_with_search_string",search_text);
      blog_listing_all_subscribe = Meteor.subscribe("fetch_blog_content_with_search_string",search_text);

    });

 Template.display_search_listing.helpers({

        show_search_strings(){
          var get_search_string = Session.get("get_search_string");
          return get_search_string;
    },


    show_books_listing(){ 

      var get_search_string = Session.get("get_search_string");
      const query = new RegExp(get_search_string,'i');  

      if(get_search_string == ""){
        // swal("case 1");
      var result = book_details.find({},{sort: {created_at: -1}}).fetch();
      }else{

      var result = book_details.find({book_name: query},{sort: {created_at: -1}}).fetch();
      }
      return result;
    },

    check_if_up_for_review(){ 

      var logged_in_user = Session.get("userId");
      Meteor.subscribe("campaign_details_all_list");
      
      var result = campaign_details.find({book_id: this.book_id}).fetch();

        // console.log('show results for up for review');
        // console.log(result);
      if(result[0]){
        return true
      }else{  
      return false;
      }

    },

    check_if_editors_pic(){ 
      
      var result = this.editors_pick_status;
      if(result){
        return true
      }else{  
      return false;
      }

    },

    check_book_name_length(){
    var book_name = this.book_name;
    if(book_name.length > 19){
      // console.log("case 1");
      return false;
    }else{
      // console.log("case 2");
      return true;
    }
    },

    book_name_trimmed(){
    var book_name = this.book_name;
      // console.log("case 1");

      if(book_name.length > 27){
          return book_name.slice(0,27)+'...';
      }else{
        return book_name;
      }
    },


    check_if_book_already_added_to_my_collections(){

     // console.log(this.book_id);
     Meteor.subscribe("book_collections_all_with_user_id", Session.get("userId") );
     var result = book_collections.find({added_book_id: this.book_id, added_by: Session.get("userId") }).fetch();
      if(result[0]){
          return true;
      }else{
        return false;
      }     
},

    fetch_user_info_listing(){ 

      var search_query = Session.get("get_search_string");
      const query = new RegExp(search_query,'i');  

      var result = user_details.find({
        $and: [{user_id: {$ne: Session.get("userId") } },{user_id: { $ne: "user_admin"} }],
        user_name: query},{sort: {created_at: -1}}).fetch();

      // var result = user_details.find({user_name: query},{sort: {created_at: -1}}).fetch();
      console.log('user_listing');
      console.log(result);
      return result;

    },

        check_if_following(){ 

         var user_id = this.user_id;            
         var logged_in_user = Session.get("userId");     
         Meteor.subscribe("get_follow_status_with_ids",user_id,logged_in_user);                
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
      if(user_name.length > 8){
        return user_name.slice(0, 8)+'...';
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


    show_blog_listing(){  

      var result = blog.find({blog_status: 1},{limit: 10,sort: {created_at: -1}}).fetch();
      return result;
    },

        fetch_user_info(){
         var user_id = this.blog_author;  
         // console.log(user_id);            
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         // console.log('show author details');
         // console.log(result);
         return result;
    },


});


Template.display_search_listing.events({

    'click .view_profile':function(){      
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            window.location.href = url;
    },  


    "click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.book_id);  
      var url = '/book_detail/'+book_id;
            // console.log(url);
            window.location.href = url;
    },

    "click .apply_for_review":function(){
      // alert("apply now");
      var logged_in_user = Session.get("userId");
      var book_id = this.book_id;
      var campaign_id = this.campaign_id;

      var fetch_results = user_details.find({"user_id": logged_in_user}).fetch();

      campaign_details_subscribe = Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var fetch_campaign_details = campaign_details.find({campaign_id: this.campaign_id}).fetch();

if(fetch_campaign_details[0]){
  // alert('case 1');
  // alert('this');
  // console.log(this);
  if(fetch_campaign_details[0].delivery_option == "2"){

        user_location = "";

         Meteor.call('send_review_request',logged_in_user,book_id,campaign_id,user_location, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review is succesfully submited");
                window.location.reload();
              }
            });


  }else{

    user_location = fetch_results[0].user_location;
        swal('You have entered "'+user_location+'" as your postal address.'+
'If you want, You can change the postal adress from the edit information section of profile page.'+
' Make sure you have inserted your fully detailed address.'+
' If its not complete, we will reject your request as a reviewer.', {
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
     Meteor.call('send_review_request',logged_in_user,book_id,campaign_id,user_location, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review is succesfully submited");
                window.location.reload();
              }
            });
            break;
        }
      });


  }

}
    },


  "click #add_to_my_collections":function(){ 
    // swal("here");
    var logged_in_user = Session.get("userId");
    var book_id = this.book_id;
    var adding_status = 1;
    var adding_id = 'adding_id_'+Math.floor((Math.random() * 2465789) + 1);

    Meteor.call('add_to_my_collections',logged_in_user,book_id,adding_status,adding_id,function(error,result){
        if(error){
            swal("Error");
        }else{

        }
      });  

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

  
  "click .go_to_blog_detail":function(){ 
      var blog_id = Base64.encode(this.blog_id);  
      var url = '/blog_detail/'+blog_id;
            // console.log(url);
            window.location.href = url;
  },


});

