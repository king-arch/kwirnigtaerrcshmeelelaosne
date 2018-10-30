
import { Meteor } from 'meteor/meteor';
import { admin_details } from './../import/collections/insert.js';
import { book_details } from './../import/collections/insert.js';

import { user_details } from './../import/collections/insert.js';
import { categories_selection } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { interest_list } from './../import/collections/insert.js';
import { feed } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';

     Meteor.publish('fetch_admin_details', function() {
      return admin_details.find({});
    });

     Meteor.publish('fetch_book_listing', function() {
      return book_details.find({});
    });

     Meteor.publish('fetch_user_listing', function() {
      return user_details.find({});
    });

     Meteor.publish('fetch_user_details', function(user_id) {
      return user_details.find({user_id: user_id});
    });

     Meteor.publish('user_info_based_on_email', function(email) {
      return user_details.find({user_email: email});
    });

     Meteor.publish('user_info_based_on_id', function(user_id) {
      return  user_details.find({user_id: user_id});
    });

     Meteor.publish('user_info_all', function() {
      return  user_details.find({});
    });

     Meteor.publish('follow_list_all', function() {
      return  following_list.find({});
    });

     Meteor.publish('fetch_result_interest', function() {
      return  interest_list.find({});
    });

     Meteor.publish('fetch_feed_content', function() {
      return  feed.find({});
    });

Meteor.startup(() => {
  // code to run on server at startup
});

smtp = {
  username: 'writersmelonteam@gmail.com',
  password: 'Admin@123',
  server: 'smtp.gmail.com',
  port: 587
}
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;



Meteor.methods({

  Check_admin_login_auth(email,password){

    // console.log(email + ' & ' + password);

    var result = admin_details.find({
      admin_email: email,
      admin_password: password
    }).fetch();
    // console.log(result);

    // console.log('case 1');
    if (result[0]) {
      // console.log('case 1.1');
      var message = {
        "msg": 'Welcome back',
        "status": "1",
        "login_type": "admin",
        "active_user": result[0].user_id
      };
      // console.log(message);
      return message;
    } else {
          // console.log('case 4');
          var message = {
            "msg": 'Wrong email or password',
            "status": "0"
          };
          // console.log(message);
          return message;
        }
  },

  save_book_details(book_id, book_name, book_summary, book_catagries, author_name,
   author_description,amazon_link, book_cover, final_release_date,book_price){

   var result = book_details.insert({
      "book_id": book_id,
      "book_name": book_name,
      "book_summary": book_summary,
      "book_catagries": book_catagries,
      "author_name": author_name,
      "author_description": author_description,
      "amazon_link": amazon_link,
      "book_cover": book_cover,
      "book_price": book_price,
      "final_release_date": final_release_date,
      "created_at": Date.now(),
    });

      return result;
  },


  save_user_details(user_id, user_name, user_email,user_role, user_contact, interest, location, password,user_cover){
      var check_if_email_exist = user_details.find({user_email: user_email}).fetch();
if(check_if_email_exist[0]){
    var message = { "msg" : "email already exist" ,"response_status": 0 };
    return message;
}
else{

   var result = user_details.insert({
      "user_id": user_id,
      "user_name": user_name,
      "user_email": user_email,
      "user_role": user_role,
      "user_contact": user_contact,
      "user_interest": interest,
      "user_location": location,
      "user_password": password,
      "user_profile_pic": user_cover,
      "user_status": 1,
      "email_status": 0,
      "created_at": Date.now(),
    });

   var message = { "msg" : result ,"response_status": 1 };
    return message;

}

  },

    update_email_status:function(userId,email_status){
            var newUser = user_details.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {"email_status": 1}
            });
          }
          return result;
        },      


  create_user_signup(signup_name,signup_password,signup_email){

   var user_id = 'user_'+Math.floor((Math.random() * 2465789) + 1);

var check_if_email_exist = user_details.find({user_email: signup_email}).fetch();

      if(check_if_email_exist[0]){
          var message = { "msg" : "email already exist" , "response_status": 0 };
          return message;
      }
      else{
         var result = user_details.insert({
      "user_id": user_id,
      "user_name": signup_name,
      "user_email": signup_email,
      "user_password": signup_password,
      "user_status": 1,
      "email_status": 0,
            "created_at": Date.now(),
          });

         var message = { "msg" : result ,"response_status": 1 ,"user_id": user_id };
          return message;
      }
  },


  edit_save_book_details(book_id, book_name, book_summary, book_catagries, author_name,
   author_description,amazon_link, book_cover, final_release_date,book_price){
    var check_if_exist = book_details.find({ book_id: book_id }).fetch();
if(check_if_exist[0]){
   var result = book_details.update({
        _id: check_if_exist[0]._id
    },
    {
    $set: {
      "book_id": book_id,
      "book_name": book_name,
      "book_summary": book_summary,
      "book_catagries": book_catagries,
      "author_name": author_name,
      "author_description": author_description,
      "amazon_link": amazon_link,
      "book_cover": book_cover,
      "book_price": book_price,
      "final_release_date": final_release_date,
      "updated_at": Date.now(),
      }
      
    });
}
      return result;
  },

  edit_save_user_details(user_id, user_name, user_email,user_role, user_contact, interest, location, password,user_cover){
    var check_if_exist = user_details.find({ user_id: user_id }).fetch();
if(check_if_exist[0]){
   var result = user_details.update({
        _id: check_if_exist[0]._id
    },
    {
    $set: {
      "user_id": user_id,
      "user_name": user_name,
      "user_email": user_email,
      "user_role": user_role,
      "user_contact": user_contact,
      "user_interest": interest,
      "user_location": location,
      "user_password": password,
      "user_profile_pic": user_cover,
      "updated_at": Date.now(),
      }
    });
}
      return result;
  },

  fetch_book_details(book_id){

   var result = book_details.find({ "book_id": book_id }).fetch();
   return result;

  },

  fetch_interest_list(interest_id){

   var result = interest_list.find({ "interest_id": interest_id }).fetch();
   return result;

  },

  fetch_user_details(user_id){

   var result = user_details.find({ "user_id": user_id }).fetch();
   return result;

  },

    "change_user_details_status": function (user_id, status) {
    // console.log(user_id + ' & ' + status);
    var newUser = user_details.find({
      "user_id": user_id
    }).fetch();

    if (newUser[0]) {

      // console.log(newUser[0]);
      var result = user_details.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          user_status: status,
          updated_at: Date.now,
        }
      });
      return result;
    }
  },

    "change_interest_details_status": function (interest_id, status) {

    // console.log(interest_id + ' & ' + status);

    var newUser = interest_list.find({
      "interest_id": interest_id
    }).fetch();

    if (newUser[0]) {

      // console.log(newUser[0]);
      var result = interest_list.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          interest_status: status,
          updated_at: Date.now,
        }
      });
      return result;
    }
  },

    FetchUserData:function(userId){
      var newUser = user_details.find({ user_id :userId }).fetch();
      return newUser; 
    },

    send_email_for_confirmation:function(userId, userEmail){
      var result = send_email_for_varification(userId,userEmail);
      return result;
    },

    check_signup_status:function(user_id){

      var result = user_details.find({user_id: user_id}).fetch();
      // console.log(result);

      if(result[0].user_location){
        var user_location = result[0].user_location;
      }else{
        var user_location = "";
      }

      if(result[0].catagries_status){
        var catagries_status = result[0].catagries_status;
      }else{
        var catagries_status = "";
      }

      if(result[0].user_headline){
        var user_headline = result[0].user_headline;
      }else{
        var user_headline = "";
      }

      if(result[0].user_profile_pic){
        var user_profile_pic = result[0].user_profile_pic;
      }else{
        var user_profile_pic = "";
      }

      if(result[0].email_status){
        var email_status = result[0].email_status;
      }else{
        var email_status = "";
      } 

      if(result[0].first_follow){
        var first_follow = result[0].first_follow;
      }else{
        var first_follow = "";
      } 

      if(result[0].follow_people_status){
        var follow_people_status = result[0].follow_people_status;
      }else{
        var follow_people_status = "";
      } 

      var message = {
        "user_location": user_location,
        "catagries_status": catagries_status,
        "user_headline": user_headline,
        "first_follow": first_follow,
        "user_profile_pic": user_profile_pic,
        "email_status": email_status,
        "follow_people_status": follow_people_status,
      };

      // console.log('-------------------------------------------');
      // console.log(message);
      return message;
    },

    insert_headline_and_profile_pic:function(signup_headline,signup_profile_pic,user_id){
        var newUser = user_details.find({user_id: user_id}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      user_headline: signup_headline,
                      user_profile_pic: signup_profile_pic

                    }
            });
          }
          return result;
    },

    insert_location:function(signup_location,user_id){
        var newUser = user_details.find({user_id: user_id}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      user_location: signup_location
                    }
            });
          }
          return result;
    },

    insert_catagries:function(catagries_array,user_id){
        // console.log(catagries_array+' & '+user_id);
        for(var i=0; i<catagries_array.length;i++){

        var categorie_id = 'categorie_id_'+Math.floor((Math.random() * 2465789) + 1);

        // console.log(catagries_array[i]);
          var result =  categories_selection.insert({
                      categorie_id: categorie_id,
                      user_id: user_id,
                      catagrie_name: catagries_array[i],
                      created_at: Date.now(),
            });
        }

        var newUser = user_details.find({"user_id":user_id}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                catagries_status: 1
              }
            });
          }
          return result;
        },   

    follow_people:function(follow_user_id,logged_in_user){

    // console.log(follow_user_id+' & '+logged_in_user);
    var newUser = following_list.find({ $and: [{ "following": follow_user_id},{"follower": logged_in_user} ] }).fetch();
                  
          if(newUser[0]){
          var result =  following_list.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                following :follow_user_id,
                follower :logged_in_user,
                current_follow_status: 1,
                updated_at: Date.now()
              }
            });
          }else{

        var follow_id = 'follow_id_'+Math.floor((Math.random() * 2465789) + 1);
            
            following_list.insert({

                follow_id :follow_id,
                following :follow_user_id,
                follower :logged_in_user,
                current_follow_status: 1,
                created_at: Date.now()

              });

          }
      var user_id = logged_in_user;
      var newUser = user_details.find({"user_id":user_id}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                follow_people_status: 1
              }
            });
          }
          return result;
        }, 

    unfollow_people:function(follow_user_id,logged_in_user){

    // console.log(follow_user_id+' & '+logged_in_user);
    
    var newUser = following_list.find({ $and: [{ "following": follow_user_id},{"follower": logged_in_user} ] }).fetch();
                 // console.log('newUser'); 
                 // console.log(newUser); 
          if(newUser[0]){
          var result =  following_list.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                following :follow_user_id,
                follower :logged_in_user,
                current_follow_status: 0,
                updated_at: Date.now()
              }
            });
          }else{

        var follow_id = 'follow_id_'+Math.floor((Math.random() * 2465789) + 1);
            
            var result =  following_list.insert({

                follow_id :follow_id,
                following :follow_user_id,
                follower :logged_in_user,
                current_follow_status: 1,
                created_at: Date.now()

              });

          }

          return result;
        },    

      "user_login":function(user_email,user_password){  
      var result =  user_details.find({user_email: user_email, user_password: user_password}).fetch(); 
      // console.log("result: " + result);
      if(result[0]){
             return result;
      }else{ 
        return "No User";
      }
  },


    update_login_status:function(login_status,userId){
            var newUser = user_details.find({"user_id":userId}).fetch();
          if(newUser[0]){
          var result =  user_details.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                "login_status": login_status
              }
            });
          }
          return result;
        },

    "save_interest":function(interest_text){  
    // console.log(' interest_text : '+interest_text);
    var newUser = interest_list.find({interest_title: interest_text}).fetch(); 
                  
          if(newUser[0]){
          var message = {
                  "msg" : interest_text + " already exists in interest list!!!",
                  "status": 0, 
          }
          }else{
      var interest_id = 'interest_'+Math.floor((Math.random() * 2465789) + 1);     
     
            interest_list.insert({
                interest_id :interest_id,
                interest_title :interest_text,
                interest_status: 1,
                created_at: Date.now()
              });
                  var message = {
                  "msg" : interest_text+ " Sucessfully added in Interest List.",
                  "status": 0, 
                 }
          }
          return message;
  },

      "update_interest":function(interest_id,interest_text){  

    // console.log(' interest_text : '+interest_text);
    // console.log(' interest_id : '+interest_id);

    var newUser = interest_list.find({interest_id: interest_id}).fetch(); 
                  
          if(newUser[0]){
          var result =  interest_list.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                "interest_title": interest_text,
              }
            });
          }
                    var message = {
                  "msg" : " Intrest Updated",
                  "interest_text" : interest_text,
                  "status": 1, 
          }
          return message;

},

        upload_cover_image: function(user_id,imagePath)
      {

    var result = user_details.update({
        user_id: user_id,
      }, {
        $set: {
               "user_cover_pic": imagePath,
               "updated_at": Date.now()
        }
      });
    return result;
    },

    upload_profile_image: function(user_id,imagePath)
      {
    var result = user_details.update({
        user_id: user_id,
      }, {
        $set: {
               "user_profile_pic": imagePath,
               "updated_at": Date.now()
        }
      });
    return result;
    },

    save_feed_post: function(post_text,logged_in_user)
      {
    var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
    var result = feed.insert({

               "post_id": post_id,
               "post_type": 'post',
               "post_content_type": 'Text',
               "post_text": post_text,
               "post_by": logged_in_user,
               "post_status": 1,
               "created_at": Date.now()
      });
    return result;
    },

    save_updated_feed_post: function(post_id,post_text,logged_in_user)
      {
    var newUser = feed.find({post_id: post_id}).fetch();
          if(newUser[0]){
          var result =  feed.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                       post_text: post_text,
                       updated_at: Date.now()
                    }
            });
          }
          return result;
    },

    remove_post_from_feed:function(currentUserId,post_id){
        console.log(post_id);

        var result = feed.update({ 
            post_id: post_id,
          }, {  
            $set: {                
                     post_status: 0,
                }
          });
        return result;
      },  

  user_details_update: function(user_id,user_name,user_email,user_contact,user_location,user_headline)
      {   
      var result = user_details.update(
              {
                'user_id': user_id
              },{
                  $set: {
                          'user_name': user_name,
                          'user_email': user_email,
                          'user_contact': user_contact,
                          'user_location': user_location,
                          'user_headline': user_headline,
                          'updated_at': Date.now()
                        }
                      });
    return result;
    },

      update_hub_like: function(post_id,liked_by){

      var checkForAlreadyExists = feed.find({
                                              parent_id: post_id,
                                              parent_post_type: 'post',
                                              liked_by: liked_by,
                                              post_type: 'like',

                                  }).fetch();
          console.log('checkForAlreadyExists: ');
          console.log(checkForAlreadyExists);

          if(checkForAlreadyExists[0]){
          if(checkForAlreadyExists[0].like_status == 0){
                      var result = feed.update({
                      like_id: checkForAlreadyExists[0].like_id
                    },
                    {
                      $set:
                      {
                      like_status: 1,
                      updated_at: Date.now() 
                    
                    }
                  });
          }
          else{
          var result = feed.update({
                      like_id: checkForAlreadyExists[0].like_id
                    },
                    {
                      $set:
                      {
                      like_status: 0,
                      updated_at: Date.now() 
                    
                    }
                  });
        }
        }else{
          var like_id = 'like_id_'+Math.floor((Math.random() * 2465789) + 1);

                    var result = feed.insert({
                      like_id: like_id,
                      parent_id: post_id,
                      parent_post_type: 'post',
                      post_type: 'like',
                      like_status: 1,
                      liked_by: liked_by,
                      created_at: Date.now() 
                    });
        }
},

});



//******************** email functions Start ***********************
 function send_email_for_varification(user_id,userEmail){

  // console.log('entring send mail function');
  // console.log('user_id: '+user_id+' userEmail: '+userEmail);
  var result = user_details.find({ user_id: user_id }).fetch();
  // console.log('result: ');
  // console.log(result);
var name = result[0].user_name;
var userID = Base64.encode(user_id);;

var div_style= "width:600px;height:auto;margin:auto;font-family:sans-serif;font-weight:normal;font-size:12px; border:10px solid red";
var div_style2= "width:600px;height:auto;float:left;background-color:#efefef;border:10px solid red !important";
var div_style3= "background-color:#fff;border-spacing:0px;width:100%";
var div_style4= "width:100%;height:50px;float:left;background-color:#fff";
var div_style5= "background-color:#fff;width:100%";
var div_style6= "background-color:#fff;width:100%";
var div_style7= "width:150px;height:auto;float:left;vertical-align: middle;";
var div_style8= "height: 50px";
var div_style9= "height: 50px";
var div_style10= "float: right; margin-right: 15px; color: #666";
var div_style11= "width:96%;height:auto;float:left;padding:10px";
var div_style12= "width:100%; border:0";
var div_style13= "color:#414850;line-height:30px";
var div_style14= "color:#414850;line-height:30px";
var div_style15= "width:100%;float:left;background-color:#fff;;margin-top:6px";
var image_url="http://writersmelon.com/wm/wp-content/uploads/2017/05/cropped-Writersmelon-Logo.png";
var style="width:150px; height:150px";
var spacing="2";
var email = "writersmelonteam@gmail.com";
var htmlCode="<html><head><title>Email</title></head><body><div style="+div_style+"><div style="+div_style2 +"><table style="+div_style3+"><tbody><tr><td><div style="+div_style4+"><table style="+div_style6+"><tbody><tr><td><div style="+div_style7+"><a> <img src="+image_url+" style="+style+"/></a></div></td><td><p style="+div_style10+"><p></td>"+
"</tr></tbody></table></div><div style="+div_style11+"><table style ="+div_style12 +" cellspacing="+spacing+" cellpadding="+spacing+"><tbody><tr><td "+
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Welcome to the Writersmelon"+
" Family!</td></tr><tr><td colspan="+spacing+">Your account is almost ready, but before you can login you need to complete a brief account verification process.</td></tr><tr><td colspan="+div_style11
+"><br/><a href=http://localhost:3000/activate_email/"+userID + ">Click here</a> to verify your email ID.  (if you are using the mobile application, after you press on the previous link close the mobile browser and continue from the application).<br/></td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for writersmelon, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: userEmail,
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Email Verification",
            html: htmlCode,
        };

  Email.send(email);

  }

//******************** email functions End *************************