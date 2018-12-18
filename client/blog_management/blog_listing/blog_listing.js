
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

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  

	  blog_listing = Meteor.subscribe("fetch_blog_content");
	// book_listing = Meteor.subscribe("fetch_book_listing");

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

	  Session.set("set_book_listing_content_limit",7);
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
        var old_post_count = Session.get("set_book_listing_content_limit");
        var close_interval = setInterval(function () {
            $icon.show();
            Session.set("set_book_listing_content_limit",Session.get("set_book_listing_content_limit")+6);
              if(Session.get("set_book_listing_content_limit") !=old_post_count){
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

	    var result = blog.find({blog_status: 1},{limit: 10,sort: {created_at: -1}}).fetch();
	    return result;
    },

        fetch_user_info(){
         var user_id = this.blog_author;  
         // console.log(user_id);            
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         // console.log('show author details');
         // console.log(result);
         return result;
    },

      comment_count_lvl_0(){
         var logged_in_user = Session.get("userId");
         // var blog_id = Session.get("get_blog_id");

         Meteor.subscribe("fetch_blog_comments_with_blog_id",this.blog_id);

         // console.log(this.blog_id);
         // console.log(logged_in_user);
                        var result = blog.find({
                                     parent_id: this.blog_id,
                                     parent_post_type: 'Blog',
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 }}).count();
// console.log("comment list_new");
// console.log(result);
return result;
  },

});

Template.blog_listing_detail.events({

	"click #create_blog":function(){ 
      Router.go("/blog_create");
    },

  "click .go_to_blog_detail":function(){ 
      var blog_id = Base64.encode(this.blog_id);  
      var url = '/blog_detail/'+blog_id;
            // console.log(url);
            window.location.href = url;
  },

});