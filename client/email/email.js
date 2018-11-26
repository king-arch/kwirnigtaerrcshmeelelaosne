
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';
import swal from 'sweetalert';

Template.email_content.onRendered(function(){



  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){
          $('#loading_div').addClass("loader_visiblity_block");
      // swal('call sending mail function');
       $("#send_mail").click();
    },3000);

     var userHandle =  user_details.find({"user_id": Session.get("userId")}).observe({
      added: function(newDoc) {
    },
      removed: function(oldDoc) {
    },
      changed: function(newDoc, oldDoc) {
        if(newDoc.email_status != oldDoc.email_status){
         Router.go('/signup');
        }
    }
  });

});

Template.email_content.helpers({

  'email_checker' : function(){

var user_id = Session.get("userId");

  if(Session.get("makeUserActive")=="true"){
      console.log(user_id);  
      var result = user_details.find({"user_id": user_id}).fetch();
      console.log(result);
  if(result[0] && result[0].email_status == 1){
            if(result[0].headline){
            Router.go('/profile');
            }else{
            Router.go('/signup');
            }
        }else{
            Meteor.call('update_email_status', Session.get("userId"), 1, function(error, result){
              if(error){
               toastr.error("Some error occured");
              }else{
                Router.go('/signup');
              }
            }); 
      }
  }  
},

    'logged_in_user_email' : function(){
      // swal('hi :');
      var email = Session.get("userEmail");
      return email;
    },

});


Template.email_content.events({

  'click #send_mail':function(event){

    // alert('sending email');
    $('#loading_div').removeClass("loader_visiblity_block");
    $('#save_text').addClass("loader_visiblity_block");
    // return false;

    var userEmail = Session.get("userEmail");
    Meteor.call('send_email_for_confirmation',Session.get("userId"),userEmail,function(error,result){
    if(error)
          {
             console.log('Error');
          }
      else{
        console.log('sucess: '+result);
          }
    });

    $('#loading_div').addClass("loader_visiblity_block");
    $('#save_text').removeClass("loader_visiblity_block");

  },

  });
