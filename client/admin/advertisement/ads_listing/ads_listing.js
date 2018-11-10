
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
import { promotion } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.display_promotion_listing.onDestroyed(function () {
  book_listing.stop();
});

Template.display_promotion_listing.onCreated(function eventlistOnCreated(){

});

Template.display_promotion_listing.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_promotion_listing').DataTable();
    // });  
    });  

  book_listing = Meteor.subscribe("fetch_promotion_listing");

  setTimeout(function () {
    $('#loading_div').addClass('loader_visiblity_block');
  }, 2000);
});




 Template.display_promotion_listing.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    show_promotion_details(){
console.log('https://en.wikipedia.org/wiki/Greece');
    var result = promotion.find({}).fetch();

    console.log('show result: ');
    console.log(result);
    return result;

},

});


Template.display_promotion_listing.events({

    "click #create_promotion":function(){
        Router.go("/create_promotion");
  },

    "click .edit_promotion_details":function(){

            var promotion_id = Base64.encode(this.promotion_id);    
            var url = '/edit_promotion_details/'+promotion_id;
            Router.go(url);
  },

});

