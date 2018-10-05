
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
import { user_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.user_management.onDestroyed(function () {
	book_listing.stop();
});

// Template.user_management.onCreated(function eventlistOnCreated(){

// });

Template.user_management.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_book_listing').DataTable();
            $('#loading_div').addClass("loader_visiblity_block");
    });  
    });  



	book_listing = Meteor.subscribe("fetch_user_listing");
	setTimeout(function () {
		click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);
});




 Template.user_management.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    show_user_details(){
	       var query = new RegExp(Session.get("search_txt"),'i'); 
	       if(Session.get("search_txt")){
	       	// alert('case2');
	       var result = user_details.find({
	                               $or: 
	                                [ {
	                                    user_name: query
	                                                 
	                                  },
	                                  { user_email: query
	                                }] }).fetch();

    }
    else{
    	var result = user_details.find({}).fetch();
    }
    console.log('show result: ');
    console.log(result);
    return result;

},

   check_user_activation_status(user_status) {
    if (user_status == 1) {
      return true;
    } else {
      return false;
    }
  }



});


function click_events() {

  $('#submit_search_text').click(function(e){
  	e.preventDefault();
  	// alert('search ');
    var search_txt = $('#search_text').val();
    Session.set("search_txt",search_txt);
    // alert('Ok...');

    return false;
  });

  $('#user_management').click(function(e){
      Router.go("/user_management");
  });



  $('#book_management').click(function(e){
  		Router.go("/book_management");
  });


	$('#add_book').click(function (e) {
		Router.go('/create_book');
	});

	$('#add_user').click(function (e) {
		Router.go('/create_user');
	});


	$('.edit_user_details').click(function (e) {

		var book_id= Base64.encode(this.id);    
		// alert(book_id); 
        var url = '/edit_user_details/'+book_id;
		Router.go(url);

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

		// alert('email: '+email+'password: '+password);

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




  $("#show_user_listing").on("click", ".activate_status_user", function (event) {
    // $(".activate_status_patient").click(function(event){

    event.preventDefault();
    // swal("here");
    var user_id = this.id;
    var status = '1';
    console.log('status');
    console.log(status);
    swal("Sure you want to Activate this detail ?", {
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
            Meteor.call('change_user_details_status', user_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("User is successfully activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  });

  $("#show_user_listing").on("click", ".deactivate_status_user", function (event) {
    event.preventDefault();
    var user_id = this.id;
    var status = '0';
    console.log('status');
    console.log(status);

    swal("Sure you want to deactivate this detail ?", {
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
            Meteor.call('change_user_details_status', user_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("User is successfully De-activated!");
                window.location.reload();
              }
            });
            break;
        }
      });

  });

}