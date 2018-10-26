
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;

Template.signup_content.onRendered(function(){

//   $.getScript("https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js",function(){
//   alert('loaded');
//   });

  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){
       // alert('call sending mail function');
       // $("#send_mail").click();
    },3000);

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);

      // alert('here: ');
      // alert('user_id: '+user_id );
       Meteor.call('check_signup_status',user_id,function(error,result){
              if(error){
                alert("Some error occure.");
              
              }else{

                // alert('ssshhsh');
                console.log(result);
            console.log("inside  Signup"  );

              if(result.email_status == 0){
                alert();
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
                // alert("location empty");
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
        // alert(profile_pic);
        var result = profile_pic;
      }else{
        var result = "img/focus.png"
      }
      return result;
    },

    show_user_info(){

      var user_id = Session.get("userId");

      user_info_list_all = Meteor.subscribe("user_info_all");
      var result = user_details.find({},{limit: 6}).fetch();

      console.log('showing user list all');
      console.log(result);

      return result;
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

        show_interest_list(){
     //     var query = new RegExp(Session.get("search_txt"),'i'); 
     //     if(Session.get("search_txt")){
     //       // alert('case2');
     //     var result = interest_list.find({}).fetch();

    // }
    // else{
    //  var result = interest_list.find({}).fetch();
    // }

    Meteor.subscribe("fetch_result_interest");
      var result = interest_list.find({interest_status: 1}).fetch();
    console.log('show result interest: ');
    console.log(result);
    return result;
},


});

Template.signup_content.events({

  'change .user_profile_pic':function(e, template){
      upload_cover_pic(e, template);
  },

  'click #signup_complete':function(e, template){
    // alert('show');
    Router.go("/profile");
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
                alert("Some error occure.");
              
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
                alert("Some error occure.");
              
              }else{
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').removeClass("hide_object");
                $('#step_8').addClass("hide_object");

              }
          });
  },

    'click .click_on_follow':function(){

    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  

      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                alert("Some error occure.");
              }else{
                console('successfully following ');
              }
          });
  },

    'click #signup_catagries':function(){
      // alert('catagriey submition clicked');
    // var signup_location = $('#signup_location').val().trim(); 

    Meteor.subscribe("fetch_result_interest");

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
// return false;
    // var catagries_array = new Array();
    // if(document.getElementById('science').checked){
    //   console.log('science is checked');
    //   $("#end_month").removeClass('emptyfield'); 
    //   $("#end_year").removeClass('emptyfield');

    //   catagries_array.push('science'); 
    // } 

    // if(document.getElementById('math').checked){
    //   console.log('math is checked');
    //   $("#end_month").removeClass('emptyfield'); 
    //   $("#end_year").removeClass('emptyfield'); 

    //   catagries_array.push('math');
    // } 

    // if(document.getElementById('anthology').checked){
    //   console.log('anthology is checked');
    //   $("#end_month").removeClass('emptyfield'); 
    //   $("#end_year").removeClass('emptyfield'); 

    //   catagries_array.push('anthology');
    // } 

    if(catagries_array.length <  1)
    {
      // $("#signup_location").addClass('emptyfield2').focus();
      alert("we need to select at least one catagry");
      return false;
    }
      console.log('catagries_array: ');
      console.log(catagries_array);

      // return false;
      var user_id = Session.get("userId");

      Meteor.call('insert_catagries',catagries_array,user_id,function(error,result){
              if(error){
                alert("Some error occure.");
              
              }else{
              
                $('#step_5').addClass("hide_object");
                $('#step_6').addClass("hide_object");

                $('#step_7').addClass("hide_object");
                $('#step_8').removeClass("hide_object");

              }
          });
  },


  });


function upload_cover_pic(e,template){
// alert('ok');
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
     alert(profile_pic_session);
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