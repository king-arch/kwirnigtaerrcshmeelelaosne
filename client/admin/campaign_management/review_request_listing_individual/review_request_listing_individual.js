
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

Template.show_review_request_listing_individual.onDestroyed(function () {
  book_listing.stop();
  request_listing.stop();
  user_details_listing.stop();
});

Template.show_review_request_listing_individual.onCreated(function eventlistOnCreated(){

});

Template.show_review_request_listing_individual.onRendered(function () {

  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var campaign_id = Base64.decode(url);
  Session.set("get_campaign_id",campaign_id);

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
       setTimeout(function () {
      $('#show_review_request_listing').DataTable(); 
        }, 2000);
    });  
       book_listing = Meteor.subscribe("campaign_details_all_list");
       request_listing = Meteor.subscribe("review_details_all_pending");
       user_details_listing = Meteor.subscribe("fetch_user_listing");

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.show_review_request_listing_individual.helpers({

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
     var campaign_id = Session.get("get_campaign_id");

      var result = review_details.find({content_type: "review_request",parent_id: campaign_id}).fetch();
      return result;
    },

    show_book_detail(){
      Meteor.subscribe("notification_details_all");
      var result = campaign_details.find({campaign_id: this.parent_id}).fetch();
      return result;
    },

    show_book_detail_for_header(){
      var result = campaign_details.find({campaign_id: Session.get("get_campaign_id")}).fetch();
      return result;
    },

    campaign_start_date(){
      var new_year  = moment(this.campaign_start_date).format('YYYY');
      var new_month  = moment(this.campaign_start_date).format('MMM');
      var new_day  = moment(this.campaign_start_date).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

    select_package(){
      var new_date = moment(this.campaign_start_date).add(this.select_package, 'day');
      
      var new_year  = moment(new_date).format('YYYY');
      var new_month  = moment(new_date).format('MMM');
      var new_day  = moment(new_date).format('DD');

      // console.log("new_day: "+ new_day+" new_year: "+ new_year);
      var end_date = new_month + ' '+new_day+' , '+new_year;
      return end_date;
    },

  book_summary_trimmed(){
       var book_summary = this.book_summary;
    if(book_summary.length > 165){
      book_summary = book_summary.substr(0,164);
      return book_summary+'...';
    }else{
      return book_summary;
    }
  },

});


Template.show_review_request_listing_individual.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign_admin";
    },


    "click .approve_review_request":function(){

      var approval_status = 1;
      var logged_in_user = Session.get("userId");
      var review_id = this.review_id;
      swal("Do you want to accept this user for reviewing ...?", {
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
            Meteor.call('update_review_request_status', logged_in_user, approval_status,review_id, function (error, result) {
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


    "click .reject_review_request":function(){

      var approval_status = 2;
      var logged_in_user = Session.get("userId");
      var review_id = this.review_id;
      swal("Do you want to reject this user for reviewing ...?", {
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
            Meteor.call('update_review_request_status', logged_in_user, approval_status,review_id, function (error, result) {
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

