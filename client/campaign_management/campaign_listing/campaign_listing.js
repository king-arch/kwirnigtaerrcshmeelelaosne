

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
import { promotion } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.campaign_listing_detail.onDestroyed(function () {
  book_listing.stop();
});

Template.campaign_listing_detail.onCreated(function eventlistOnCreated(){

});

Template.campaign_listing_detail.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
      $('#show_promotion_listing').DataTable(); 
    });  

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.campaign_listing_detail.helpers({

    // show_dates(){
    //   var array = new Array;
    //   for(var i=1;i<32;i++){
    //     array.push({'index': i});
    //   }
    //   console.log('here we are: ');
    //   console.log(array);
    //   return array;
    // },

});


Template.campaign_listing_detail.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign";
   	},

});

