

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
import { promotion } from './../../../../import/collections/insert.js';
import { campaign_details } from './../../../../import/collections/insert.js';
import { user_details } from './../../../../import/collections/insert.js';

import { review_details } from './../../../../import/collections/insert.js';
import { book_details } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var request_listing;
var user_details_listing;

Template.show_review_approval_listing.onDestroyed(function () {
  book_listing.stop();
  request_listing.stop();
  user_details_listing.stop();
});

Template.show_review_approval_listing.onCreated(function eventlistOnCreated(){

});

Template.show_review_approval_listing.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
      $('#show_review_approval_listing').DataTable(); 
    });  
       book_listing = Meteor.subscribe("campaign_details_all_list");
       request_listing = Meteor.subscribe("review_details_all_pending");
  
       user_details_listing = Meteor.subscribe("fetch_user_listing");

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.show_review_approval_listing.helpers({

    check_approval_status(){
        if(this.approval_status == 0){
          return 'pending';
        }
        else if(this.approval_status == 1){
          return 'Accepted';
        }
        else if(this.approval_status == 2){
          return 'Rejected';
        }
    },

    check_approval_status_for_time_dislay(){
      if(this.approval_status == 0){
          return false;
        }
        else if(this.approval_status == 1){
          return true;
        }
        else if(this.approval_status == 2){
          return false;
        }
    },

    show_user_details(){

          var result = user_details.find({"user_id": this.review_request_by}).fetch();
        console.log('show result: ');
        console.log(result);
        return result;
    },


    show_campaign_listing(){

      Meteor.subscribe("notification_details_all");
      var result = review_details.find({content_type: "submit_review",approval_status: 0}).fetch();
      return result;

    },

    show_book_detail(){
      Meteor.subscribe("notification_details_all");
      var result = campaign_details.find({campaign_id: this.parent_id}).fetch();
      return result;
    },

    status_updated_time(){
      var new_year  = moment(this.status_updated_time).format('YYYY');
      var new_month  = moment(this.status_updated_time).format('MMM');
      var new_day  = moment(this.status_updated_time).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

    select_package(){
      var new_date = moment(this.status_updated_time).add(this.select_package, 'day');
      
      var new_year  = moment(new_date).format('YYYY');
      var new_month  = moment(new_date).format('MMM');
      var new_day  = moment(new_date).format('DD');

      // console.log("new_day: "+ new_day+" new_year: "+ new_year);
      var end_date = new_month + ' '+new_day+' , '+new_year;
      return end_date;
    },

});


Template.show_review_approval_listing.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign_admin";
    },


    "click .approve_review_submition":function(){

      var approval_status = 1;
      var logged_in_user = Session.get("userId");
      var review_id = this.review_id;
      swal("this review will be submitted and displayed on book detail page. you want to procced ...?", {
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
            Meteor.call('update_review_submition_status', logged_in_user, approval_status,review_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Reviewing Request Accepted!");
                window.location.reload();
              }
            });
            break;
        }
      });
    },


    "click .reject_review_submition":function(){

      var approval_status = 2;
      var logged_in_user = Session.get("userId");
      var review_id = this.review_id;
      swal("Do you want to reject this review ...?", {
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
            Meteor.call('update_review_submition_status', logged_in_user, approval_status,review_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Reviewing Request Rejected!");
                window.location.reload();
              }
            });
            break;
        }
      });
    },


    "click #go_to_review_request_listing":function(){
        // alert("clicked");
        window.location.href = "review_approval_listing";
    },


    "click #go_to_review_approval_listing":function(){
        // alert("clicked");
        window.location.href = "review_approval_listing";
    },

    "click .view_detail":function(){
        // alert("clicked");
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/campaign_detail/'+campaign_id;
            console.log(url);
            window.location.href = url;

    },

});

