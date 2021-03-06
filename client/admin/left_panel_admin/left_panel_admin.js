
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

// var book_listing;

Template.left_panel_admin.onDestroyed(function () {
	// book_listing.stop();
});

 Template.left_panel_admin.events({

    'click #user_management':function(){
        Router.go("/user_management");
  },

    'click #edit_profile':function(){
        Router.go("/edit_profile");
  },

    'click #reward_management':function(){
  		  Router.go("/reward_management");
  },

    'click #admin_dashbaord':function(){
        Router.go("/admin_dashboard");
  },

    'click #book_management':function(){
        Router.go("/book_management");
  },

    'click #campaign_management':function(){
  		  Router.go("/campaign_listing_admin");
  },

    'click #interest_management':function(){
  		  Router.go("/interest_management");
  },

    'click #advertisement_management':function(){
  		  Router.go("/promotion_listing");
  },

    'click #blog_management':function(){
        Router.go("/blog_listing_admin");
  },
    'click #admin_notification':function(){
  		  Router.go("/admin_notification");
  },

    'click #admin_settings':function(){
        Router.go("/admin_settings");
  },

    'click #report_display':function(){
        Router.go("/report_analyze");
      },


    'click #invoice_management':function(){
        Router.go("/invoice_management");
      },

    'click #sign_out':function(){
        Session.clear("active_user");
        Session.clear("active_user_type");
  		  Session.clear("userEmail");

        Router.go("/");
      },

 });

 Template.left_panel_admin.helpers({

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
	                                }] }).fetch();

    }
    else{
    	var result = book_details.find({}).fetch();
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

	check_if_editor_or_admin(){
		var book_summary = Session.get("userId");  

		if(book_summary == "user_admin" ){
			return true;
		}else{
			return false;
		}
	},

    notification_pending(){
      var logged_in_user = Session.get("userId");
      Meteor.subscribe("notification_details_for_user",logged_in_user);

      var result = notification_details.find({notification_to: 'writersmelon', notification_status: {$ne : 1}}).fetch();
      console.log(' check_status for notifications: ');
      console.log(result);
      if(result[0]){
        return true;
      }else{
        return false;
      }                               
    },

});


