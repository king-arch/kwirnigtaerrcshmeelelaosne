
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
import { book_details } from './../../../import/collections/insert.js';

var admin_detailed;
Template.edit_book_details.onDestroyed(function () {
	admin_detailed.stop();
});

Template.edit_book_details.onRendered(function () {
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.min.js",function(){
	
		    var picker = new Pikaday({ field: document.getElementById('date_picker') });
	})



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
  var book_id = Base64.decode(url);
// alert('book_id: '+ book_id);

  Meteor.call('fetch_book_details', book_id, function (error, result) {
    if (error) {
      console.log("Some error occured.");
    } else {

      console.log('result: ');
      console.log(result);
      // alert("book details successfully fetched!");
      console.log("book details successfully fetched!");

      var book_name = result[0].book_name;
      var book_id = result[0].book_id;
      var book_summary = result[0].book_summary;
      var book_catagries = result[0].book_catagries;
      var author_name = result[0].author_name;

      var author_description = result[0].author_description;
      var amazon_link = result[0].amazon_link;
      var book_price = result[0].book_price;
      var book_cover = result[0].book_cover;
      var final_release_date = result[0].final_release_date;

      $('#hidden_book_id').val(book_id);
      $('#book_name').val(book_name);
      $('#book_summary').val(book_summary);
      $('#book_catagries').val(book_catagries);
      $('#author_name').val(author_name);

      $('#author_description').val(author_description);
      $('#amazon_link').val(amazon_link);
      $('#book_price').val(book_price);
      // $('#release_date').val(final_release_date);

      // var load_date = final_release_date;

      // load_date = load_date.split(',');
      // var day_and_month = load_date[0].trim();
      // var year = load_date[1].trim();


      // day_and_month = day_and_month.split(' ');
      // var day = day_and_month[1].trim();
      // var month = day_and_month[0].trim();

      // // alert(day+' '+month+' '+year);
      // $('#release_date').val(day);
      // $('#release_month').val(month);
      $('#date_picker').val(final_release_date);

      Session.set("book_cover_session",book_cover);

    }
  });

});


 Template.edit_book_details.helpers({
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

    
    var final_release_date = date_picker;

        book_price = Math.round(book_price * 100) / 100;


	    
	    if(Session.get("book_cover_session")){
		  var book_cover = Session.get("book_cover_session");
		}
		else{
					$('#book_cover').addClass('empty_field').focus();
					return false;
		}

		swal(
			' book_name: '+book_name+' book_summary: '+book_summary+
			' book_catagries: '+book_catagries+' author_name: '+author_name+
			' author_description: '+author_description+' amazon_link: '+amazon_link+
			' book_price: '+book_price+' book_cover: '+book_cover+' final_release_date: '+final_release_date
			);

		 var book_id = $('#hidden_book_id').val();

		 // var check_amazon_link = ValidURL(amazon_link);



		$('#loader_gif').removeClass('div_hide_class');
		$('#save_text').addClass('div_hide_class');
		
		Meteor.call('edit_save_book_details', book_id, book_name, book_summary, book_catagries, author_name, author_description,
		 amazon_link, book_cover, final_release_date,book_price, function (error, result) {

			$('#loader_gif').addClass('div_hide_class');
			$('#save_text').removeClass('div_hide_class');

			if (error) {
				swal('Some error occured!');

			} else {
						swal('Book successfully added. ');
						Router.go('/book_management');
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


// function ValidURL(str) {
//   var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
//   '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//   '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//   '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//   return pattern.test(str);
// }
