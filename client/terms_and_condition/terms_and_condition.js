
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

Template.terms_content.onDestroyed(function () {
	book_listing.stop();
	blog_listing.stop();
});

Template.terms_content.onCreated(function eventlistOnCreated(){

});

Template.terms_content.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
    	setTimeout(function () {
    	        $('#show_book_listing').DataTable();
			}, 2000);
    });  

	setTimeout(function () {
		$('#loading_div').addClass("loader_visiblity_block");
	}, 3000);

});

 Template.terms_content.helpers({

    terms_and_condition_content(){ 
      
      Meteor.subscribe("show_terms_and_condition");
      var result = content.find({content_type: "terms_and_condition"}).fetch();
      console.log('terms_and_condition');
      console.log(result);
      return result;
    },


});

Template.terms_content.events({

    'click .view_profile':function(){  
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            window.location.href = url;
    }, 

});