
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

var book_listing;

Template.left_panel_admin.onDestroyed(function () {
	book_listing.stop();
});

 Template.left_panel_admin.events({

    'click #user_management':function(){
  		  Router.go("/user_management");
  },

    'click #book_management':function(){
  		  Router.go("/book_management");
  },

    'click #interest_management':function(){
  		  Router.go("/interest_management");
  },

    'click #advertisement_management':function(){
  		  Router.go("/promotion_listing");
  },

    'click #blog_management':function(){
  		  Router.go("/blog_listing");
  },

    'click #admin_settings':function(){
        Router.go("/admin_settings");
  },

    'click #report_display':function(){
        Router.go("/report_analyze");
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


});


