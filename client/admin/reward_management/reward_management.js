
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
import { reward_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.reward_management_details.onDestroyed(function () {
	book_listing.stop();
});

Template.reward_management_details.onCreated(function eventlistOnCreated(){

});

Template.reward_management_details.onRendered(function () {



    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_reward_request_listing').DataTable();
    // });  
    });  



	book_listing = Meteor.subscribe("reward_details_all");
	// book_listing = Meteor.subscribe("fetch_book_listing");
	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");

		click_events();
		// $('#loading_div').addClass('loader_visiblity_block');

	}, 2000);
});

 Template.reward_management_details.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    show_reward_details(){
	       // var query = new RegExp(Session.get("search_txt"),'i'); 
	       // if(Session.get("search_txt")){
	       var result = reward_details.find({ entry_type: "redeem_request",request_status: 0 }).fetch();
    // }
    // else{
    // 	var result = reward_details.find({approval_status: 1,campaign_end_date: {$lt: Date.now()}}).fetch();
    // }
    // console.log('show result: ');
    // console.log(result);
    return result;
},

    show_request_date(){
      var new_year  = moment(this.created_at).format('YYYY');
      var new_month  = moment(this.created_at).format('MMM');
      var new_day  = moment(this.created_at).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

	        fetch_user_info(){
		         var user_id = this.requested_by;  
		         // console.log(user_id);            
		         Meteor.subscribe("user_info_based_on_id",user_id);
		         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
		         console.log('show requesters details');
		         console.log(result);
		         return result;
		    },

});


Template.reward_management_details.events({

'click .reject_redeem_status':function(){    
		swal("Reject");	
		var request_id = this.request_id;
		var status = 2;
    swal("Sure you want to Reject this request?", {
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
            Meteor.call('change_reward_request_status', request_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal(" Successfully Marked it as paid.");
                window.location.reload();
              }
            });
            break;
        }
      });

	},

'click .accept_redeem_status':function(){    
		swal("Aceept");
		var request_id = this.request_id;
		var status = 1;
    swal("Sure you want to Mark it as Paid?", {
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
            Meteor.call('change_reward_request_status', request_id, status, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal(" Successfully Marked it as paid.");
                window.location.reload();
              }
            });
            break;
        }
      });
	},

});