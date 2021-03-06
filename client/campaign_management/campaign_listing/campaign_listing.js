

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
import { campaign_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;

Template.campaign_listing_detail.onDestroyed(function () {
  book_listing.stop();
});

Template.campaign_listing_detail.onCreated(function eventlistOnCreated(){

});

Template.campaign_listing_detail.onRendered(function () {

    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
            setTimeout(function () {
              $('#show_campaign_listing').DataTable(); 
            }, 2000);
    });  

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);
    });

 Template.campaign_listing_detail.helpers({

    show_user_campaign_listing(){
      var logged_in_user = Session.get("userId");
      Meteor.subscribe("campaign_details_all_list");
      var result = campaign_details.find({campaigner_id: logged_in_user, entry_type: {$ne: "campaign_completion_report"} }).fetch();
      return result;
    },

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
        else if(this.approval_status == 3){
          return 'Accepted';
        }
        else if(this.approval_status == 4){
          return 'Finished';
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
        else if(this.approval_status == 3){
          return true;
        }
    },

    show_campaign_listing(){
      var result = campaign_details.find({}).fetch();
      return result;
    },

    campaign_start_date(){
      var new_year  = moment(this.campaign_start_date).format('YYYY');
      var new_month  = moment(this.campaign_start_date).format('MMM');
      var new_day  = moment(this.campaign_start_date).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

    select_package(){
      var new_date = moment(this.campaign_start_date).add(this.select_package, 'day');
      
      var new_year  = moment(new_date).format('YYYY');
      var new_month  = moment(new_date).format('MMM');
      var new_day  = moment(new_date).format('DD');

      // console.log("new_day: "+ new_day+" new_year: "+ new_year);
      var end_date = new_month + ' '+new_day+' , '+new_year;
      return end_date;
    },

      book_summary_trimmed(){
       var book_summary = this.book_summary;
    if(book_summary.length > 165){
      book_summary = book_summary.substr(0,164);
      return book_summary+'...';
    }else{
      return book_summary;
    }
  },

});


Template.campaign_listing_detail.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign";
    },

    "click .view_invoice_detail":function(){

      var campaign_id = Base64.encode(this.campaign_id);  
      var url = '/invoice_detail/'+campaign_id;
            console.log(url);
            window.location.href = url;
          },

    "click .show_reviewer_details":function(){

      var campaign_id = Base64.encode(this.campaign_id);  
      var url = '/reviewer_details/'+campaign_id;
            console.log(url);
            window.location.href = url;
    },

    "click .view_completion_report":function(){

      var campaign_id = Base64.encode(this.campaign_id);  
      var url = '/campaign_completion_report/'+campaign_id;
            console.log(url);
            window.location.href = url;
    },

    "click .go_to_book_detail":function(){ 
      var book_id = Base64.encode(this.book_id);  
      var url = '/book_detail/'+book_id;
            console.log(url);
            window.location.href = url;
    },


    "click .view_detail":function(){
        // alert("clicked");
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/campaign_detail/'+campaign_id;
            console.log(url);
            // window.location.href = url;
    },

});

