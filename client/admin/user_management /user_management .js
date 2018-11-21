
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
import { user_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.user_management_details.onDestroyed(function () {
	book_listing.stop();
});

Template.user_management_details.onRendered(function () {
  $('#loading_div').addClass("loader_visiblity_block");

  book_listing = Meteor.subscribe("fetch_user_listing");
     // var result  = user_details.find({}).fetch();
     // result = JSON.parse(result);

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
           // alert('show');
            $('#show_book_listing').DataTable();
            //             $('#show_book_listing').DataTable({
            //   "paging": true,
            //   "processing": true,
            //   "serverSide": true,
            //   "ajax": result,
            //   "columns":[
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   {"data": "user_name"},
            //   ] 
            // });
    });  
    });  


	book_listing = Meteor.subscribe("fetch_user_listing");
	setTimeout(function () {
    $('#loading_div').addClass("loader_visiblity_block");
		// click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);
});



function fetch_data(){
      book_listing = Meteor.subscribe("fetch_user_listing");
     var result  = user_details.find({}).fetch();
     // return JSON.parse(result);
     console.log(result);
     var new_array = new Array();
     for(var i=0; i<result.length; i++){
        new_array.push({_id: "wfvxRp4Xmu5ieBqzC", user_id: "user_679668", user_name: "Sss", user_email: "cos2@mailinator.com", user_password: "12345678"})
     }  
     console.log(new_array);
     return new_array;
}

 Template.user_management_details.helpers({

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

    	var result = user_details.find({"user_email": {$ne: "admin@wm.com"}}).fetch();
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
  },

      user_profile_pic(){
      if(this.user_profile_pic){
      return this.user_profile_pic;
    }else{
      return "/img/avatar1.jpeg";
    }
    },



});

Template.user_management_details.events({

'click #submit_search_text':function(){      
    var search_txt = $('#search_text').val();
    Session.set("search_txt",search_txt);
    return false;
  },

'click #user_management':function(){ 
      Router.go("/user_management");
},


'click #book_management':function(){  
  		Router.go("/book_management");
  },

'click #add_book':function(){      
		Router.go('/create_book');
	},

'click #add_user':function(){      
		window.location.href = '/create_user';
	},

'click .edit_user_details':function(){      
		var book_id= Base64.encode(this.user_id);    
    var url = '/edit_user_details/'+book_id;
		Router.go(url);

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

'click .activate_status_user':function(){      
    var user_id = this.user_id;
    var status = 1;
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
  },

'click .deactivate_status_user':function(){      
    var user_id = this.user_id;
    var status = 0;
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
  },

});