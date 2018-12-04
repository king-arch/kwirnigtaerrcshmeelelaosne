
import { Meteor } from 'meteor/meteor';
import { admin_details } from './../import/collections/insert.js';
import { book_details } from './../import/collections/insert.js';

import { user_details } from './../import/collections/insert.js';
import { categories_selection } from './../import/collections/insert.js';
import { promotion } from './../import/collections/insert.js';

import { following_list } from './../import/collections/insert.js';
import { interest_list } from './../import/collections/insert.js';
import { feed } from './../import/collections/insert.js';
import { blog } from './../import/collections/insert.js';
import { content } from './../import/collections/insert.js';
import { campaign_details } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';

     Meteor.publish('fetch_admin_details', function() {
      return user_details.find({user_id: "user_admin"});
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

     Meteor.publish('fetch_book_listing', function() {
      return book_details.find({});
    });

     Meteor.publish('fetch_promotion_listing', function() {
      return promotion.find({});
    });

     Meteor.publish('fetch_text_promotion_listing', function() {
      return promotion.find({"promotion_type": "Textual",});
    });

     Meteor.publish('fetch_promotion_listing_with_id', function(promotion_id) {
      return promotion.find({promotion_id: promotion_id});
    });

     Meteor.publish('follow_list_all', function() {
      return  following_list.find({});
    });

     Meteor.publish('fetch_result_interest', function() {
      return  interest_list.find({});
    });

     Meteor.publish('fetch_result_interest_listing', function() {
      return  interest_list.find({});
    });

     Meteor.publish('fetch_feed_content', function() {
      return  feed.find({});
    });


     Meteor.publish('fetch_feed_content_details', function(post_id) {
      return  feed.find({post_id: post_id});
    });

     Meteor.publish('fetch_blog_content', function() {
      return  blog.find({});
    });

     Meteor.publish('show_content_data', function() {
      return  content.find({content_type: "reward_points"});
    });

     Meteor.publish('show_terms_and_condition', function() {
      return  content.find({content_type: "terms_and_condition"});
    });

     Meteor.publish('show_privacy_policy', function() {
      return  content.find({content_type: "privacy_policy"});
    });

     Meteor.publish('show_cancellation_policy', function() {
      return  content.find({content_type: "cancellation_policy"});
    });

     Meteor.publish('show_copyright_policy', function() {
      return  content.find({content_type: "copyright_policy"});
    });

     Meteor.publish('show_review_policy', function() {
      return  content.find({content_type: "review_policy"});
    });

     Meteor.publish('show_reward_policy', function() {
      return  content.find({content_type: "reward_policy"});
    });

     Meteor.publish('show_work_with_us', function() {
      return  content.find({content_type: "work_with_us"});
    });

     Meteor.publish('categories_selection_for_user', function(user_id) {
      return  categories_selection.find({user_id: user_id});
    });

     Meteor.publish('campaign_details_all_list', function() {
      return  campaign_details.find({});
    });

     Meteor.publish('campaign_details_with_id', function(campaign_id) {
      return  campaign_details.find({campaign_id: campaign_id});
    });

     Meteor.publish('notification_details', function(campaign_id) {
      return  notification_details.find({campaign_id: campaign_id});
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

    console.log(email + ' & ' + password);

    var result = user_details.find({
      user_id: "user_admin",
      user_email: email,
      user_password: password
    }).fetch();

    console.log(result);
    // console.log('case 1');

    if(result[0]){

      console.log('case 1.1');
      var message = {
        "msg": 'Welcome back',
        "status": 1,
        "login_type": "Admin",
        "active_user": result[0].user_id
      };
      // console.log(message);
      return message;
    } else {

      console.log('case 2.1');
    var result2 = user_details.find({
      user_email: email,
      user_password: password,
      user_role: 'Editor',
    }).fetch();

        if(result2[0]) {
      console.log('case 3.1');
      var message = {
        "msg": 'Editor Login',
        "status": 1,
        "login_type": "Editor",
        "active_user": result2[0].user_id
      };
      // console.log(message);
      return message;
    } 
      console.log('case 1.2');
        var message = {
            "msg": 'Wrong email or password',
            "status": 0
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


  save_user_details( user_id, user_name, user_email,user_role, password, user_cover){
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
      "user_password": password,
      "user_profile_pic": user_cover,
      "user_status": 1,
      "email_status": 0,
      "created_at": Date.now(),
    });


var result = send_email_user_created_by_admin(user_id,user_name,user_email,password);
   var message = { "msg" : result.msg ,"response_status": 1 };
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
          var message = { 
                      "msg" : "email already exist" ,
                       "response_status": 0,
                       "email_status": 1,
                        };
          return message;
      }
      else{
         var result = user_details.insert({
      "user_id": user_id,
      "user_name": signup_name,
      "user_email": signup_email,
      "user_password": signup_password,
      "user_role": "User",
      "user_status": 1,
      "email_status": 0,
            "created_at": Date.now(),
          });

         var message = { 
                      "msg" : result ,
                      "response_status": 1 ,
                      "user_id": user_id,
                      "email_status": 0,
                    };
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

  edit_save_user_details(user_id, user_name, user_email,user_role, password, user_cover){
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

  fetch_blog_details(blog_id){

   var result = blog.find({ "blog_id": blog_id }).fetch();
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
    console.log(user_id + ' & ' + status);
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

    "change_blog_details_status": function (blog_id, status) {

    // console.log(interest_id + ' & ' + status);
    var newUser = blog.find({
      "blog_id": blog_id
    }).fetch();

    if (newUser[0]) {
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_status: status,
          updated_at: Date.now,
        }
      });
      return result;
    }
  },

    "change_blog_approval_status": function (blog_id, status) {

    // console.log(interest_id + ' & ' + status);
    var newUser = blog.find({
      "blog_id": blog_id
    }).fetch();

    if (newUser[0]) {
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_approval_status: status,
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
      console.log(userId+' & '+userEmail);
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
        console.log(catagries_array+' & '+user_id);

        for(var i=0; i<catagries_array.length;i++){

        var category_selection_id = 'category_selection_id_'+Math.floor((Math.random() * 2465789) + 1);

        // console.log(catagries_array[i]);
          var result =  categories_selection.insert({
                      categorie_id: category_selection_id,
                      user_id: user_id,
                      selected_category_id: catagries_array[i],
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

    update_catagries:function(catagries_array,user_id){
        console.log(catagries_array+' & '+user_id);

        var array1 = catagries_array;
        categories_selection.remove({user_id: user_id});

        var array2 = categories_selection.find({user_id: user_id}).fetch();

        console.log('array2');
        console.log(array2);

        var array_update_1 = new Array();
        var array_insert_1 = new Array();

        for(var i=0; i < array1.length; i++){

        var category_selection_id = 'category_selection_id_'+Math.floor((Math.random() * 2465789) + 1);
        var result =  categories_selection.insert({

                      categorie_id: category_selection_id,
                      user_id: user_id,
                      selection_status: 1,
                      selected_category_id: catagries_array[i],
                      created_at: Date.now(),

            });
        }


        // for(var i = 0; i < array_update_1.length; i++){

        //   var result =  categories_selection.update({
        //       selected_category_id: array_update_1[i],
        //       user_id: user_id,
        //     }, {
        //       $set: {
        //         selection_status: 1,
        //         updated_at: Date.now(),
        //       }
        //     });
        
        // }

        // for(var i = 0; i < array_update_0.length; i++){

        //   var result =  categories_selection.update({
        //       selected_category_id: array_update_0[i],
        //       user_id: user_id,
        //     }, {
        //       $set: {
        //         selection_status: 0,
        //         updated_at: Date.now(),
        //       }
        //     });
        
        // }

        // for(var i = 0; i < array_update_0.length; i++){

        // var category_selection_id = 'category_selection_id_'+Math.floor((Math.random() * 2465789) + 1);
        // var result =  categories_selection.insert({

        //               categorie_id: category_selection_id,
        //               user_id: user_id,
        //               selection_status: 1,
        //               selected_category_id: catagries_array[i],
        //               created_at: Date.now(),

        //     });
        
        // }

        console.log('array_update_1');
        console.log(array_update_1);

        console.log('array_insert_1');
        console.log(array_insert_1);

        var message = { msg: 'success' };
        return message;

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

        }, 

    change_follow_status:function(logged_in_user){

    // console.log(follow_user_id+' & '+logged_in_user);
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

    save_feed_post_with_image: function(post_text,logged_in_user,post_image)
      {
    var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
    var result = feed.insert({

               "post_id": post_id,
               "post_type": 'post',
               "post_content_type": 'Image',
               "post_text": post_text,
               "post_image": post_image,
               "post_by": logged_in_user,
               "post_status": 1,
               "created_at": Date.now()
      });
    return result;
    },

    'save_metadata_post':function(post_text,featured_image,featured_title,source,posted_url,logged_in_user)
      {

          var post_type;
        var is_youtube_video = youtube_parser(posted_url);
            // console.log("posted_url");
            // console.log(posted_url);
          
        if(is_youtube_video !=false){
          post_type = "youtube_post";
          posted_url = is_youtube_video;
        }else{
          post_type = "url_metadata";
        }

    var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
    var result = feed.insert({

               "post_id": post_id,
               "post_text": post_text,
               "post_type": 'post',
               "post_content_type": post_type,
               "post_by": logged_in_user,

               "featured_image":featured_image,
               "featured_title":featured_title,
               "source":source,
               "posted_url":posted_url,

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

    save_updated_comment_lvl0: function(comment_id,comment_text)
      {
    var newUser = feed.find({comment_id: comment_id}).fetch();
          if(newUser[0]){
          var result =  feed.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                       comment_text: comment_text,
                       updated_at: Date.now()
                    }
            });
          }
          return result;
    },

    save_updated_comment_lvl1: function(comment_id,comment_text)
      {
    var newUser = feed.find({comment_id: comment_id}).fetch();
          if(newUser[0]){
          var result =  feed.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                       comment_text: comment_text,
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

    remove_comment_from_lvl0:function(currentUserId,comment_id){
        console.log(comment_id);

        var result = feed.update({ 
            comment_id: comment_id,
          }, {  
            $set: {                
                     comment_status: 0,
                }
          });
        return result;
      },  

  remove_comment_from_lvl1:function(currentUserId,comment_id){
        console.log(comment_id);

        var result = feed.update({ 
            comment_id: comment_id,
          }, {  
            $set: {                
                     comment_status: 0,
                }
          });
        return result;
      },  


  user_details_update: function(user_id,user_name,fb_handler,twitter_handler,goodreads_handler,user_contact,user_location,user_headline)
      {   

      var result = user_details.update(
              {
                'user_id': user_id
              },{
                  $set: {
                          'user_name': user_name,
                          'user_contact': user_contact,
                          'user_location': user_location,

                          'fb_handler': fb_handler,
                          'twitter_handler': twitter_handler,
                          'goodreads_handler': goodreads_handler,

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

      update_hub_like_comment_lvl_0: function(comment_id,liked_by){
      var checkForAlreadyExists = feed.find({
                                              parent_id: comment_id,
                                              parent_post_type: 'comment_lvl_0',
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
                      parent_id: comment_id,
                      parent_post_type: 'comment_lvl_0',
                      post_type: 'like',
                      like_status: 1,
                      liked_by: liked_by,
                      created_at: Date.now() 
                    });
        }
},


      async fetch_url_information(url){
       const data = await urlMetadata(url).then(
          function (metadata) { // success handler
       console.log(metadata);
       return metadata;
        },
        function (error) { // failure handler
          console.log(error)
         return error;
        }).then(
        function(success){
         return success;
        },function(error){
          console.log("log");
        })
        return data;
      },

//***************** promotion ( For admin ) Starting **************************//
                          
       save_promotion: function(promotion_title,promotion_type,promotion_url,promotion_content,promotion_start_date,promotion_end_date )
      {
        var promotion_id = 'promotion_id_'+Math.floor((Math.random() * 2465789) + 1);
        // console.log('i am here');
var result = promotion.insert({
                      promotion_id: promotion_id,
                      promotion_title: promotion_title,
                      promotion_start_date: promotion_start_date,
                      promotion_end_date: promotion_end_date,

                      promotion_type: promotion_type,
                      promotion_url: promotion_url,

                      promotion_content: promotion_content,
                      promotion_status: 1,
                      clicks_count: 0,

                      created_at: Date.now(),
                });
            
return result;
    },       
                                   
       save_blog: function(blog_title,blog_type,blog_discription,logged_in_user )
      {
        var blog_id = 'blog_id_'+Math.floor((Math.random() * 2465789) + 1);
        // console.log('i am here');
var result = blog.insert({
                      blog_id: blog_id,
                      blog_title: blog_title,
                      blog_type: blog_type,
                      blog_discription: blog_discription,

                      blog_status: 1,
                      blog_approval_status: 1,
                      blog_author: logged_in_user,

                      created_at: Date.now(),
                });
                return result;
              },
                                   
       update_blog: function(blog_id,blog_cover,blog_title,blog_type,blog_discription,logged_in_user )
      {
console.log(blog_cover+blog_id+blog_title+blog_type+blog_discription+logged_in_user);
    var newUser = blog.find({blog_id: blog_id}).fetch();
        
          if(newUser[0]){
          console.log("case 1");
          var result =  blog.update({
              _id: newUser[0]._id,
            }, {
              $set: {

                      blog_title: blog_title,
                      blog_type: blog_type,
                      blog_discription: blog_discription,
                      blog_cover: blog_cover,

                      blog_status: 1,
                      blog_approval_status: 1,
                      blog_author: logged_in_user,

                      updated_at: Date.now(),
                }});
                return result;

              }
              else{
console.log("case 2");
                return false;
              }
            },  
                                          
       update_promotion: function( promotion_id,promotion_title,promotion_type,promotion_url,promotion_content,promotion_start_date,promotion_end_date )
      { 
  // console.log(promotion_id+promotion_title+promotion_type+promotion_url+promotion_start_date+promotion_end_date);

    var newUser = promotion.find({promotion_id: promotion_id}).fetch();
          if(newUser[0]){

          var result =  promotion.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      promotion_title: promotion_title,
                      promotion_start_date: promotion_start_date,
                      promotion_end_date: promotion_end_date,

                      promotion_type: promotion_type,
                      promotion_url: promotion_url,

                      promotion_content: promotion_content,
                      promotion_status: 1,
                      clicks_count: 0,

                      updated_at: Date.now(),
                    }
            });
          }
          return result;
    },
                          
       fetch_promotion_details: function(promotion_id )
      { 
        var result = promotion.find({ promotion_id: promotion_id }).fetch()
        return result;
    },
                        
       submit_lvl_0_comment: function(logged_in_user,post_id,comment_text )
      { 
        var comment_id = 'comment_id_'+Math.floor((Math.random() * 2465789) + 1);
        
                    var result = feed.insert({                
                      comment_id: comment_id,
                      comment_text: comment_text,
                      parent_id: post_id,
                      parent_post_type: 'Image',
                      post_type: 'comment_lvl_0',
                      comment_status: 1,
                      comment_by: logged_in_user,
                      created_at: Date.now() 
      });
            return result;
    },
                       
       submit_lvl_1_comment: function(logged_in_user,parent_id,comment_text )
      { 

        var comment_id = 'comment_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = feed.insert({
                      comment_id: comment_id,
                      comment_text: comment_text,
                      parent_id: parent_id,
                      parent_post_type: 'Image',
                      post_type: 'comment_lvl_1',
                      comment_status: 1,
                      comment_by: logged_in_user,
                      created_at: Date.now()
      });
            return result;
    },         

//****************** promotion ( For admin ) Ending **************************//

       display_reward_rates: function(reward_rates){
          var result = content.find({content_type: "reward_points"}).fetch();
          return result;
       },

      display_terms_and_condition: function(){
          var result = content.find({content_type: "terms_and_condition"}).fetch();
          return result;
       },

      display_privacy_policy: function(){
          var result = content.find({content_type: "privacy_policy"}).fetch();
          return result;
       },


       display_cancellation_policy: function(){
          var result = content.find({content_type: "cancellation_policy"}).fetch();
          return result;
       },

       display_copyright_policy: function(){
          var result = content.find({content_type: "copyright_policy"}).fetch();
          return result;
       },

       display_review_policy: function(){
          var result = content.find({content_type: "review_policy"}).fetch();
          return result;
       },

       display_reward_policy: function(){
          var result = content.find({content_type: "reward_policy"}).fetch();
          return result;
       },

       display_work_wit_us: function(){
          var result = content.find({content_type: "work_with_us"}).fetch();
          return result;
       },

       update_work_with_us: function(work_with_us)
      { 
          var newUser = content.find({content_type: "work_with_us"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      work_with_us_text: work_with_us,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "work_with_us",
                      work_with_us_text: work_with_us,
                      created_at: Date.now()
      });
     }
            return result;
    },


       update_reward_policy: function(reward_policy)
      { 
          var newUser = content.find({content_type: "reward_policy"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      reward_policy_text: reward_policy,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "reward_policy",
                      reward_policy_text: reward_policy,
                      created_at: Date.now()
      });
     }
            return result;
    },


       update_review_policy: function(review_policy)
      { 
          var newUser = content.find({content_type: "review_policy"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      review_policy_text: review_policy,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "review_policy",
                      review_policy_text: review_policy,
                      created_at: Date.now()
      });
     }
            return result;
    },

       update_copyright_policy: function(copyright_policy)
      { 
          var newUser = content.find({content_type: "copyright_policy"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      copyright_policy_text: copyright_policy,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "copyright_policy",
                      copyright_policy_text: copyright_policy,
                      created_at: Date.now()
      });
     }
            return result;
    },


       update_terms_and_condition: function(terms_and_condition)
      { 
          var newUser = content.find({content_type: "terms_and_condition"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      terms_and_condition_text: terms_and_condition,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "terms_and_condition",
                      terms_and_condition_text: terms_and_condition,
                      created_at: Date.now()
      });
     }
            return result;
    },

       update_privacy_policy: function(privacy_policy)
      { 
          var newUser = content.find({content_type: "privacy_policy"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      privacy_policy_text: privacy_policy,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "privacy_policy",
                      privacy_policy_text: privacy_policy,
                      created_at: Date.now()
      });
     }
            return result;
    },

       update_cancellation_policy: function(cancellation_policy)
      { 
          var newUser = content.find({content_type: "cancellation_policy"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                     cancellation_policy_text: cancellation_policy,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "cancellation_policy",
                      cancellation_policy_text: cancellation_policy,
                      created_at: Date.now()
      });
     }
            return result;
    },

       update_reward_management: function(field_name,points_value)
      { 
        // console.log(field_name+' & '+points_value);

            var newUser = content.find({content_type: "reward_points"}).fetch();
          if(newUser[0]){
// console.log('case 1');

if(field_name == 'review_submition'){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      review_submition: points_value,
                      updated_at: Date.now(),
                    }
            });
}
else if(field_name == 'book_purchase'){
            var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      book_purchase: points_value,
                      updated_at: Date.now(),
                    }
            });
}
else if(field_name == 'blog_approval'){
            var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      blog_approval: points_value,
                      updated_at: Date.now(),
                    }
            });
}
else if(field_name == 'signup_completion'){
            var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      signup_completion: points_value,
                      updated_at: Date.now(),
                    }
            });
}
else if(field_name == 'socail_media_handle_shared'){
            var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      socail_media_handle_shared: points_value,
                      updated_at: Date.now(),
                    }
            });
}
else if(field_name == 'socail_media_handle_shared'){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      socail_media_handle_shared: points_value,
                      updated_at: Date.now(),
                    }
            });
}

          }

      else{
        // console.log('case 2');
        var reward_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);
                    var result = content.insert({
                      reward_id: reward_id,
                      content_type: "reward_points",
                      review_submition: 200,

                      book_purchase: 50,
                      blog_approval: 500,
                      signup_completion: 50,

                      socail_media_handle_shared: 50,
                      profile_completion: 50,
                      created_at: Date.now()
      });
     }
            return result;
    },

       reset_reward_management: function()
      { 

          var newUser = content.find({content_type: "reward_points"}).fetch();
          if(newUser[0]){

          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      review_submition: 200,

                      book_purchase: 50,
                      blog_approval: 500,
                      signup_completion: 50,

                      socail_media_handle_shared: 50,
                      profile_completion: 50,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var reward_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      reward_id: reward_id,
                      content_type: "reward_points",
                      review_submition: 200,

                      book_purchase: 50,
                      blog_approval: 500,
                      signup_completion: 50,

                      socail_media_handle_shared: 50,
                      profile_completion: 50,
                      created_at: Date.now()
      });
     }
            return result;
    },


    fetch_categories_selection: function(user_id)
    { 
     var result = categories_selection.find({"user_id": user_id}).fetch();
     return result;
    },

    send_email_for_forgot_password:function(email_addr){
      var result = send_email_for_forgot_password(email_addr);
      return result;
    },

    change_password:function(userid,pass){
          var result =  user_details.update({
              user_id: userid,
            }, {
              $set: {
                "user_password": pass}
            });
          var result = send_email_for_changed_password(userid);
          return result;
      },

    update_campaigning_status:function(logged_in_user, approval_status,campaign_id){
      console.log(logged_in_user+' & '+ approval_status+' & '+campaign_id);
          var check_status =  campaign_details.find({campaign_id: campaign_id}).fetch();
          if(check_status[0]){

              var result =  campaign_details.update({
                                campaign_id: check_status[0].campaign_id,
                              }, {
                                $set: {
                                  "approval_status": approval_status,
                                  "status_changed_by": logged_in_user,
                                  "status_updated_time": Date.now()
                                }
                              }); 

          if(approval_status == 1){

          var notification_text = "Your campaign was accepted and got started";
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].campaigner_id,
                      campaign_id: check_status[0].campaign_id,
                      notification_type: "campaign",
                      created_at: Date.now()
      });
            return result;
          }
          else if(approval_status == 2){
                      var notification_text = "Your campaign is rejected";
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].campaigner_id,
                      campaign_id: check_status[0].campaign_id,
                      notification_type: "campaign",
                      created_at: Date.now()
      });
             return result;
          }
        }

      },

   save_campaign_details_for_admin:function(select_package,book_name,book_summary,author_name,
        author_description,amazon_link,delivery_option,additional_information,book_price,
        book_catagries,book_cover,final_payment,logged_in_user){

console.log(select_package+book_name+book_summary+author_name+author_description+amazon_link+delivery_option+additional_information+book_price+book_catagries+final_payment);
   var campaign_id = 'campaign_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result = campaign_details.insert({

                      campaign_id: campaign_id,
                      campaigner_id: logged_in_user,
                      select_package: select_package,
                      book_name: book_name,
                      book_summary: book_summary,

                      author_name: author_name,
                      author_description: author_description,
                      amazon_link: amazon_link,

                      delivery_option: delivery_option,
                      delivery_option: delivery_option,
                      additional_information: additional_information,
                      book_price: book_price,
                      book_cover: book_cover,
                      final_payment: final_payment,
                      book_catagries: book_catagries,
                      approval_status: 1,

                      status_changed_by: logged_in_user,
                      status_updated_time: Date.now(),

                      created_at: Date.now()
      });
                   return result;
},

    save_campaign_details:function(select_package,book_name,book_summary,author_name,
        author_description,amazon_link,delivery_option,additional_information,book_price,
        book_catagries,book_cover,final_payment,logged_in_user){

console.log(select_package+book_name+book_summary+author_name+author_description+amazon_link+delivery_option+additional_information+book_price+book_catagries+final_payment);
   var campaign_id = 'campaign_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result = campaign_details.insert({

                      campaign_id: campaign_id,
                      campaigner_id: logged_in_user,
                      select_package: select_package,
                      book_name: book_name,
                      book_summary: book_summary,

                      author_name: author_name,
                      author_description: author_description,
                      amazon_link: amazon_link,

                      delivery_option: delivery_option,
                      delivery_option: delivery_option,
                      additional_information: additional_information,
                      book_price: book_price,
                      book_cover: book_cover,
                      final_payment: final_payment,
                      book_catagries: book_catagries,
                      approval_status: 0,
                      created_at: Date.now()
      });
                   return result;
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
+"><br/><a href=https://writersmelon.herokuapp.com/activate_email/"+userID + ">Click here</a> to verify your email ID.  (if you are using the mobile application, after you press on the previous link close the mobile browser and continue from the application).<br/></td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for Writersmelon, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
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

 function send_email_for_forgot_password(email_addr){

  var result = user_details.find({ user_email: email_addr }).fetch();

var name = result[0].user_name;
var user_id = result[0].user_id;
var userId = Base64.encode(user_id);
var url = 'https://writersmelon.herokuapp.com';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Your request for Password reset has been processed successfully."+
"</td></tr><tr><td colspan="+div_style11
+"><br/><p>Please click on the link below to reset your password</p>"+
"<a href="+url+"/change_forgot_password/"+userId +" </a>Reset Password link</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for Writersmelon, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

          var email = {
                to: email_addr,
                from: 'writersmelonteam@gmail.com',
                subject: "Writersmelon | Forgot Password",
                html: htmlCode,
            };
               Email.send(email);
               var message = {"msg": "We have sent a password reset email to your registered email address."};
               return message;
    }

 function send_email_for_changed_password(userid){

var result = user_details.find({ user_id: userid }).fetch();
var name = result[0].user_name;
var user_email = result[0].user_email;
var password = result[0].user_password;
console.log('Password: ');
console.log(password);
var userId = Base64.encode(userid);
var url = 'https://writersmelon.herokuapp.com';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Your password has been changed Sucessfully and below are your login details"+
"!</td></tr><tr><td colspan="+div_style11
+"><br/><p>Email: "+user_email+" </p></br><p>Password : "+password+"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you did not sign up for Writersmelon, just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: user_email,
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Password Sucessfully Changed",
            html: htmlCode,
        };

               Email.send(email);
               // console.log(htmlCode);
var message = { "msg": "Password succesfully changed. We also sent your new password on an email to your registered email for future referance."}
          return message;
}

 function send_email_user_created_by_admin(user_id,user_name,user_email,password){

var name = user_name;
var user_email = user_email;
var password = password;
console.log('Password: ');
console.log(password);
var userId = Base64.encode(user_id);
var url = 'https://writersmelon.herokuapp.com';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Congrats!!! your account has been created and down below are your login details"+
"!</td></tr><tr><td colspan="+div_style11
+"><br/><p>Email: "+user_email+" </p></br><p>Password : "+password+"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you are not "+name+", just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: user_email,
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Writermelon New Account credentials",
            html: htmlCode,
        };

               Email.send(email);
               // console.log(htmlCode);
var message = { "msg": "User succesfully created. "}
          return message;
}

//******************** email functions End *************************

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}