
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
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.book_listing_detail.onDestroyed(function () {
	book_listing.stop();
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

	book_listing = Meteor.subscribe("fetch_book_listing");

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




 Template.book_listing_detail.helpers({

    show_books_listing(){	

    	var new_sort_order = Session.get("new_sort_order");
    	var limit = Session.get("set_book_listing_content_limit");

    	if(Session.get("filter_content") == 1){
			var result = book_details.find({},{limit: limit,sort: {created_at: new_sort_order}}).fetch();
		    var new_array = new Array();
		    for(var i=0; i < result.length; i++){
		    var campaign_result = campaign_details.find({book_id: result[i].book_id}).fetch();
			    if(campaign_result[0]){
			    	  new_array.push(result[i]);
			    }
		    }
		    result = new_array;
    	}else{
			var result = book_details.find({},{limit: limit,sort: {created_at: new_sort_order}}).fetch();
    	}
	    return result;
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
		  console.log("case 1");

		  if(book_name.length > 27){
		      return book_name.slice(0,27)+'...';
		  }else{
		    return book_name;
		  }
    },


    // newest_selected(){

		  // if(Session.get("filter_content") == 0){
		  //     return false;
		  // }else{
		  //   return true;
		  // }
    // },

});

Template.book_listing_detail.events({

	"click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.book_id);  
      var url = '/book_detail/'+book_id;
            // console.log(url);
            window.location.href = url;
    },

	"click .change_sort_by_status":function(){ 
// alert('clicked');
// alert(Session.get("new_sort_order"));
		if(Session.get("new_sort_order") == -1){
			// alert("case 1");
	     $("#change_to_increasing_order_with_check").removeClass("loader_visiblity_block");
	     $("#change_to_decreasing_order").removeClass("loader_visiblity_block");

	     $("#change_to_decreasing_order_with_check").addClass("loader_visiblity_block");
	     $("#change_to_increasing_order").addClass("loader_visiblity_block");	 
		}else{
// alert("case 2");
    	 $("#change_to_decreasing_order_with_check").removeClass("loader_visiblity_block");
	     $("#change_to_increasing_order").removeClass("loader_visiblity_block");

	     $("#change_to_decreasing_order").addClass("loader_visiblity_block");
	     $("#change_to_increasing_order_with_check").addClass("loader_visiblity_block");

		}

    },

	"click .change_filter_by_status":function(){ 
// alert('clicked');
// alert(Session.get("filter_content"));
		if(Session.get("filter_content") == 0){
			// alert("case 1");
	     $("#show_all_books").removeClass("loader_visiblity_block");
	     $("#show_up_for_review_with_check").removeClass("loader_visiblity_block");

	     $("#show_all_books_with_check").addClass("loader_visiblity_block");
	     $("#show_up_for_review").addClass("loader_visiblity_block");
	     	 
		}else{
// alert("case 2");
		 $("#show_all_books_with_check").removeClass("loader_visiblity_block");
	     $("#show_up_for_review").removeClass("loader_visiblity_block");

	     $("#show_all_books").addClass("loader_visiblity_block");
	     $("#show_up_for_review_with_check").addClass("loader_visiblity_block");

		}

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

    },

	"click #show_all_books":function(){ 
      Session.set("filter_content",0);
      Session.set("new_sort_order",-1);	

    },

'click #id': function(){
		var email = $('#email').val();
		var password = $('#password').val();

		if (email == '' || email == undefined) {
			$('#email').addClass('empty_field').focus();
			return false;
		} else {
			$('#email').removeClass('empty_field').blur();
		}

		if (password == '' || password == undefined) {
			$('#password').addClass('empty_field').focus();
			return false;
		} else {
			$('#password').removeClass('empty_field').blur();
		}

		$('#loader_gif').removeClass('div_hide_class');
		$('#save_text').addClass('div_hide_class');

		// swal('email: '+email+'password: '+password);

		Meteor.call('Check_admin_login_auth', email, password, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal({
					text: 'Some error occured!',
					button: "ok",
					icon: "warning",
					dangerMode: true,
				});

			} else {
				if (result) {

					if (result.status == 0) {
						swal({
							text: result.msg,
							button: "ok",
							icon: "warning",
							dangerMode: true,
						});
					}

					if (result.login_type == 'admin') {
						Session.setPersistent("active_user", result.active_user);
						Session.setPersistent("active_user_type", result.login_type);
						Router.go('/inside');

					}
				}
			}
		});

},

});