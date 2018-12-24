
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
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.payment_status_detail.onDestroyed(function () {
  book_listing.stop();
});

Template.payment_status_detail.onCreated(function eventlistOnCreated(){

});

Template.payment_status_detail.onRendered(function () {

  var url = window.location.href;

  var url = new URL(url);
var payment_id = url.searchParams.get("payment_id");
var payment_status = url.searchParams.get("payment_status");
var payment_request_id = url.searchParams.get("payment_request_id");

console.log(payment_id+ ' & '+payment_status+ ' & '+payment_request_id);

      var campaign_id = Session.get("campaign_id_for_payment_status_update");

      Meteor.call('payment_campaign_status_with_payment_details',payment_id,payment_status,payment_request_id,campaign_id,function (error,result) {
      if (error) {
        swal('Some error occured!');
        return false;
      } else {      
        console.log(result);
        console.log("payment_status successfully changed");
        // Session.clear("campaign_id_for_payment_status_update");
        }
    });

      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

     book_listing = Meteor.subscribe("campaign_details_all_list");
    });

 Template.payment_status_detail.helpers({

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

});


Template.payment_status_detail.events({

    "click .go_to_write_review_page":function(){
      
            var review_id = this.review_id;
            var review_id = Base64.encode(review_id);

            var url = '/write_review/'+review_id;
            console.log(url);
            window.location.href = url;
    },


});

