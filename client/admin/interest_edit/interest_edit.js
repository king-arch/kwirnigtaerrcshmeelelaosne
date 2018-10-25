
import {
	Template
} from 'meteor/templating';
import {
	ReactiveVar
} from 'meteor/reactive-var';
import {
	Session
} from 'meteor/session';

import { Base64 } from 'meteor/ostrio:base64';
import swal from 'sweetalert';
import { admin_details } from './../../../import/collections/insert.js';
import { book_details } from './../../../import/collections/insert.js';

var admin_detailed;
Template.edit_interest.onDestroyed(function () {
	admin_detailed.stop();
});

Template.edit_interest.onRendered(function () {

	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
	
		    var picker = new Pikaday({ field: document.getElementById('date_picker') });


	})


	// admin_detailed = Meteor.subscribe("fetch_admin_details");
/*$.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.2/js/bootstrap-select.min.js",function(){
	alert("bootstrap-select");
	$('select').selectpicker();
})*/
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
		click_events();
	}, 2000);

// alert('start');
  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var interest_id = Base64.decode(url);
// alert('interest_id: '+ interest_id);

  Meteor.call('fetch_interest_list', interest_id, function (error, result) {
    if (error) {
      console.log("Some error occured.");
    } else {
      console.log('result: ');
      console.log(result);
      // alert("book details successfully fetched!");
      console.log("interest details successfully fetched!");

      var interest_title = result[0].interest_title;
      var interest_id = result[0].interest_id;

      $('#interest_text').val(interest_title);
      $('#hidden_iterest_id').val(interest_id);

    }
  });

});


 Template.edit_interest.helpers({
    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    book_cover(){
	    if(Session.get("book_cover_session")){
		  var user_cover = Session.get("book_cover_session");
		  return user_cover;
		}
    },


});

function click_events() {

	$('#book_cover').change(function (e, template) {
		// alert('click');
	    upload_cover_pic(e, template);

	    // alert(Session.get("book_cover_session"));
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



  $('#user_management').click(function(e){
      Router.go("/user_management");
  });



  $('#book_management').click(function(e){
  		Router.go("/book_management");
  });
  

	$('#go_back').click(function (e) {
		history.go(-1);
	});
	

	// $('#add_book').click(function (e) {
	// 	Router.go('/add_book');
	// });

	$('#update_book').click(function (e) {
// alert('here: ');
		var interest_text = $('#interest_text').val();

		if (interest_text == '' || interest_text == null) {
			$('#interest_text').addClass('empty_field').focus();
			return false;
		} else {
			$('#interest_text').removeClass('empty_field').blur();
		}

		// swal(' interest_text: '+interest_text);

		$('#loader_gif').removeClass('div_hide_class');
		$('#save_text').addClass('div_hide_class');

		interest_text = interest_text.substring(0, 1).toLocaleUpperCase() + interest_text.substring(1);

		var interest_id = $('#hidden_iterest_id').val();
		
		Meteor.call('update_interest',interest_id,interest_text, function (error, result) {
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
				alert(result.msg);
				// alert(result.interest_text);
				window.location.href="/interest_management";
		}
		});
	});
}
