

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
import { campaign_details } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.show_campaign_listing_admin.onDestroyed(function () {
  book_listing.stop();
});

Template.show_campaign_listing_admin.onCreated(function eventlistOnCreated(){

});

Template.show_campaign_listing_admin.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
      $('#show_campaign_listing_admin').DataTable(); 
    });  
       book_listing = Meteor.subscribe("campaign_details_all_list");

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.show_campaign_listing_admin.helpers({

    check_approval_status(){
        if(this.approval_status == 0){
          return 'pending';
        }
        else if(this.approval_status == 1){
          return 'Accepted';
        }
        else if(this.approval_status == 2){
          return 'Rejected';
        }
    },

    check_approval_status_for_time_dislay(){
      if(this.approval_status == 0){
          return false;
        }
        else if(this.approval_status == 1){
          return true;
        }
        else if(this.approval_status == 2){
          return false;
        }
    },

    show_campaign_listing(){
      var result = campaign_details.find({}).fetch();
      return result;
    },

    status_updated_time(){
      var new_year  = moment(this.status_updated_time).format('YYYY');
      var new_month  = moment(this.status_updated_time).format('MMM');
      var new_day  = moment(this.status_updated_time).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

    select_package(){
      var new_date = moment(this.status_updated_time).add(this.select_package, 'day');
      
      var new_year  = moment(new_date).format('YYYY');
      var new_month  = moment(new_date).format('MMM');
      var new_day  = moment(new_date).format('DD');

      // console.log("new_day: "+ new_day+" new_year: "+ new_year);
      var end_date = new_month + ' '+new_day+' , '+new_year;
      return end_date;
    },

});


Template.show_campaign_listing_admin.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign_admin";
    },

    "click .view_detail":function(){
        // alert("clicked");
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/campaign_detail/'+campaign_id;
            console.log(url);
            window.location.href = url;

   	},

});

