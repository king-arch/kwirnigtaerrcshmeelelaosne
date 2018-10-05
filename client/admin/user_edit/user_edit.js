
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
import { admin_details } from './../../../import/collections/insert.js';
import { book_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';


var admin_detailed;

Template.edit_user_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.edit_user_details.onRendered(function () {


  $.getScript('https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCiTVlNvc4XoKjbmX4FDSyWhFLWP8_U1_k', function () {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/geocomplete/1.7.0/jquery.geocomplete.min.js', function () {
      // alert('Here: ');
      $("#location").geocomplete();
    });
  });
  
	// $('#loading_div').removeClass('loader_visiblity_block');
	// admin_detailed = Meteor.subscribe('admin_details');
	// click_events();
	setTimeout(function () {
		click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);

	  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var user_id = Base64.decode(url);
// alert('user_id: '+ user_id);

	admin_detailed = Meteor.subscribe("fetch_user_details",user_id);

  Meteor.call('fetch_user_details', user_id, function (error, result) {
    if (error) {
      console.log("Some error occured.");
    } else {
    
      $('#loading_div').addClass("loader_visiblity_block");
      
      console.log('result: ');
      console.log(result);
      // alert("book details successfully fetched!");
      console.log("book details successfully fetched!");
      console.log('user_name:');
      var user_name = result[0].user_name;

      console.log(user_name);
      var name = user_name.split(" ");

      var user_id = result[0].user_id;
      var user_email = result[0].user_email;
      var user_role = result[0].user_role;
      var user_contact = result[0].user_contact;

      var user_interest = result[0].user_interest;
      var user_location = result[0].user_location;
      var user_cover = result[0].user_cover;
      var user_password = result[0].user_password;

      $('#hidden_user_id').val(user_id);
      $('#first_name').val(name[0]);
      $('#last_name').val(name[1]);
      $('#user_email').val(user_email);
      $('#user_role').val(user_role);
      $('#user_contact').val(user_contact);

      $('#interest').val(user_interest);
      $('#location').val(user_location);

      password = Base64.decode(password);

      $('#password').val(user_password);
      // alert();

      Session.set("user_cover_session",user_cover);
}

});
});


 Template.edit_user_details.helpers({
    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    user_cover(){
	    if(Session.get("user_cover_session")){
		  var user_cover = Session.get("user_cover_session");
		  return user_cover;
		}
    },

});

function click_events() {

	$('#user_cover').change(function (e, template) {
		// alert('click');
	    upload_cover_pic(e, template);

	    // alert(Session.get("user_cover_session"));
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

	// $('#add_book').click(function (e) {
	// 	Router.go('/add_book');
	// });

	$('#add_user').click(function (e) {
// alert('here: ');
		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();
		var user_email = $('#user_email').val();
		var user_contact = $('#user_contact').val();
		var interest = $('#interest').val();
		var user_role = $('#user_role').val();

		var location = $('#location').val();
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

		if (user_contact == '' || user_contact == undefined) {
			$('#user_contact').addClass('empty_field').focus();
			return false;
		} else {
			$('#user_contact').removeClass('empty_field').blur();
		}

		if (interest == '' || interest == undefined) {
			$('#interest').addClass('empty_field').focus();
			return false;
		} else {
			$('#interest').removeClass('empty_field').blur();
		}

		if (user_role == '' || user_role == undefined) {
			$('#user_role').addClass('empty_field').focus();
			return false;
		} else {
			$('#user_role').removeClass('empty_field').blur();

		if (location == '' || location == undefined) {
			$('#location').addClass('empty_field').focus();
			return false;
		} else {
			$('#location').removeClass('empty_field').blur();
		}
		}

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

		var first_name = first_name.trim();
        var last_name = last_name.trim();

        var first_name = first_name.substring(0, 1).toLocaleUpperCase() + first_name.substring(1);
        var last_name = last_name.substring(0, 1).toLocaleUpperCase() + last_name.substring(1);

        var user_name = first_name + ' ' + last_name;

        password = Base64.encode(password);

		// swal(
		// 	' user_name: '+user_name+' user_email: '+user_email+
		// 	' user_contact: '+user_contact+
		// 	' interest: '+interest+' user_role: '+user_role+
		// 	' location: '+location+'  password: '+password
		// 	);

		// return false;

		var user_id = $('#hidden_user_id').val();

		Meteor.call('edit_save_user_details', user_id, user_name, user_email,user_role, user_contact, interest,
		 location, password, user_cover, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal('Some error occured!');

			} else {
				
						swal('User successfully edited. ');
						Router.go('/user_management');
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
    return (false);
  }