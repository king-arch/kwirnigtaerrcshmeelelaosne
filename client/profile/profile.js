
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

Template.profile_content.onRendered(function(){
  // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.4.3/cropper.min.js",function(){
  // alert('loaded');
  // });

  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){
       // alert('call sending mail function');
       // $("#send_mail").click();
    },3000);

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);

      // alert('here: ');
      // alert('user_id: '+user_id );
       Meteor.call('check_signup_statusss',user_id,function(error,result){
              if(error){
                console.log("Some error occure.");
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

Template.profile_content.helpers({

    'logged_in_user_email' : function(){
      var email = Session.get("userEmail");
      return email;
    },

    'show_logged_in_user_info' : function(){
      var user_id = Session.get("userId");
      
      Meteor.subscribe("fetch_user_details",user_id);
      var result = user_details.find({user_id: user_id}).fetch();

      return result;
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

    user_contact_with_check(){
      if(this.user_contact){
        return this.user_contact
      }
      else{
        return 'No contact info shared.';
      }
    },


        show_interest_list(){
            Meteor.subscribe("fetch_result_interest");
              var result = interest_list.find({interest_status: 1}).fetch();
            console.log('show result interest: ');
            console.log(result);
            return result;
},

    show_user_info(){

      var user_id = Session.get("userId");

      user_info_list_all = Meteor.subscribe("user_info_all");
      var result = user_details.find({},{limit: 5}).fetch();

      console.log('showing user list all');
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

    check_if_already_following(){
      var follow_user_id = this.user_id;
      var logged_in_user = Session.get("userId");

      follow_list_all = Meteor.subscribe("follow_list_all");
      var result = following_list.find({ $and: [{ "following": follow_user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();    

      console.log('showing user list all with check');
      console.log(result);

      if(result[0]){
        console.log('case 1');
        return false;
      }else{
        console.log('case 2');
        return true;
      }

    },

    user_profile_pic(){
      if(this.user_profile_pic){
        return this.user_profile_pic;
      }
      else{
        return '/img/avatar1.jpg';
      }
    },

});

Template.profile_content.events({

  'click .click_on_follow':function(){
    // alert('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // alert('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                alert("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },

  'click .click_on_unfollow':function(){
    // alert('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // alert('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

          Meteor.call('unfollow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                alert("Some error occure.");
              }else{
                console.log('successfully following ');
              }
          });
  },


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

  'click #upload_cover_trigger':function(){
    $('#upload_cover').click();
},

 'change #upload_cover': function(e, template) {

    upload_cover_pic(e, template);
    $('#cover_pic_modal').click();
},

'change #cover_pic_modal': function() {
            $('#divcrop_cover').addClass('cropper-example-lena');
             $('.cropper-example-lena > img').cropper({
             aspectRatio: 8 / 8,
viewMode: 1,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  autoCropArea: 1
            });
},   

'click #crop_cover_image_selection':function(){
  // alert('1');
  crop_image_cover();
  $('#update_cover_pic_modal').modal('toggle');
},

////////////////////////////////////////////

'click #upload_profile_pic_trigger':function(){
  $('#upload_profile').click();
},

'click #crop_profile_image_selection':function(){
  crop_image();
  $('#update_profile_pic_modal').modal('toggle');
},

 'change #upload_profile': function(e, template) {
    upload_profile_pic(e, template);
    $('#profile_pic_modal').click();
},


'change #profile_pic_modal': function() {
            $('#divcrop_profile').addClass('cropper-example-lena');
             $('.cropper-example-lena > img').cropper({
             aspectRatio: 8 / 8,
viewMode: 1,
  dragMode: 'move',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  autoCropArea: 1
            });
}, 

'click #save_user_info': function(event){

        event.preventDefault();

        var user_name = $('#user_name').val().trim();
        var user_email = $('#user_email').val().trim();
        var user_contact = $('#user_contact').val().trim();

        var user_location = $('#user_location').val().trim();
        var user_headline = $('#user_headline').val().trim(); 

        if(user_name == null || user_name == "")
        {
          $('#user_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_name').removeClass('emptyfield');
        }
        
        if(user_email == null || user_email == "")
        {
          $('#user_email').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_email').removeClass('emptyfield');
        }
        
        if(user_contact == null || user_contact == "")
        {
          $('#user_contact').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_contact').removeClass('emptyfield');
        }
        
        if(user_location == null || user_location == "")
        {
          $('#user_location').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_location').removeClass('emptyfield');
        }

        if(user_headline == null || user_headline == "")
        {
          $('#user_headline').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_headline').removeClass('emptyfield');
        }

        if ( !(user_contact+"").match(/^\d+$/) ) {
           alert('phone number can only have digits');
           return false;
        }
        // alert('above update');

        var check_len = user_contact.length;
        var user_contact = parseFloat(user_contact);
        // alert(check_len);  
        if(check_len != 16 )
        {
          alert('Phone number should be of 10 degits only');
          return false;   
        }
        var user_id = Session.get("userId");

        user_name = user_name.charAt(0).toUpperCase()+ user_name.slice(1);
        // alert(name+gender+marital_status+phone+datepicker+autocomplete+user_id);
        // user_contact_with_check
        Meteor.call('user_details_update',user_id,user_name,user_email,user_contact,user_location,user_headline,function(){
          if(result){
             console.log('error');
          }else{
             console.log('User details successfully updated');
          }
        });

        $('#edit_user_details').modal('toggle');
    },


  });




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



// **********************upload function cover pic START*************************************************


function upload_cover_pic(e,template){
  $('#my_image_cover').cropper('destroy');
    // e.preventDefault();
    // var files = e.currentTarget.files;
    if (e.currentTarget.files && e.currentTarget.files[0]) {
     var file = e.currentTarget.files[0];
      if (file) {
   
        var reader = new FileReader();
   var base64data="";
   reader.readAsDataURL(file);
   reader.onload = function () {
   console.log(reader.result);
   base64data = reader.result;

    var imagePath = base64data;
    $("#my_image_cover").attr("src",imagePath);             
            $("#my_image_cover").attr("srcset",imagePath);             
            
            $("#crop_cover_modal").attr("src",imagePath);
            $('#divcrop_cover').addClass('cropper-example-lena');

             $('.cropper-example-lena > img').cropper({
                               aspectRatio: 4 / 1,
                    autoCropArea: 0,
                      viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: true,
                modal: true,
                guides: false,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                zoomable:false
            });
}; 
     }  }} 



function crop_image_cover(){
  var croppedPhoto = $('#my_image_cover').cropper('getCroppedCanvas');
    console.log(croppedPhoto);
    // croppedPhoto.toBlob(function (blob) {
var dataURL = croppedPhoto.toDataURL('image/jpeg', 0.5);
var blob = dataURItoBlob(dataURL);
// console.log(blob);
var file = new FormData(document.forms[0]);
file.append("canvasImage", blob);
// alert(dataURL);
base64data = dataURL;
console.log(base64data);

  Session.setPersistent("new_cover_image_url",base64data);

  var user_id = Session.get("userId");
   Meteor.call("upload_cover_image",user_id,base64data,function(error,result){
        if(error){
          console.log("Error");
        }else{
            console.log("cover Pic Changed");
           $('#divcrop_cover').removeClass('cropper-example-lena');
        }
        
    });
 }
// **********************upload function cover pic END*************************************************

// **********************upload function profile pic START*************************************************

function upload_profile_pic(e,template){
  $('#my_image_profile').cropper('destroy');
    // e.preventDefault();
    // var files = e.currentTarget.files;
    if (e.currentTarget.files && e.currentTarget.files[0]) {
     var file = e.currentTarget.files[0];ValValidateEmailidateEmail
      if (file) {
   
        var reader = new FileReader();
   var base64data="";
   reader.readAsDataURL(file);
   reader.onload = function () {
   console.log(reader.result);
   base64data = reader.result;

    var imagePath = base64data;
    $("#my_image_profile").attr("src",imagePath);             
            $("#my_image_profile").attr("srcset",imagePath);             
            
            $("#crop_profile_modal").attr("src",imagePath);
            $('#divcrop_profile').addClass('cropper-example-lena');

            var height = 400;
            var width = 400;

             $('.cropper-example-lena > img').cropper({
                               aspectRatio: 1 / 1,
                    autoCropArea: 0,
                      viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: true,
                modal: true,
                guides: false,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                zoomable: true,
            });

};
    
     }  }} 

function crop_image(){
  var croppedPhoto = $('#my_image_profile').cropper('getCroppedCanvas');
    console.log(croppedPhoto);
var dataURL = croppedPhoto.toDataURL('image/jpeg', 0.5);
var blob = dataURItoBlob(dataURL);
console.log(blob);
var file = new FormData(document.forms[0]);
file.append("canvasImage", blob);
// alert(dataURL);
base64data = dataURL;
console.log(base64data);
Session.setPersistent("new_profile_image_url",base64data);
var user_id = Session.get("userId");
   Meteor.call("upload_profile_image",user_id,base64data,function(error,result){
        if(error){
          console.log("Error");
        }else{
            console.log("Profile Pic Changed")
           $('#divcrop_profile').removeClass('cropper-example-lena');
        }
    });
}


 // **********************upload function profile pic END*************************************************
