

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
import { notification_details } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.show_campaign_detail.onDestroyed(function () {
  book_listing.stop();
});

Template.show_campaign_detail.onCreated(function eventlistOnCreated(){

});

Template.show_campaign_detail.onRendered(function () {

    var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var get_campaign_id = Base64.decode(url);
  Session.set("get_campaign_id",get_campaign_id);


    // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
    //   $('#show_promotion_listing').DataTable(); 
    // });  

    // $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);


    });

 Template.show_campaign_detail.helpers({

    show_campaign_detail(){

      var campaign_id = Session.get("get_campaign_id");
      Meteor.subscribe("campaign_details_with_id",campaign_id);
      Meteor.subscribe("notification_details",campaign_id);
      
      var result = campaign_details.find({campaign_id: campaign_id}).fetch();
      return result;
    },

    delivery_option_display(){

      var delivery_option = this.delivery_option;
      if(delivery_option == 1){
          return "campaigner will send books offline";
      }else{
      return "Points will be released to reviewers. reviewers will buy book themselves.";
      }

    },

});


Template.show_campaign_detail.events({

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
            Meteor.call('update_campaing_status', logged_in_user, approval_status,campaign_id, function (error, result) {
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

