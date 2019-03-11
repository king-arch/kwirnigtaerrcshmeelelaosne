
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

Template.preview_content.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.preview_content.onCreated(function eventlistOnCreated(){

});

Template.preview_content.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

});

 Template.preview_content.helpers({

    preview_policy_content(){ 
      
      Meteor.subscribe("show_review_policy");
      var result = content.find({content_type: "review_policy"}).fetch();
      console.log('preview_content');
      console.log(result);
      return result;
    },


});
