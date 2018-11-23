
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';
import swal from 'sweetalert';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;



Template.signup_content.onRendered(function(){
  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){
       // swal('call sending mail function');
       // $("#send_mail").click();
    },3000);

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);

      // swal('here: ');
      // swal('user_id: '+user_id );
       Meteor.call('check_signup_status',user_id,function(error,result){
              if(error){
                swal("Some error occure.");
              
              }else{

                // swal('ssshhsh');
                console.log(result);
            console.log("inside  Signup"  );

              if(result.email_status == 0){
                swal();
                window.location.href("/email");
                // Router.go('/email');
                 // Router.go('/signup');
                 console.log("case 1");
              }

              else if(!result.user_headline){
                console.log("case 4");
                $('#step_5').removeClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').addClass("hide_object");
              }

              else if(!result.user_location){
                // swal("location empty");
                console.log("case 2");
                $('#step_5').addClass("hide_object");
                $('#step_6').removeClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').addClass("hide_object");
              }

              else if(!result.catagries_status){
                console.log("case 3");
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').removeClass("hide_object");
                $('#step_8').addClass("hide_object"); 
              }

              else if(!result.follow_people_status){
                console.log("case 5");
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').removeClass("hide_object"); 
              }

              else{
                window.location.href="/profile";
              }

              }

            });

});

Template.signup_content.helpers({

    'logged_in_user_email' : function(){
      var email = Session.get("userEmail");
      return email;
    },

    'show_profile_image' : function(){
      var profile_pic = Session.get("profile_pic_session");
      if(profile_pic){
        // swal(profile_pic);
        var result = profile_pic;
      }else{
        var result = "/img/focus.png"
      }
      return result;
    },

        show_interest_list(){

    Meteor.subscribe("fetch_result_interest_listing");
      var result = interest_list.find({interest_status: 1}).fetch();
    console.log('show result interest: ');
    console.log(result);
    return result;
},



//START - for showing and validating the User listing to follow
    show_user_info(){

      var follow_user_id = this.user_id;
      var logged_in_user = Session.get("userId");
      var admin_id = "user_admin";

      follow_list_all = Meteor.subscribe("follow_list_all");
      follow_list_all = Meteor.subscribe("fetch_user_listing");
          Meteor.subscribe("fetch_user_listing");
       var result = user_details.find({ user_id: {  $ne: logged_in_user  }}).fetch();

      var new_result = new Array();
      var count = 1;
      for(var i = 0; i < result.length; i++){
        console.log(result[i]);

          if(count <= 6 && result[i].user_id != admin_id){
            var result2 = following_list.find({ $and: [{ "following": result[i].user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();
             if(result2[0]){

             }else{
              new_result.push(result[i]);
              count = count + 1;
             }    
          }
        }

      console.log('new array');
      console.log(new_result);
                                

      return new_result;
    },

    check_if_already_following(){
      var follow_user_id = this.user_id;
      var logged_in_user = Session.get("userId");

      follow_list_all = Meteor.subscribe("follow_list_all");
      var result = following_list.find({ $and: [{ "following": follow_user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();    

      console.log('showing user list all');

      if(result[0]){
        return false;
      }else{
        return true;
      }
      console.log(result);

      return result;
    },

        user_name_to_follow(){
      var user_name = this.user_name;
      if(user_name.length > 8){
        return user_name.slice(0, 8)+'...';
      }
      else{
        return user_name;
      }

    },

//END - for showing and validating the User listing to follow

});

Template.signup_content.events({

  'click .click_on_follow':function(){
    // swal('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    
      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },

    'click #signup_complete':function(e, template){
      
      var logged_in_user = Session.get("userId");  
      Meteor.call('change_follow_status',logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('Follow status update!');
              }
          });

    Router.go("/profile");
  },

  'click .click_on_unfollow':function(){
    // swal('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // swal('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

          Meteor.call('unfollow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },

  'change .user_profile_pic':function(e, template){
      upload_cover_pic(e, template);
  },


  'click #submit_headline_and_profile_pic':function(){
    
  var signup_headline = $('#signup_headline').val().trim(); 
  var signup_profile_pic = Session.get("profile_pic_session");  
    
    if(signup_headline == null || signup_headline == '')
    {
      $("#signup_headline").addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $("#signup_headline").removeClass('emptyfield2');
    }

    if(signup_profile_pic == null || signup_profile_pic == '')
    {
      $("#signup_profile_pic").addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $("#signup_profile_pic").removeClass('emptyfield2');
    }

    var user_id = Session.get("userId");  

      Meteor.call('insert_headline_and_profile_pic',signup_headline,signup_profile_pic,user_id,function(error,result){
              if(error){
                swal("Some error occure.");
              
              }else{

                $('#step_5').addClass("hide_object");
                $('#step_6').removeClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').addClass("hide_object");

              }
          });
  },

    'click #submit_signup_location':function(){

    var signup_location = $('#signup_location').val().trim(); 
    if(signup_location == null || signup_location == '')
    {
      $("#signup_location").addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $("#signup_location").removeClass('emptyfield2');
    }

    var user_id = Session.get("userId");  

      Meteor.call('insert_location',signup_location,user_id,function(error,result){
              if(error){
                swal("Some error occure.");
              
              }else{
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').removeClass("hide_object");
                $('#step_8').addClass("hide_object");

              }
          });
  },

    'click #signup_catagries':function(){

    Meteor.subscribe("fetch_result_interest_listing");

    var result = interest_list.find({interest_status: 1}).fetch();
    console.log('show result interest: ');
    console.log(result);

    console.log(' showfull list of checkbox for interest.');

    var catagries_array = new Array();
    for(var i=0; i< result.length; i++){
        console.log(result[i].interest_id);

        if(document.getElementById('checkbox_'+result[i].interest_id).checked){
      console.log(result[i].interest_id+' is checked');
      $("#end_month").removeClass('emptyfield'); 
      $("#end_year").removeClass('emptyfield');

      catagries_array.push(result[i].interest_id); 
    } 
    }

    if(catagries_array.length <  1)
    {
      swal("we need to select at least one catagry");
      return false;
    }
      console.log('catagries_array: ');
      console.log(catagries_array);

      // return false;
      var user_id = Session.get("userId");

      Meteor.call('insert_catagries',catagries_array,user_id,function(error,result){
              if(error){
                swal("Some error occure.");
              
              }else{
              
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').removeClass("hide_object");

              }
          });
  },
  });

//START image uploading functionalities
function upload_cover_pic(e,template){
// swal('ok');
        if (e.currentTarget.files && e.currentTarget.files[0]) {
         var file = e.currentTarget.files[0];
          if (file) {
            var reader = new FileReader();
       var base64data="";
       reader.readAsDataURL(file);

       reader.onload = function () {
       console.log(reader.result);
       base64data = reader.result;
       console.log(base64data);

     Session.set("profile_pic_session",base64data);
     // swal(profile_pic_session);
    };
    
   }
  }
 } 

function dataURItoBlob(dataURI) {

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}