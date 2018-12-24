

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
import { user_details } from './../../import/collections/insert.js';
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

      var fetch_user_account_details = user_details.find({user_id: Session.get("userId")}).fetch();

if(fetch_user_account_details[0]){
  // alert('case 1');
  // alert('this');
  // console.log(this);
  var account_number = 0;
  if(fetch_user_account_details[0].account_number){

    account_number = fetch_user_account_details[0].account_number;
        swal('You have entered "'+account_number+'" account number.'+
'If you want, You can change this account detail from edit personal infomation section of profile section as it would be used by admin for sending reward points equilent money.'+
' If its not complete or correct, we will process your request and will reject it.', {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Sure",
            value: "catch",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "defeat":
            swal("Pikachu fainted! You gained 500 XP!");
            break;

          case "catch":
        Meteor.call('send_redeem_request',logged_in_user,requested_value,account_number,function(error,result){
          if(error){
              console.log("Error");
          }else{
           swal("Request sent");
          }
    });  
            break;
        }
      });

  }else{

        swal('You havent entered your Account details.'+
'Admin requires this for sending reward points equilent money.'+
' If you wish to complete account details, you can do it from edit personal infomation section of profile section.', {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Sure",
            value: "catch",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "defeat":
            swal("Pikachu fainted! You gained 500 XP!");
            break;

          case "catch":
return false;

            break;
        }
      });
   }}   
    },

});

