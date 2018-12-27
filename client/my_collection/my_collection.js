
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
import { campaign_details } from './../../import/collections/insert.js';
import { book_details } from './../../import/collections/insert.js';

import { book_collections } from './../../import/collections/insert.js';
import { blog } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var blog_listing;

Template.my_collections_detail.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.my_collections_detail.onCreated(function eventlistOnCreated(){

});

Template.my_collections_detail.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  
  
  var logged_in_user = Session.get("userId");
  blog_listing = Meteor.subscribe("book_collections_all_with_user_id",logged_in_user);

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

 Template.my_collections_detail.helpers({

    show_my_collection_books(){ 
      var logged_in_user = Session.get("userId");
      var new_sort_order = Session.get("new_sort_order");

      var result = book_collections.find({added_by: logged_in_user,adding_status: {$ne: 0} },{limit: 100,sort: {created_at: new_sort_order}}).fetch();
      console.log('book_collections');
      console.log(result);
      return result;
    },

    show_book_details(){  
      var logged_in_user = Session.get("userId");

      blog_listing = Meteor.subscribe("fetch_book_detail_with_id",this.added_book_id);
      var result = book_details.find({book_id: this.added_book_id},{limit: 100,sort: {created_at: -1}}).fetch();
      console.log('book_details');
      console.log(this.added_book_id);
      console.log(result);
      return result;
    },

});

Template.my_collections_detail.events({

	"click .go_to_book_detail":function(){ 
    // swal("inside");
      var book_id = Base64.encode(this.book_id); 
      blog_listing = Meteor.subscribe("book_collections_all_with_user_id",Session.get("userId")); 
      var url = '/book_detail/'+book_id;
      // console.log(url);
      window.location.href = url;
    },


  "click #remove_to_my_collections":function(){ 
    // swal("here");
    var logged_in_user = Session.get("userId");
    var book_id = this.book_id;

    var adding_status = 0;
    var adding_id = 'adding_id_'+Math.floor((Math.random() * 2465789) + 1);
    swal("Sure you want to remove this book from my collections ?", {
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
           Meteor.call('add_to_my_collections',logged_in_user,book_id,adding_status,adding_id,function(error,result){
              if(error){
                  swal("Error");
                  console.log("Error");
              }else{
                  console.log("Successfully removed from my collection");
              }
            });  
            break;
        }
      });
    
    },

  "click #change_to_increasing_order":function(){ 
      Session.set("new_sort_order",1);       
    },

  "click #change_to_decreasing_order":function(){ 
      Session.set("new_sort_order",-1);         
    },

  "click .change_sort_by_status":function(){ 

    if(Session.get("new_sort_order") == -1){
      // swal('new_sort_order = -1');
       $("#change_to_decreasing_order_with_check").removeClass("loader_visiblity_block");
       $("#change_to_increasing_order").removeClass("loader_visiblity_block");

       $("#change_to_increasing_order_with_check").addClass("loader_visiblity_block");
       $("#change_to_decreasing_order").addClass("loader_visiblity_block");  

       }else if(Session.get("new_sort_order") == 1){
      // swal('new_sort_order = 1');

       $("#change_to_increasing_order_with_check").removeClass("loader_visiblity_block");
       $("#change_to_decreasing_order").removeClass("loader_visiblity_block");

       $("#change_to_increasing_order").addClass("loader_visiblity_block");
       $("#change_to_decreasing_order_with_check").addClass("loader_visiblity_block");
              
      }
    },

});