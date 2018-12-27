
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
            setTimeout(function () {
              $('#show_campaign_listing_admin').DataTable(); 
                    }, 2000);
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
          return 'Pending';
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
      var result = campaign_details.find({},{sort: {created_at: -1} }).fetch();
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


Template.show_campaign_listing_admin.events({

    "click #create_campaign":function(){
        // alert("clicked");
        window.location.href = "create_campaign_admin";
    },

    "click #go_to_review_request_listing":function(){
        // alert("clicked");
        window.location.href = "review_request_listing";
    },

    "click #go_to_review_approval_listing":function(){
        // alert("clicked");
        window.location.href = "review_approval_listing";
    },

    "click .view_detail":function(){
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/campaign_detail/'+campaign_id;
            console.log(url);
            window.location.href = url;     
    },

    
  'click .view_profile':function(){      
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            window.location.href = url;
    },  


    "click .view_request_listing":function(){
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/review_request_listing_individual/'+campaign_id;
            console.log(url);
            window.location.href = url;     
    },

    "click .view_approval_listing":function(){
            var campaign_id = this.campaign_id;
            var campaign_id = Base64.encode(campaign_id);  
            var url = '/review_approval_listing_individual/'+campaign_id;
            console.log(url);
            window.location.href = url;   	
    },

});

