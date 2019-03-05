
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { book_details }  from './../../import/collections/insert.js';
import { blog }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

// import { ServiceConfiguration } from 'meteor/service-configuration';

var user_info_based_on_email;

Template.index_content.onDestroyed(function(){
  user_info_based_on_email.stop();
});


Template.index_content.onDestroyed(function () {
  Session.set("makeUserActive","");
  tracker.stop();

});

var tracker;

Template.index_content.onRendered(function () {

      setTimeout(function(){
          $(".feed_loader").addClass("loader_visiblity_block");
          $(".myCarousel_display").removeClass("loader_visiblity_block");
      },3000);

      // Meteor.call('check_book_count',function(error,result){
      //         if(error){
      //           swal("Some error occure.");
      //         }else{
      //           swal("Some error occure.");
      //              }
      //       });                       
});

Template.index_content.helpers({

    show_book_details(){

      Meteor.subscribe("fetch_book_for_slider");
      var result = book_details.find({},{limit: 10,sort: {created_at: -1 } }).fetch();
      var new_array = new Array();
          for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({"index": i ,"book_cover": result[i].book_cover,"book_name": result[i].book_name});
            }
          }

          for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({"index": i ,"book_cover": result[i].book_cover,"book_name": result[i].book_name});
            }
          }

           for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({"index": i ,"book_cover": result[i].book_cover,"book_name": result[i].book_name});
            }
          }
    // console.log('show result book: ');
    // console.log(new_array);
    return new_array;

    },

    show_book_details_deafult_slider(){

      var result = book_details.find({},{limit: 1,sort: {created_at: -1 } }).fetch();
      var new_array = new Array();
      new_array.push({"index": 0 ,"book_cover": result[0].book_cover,"book_name": result[0].book_name});
      return new_array;

    },

    show_blog_details(){

          Meteor.subscribe("fetch_blog_content_for_slider");
          var result = blog.find({},{ limit: 10 ,sort: { created_at: -1 } }).fetch();

          console.log("blog general listing");
          console.log(result);

          var new_array = new Array();
          for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({
                              "index": i ,
                              "blog_cover": result[i].blog_cover,
                              "blog_title": result[i].blog_title,
                              "blog_id": result[i].blog_id
                            });
            }
          }

          for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({
                              "index": i ,
                              "blog_cover": result[i].blog_cover,
                              "blog_title": result[i].blog_title,
                              "blog_id": result[i].blog_id
                            });
            }
          }

          for( var i=0; i<result.length;i++){
            if(i != 0){
              new_array.push({
                              "index": i ,
                              "blog_cover": result[i].blog_cover,
                              "blog_title": result[i].blog_title,
                              "blog_id": result[i].blog_id
                            });
            }
          }
console.log(new_array.length);
console.log(new_array);
          return new_array;

    },


    show_blog_details_deafult_slider(){

          var result = blog.find({},{limit: 1,sort: { created_at: -1 } }).fetch();
          return result;

  },

    fetch_user_info(){

         var user_id = this.blog_author;  
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id}).fetch();
         return result;

    },

    book_name_with_trim(){
      var book_name = this.book_name;
      if(book_name.length > 40){ 
        return book_name.slice(0, 40)+'...';
      }
      else{
        return book_name;
      }
    },

});

Template.index_content.events({

'click #clicked_on_gmail': function(){
  swal("lets click 1");
    $("#google_login").click();
},

'click #google_login': function(){
  swal("lets click 2");
   
},

'click #forgot_password': function(){
    window.location.href = "/forgot_password";
},

'click .show_signup_password': function(){
  
  var input = $('#signup_password').attr("type");

  if (input == "password") {
    $('#signup_password').attr("type", "text");

    $('#sign_in_eye_open').addClass("loader_visiblity_block");
    $('#sign_in_eye_close').removeClass("loader_visiblity_block");

  } else {
    $('#signup_password').attr("type", "password");

    $('#sign_in_eye_close').addClass("loader_visiblity_block");
    $('#sign_in_eye_open').removeClass("loader_visiblity_block");
  }

},


'click .show_signup_password_2': function(){
  
  var input = $('#login_password').attr("type");

  if (input == "password") {
    $('#login_password').attr("type", "text");

    $('#sign_in_eye_open').addClass("loader_visiblity_block");
    $('#sign_in_eye_close').removeClass("loader_visiblity_block");

  } else { 
    $('#login_password').attr("type", "password");

    $('#sign_in_eye_close').addClass("loader_visiblity_block");
    $('#sign_in_eye_open').removeClass("loader_visiblity_block");
  } 

},

  'click #submit_signup': function(event){
    // swal('inside submit');
  event.preventDefault();

  var signup_name = $('#signup_name').val().trim(); 
  var signup_email = $('#signup_email').val().trim(); 
  var signup_password = $('#signup_password').val().trim();   
    

    if(signup_name == null || signup_name == '')
    {
      $("#signup_name").addClass('emptyfield2').focus();
      return false;
    }else
    {
      $("#signup_name").removeClass('emptyfield2');
    }

    if(signup_email == null || signup_email == '')
    {
      $("#signup_email").addClass('emptyfield2').focus();
      return false;
    }else
    {
      $("#signup_email").removeClass('emptyfield2');
    }

    var check_validity = ValidateEmail(signup_email);

    if(check_validity == null || check_validity == '' || check_validity == undefined)
    {
      $("#signup_email").addClass('emptyfield2').focus();
      return false;
    }else
    {
      $("#signup_email").removeClass('emptyfield2');
    }


    if(signup_password == null || signup_password == '')
    {
      $("#signup_password").addClass('emptyfield2').focus();
      return false;
    }else
    {
      $("#signup_password").removeClass('emptyfield2');
    }

    if(signup_password.length <= 7)
    {
      //swal("Password should be of 6 digits at least");
      swal("Password should be of 8 digits at least");
      return false;
    }

    user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",signup_email);
    
    // var check_if_mail_exist = user_details.find({user_email: email}).count();

    // if(check_if_mail_exist > 0){
    //   swal("email already exist!");
    //   return false; 
    // } 

    // swal(" signup_name: "+signup_name + ' signup_email: '+signup_email+
    //   ' signup_password: '+ signup_password);

      signup_name =  signup_name.charAt(0).toUpperCase()+ signup_name.slice(1);
      Meteor.call('create_user_signup',signup_name,signup_password,signup_email,function(error,result){
              if(error){
                swal("Some error occure.");
              
              }else{
                // swal('result.response_status '+result.response_status);
                if(result.response_status == 0){
                   swal("email already exist!");
                   return false;
                }else{
                Session.setPersistent("userId",result.user_id);
                Session.setPersistent("userEmail",signup_email);
                Session.setPersistent("email_status",result.email_status);
                Router.go('/email');

                }
              }
          });
      },

  'click .redirect_to_login':function(event){
      var blog_id = Base64.encode(this.blog_id);
      alert(this.blog_id);  
      var url = '/blog_detail_not_logged_in/'+blog_id;
      window.location.href = url;
  },

  'click #login_submit':function(event){
// swal('inside: ');
      event.preventDefault();
      var login_email = $('#login_email').val();         
      var login_password = $('#login_password').val();         

       if(login_email == null || login_email == "")
        {
          $('#email_validation').addClass('label-floating is-empty has-error');
          $('#login_email').focus();
          return false; 
        } 
        else{
          $('#email_validation').removeClass('label-floating is-empty has-error');
          $('#email_validation').addClass('label-floating has-success');
        }

        var check_validity = ValidateEmail(login_email);

         if(login_password == null || login_password == "")
        {
          $('#login_password').addClass('emptyfield').focus();
          return false; 
        }
        else{
          $('#login_password').removeClass('emptyfield');
        }

     // swal('login_email'+login_email+' & login_password '+login_password);
        // return false;

          Meteor.call("user_login",login_email,login_password, function(error,result){
      
        if(error){
          swal("Something went wrong, Please try again");          
        }else{

          // swal(JSON.stringify(result));

          if(result == "No User"){
             var msg='Wrong email or Password';
            swal(msg+""); 
          }
          else if(result.length == 1){

            if(result[0].user_status == 0){

          var name = result[0].user_name;
            swal(' Your account has been Blocked by Admin');
            return false;
        }
            // swal("Logged in Successfully");
            var userId = result[0].user_id;
            var user_email = result[0].user_email;
            var user_status = result[0].user_status;
            var email_status = result[0].email_status;

          Session.setPersistent("userId",userId);
          Session.setPersistent("userEmail",user_email);
          Session.setPersistent("email_status",email_status);

          Session.set("coming_from_login","true");

          // $('.form_reset').trigger('reset');
         var login_status = 1;
         var userId = Session.get("userId");
         storeToken();

         Meteor.call("update_login_status",login_status,userId,function(error,result){
              if(error){
                //swal('user login status updation error');
                console.log('error');
              }
              else{
                 console.log('result');
              }

            });

            if(result[0]){
              if(result[0].email_status==0){
                Router.go('/email');
              }
              else if(result[0].user_location == undefined){
                  Router.go("/signup");
              }
              else if(result[0].user_profile_pic == undefined){
                   Router.go("/signup");
              }
              else if(result[0].catagries_status == undefined){
                      Router.go("/signup")
              }
              else if(result[0].follow_people_status == undefined){
                       Router.go("/signup");                       
              }
              else if(result[0].user_headline == undefined){
                       Router.go("/signup");                       
              }
              else if(result[0].user_headline){
                Router.go("/profile");
              }
              
            return false;
          }


          }else{
            toastr.warning("Wrong Email or Password");
          }
        }
      });
},

});

function storeToken(){
        if(Meteor.isCordova){
            Meteor.call("update_user_token",Session.get("userToken"),Session.get("userId"),function(error,result){
              if(error){
                swal("Token not updated");
              }else{
                swal("Token updated");
              }
            });
          }
}

function check_login(source){

        var source = source;
        var show12 = Meteor.user();
       
        if(show12){  
        if(source=="Google"){

      var name  = show12.services.google.name;
      var email = show12.services.google.email;
      var picture = show12.services.google.picture; 
             user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);     
      var check_existance = UserInfo.find({email: email}).count();

        }else if(source == "Facebook"){
  
       var name  = show12.services.facebook.name;
       var email = show12.services.facebook.email;       

       user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);
       var check_existance = UserInfo.find({email: email}).count();
       var picture = "http://graph.facebook.com/" + show12.services.facebook.id + "/picture/?type=large";

        }else{
      var name  = show12.services.linkedin.firstName+' '+show12.services.linkedin.lastName;
      var email = show12.services.linkedin.emailAddress; 

      user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);     
      var check_existance = UserInfo.find({email: email}).count();  
      if(check_existance>0)
      {
        Session.setPersistent("nammaval",1);
      }
      var picture = show12.services.linkedin.pictureUrl; 
           //swal(email);
        }
           }
     // console.log(show12);return false;
       // swal(show12);      
      if(check_existance == 0){
         var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);  
         Session.setPersistent("userId",userID);
 
 var ab = Meteor.call("create_user",userID,source,name,email,picture);  
       
         Session.setPersistent("userEmail",email);       
        storeToken();
         window.location.replace("/signup");
      }
      else{
        // return false;
        user_info_based_on_email = Meteor.subscribe("user_info_based_on_email",email);
        var users = UserInfo.find({email: email}).fetch();
        var userID = users[0].user_id;
        console.log(users);
        //swal(userID);

        if(userID){
        Session.setPersistent("userId",userID);
          storeToken();


                  // var users =UserInfo.find({"user_id":userID}).fetch();
        storeToken();
          console.log(users);

           if(users[0]){
            console.log("inside  login"  );
              if(users[0].email_status==0){
                Router.go('/email');
                 // Router.go('/signup');
                 console.log("case 1");
              }else if(!users[0].location){
                // swal("location empty");
                console.log("case 2");
                   Session.set("emptyField","location");

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else if(!users[0].phone){
                console.log("case 3");
                // swal("phone empty");
                   Session.set("emptyField","phone"); 

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else if(!users[0].disablities){
                console.log("case 4");
                // swal("speech empty");
                      Session.set("emptyField","speech");

                      window.location.replace("/signup");
                      // Router.go('/signup');
              }else if(!users[0].profile_pic){
                console.log("case 5");
                    // swal("profile pic empty");
                       Session.set("emptyField","profile_pic");                       
              }else if(!users[0].headline){
                   Session.set("emptyField","headline");

                   window.location.replace("/signup");
                   // Router.go('/signup');
              }else{
                
            Router.go('/feed');
              }
          }

        window.location.replace("/signup");
        }
        else{
          return false;
        }
      }
}

  function ValidateEmail(mail) {

    // var email = $('#signup_email').val();

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      $('#email_validation').addClass('label-floating has-success');
      $('#email_validation').removeClass('label-floating is-empty has-error');
      return (true)

    }

    swal({
      text: 'Please enter a valid email ID',
      button: "ok",
      icon: "warning",
      dangerMode: true,
    });
    $('#email_validation').removeClass('label-floating has-success');
    $('#email_validation').addClass('label-floating is-empty has-error');
    return (false)
  }
