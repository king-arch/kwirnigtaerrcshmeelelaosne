
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
import { interest_list } from './../../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.interest_management.onDestroyed(function () {
	book_listing.stop();
});

Template.interest_management.onCreated(function eventlistOnCreated(){

});

Template.interest_management.onRendered(function () {



    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_book_listing').DataTable();

    });  
    });  



	book_listing = Meteor.subscribe("fetch_book_listing");
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");

		// click_events();
		// $('#loading_div').addClass('loader_visiblity_block');
	}, 2000);
});




 Template.interest_management.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    show_interest_list(){
     //     var query = new RegExp(Session.get("search_txt"),'i'); 
     //     if(Session.get("search_txt")){
     //       // alert('case2');
     //     var result = interest_list.find({}).fetch();

    // }
    // else{
    //  var result = interest_list.find({}).fetch();
    // }

    Meteor.subscribe("fetch_result_interest");
    	var result = interest_list.find({}).fetch();
    console.log('show result interest: ');
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

	   check_interest_activation_status(user_status) {
    if (user_status == 1) {
      return true;
    } else {
      return false;
    }
  }




});


Template.interest_management.events({

    'click #add_interest': function(){
    	  // alert('here: ');
    	window.location.href="/create_interest";
    },

 'click .edit_book_details': function(){

		var interest_id= Base64.encode(this.interest_id);    
		alert(interest_id); 
        var url = '/edit_interest/'+interest_id;
		Router.go(url);

	},

    'click .activate_status_interest': function(event){

    event.preventDefault();
    // swal("here");
    // alert(JSON.stringify(this));
    // var interest_id = this.id;

    var interest_id = this.interest_id;
        // alert(interest_id);
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
            Meteor.call('change_interest_details_status', interest_id, status, function (error, result) {
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

    'click .deactivate_status_interest': function(event){
    event.preventDefault();
        // alert(JSON.stringify(this));
    // var interest_id = this.id;
    var interest_id = this.interest_id;
        // alert(interest_id);
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
            Meteor.call('change_interest_details_status', interest_id, status, function (error, result) {
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