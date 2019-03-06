
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
import { book_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.book_management_details.onDestroyed(function () {
	book_listing.stop();
});

Template.book_management_details.onCreated(function eventlistOnCreated(){

});

Template.book_management_details.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    // });  
    });  

	book_listing = Meteor.subscribe("fetch_book_listing");
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");

		click_events();
		// $('#loading_div').addClass('loader_visiblity_block');

	}, 2000);

});




 Template.book_management_details.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    show_book_details(){
	       var query = new RegExp(Session.get("search_txt"),'i'); 
	       if(Session.get("search_txt")){
	       	// swal('case2');
	       var result = book_details.find({
	                               $or: 
	                                [ {
	                                    book_name: query
	                                                 
	                                  },
	                                  { author_name: query
	                                }] },{sort: {created_at: -1}}).fetch();

    }
    else{
    	var result = book_details.find({},{sort: {created_at: -1}}).fetch();
    }
    console.log('show result: ');
    console.log(result);
    return result;

},
	book_summary(){
		var book_summary = this.book_summary;
		if(book_summary.length > 10){
			book_summary = book_summary.substr(0,10);
			return book_summary+'...';
		}else{
			return book_summary;
		}
	},

	author_description(){
		var book_summary = this.author_description;
		if(book_summary.length > 10){
			book_summary = book_summary.substr(0,10);
			return book_summary+'...';
		}else{
			return book_summary;
		}
	},

	    book_name_with_trim(){
      var book_name = this.book_name;
      if(book_name.length > 40){ 
        return book_name.slice(0, 40)+'...';
      }
      else{
        return book_name;
      }
    },


});


function click_events() {

  $('#submit_search_text').click(function(e){
  	e.preventDefault();
  	// swal('search ');
    var search_txt = $('#search_text').val();
    Session.set("search_txt",search_txt);
    // swal('Ok...');

    return false;
  });

  $('#user_management').click(function(e){
  	// swal("here");
  		Router.go("/user_management");
  });


  $('#book_management').click(function(e){
  	// swal("here");
  		Router.go("/book_management");
  });


	$('#add_book').click(function (e) {
		window.location.href= "/create_book";
	});


	$('.edit_book_details').click(function (e) {
// swal('here: ');
		var book_id= Base64.encode(this.id);    
        var url = '/edit_book_details/'+book_id;
		window.location.href= url;

	});

	$('#Check_auth_for_admin_login').click(function (e) {

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

	});

}