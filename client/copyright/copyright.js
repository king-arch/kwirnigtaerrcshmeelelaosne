
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
import { campaign_details } from './../../import/collections/insert.js';
import { book_details } from './../../import/collections/insert.js';
import { blog } from './../../import/collections/insert.js';

import { user_details } from './../../import/collections/insert.js';
import { notification_details } from './../../import/collections/insert.js';
import { content } from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var blog_listing;

Template.copyright_content.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.copyright_content.onCreated(function eventlistOnCreated(){

});

Template.copyright_content.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

});

 Template.copyright_content.helpers({

    copyright_policy_content(){ 
      
      Meteor.subscribe("show_copyright_policy");
      var result = content.find({content_type: "copyright_policy"}).fetch();
      console.log('copyright_content');
      console.log(result);
      return result;
    },


});
