
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


var admin_detailed;

Template.create_user_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.create_user_details.onRendered(function () {

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


 Template.create_user_details.helpers({
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

	$('#add_user').click(function (e) {
// swal('here: ');
		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();
		var user_email = $('#user_email').val();
		// var user_contact = $('#user_contact').val();
		// var interest = $('#interest').val();
		var user_role = $('#user_role').val();

		// var location = $('#location').val();
		var password = $('#password').val();

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

		// if (user_contact == '' || user_contact == undefined) {
		// 	$('#user_contact').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#user_contact').removeClass('empty_field').blur();
		// }

		// if (interest == '' || interest == undefined) {
		// 	$('#interest').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#interest').removeClass('empty_field').blur();
		// }

		if (user_role == '' || user_role == undefined) {
			$('#user_role').addClass('empty_field').focus();
			return false;
		} else {
			$('#user_role').removeClass('empty_field').blur();
		}

		// if (location == '' || location == undefined) {
		// 	$('#location').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#location').removeClass('empty_field').blur();
		// }

		if (password == '' || password == undefined) {
			$('#password').addClass('empty_field').focus();
			return false;
		} else {
			$('#password').removeClass('empty_field').blur();
		}

	    if(Session.get("user_cover_session")){
		  var user_cover = Session.get("user_cover_session");
		}
		else{
					$('#user_cover').addClass('empty_field').focus();
					return false;
		}

		// var check_length = user_contact/10;

		// if(check_length < 6){
		// 	swal("Phone's length should be at least 5 digit");
		//    $('#user_contact').addClass('empty_field').focus();
		//    return false;
		// }

		var first_name = first_name.trim();
        var last_name = last_name.trim();

        var first_name = first_name.substring(0, 1).toLocaleUpperCase() + first_name.substring(1);
        var last_name = last_name.substring(0, 1).toLocaleUpperCase() + last_name.substring(1);

        var user_name = first_name + ' ' + last_name;
        password = Base64.encode(password);

		swal(
			' user_name: '+user_name+' user_email: '+user_email+
			' user_role: '+user_role+
			' password: '+password
			);

		var user_id = 'user_id_' + Math.floor((Math.random() * 2465789) + 1);
		
		Meteor.call('save_user_details', user_id, user_name, user_email,user_role, password, user_cover, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal('Some error occured!');

			} else {
				if (result.response_status == 1) {
						swal('User successfully added. ');
						Router.go('/user_management');
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

function upload_cover_pic(e,template){

		    if (e.currentTarget.files && e.currentTarget.files[0]) {
		     var file = e.currentTarget.files[0];
		      if (file) {
		        var reader = new FileReader();
		   var base64data="";
		   reader.readAsDataURL(file);
		   reader.onload = function () {
		   console.log(reader.result);
		   base64data = reader.result;
		   console.log(base64data);

		 Session.set("user_cover_session",base64data);

		};
    
   }
  }
 } 



function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

  function ValidateEmail(user_email) {
    var user_email = $('#user_email').val();

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email)) {
      return (true)
    }

    swal("You have entered an invalid email address!");
    return (false)
  }