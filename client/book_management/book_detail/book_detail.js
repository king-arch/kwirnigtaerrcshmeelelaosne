
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
import { promotion } from './../../../import/collections/insert.js';
import { campaign_details } from './../../../import/collections/insert.js';
import { review_details } from './../../../import/collections/insert.js';

import { book_details } from './../../../import/collections/insert.js';
import { notification_details } from './../../../import/collections/insert.js';
import { user_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var user_details_subscribe;
var campaign_details_subscribe;

Template.book_detail_page.onDestroyed(function () {
  book_listing.stop();
  user_details_subscribe.stop();
  campaign_details_subscribe.stop();
});

Template.book_detail_page.onCreated(function eventlistOnCreated(){

});

Template.book_detail_page.onRendered(function () {


  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var book_id = Base64.decode(url);
  Session.set("get_book_id",book_id);

      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

    user_details_subscribe = Meteor.subscribe("fetch_user_details",Session.get(userId));

    });

 Template.book_detail_page.helpers({

    show_book_detail(){
      console.log("show_detail here");
      var book_id = Session.get("get_book_id");
      Meteor.subscribe("fetch_book_detail_with_id",book_id);
      var result = book_details.find({
                        book_id: book_id,
                      }).fetch();
      if(result[0]){
      Meteor.subscribe("review_details_with_campaign_id",result[0].campaign_id);
      Meteor.subscribe("notification_details",result[0].campaign_id);
      }

      return result;
    },

    check_if_already_requested_for_review(){
      
      Meteor.subscribe("review_details_with_campaign_id",this.campaign_id);
      console.log("show_detail here");
      
      var result = review_details.find({
                        parent_id: this.campaign_id,
                        content_type: "review_request",
                        review_request_by: Session.get("userId")
                      }).fetch();
      if(result[0]){
      return result;
      }

    },

    check_if_user_is_campaigner(){
      
      Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var result = campaign_details.find({campaign_id: this.campaign_id}).fetch();
      if(result[0]){
        if(result[0].campaigner_id == Session.get("userId")){
            return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
    },

    check_if_campaign_expired(){
      
      Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var result = campaign_details.find({approval_status: 1,campaign_end_date: {$gte: Date.now()} }).fetch();
      if(result[0]){
        return true;
    }else{
      return false;
    }
    },

    show_review_details(){
      
      Meteor.subscribe("review_details_with_campaign_id",this.campaign_id);
      console.log("show_detail here");
      
      var result = review_details.find({
                        parent_id: this.campaign_id,
                        content_type: "submit_review",
                        approval_status: 1
                      }).fetch();
      if(result[0]){
        console.log("show_review_details");
        console.log(result);
      return result;
      }

    },

        show_user_details(){
          console.log(this.review_request_by);
          Meteor.subscribe("fetch_user_details",this.review_request_by);
          var result = user_details.find({"user_id": this.review_request_by}).fetch();
        console.log('show result: ');
        console.log(result);
        return result;
    },

});


Template.book_detail_page.events({

    "click .go_to_write_review_page":function(){
          
            var parent_id = this.parent_id;
            var parent_id = Base64.encode(parent_id);
            
            var url = '/write_review/'+parent_id;
            console.log(url);
            window.location.href = url;
    },

    "click .create_book":function(){
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/write_review/'+campaign_id;
            console.log(url);
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
' If its not complete, we will reject your request as a reviewer. please make sure your profile is complete to recive review copies. we need atleast 1 link from your blog or social media handle & complete postal address with pincode & phone number. Currently we ar sending physical books only to residents of india', {
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

});
