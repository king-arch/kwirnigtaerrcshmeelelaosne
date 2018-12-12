

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
import { review_details } from './../../../import/collections/insert.js';
import { user_details } from './../../../import/collections/insert.js';
import { campaign_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var user_details_listing;
var request_listing;

Template.show_reviewer_details.onDestroyed(function () {
  book_listing.stop();
  user_details_listing.stop();
  request_listing.stop();
});

Template.show_reviewer_details.onCreated(function eventlistOnCreated(){

});

Template.show_reviewer_details.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
            setTimeout(function () {
              $('#show_reviewer_details_table').DataTable(); 
            }, 2000);
    });  

      var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var campaign_id = Base64.decode(url);
  Session.set("get_campaign_id",campaign_id);


    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

        // request_listing = Meteor.subscribe("review_details_all_pending");
        user_details_listing = Meteor.subscribe("fetch_user_listing");
    });

 Template.show_reviewer_details.helpers({

    show_reviewers_listing(){
      Meteor.subscribe("notification_details_all");

      var campaign_id = Session.get("get_campaign_id");
      Meteor.subscribe("review_details_with_campaign_id",campaign_id);
      var result = review_details.find({content_type: "review_request",parent_id: campaign_id,approval_status: 1}).fetch();
      return result;
    },

        show_user_details(){

          var result = user_details.find({"user_id": this.review_request_by}).fetch();
        console.log('show result: ');
        console.log(result);
        return result;
    },



});


Template.show_reviewer_details.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign";
    },

});

