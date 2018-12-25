
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

import { user_details } from './../../../../import/collections/insert.js';
import { promotion } from './../../../../import/collections/insert.js';
import { blog } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var reward_details_all;

Template.display_blog_listing_admin.onDestroyed(function () {
  book_listing.stop();
  reward_details_all.stop();
});

Template.display_blog_listing_admin.onCreated(function eventlistOnCreated(){

});

Template.display_blog_listing_admin.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
  setTimeout(function () {
              $('#show_promotion_listing').DataTable();
    }, 2000);
    // });  
    });  

  book_listing = Meteor.subscribe("fetch_blog_content");
  reward_details_all = Meteor.subscribe("reward_details_all");

  setTimeout(function () {
    $('#loading_div').addClass('loader_visiblity_block');
  }, 2000);
});




 Template.display_blog_listing_admin.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

     check_interest_activation_status(user_status) {
        if (user_status == 1) {
          return true;
        } else {
          return false;
        }
      },

     check_blog_activation_status(user_status) {
        if (blog_approval_status == 1) {
          return true;
        } else {
          return false;
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

    fetch_user_info(){
      console.log('ok');
         var user_id = this.blog_author;  
         console.log(user_id);            
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: 1}}).fetch();
         console.log('show author details');
         console.log(result);
         return result;
    },

    show_blog_details(){
    console.log('https://en.wikipedia.org/wiki/Greece');
    
    var result = blog.find({blog_status: { $exists: true}}).fetch();

    console.log('show result: ');
    console.log(result);
    return result;

},

});


Template.display_blog_listing_admin.events({

    "click #create_blog":function(){
        Router.go("/create_blog_admin");
  },

    "click .edit_blog_details":function(){
            var blog_id = Base64.encode(this.blog_id);    
            var url = '/edit_blog_details/'+blog_id;
            Router.go(url);
  },

      "click .edit_promotion_details":function(){
            var promotion_id = Base64.encode(this.promotion_id);    
            var url = '/edit_promotion_details/'+promotion_id;
            Router.go(url);
  },


    'click .activate_status_blog': function(event){

    event.preventDefault();
    var blog_id = this.blog_id;
        // swal(interest_id);
    var status = 1;
    console.log('status');
    console.log(status);
    swal("Sure you want to Activate this detail ?", {
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
            Meteor.call('change_blog_details_status', blog_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                // swal("User is successfully activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  },

    'click .deactivate_status_blog': function(event){
    event.preventDefault();
        // swal(JSON.stringify(this));
    // var interest_id = this.id;
    var blog_id = this.blog_id;
        // swal(interest_id);
    var status = 0;
    console.log('status');
    console.log(status);

    swal("Sure you want to deactivate this detail ?", {
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
            Meteor.call('change_blog_details_status', blog_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                // swal("User is successfully De-activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  },

    'click .disapproval_status_blog': function(event){
    event.preventDefault();
        // swal(JSON.stringify(this));
    // var interest_id = this.id;
    var blog_id = this.blog_id;
    var logged_in_user = Session.get("userId");
        // swal(interest_id);
    var status = 2;
    console.log('status');
    console.log(status);

    swal("Sure you want to reject this detail ?", {
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
            Meteor.call('change_blog_approval_status', blog_id, status,logged_in_user, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                // swal("User is successfully De-activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  },

    'click .approval_status_blog': function(event){
    event.preventDefault();
        // swal(JSON.stringify(this));
    // var interest_id = this.id;
    var blog_id = this.blog_id;
    var logged_in_user = Session.get("userId");
        // swal(interest_id);
    var status = 1;
    console.log('status');
    console.log(status);

    swal("Sure you want to Approve this detail ?", {
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
            Meteor.call('change_blog_approval_status', blog_id, status,logged_in_user, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                // swal("User is successfully De-activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  },

      "click .go_to_blog_detail":function(){ 
      var blog_id = Base64.encode(this.blog_id);  
      var url = '/admin_blog_detail/'+blog_id;
            console.log(url);
            window.location.href = url;
    },


});

