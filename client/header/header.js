
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { promotion }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';

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

    // var result = advertisement.find({
    //                                     $and: [
    //                                     { promotion_type: 'Textual' },
    //                                     { promotion_status: 
    //                                                     {
    //                                                         $ne: 'Inactive' 
    //                                                     }
    //                                     },
    //                                     { promotion_start_date: 
    //                                                     {
    //                                                         $lte: str2
    //                                                     }
    //                                     },
    //                                     { promotion_end_date: 
    //                                                     {
    //                                                         $gte : str2
    //                                                     }
    //                                      }
    //                                 ] }).fetch();

    console.log( 'display tickers');
    console.log(result);
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

});




Template.headeroptions.events({

  'click #go_to_feed':function(){
    Router.go("/feed");
   },

  'click #sign_out':function(){
    Session.clear("userId");
            var url = '/';
            window.location.href = url;
   },

  'click #go_to_book':function(){
    Router.go("/book");
   },

  'click #go_to_author':function(){
    Router.go("/author");
   },

  'click #go_to_blog':function(){
    Router.go("/blog");
   },

  'click #go_to_profile':function(){
            var url = '/profile';
            window.location.href = url;
   },

  });