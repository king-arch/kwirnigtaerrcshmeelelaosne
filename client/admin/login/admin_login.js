
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
import { user_details } from './../../../import/collections/insert.js';

var admin_detailed;

Template.admin_login_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.admin_login_details.onRendered(function () {
	// admin_detailed = Meteor.subscribe("fetch_admin_details");
	        admin_detailed = Meteor.subscribe("fetch_user_listing");
	setTimeout(function () {
		// click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);
});


Template.admin_login_details.events({

'click #send_to_cookies':function(){   
		Router.go('/cookies_display');
	},

'click #send_to_user_aggrement':function(){  
		Router.go('/user_agreement_display');
	},

'click #send_to_privacy':function(){  
		Router.go('/user_policy_display');
	},

'click #send_to_forget_password':function(){  
		Router.go('/forget_password');
	},

'click #Check_auth_for_admin_login':function(){  

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
				// swal("sucess");
				if (result) {

					if (result.status == 0) {
						swal({
							text: result.msg,
							button: "ok",
							icon: "warning",
							dangerMode: true,
						});
					}

					if (result.login_type == 'Admin'){
						Session.setPersistent("active_user", result.active_user);
						Session.setPersistent("userId", result.active_user);
						Session.setPersistent("active_user_type", result.login_type);
						Router.go('/book_management');
					}
					else if(result.login_type == 'Editor'){
						Session.setPersistent("active_user", result.active_user);
						Session.setPersistent("userId", result.active_user);
						Session.setPersistent("active_user_type", result.login_type);
						Router.go('/book_management');
					}
				}
			}
		});
	},
});