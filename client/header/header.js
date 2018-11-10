



import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;

Template.headeroptions.onRendered(function(){

  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){

    },3000);

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);
  });

Template.headeroptions.helpers({

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
    Router.go("/");
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
    Router.go("/profile");
   },

  });