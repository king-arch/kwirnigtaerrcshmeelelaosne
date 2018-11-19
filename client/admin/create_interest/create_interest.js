
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

// import { daterangepicker } from './../../theme js/daterangepicker.js';
// import { simplecalendar } from './../../theme js/simplecalendar.js';
// import { moment } from './../../theme js/moment.js';
// import { fullcalendar } from './../../theme js/fullcalendar.js';

var admin_detailed;

Template.create_interest_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.create_interest_details.onRendered(function () {


	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
    var picker = new Pikaday({ field: document.getElementById('date_picker') });
	})

	Session.set("book_cover_session","");
	setTimeout(function () {
		// click_events();
	}, 2000);
});


 Template.create_interest_details.helpers({

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

 Template.create_interest_details.events({

 	'click #go_back': function(){
    	  // swal('here: ');
    	window.history.go(-1);
    },


    'click #add_interest': function(){
    	// swal('ddd');
    		$('#loader_gif').removeClass('div_hide_class');
			$('#save_text').addClass('div_hide_class');

		var interest_text = $('#interest_text').val();
		if (interest_text == '' || interest_text == undefined) {
			$('#interest_text').addClass('empty_field').focus();
			return false;
		} else {
			$('#interest_text').removeClass('empty_field').blur();
		}

		interest_text = interest_text.substring(0, 1).toLocaleUpperCase() + interest_text.substring(1);

		Meteor.call('save_interest',interest_text, function (error, result) {
			
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
				swal(result.msg);
				$('#interest_text').val("");
		}
		});


	},

});
