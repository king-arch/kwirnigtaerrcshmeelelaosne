
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

Template.write_review_detail.onDestroyed(function () {
  book_listing.stop();
});

Template.write_review_detail.onCreated(function eventlistOnCreated(){

});

Template.write_review_detail.onRendered(function () {

  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var campaign_id = Base64.decode(url);
  Session.set("get_campaign_id",campaign_id);

      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.write_review_detail.helpers({

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

});


Template.write_review_detail.events({

    "click .go_to_write_review_page":function(){
      
            var review_id = this.review_id;
            var review_id = Base64.encode(review_id);

            var url = '/write_review/'+review_id;
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

    "click #submit_review":function(){
        // alert("clicked");
        var review_text = $("#review_text").val();
        var good_reads_link = $("#good_reads_link").val();
        var personal_blog_link = $("#personal_blog_link").val();

        var amazon_link = $("#amazon_link").val();
        var additional_text = $("#additional_text").val();

        var logged_in_user = Session.get("userId");
        var campaign_id = Session.get("get_campaign_id");

            if (review_text == '' || review_text == undefined) {
              $('#review_text').addClass('empty_field').focus();
              return false;
            } else {
              $('#review_text').removeClass('empty_field').blur();
            }

if(good_reads_link == null || good_reads_link == "" || amazon_link == null || amazon_link == "" ||
  personal_blog_link == null || personal_blog_link == ""){

      swal("Looks like you have left one of the links. Do you want to submit without links ?", {
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

            Meteor.call('submit_review',logged_in_user, review_text,good_reads_link,personal_blog_link,amazon_link,additional_text,campaign_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review successfully submited!");
                window.location.reload();
              }
            });

            break;
        }
      });

}else{

            Meteor.call('submit_review',logged_in_user, review_text,good_reads_link,personal_blog_link,amazon_link,additional_text,campaign_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review successfully submited!");
                window.location.reload();
              }
            });
            
}


    },

});

