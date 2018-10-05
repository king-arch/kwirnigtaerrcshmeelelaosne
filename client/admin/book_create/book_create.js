
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

// import { daterangepicker } from './../../theme js/daterangepicker.js';
// import { simplecalendar } from './../../theme js/simplecalendar.js';
// import { moment } from './../../theme js/moment.js';
// import { fullcalendar } from './../../theme js/fullcalendar.js';

var admin_detailed;

Template.create_book.onDestroyed(function () {
	admin_detailed.stop();
});

Template.create_book.onRendered(function () {
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
	
		    var picker = new Pikaday({ field: document.getElementById('date_picker') });
	})

	Session.set("book_cover_session","");


	setTimeout(function () {
		click_events();
	}, 2000);
});


 Template.create_book.helpers({

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

	$('#go_back').click(function (e) {
		history.go(-1);
	});



  $('#user_management').click(function(e){
      Router.go("/user_management");
  });



  $('#book_management').click(function(e){
  		Router.go("/book_management");
  });
  

	// $('#add_book').click(function (e) {
	// 	Router.go('/add_book');
	// });

	$('#add_book').click(function (e) {
// alert('here: ');
		var book_name = $('#book_name').val();
		var book_summary = $('#book_summary').val();
		var book_price = $('#book_price').val();
		var book_catagries = $('#book_catagries').val();
		var author_name = $('#author_name').val();

		var author_description = $('#author_description').val();
		var amazon_link = $('#amazon_link').val();

		var date_picker = $('#date_picker').val();
		// var release_month = $('#release_month').val();
		// var release_year = $('#release_year').val();

		if (book_name == '' || book_name == undefined) {
			$('#book_name').addClass('empty_field').focus();
			return false;
		} else {
			$('#book_name').removeClass('empty_field').blur();
		}

		if (book_summary == '' || book_summary == undefined) {
			$('#book_summary').addClass('empty_field').focus();
			return false;
		} else {
			$('#book_summary').removeClass('empty_field').blur();
		}

		if (book_price == '' || book_price == undefined) {
			$('#book_price').addClass('empty_field').focus();
			return false;
		} else {
			$('#book_price').removeClass('empty_field').blur();
		}

		if (book_catagries == '' || book_catagries == undefined) {
			$('#book_catagries').addClass('empty_field').focus();
			return false;
		} else {
			$('#book_catagries').removeClass('empty_field').blur();

		if (author_name == '' || author_name == undefined) {
			$('#author_name').addClass('empty_field').focus();
			return false;
		} else {
			$('#author_name').removeClass('empty_field').blur();
		}

		if (book_catagries == '' || book_catagries == undefined) {
			$('#book_catagries').addClass('empty_field').focus();
			return false;
		} else {
			$('#book_catagries').removeClass('empty_field').blur();
		}
		}

		if (amazon_link == '' || amazon_link == undefined) {
			$('#amazon_link').addClass('empty_field').focus();
			return false;
		} else {
			$('#amazon_link').removeClass('empty_field').blur();
		}

		if (date_picker == '' || date_picker == undefined) {
			$('#date_picker').addClass('empty_field').focus();
			return false;
		} else {
			$('#date_picker').removeClass('empty_field').blur();
		}

		// if (release_date == '' || release_date == undefined) {
		// 	$('#release_date').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#release_date').removeClass('empty_field').blur();
		// }

		// if (release_month == '' || release_month == undefined) {
		// 	$('#release_month').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#release_month').removeClass('empty_field').blur();
		// }

		// if (release_year == '' || release_year == undefined) {
		// 	$('#release_year').addClass('empty_field').focus();
		// 	return false;
		// } else {
		// 	$('#release_year').removeClass('empty_field').blur();
		// }

    // var mydate = new Date();
    // var str = moment(mydate).format('YYYY');

    book_price = Math.round(book_price * 100) / 100;

    // // alert(str);

    // if (release_year > str) {
    //   swal(' Last used year value cannot be greater then the current year');
    //   $('#release_year').addClass('empty_field').focus();
    //   return false;
    // } else if (release_year < 1900) {
    //   swal(' Last used year value cannot be less then the 1900');
    //   $('#release_year').addClass('empty_field').focus();
    //   return false;
    // }

    // var date = release_date;
    // var month = release_month;
    // var year = release_year;


    // if (release_year == str) {

    //   var mydate = new Date();
    //   var current_month = moment(mydate).format('MM');
    //   // var current_month2=moment(mydate).format('MMMM');
    //   // alert(current_month +' & '+current_month2);

    //   var selected_month;

    //   if (release_month == 'Jan') {
    //     selected_month = 01;
    //   } else if (release_month == 'Feb') {
    //     selected_month = 02;
    //   } else if (release_month == 'Mar') {
    //     selected_month = 03;
    //   } else if (release_month == 'Apr') {
    //     selected_month = 04;
    //   } else if (release_month == 'May') {
    //     selected_month = 05;
    //   } else if (release_month == 'Jun') {
    //     selected_month = 06;
    //   } else if (release_month == 'Jul') {
    //     selected_month = 07;
    //   } else if (release_month == 'Aug') {
    //     selected_month = 08;
    //   } else if (release_month == 'Sep') {
    //     selected_month = 09;
    //   } else if (release_month == 'Oct') {
    //     selected_month = 10;
    //   } else if (release_month == 'Nov') {
    //     selected_month = 11;
    //   } else if (release_month == 'Dec') {
    //     selected_month = 12;
    //   }

    //   if (selected_month > current_month) {
    //     swal('you cant select month greater than current month of this year');
    //     $('#release_month').addClass('empty_field').focus();
    //     return false;
    //   }
    // }

    // var final_release_date = month + ' ' + date + ', ' + year;


    var search_string = amazon_link.search("amazon");
    
    if(search_string < 0){
    	$('#amazon_link').addClass('empty_field').focus();
    	return false;
    }  
	    if(Session.get("book_cover_session")){
		  var book_cover = Session.get("book_cover_session");
		}
		else{
					$('#book_cover').addClass('empty_field').focus();
					return false;
		}


		$('#loader_gif').removeClass('div_hide_class');

		// swal(
		// 	' book_name: '+book_name+' book_summary: '+book_summary+
		// 	' book_catagries: '+book_catagries+' author_name: '+author_name+
		// 	' author_description: '+author_description+' amazon_link: '+amazon_link+
		// 	' book_price: '+book_price+' book_cover: '+book_cover+' final_release_date: '+final_release_date
		// 	);
		var final_release_date = date_picker;
		var book_id = 'book_id_' + Math.floor((Math.random() * 2465789) + 1);

		$('#save_text').addClass('div_hide_class');
	    $('#loader_gif').removeClass('div_hide_class');	
		
		Meteor.call('save_book_details', book_id, book_name, book_summary, book_catagries, author_name, author_description,
		 amazon_link, book_cover, final_release_date,book_price, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal('Some error occured!');

			} else {
				if (result) {
						swal('Book successfully added. ');
						Router.go('/book_management');
					}
				}
		});

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

		 Session.set("book_cover_session",base64data);

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