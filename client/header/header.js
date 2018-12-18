
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { promotion }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';
import swal from 'sweetalert';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;


var ads_listing_ticker;
var interval_ticker;

 Template.headeroptions.onDestroyed(function(){
  ads_listing_ticker.stop();
 });


Template.headeroptions.onRendered(function(){

  ads_listing_ticker = Meteor.subscribe('fetch_text_promotion_listing');

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);

    interval_ticker = setInterval(function() {
    tick();
}, 5000); 

  });

function tick() {
    $('#ticker div:first').fadeOut("slow",function() {
        $(this).appendTo($('#ticker')).slideDown();
    });
}


Template.headeroptions.helpers({

    change_textual_ads(){

    var mydate=new Date();
    str=moment(mydate).format('YYYY-MM-DD');
// console.log('str: '+str);
var str2 = str.split("-").join(" ");
// console.log('str2: '+str2);

    var result = promotion.find({ promotion_type: 'Textual' , promotion_status: 
                                                        {
                                                            $ne: 0 
                                                        }
                                        }).fetch();
    return result;
  },


    user_profile_pic(){
      if(this.user_profile_pic){
        return this.user_profile_pic;
      }
      else{
        return '/img/avatar1.jpg';
      }
    },

    show_user_details(){
          var logged_in_user = Session.get("userId");
          Meteor.subscribe("fetch_user_details",logged_in_user);
          var result = user_details.find({"user_id": logged_in_user}).fetch();
        // console.log('show result: ');
        // console.log(result);
        return result;
    },

});

Template.headeroptions.events({

  'click #go_to_feed':function(){
    // window.location.href="/feed";
    Router.go("/feed");
   },


  'click #got_to_user_setting':function(){
    // window.location.href="/feed";
    Router.go("/user_settings");
   },

  'click #send_to_my_collections':function(){
    // window.location.href="/feed";
    Router.go("/my_collections");
   },

  'click #sign_out':function(){

    Session.clear("userId");
    var url = '/';
    window.location.href = url;

   },

  'click #go_to_book':function(){
    Router.go("/book_listing");
   },

  'click #go_to_community':function(){
    Router.go("/community");
   },

  'click #go_to_blog':function(){
    Router.go("/blog_listing");
   },

  'click #go_to_profile':function(){
            var url = '/profile';
            window.location.href = url;
   },

  'click #submit_search_text':function(){
            // alert("submitted");
            var search_text = $("#search_text").val();
            
            // alert(search_text);
            var url = '/search/'+search_text;
            window.location.href = url;
   },

  });