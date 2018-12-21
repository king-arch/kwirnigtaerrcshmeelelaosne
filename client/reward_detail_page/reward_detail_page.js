

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
import { promotion } from './../../import/collections/insert.js';
import { reward_details } from './../../import/collections/insert.js';
import { campaign_details } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var reward_details_all;

Template.display_reward_detail_page.onDestroyed(function () {
  reward_details_all.stop();
});

Template.display_reward_detail_page.onCreated(function eventlistOnCreated(){

});

Template.display_reward_detail_page.onRendered(function () {



    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){            
            setTimeout(function () {
              $('#show_reward_point_listing').DataTable(); 
            }, 2000);
    });  

    $(".show_packages").addClass("loader_visiblity_block");
      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

      reward_details_all = Meteor.subscribe("reward_details_all_with_user_id",Session.get("userId"));
      Session.set("total_reward_points",0);
    });

 Template.display_reward_detail_page.helpers({

    show_reward_listing(){
      var logged_in_user = Session.get("userId");
      reward_details_all = Meteor.subscribe("reward_details_all");
      var result = reward_details.find({reward_to: logged_in_user}).fetch();
      return result;
    },

    total_reward_points(){
      var logged_in_user = Session.get("userId");
      reward_details_all = Meteor.subscribe("reward_details_all");
      var result = reward_details.find({reward_to: logged_in_user,reward_redeem_status: 0}).fetch();

      var total_count = 0;
      if(result[0]){
            for(var i=0; i< result.length; i++){

              total_count = total_count + parseInt(result[i].reward_value);
            }
      }
      Session.set("total_reward_points",total_count);
      return total_count;

    },

    check_if_eligible_to_redeem(total_reward_points){
            if(parseInt(Session.get("total_reward_points")) >= 1000){
              return true;
            }else{
              return false;
            }
    },

   reward_distribution_date(){
      var new_year  = moment(this.created_at).format('YYYY');
      var new_month  = moment(this.created_at).format('MMM');
      var new_day  = moment(this.created_at).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },



});


Template.display_reward_detail_page.events({

    "click #send_request_to_redeem":function(){
      var logged_in_user = Session.get("userId");
      var requested_value = Session.get("total_reward_points");
        Meteor.call('send_redeem_request',logged_in_user,requested_value,function(error,result){
          if(error){
              console.log("Error");
          }else{
           swal("Request sent");
          }
    });  

    },

});

