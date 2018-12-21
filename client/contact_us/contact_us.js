
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
import { book_details } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';


var admin_detailed;

Template.contact_us_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.contact_us_details.onRendered(function () {

  $.getScript('https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCiTVlNvc4XoKjbmX4FDSyWhFLWP8_U1_k', function () {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/geocomplete/1.7.0/jquery.geocomplete.min.js', function () {
      // swal('Here: ');
      $("#location").geocomplete();
      
    });
  });
  
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
		click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);

	Session.set("user_cover_session","");
});


 Template.contact_us_details.helpers({
    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    user_profile_pic(){
	    if(Session.get("user_cover_session") != ""){
		  var user_cover = Session.get("user_cover_session");
		  return user_cover;
		}else{
		  return "/img/avatar1.jpeg";
		}
    },

});

function click_events() {

	$('#user_cover').change(function (e, template) {
		// swal('click');
	    upload_cover_pic(e, template);

	    // swal(Session.get("user_cover_session"));
	});

	$('#send_to_cookies').click(function (e) {
		Router.go('/cookies_display');
	});

	$('#send_to_user_aggrement').click(function (e) {
		Router.go('/user_agreement_display');
	});

	$('#send_to_privacy').click(function (e) {
		Router.go('/user_policy_display');
	});

	$('#send_to_forget_password').click(function (e) {
		Router.go('/forget_password');
	});

	
	$('#go_back').click(function (e) {
		history.go(-1);
	});



  $('#user_management').click(function(e){
      Router.go("/user_management");
  });



  $('#book_management').click(function(e){
  		Router.go("/book_management");
  });
  
	// $('#add_book').click(function (e) {
	// 	Router.go('/add_book');
	// });

	$('#submit_contact_us_details').click(function (e) {
// swal('here: ');
		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();

		var user_email = $('#user_email').val();
		var phone = $('#phone').val();

		var query_type = $('#query_type').val();
		var text_details = $('#text_details').val();

		    if (first_name == '' || first_name == undefined) {
		      $('#first_name').addClass('empty_field').focus();
		      return false;
		    } else {
		      $('#first_name').removeClass('empty_field').blur();
		    }

		    if (last_name == '' || last_name == undefined) {
		      $('#last_name').addClass('empty_field').focus();
		      return false;
		    } else {
		      $('#last_name').removeClass('empty_field').blur();
		    }


		if (user_email == '' || user_email == undefined) {
			$('#user_email').addClass('empty_field').focus();
			return false;
		} else {
			$('#user_email').removeClass('empty_field').blur();
		}

		var email_validation = ValidateEmail(user_email);
		if(email_validation == 0){
			alert(0);
			$('#phone').removeClass('empty_field').blur();
			$('#user_email').addClass('empty_field').focus();
			return false;
		}else{
			// alert(1);
			$('#user_email').removeClass('empty_field').blur();
		}

		if (phone == '' || phone == undefined) {
			$('#phone').addClass('empty_field').focus();
			return false;
		} else {
			$('#phone').removeClass('empty_field').blur();
		}

		if (query_type == '' || query_type == undefined) {
			$('#query_type').addClass('empty_field').focus();
			return false;
		} else {
			$('#query_type').removeClass('empty_field').blur();
		}

		if (text_details == '' || text_details == undefined) {
			$('#text_details').addClass('empty_field').focus();
			return false;
		} else {
			$('#text_details').removeClass('empty_field').blur();
		}

		var first_name = first_name.trim();
        var last_name = last_name.trim();

        var first_name = first_name.substring(0, 1).toLocaleUpperCase() + first_name.substring(1);
        var last_name = last_name.substring(0, 1).toLocaleUpperCase() + last_name.substring(1);

        var user_name = first_name + ' ' + last_name;

		swal(
			' user_name: '+user_name+
			' & user_email: '+user_email+
			' & phone: '+phone+
			' & query_type: '+query_type+
			' & text_details: '+text_details
			);

		Meteor.call('send_contact_us_email', user_name, user_email,phone, query_type, text_details, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal('Some error occured!');

			} else {
				if (result.response_status == 1) {
						swal('Successfully Sent. ');
						
					}
					else{
						swal(result.msg);
						return false;
					}
				}
		});

		return false;

	});
}

  function ValidateEmail(user_email) {
    var user_email = $('#user_email').val();

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)) {
      return 1;
    }

    swal("You have entered an invalid email address!");
    return 0;
  }