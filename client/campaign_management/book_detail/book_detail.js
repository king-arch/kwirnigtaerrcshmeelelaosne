

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
import { book_details } from './../../../import/collections/insert.js';
import { notification_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.book_detail_page.onDestroyed(function () {
  book_listing.stop();
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
    });

 Template.book_detail_page.helpers({

    show_book_detail(){
      console.log("show_detail here");
      var book_id = Session.get("get_book_id");
      Meteor.subscribe("fetch_book_detail_with_id",book_id);
      var result = book_details.find({
                        book_id: book_id,
                      }).fetch();
      return result;
    },

});


Template.book_detail_page.events({

    "click .create_book":function(){
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/book_create_campaign/'+campaign_id;
            console.log(url);
            window.location.href = url;
    },

    "click .apply_for_review":function(){
      alert("apply now");

      
    },

    "click .accept_campaign":function(){
        // alert("clicked");
      var approval_status = 1;
      var logged_in_user = Session.get("userId");
      var campaign_id = this.campaign_id;
      swal("Do you want to start the campaign ...?", {
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
            Meteor.call('update_campaigning_status', logged_in_user, approval_status,campaign_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Campaign is succesfully started!");
                window.location.reload();
              }
            });
            break;
        }
      });
    },

    "click .reject_campaign":function(){
        // alert("clicked");
      var approval_status = 2;
      var logged_in_user = Session.get("userId");
      var campaign_id = this.campaign_id;
      swal("Do you want to reject this campaign ...?", {
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
            Meteor.call('update_campaigning_status', logged_in_user, approval_status,campaign_id, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Campaign got Rejected!");
                window.location.reload();
              }
            });
            break;
        }
      });
    },

});

