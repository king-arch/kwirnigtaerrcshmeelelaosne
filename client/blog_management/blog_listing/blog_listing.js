
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
import { campaign_details } from './../../../import/collections/insert.js';
import { user_details } from './../../../import/collections/insert.js';

import { book_details } from './../../../import/collections/insert.js';
import { blog } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var book_comment_listing;

Template.blog_listing_detail.onDestroyed(function () {
	book_listing.stop();
	book_comment_listing.stop();
});

Template.blog_listing_detail.onCreated(function eventlistOnCreated(){

});

Template.blog_listing_detail.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

fetch_all_blogs_listing_count();
	// book_listing = Meteor.subscribe("fetch_book_listing");

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

	  Session.set("set_blog_listing_content_limit",8);
  var loading;

var block=0;
var $loading = $('<div class="loading"><img class="loading-icon" src="http://imageserver.webpropartners.com/AdminMedia/SpecialtyImages/CaptchaImages/loading.gif" width="25"></div>');
var $icon = $loading.find('img');

$(document).ready(function() {
  window.onscroll = function() {
      if (block === -1) {
        return;
    }
    var scrollTop = $(document).scrollTop();
    var windowHeight = $(window).height();     var bodyHeight = $(document).height() - windowHeight;
   
    var scrollPercentage = (scrollTop / bodyHeight);
    if(scrollPercentage > 0.9 && !loading) {
        loading = true;
        var old_post_count = Session.get("set_blog_listing_content_limit");
        var close_interval = setInterval(function () {
            $icon.show();
            Session.set("set_blog_listing_content_limit",Session.get("set_blog_listing_content_limit")+6);
              if(Session.get("set_blog_listing_content_limit") !=old_post_count){
              loading = false;
              clearInterval(close_interval)
            }
            
        }, 2500);
    }

 }
});

});

 Template.blog_listing_detail.helpers({
    
    show_blog_listing(){	
       var limit = Session.get("set_blog_listing_content_limit");
       blog_listing = Meteor.subscribe("fetch_blog_content_with_optimization",limit);
	    var result = blog.find({blog_status: 1},{limit: limit,sort: {created_at: -1}}).fetch();
      return result;
    },

    fetch_user_info(){
         var user_id = this.blog_author;        
         Meteor.subscribe("user_info_based_on_id_for_blog",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         return result;
    },

      comment_count_lvl_0(){
          var logged_in_user = Session.get("userId");
          Meteor.subscribe("fetch_blog_comments_with_blog_id",this.blog_id);
                        var result = blog.find({
                                     parent_id: this.blog_id,
                                     parent_post_type: 'Blog',
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 }}).count();
          return result;
      },

    blog_title_trimmed(blog_title){
      if(blog_title.length > 18){
          return blog_title.slice(0,18)+'...';
      }else{
        return blog_title;
      }
    },

    user_headline_trimmed(user_headline){
      if(user_headline.length > 18){
          return user_headline.slice(0,18)+'...';
      }else{
        return user_headline;
      }
    },

});

Template.blog_listing_detail.events({

	"click #create_blog":function(){ 
      Router.go("/blog_create");
    },

  "click .go_to_blog_detail":function(){ 
      var blog_id = Base64.encode(this.blog_id);  
      var url = '/blog_detail/'+blog_id;
      window.location.href = url;
  },

});

function fetch_all_blogs_listing_count(){

      var limit = Session.get("set_blog_listing_content_limit");
      Meteor.call("fetch_all_blogs_listing_count",limit,function(error,result){
          if(error){

          }else{
                      console.log(result);
                      if(result == 0){
                      console.log("case 1");

                        $("#no_blogs_div").removeClass("div_hide_class");
                        $("#no_blogs_loader_div").addClass("div_hide_class");
                      }

               }
  });
}
