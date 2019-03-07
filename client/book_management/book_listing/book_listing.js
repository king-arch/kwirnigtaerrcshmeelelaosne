
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
import { book_details } from './../../../import/collections/insert.js';

import { review_details } from './../../../import/collections/insert.js';
import { book_collections } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_added_listing;
var book_listing_all;

Template.book_listing_detail.onDestroyed(function () {
	book_added_listing.stop();
	book_listing_all.stop();
});

Template.book_listing_detail.onCreated(function eventlistOnCreated(){

});

Template.book_listing_detail.onRendered(function () {

           Session.set("new_sort_order",-1);
           Session.set("filter_content",0);

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  
    var logged_in_user = Session.get("userId");
	book_added_listing = Meteor.subscribe("book_collections_all_with_user_id",logged_in_user);

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

	  Session.set("set_book_listing_content_limit",8);
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
            Session.set("set_book_listing_content_limit",Session.get("set_book_listing_content_limit")+8);
              if(Session.get("set_book_listing_content_limit") !=old_post_count){
              loading = false;
              clearInterval(close_interval)
            }
            
        }, 2500);
    }

 }
});

fetch_all_book_count();
// fetch_editors_pic_count();
// fetch_up_for_review_book_count();

});




 Template.book_listing_detail.helpers({

    show_books_listing(){	
    	var new_sort_order = Session.get("new_sort_order");
    	var limit = Session.get("set_book_listing_content_limit");
      Meteor.subscribe("fetch_book_listing_optimized",limit,new_sort_order);

    	if(Session.get("filter_content") == 1){
    		// swal("case 1");
			var result = book_details.find({},{limit: limit,sort: {created_at: new_sort_order}}).fetch();
		    var new_array = new Array();
		    for(var i=0; i < result.length; i++){
		    var campaign_result = campaign_details.find({book_id: result[i].book_id}).fetch();
			    if(campaign_result[0]){
			    	  new_array.push(result[i]);
			    }
		    }
		    result = new_array;
    	}else if(Session.get("filter_content") == 2){
			var result = book_details.find({editors_pick_status: 1},{limit: limit,sort: {created_at: new_sort_order}}).fetch();
    	}
    	else{
			var result = book_details.find({},{limit: limit,sort: {created_at: new_sort_order}}).fetch();
    	}
	    return result;
      // return false;
    },

    check_if_up_for_review(){	
      var logged_in_user = Session.get("userId");
      Meteor.subscribe("campaign_details_all_list");
      
      var result = campaign_details.find({book_id: this.book_id}).fetch();

      	// console.log('show results for up for review');
      	// console.log(result);
      if(result[0]){
      	return true
      }else{	
      return false;
      }

    },

    check_if_editors_pic(){	
      
      var result = this.editors_pick_status;
      if(result){
      	return true
      }else{	
      return false;
      }
    },

    check_book_name_length(){
		var book_name = this.book_name;
		if(book_name.length > 19){
			// console.log("case 1");
			return false;
		}else{
			// console.log("case 2");
			return true;
		}
    },

    book_name_trimmed(){
		var book_name = this.book_name;
		  // console.log("case 1");

		  if(book_name.length > 18){
		      return book_name.slice(0,18)+'...';
		  }else{
		    return book_name;
		  }
    },

    check_if_book_already_added_to_my_collections(){

       // console.log(this.book_id);
	   var result = book_collections.find({added_book_id: this.book_id, added_by: Session.get("userId"), adding_status: 1 }).fetch();
		  if(result[0]){
		  		return true;
		  }else{
		  	return false;
		  } 		
},


    show_review_counts(){
      
      Meteor.subscribe("review_details_with_campaign_id",this.campaign_id);
      // console.log("show_detail here");
      
      // console.log(this.campaign_id);
      var result = review_details.find({
                        parent_id: this.campaign_id,
                        content_type: "submit_review",
                        approval_status: 1
                      }).count();
      
      if(result > 0){
        // console.log("show_review_details");
        // console.log(result);
      return result;
      }else{
      	return 0;
      }

    },


});

Template.book_listing_detail.events({

	"click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.book_id);  
      var url = '/book_detail/'+book_id;
            // console.log(url);
            window.location.href = url;
    },

	"click #add_to_my_collections":function(){ 
		// swal("here");
		var logged_in_user = Session.get("userId");
		var book_id = this.book_id;
		var adding_status = 1;
		var adding_id = 'adding_id_'+Math.floor((Math.random() * 2465789) + 1);

		Meteor.call('add_to_my_collections',logged_in_user,book_id,adding_status,adding_id,function(error,result){
	      if(error){
	          swal("Error");
	      }else{

	      }
	    });  

    },

	"click #change_to_increasing_order":function(){ 

      Session.set("new_sort_order",1);
       Session.set("filter_content",0);
       
    },

	"click #change_to_decreasing_order":function(){ 

      Session.set("new_sort_order",-1);
      Session.set("filter_content",0);
      	 
    },

	"click #show_up_for_review":function(){ 
      Session.set("filter_content",1);
      Session.set("new_sort_order",-1);
      fetch_up_for_review_book_count();
    },

	"click #show_all_books":function(){ 
      Session.set("filter_content",0);
      Session.set("new_sort_order",-1);	

    },

	"click #editors_pick":function(){ 
      Session.set("filter_content",2);
      Session.set("new_sort_order",-1);
       
      fetch_editors_pic_count();
    },

	"click .change_sort_by_status":function(){ 
		
// alert('clicked');
// alert(Session.get("new_sort_order"));

		if(Session.get("new_sort_order") == -1){
			// alert("case 1");
	     $("#change_to_decreasing_order_with_check").removeClass("loader_visiblity_block");
	     $("#change_to_increasing_order").removeClass("loader_visiblity_block");

	     $("#change_to_increasing_order_with_check").addClass("loader_visiblity_block");
	     $("#change_to_decreasing_order").addClass("loader_visiblity_block");	 

		}else if(Session.get("new_sort_order") == 1){
// alert("case 2");
    	 $("#change_to_increasing_order_with_check").removeClass("loader_visiblity_block");
	     $("#change_to_decreasing_order").removeClass("loader_visiblity_block");

	     $("#change_to_increasing_order").addClass("loader_visiblity_block");
	     $("#change_to_decreasing_order_with_check").addClass("loader_visiblity_block");

		}
    },

	"click .change_filter_by_status":function(){ 
// alert('clicked');
// alert(Session.get("filter_content"));
		if(Session.get("filter_content") == 0){
			// alert("case 0");
	     $("#show_all_books_with_check").removeClass("loader_visiblity_block");
	     $("#show_up_for_review").removeClass("loader_visiblity_block");
	     $("#editors_pick").removeClass("loader_visiblity_block");

	     $("#show_all_books").addClass("loader_visiblity_block");
	     $("#show_up_for_review_with_check").addClass("loader_visiblity_block");
	     $("#editors_pick_with_check").addClass("loader_visiblity_block");
	     	 
		}
		else if(Session.get("filter_content") == 1){
		// alert("case 1");
		 $("#show_up_for_review_with_check").removeClass("loader_visiblity_block");
	     $("#show_all_books").removeClass("loader_visiblity_block");
	     $("#editors_pick").removeClass("loader_visiblity_block");

	     $("#show_up_for_review").addClass("loader_visiblity_block");
	     $("#show_all_books_with_check").addClass("loader_visiblity_block");
	     $("#editors_pick_with_check").addClass("loader_visiblity_block");

		}

	     else if(Session.get("filter_content") == 2){
			// alert("case 2");
	     $("#show_all_books").removeClass("loader_visiblity_block");
	     $("#show_up_for_review").removeClass("loader_visiblity_block");
	     $("#editors_pick_with_check").removeClass("loader_visiblity_block");

	     $("#editors_pick").addClass("loader_visiblity_block");
	     $("#show_all_books_with_check").addClass("loader_visiblity_block");
	     $("#show_up_for_review_with_check").addClass("loader_visiblity_block");
	     	 
		}
    },

});

function fetch_all_book_count(){
  Meteor.call("fetch_all_book_count",function(error,result){
          if(error){

          }else{
            console.log(result);
                      if(result == 0){
                            console.log("case 1");

                        $("#no_book_div").removeClass("div_hide_class");
                        $("#no_editors_pic_div").addClass("div_hide_class");
                        $("#no_up_for_review_div").addClass("div_hide_class");

                        $("#no_book_loader_div").addClass("div_hide_class");
                        $("#no_editors_pic_loader_div").addClass("div_hide_class");
                        $("#no_up_for_review_loader_div").addClass("div_hide_class");
                      }

               }
  });
}


function fetch_editors_pic_count(){
  Meteor.call("fetch_editors_pic_count",function(error,result){
          if(error){

          }else{
            console.log(result);
                      if(result == 0){
                        console.log("case 1");

                        $("#no_book_div").addClass("div_hide_class");
                        $("#no_editors_pic_div").removeClass("div_hide_class");
                        $("#no_up_for_review_div").addClass("div_hide_class");
                        
                        $("#no_book_loader_div").addClass("div_hide_class");
                        $("#no_editors_pic_loader_div").addClass("div_hide_class");
                        $("#no_up_for_review_loader_div").addClass("div_hide_class");
                      }

               }
  });
}



function fetch_up_for_review_book_count(){
  console.log("i am here");
  Meteor.call("fetch_up_for_review_book_count",function(error,result){
          if(error){

          }else{
            console.log(result);
                      if(result == 0){
                            console.log("case 1");

                        $("#no_book_div").addClass("div_hide_class");
                        $("#no_editors_pic_div").addClass("div_hide_class");
                        $("#no_up_for_review_div").removeClass("div_hide_class");
                        
                        $("#no_book_loader_div").addClass("div_hide_class");
                        $("#no_editors_pic_loader_div").addClass("div_hide_class");
                        $("#no_up_for_review_loader_div").addClass("div_hide_class");
                      }

               }
  });
}