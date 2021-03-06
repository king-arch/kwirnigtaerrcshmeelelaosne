
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
import { review_details } from './../import/collections/insert.js';

import { general_records } from './../import/collections/insert.js';
import { book_collections } from './../import/collections/insert.js';
import { reward_details } from './../import/collections/insert.js';

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

     Meteor.publish('user_info_based_on_id_logged_in_user', function(user_id){
      return  user_details.find({
                                      user_id: user_id
                                   },
                                   { 
                                      fields:
                                      {
                                          "user_id": 1,  
                                          "user_name": 1,
                                          "user_headline": 1,
                                          "user_profile_pic": 1,
                                      } 
                                    });
    });

     Meteor.publish('user_info_all', function() {
      return  user_details.find({});
    });

     Meteor.publish('user_info_listing_with_search_string', function(search_text) {
      const query = new RegExp(search_text,'i');  
      return user_details.find({user_name: query});
    });

     Meteor.publish('fetch_blog_content_with_search_string', function(search_text) {
      const query = new RegExp(search_text,'i');  
      return blog.find({blog_title: query});
    });

     Meteor.publish('fetch_book_detail_with_id', function(book_id) {
      return book_details.find({book_id: book_id});
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

     Meteor.publish('fetch_result_interest', function() {
      return  interest_list.find({});
    });

     Meteor.publish('fetch_result_interest_listing', function() {
      return  interest_list.find({});
    });

     Meteor.publish('categories_selection_for_user', function(user_id){
      return  categories_selection.find({user_id: user_id});
    });

     Meteor.publish('notification_details', function(campaign_id){
      return  notification_details.find({campaign_id: campaign_id});
    });


     Meteor.publish('notification_details_all', function(){
      return  notification_details.find({});
    });

     Meteor.publish('notification_details_for_user', function(user_id){
      return  notification_details.find({notification_to: user_id});
    });

     Meteor.publish('notification_details_for_admin', function(user_id){
      return  notification_details.find({notification_to: 'writersmelon'});
    });

     Meteor.publish('review_details_with_campaign_id', function(campaign_id){
      return  review_details.find({parent_id: campaign_id});
    });

     Meteor.publish('review_details_with_review_id', function(review_id){
      return  review_details.find({review_id: review_id});
    });

     Meteor.publish('review_details_all_pending', function(campaign_id){
      return  review_details.find({});
    });



    //  Meteor.publish('book_collections_all_with_book_id', function(book_id) {
    //   return  book_collections.find({book_id: book_id});
    // });

     Meteor.publish('reward_details_all', function() {
      return  reward_details.find({});
    });

     Meteor.publish('reward_details_all_with_user_id', function(user_id){
      return  reward_details.find({reward_to: user_id});
    });


//START Email setup function for support mail

smtp = {
  username: 'writersmelonteam@gmail.com',
  password: 'Admin@123',
  server: 'smtp.gmail.com',
  port: 587
}
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

// END Email setup function for support mail

// START crone jobs for capturing the report stats


// Meteor.startup(() => {
//   // code to run on server at startup 
//       SyncedCron.start();
// });


//   SyncedCron.config({
//     collectionName: 'somethingDifferent'
//   });

//   SyncedCron.add({
//     name: 'Get the campaign total counts and total revenue',
//     schedule: function(parser) {
//       // parser is a later.parse object

//       return parser.text('every  hours');
//       // return parser.text('every 20 seconds');

//         // fires at 10:15am every day
//   // var cron1 = later.parse.cron('15 10 ? * *');

//   // fires every 5 minutes starting at 2pm and ending at 2:55pm, every day
//   // var cron2 = later.parse.cron('0 0/5 14 * * ?', true);

//     }, 
//     job: function(intendedAt) {
//       // console.log('crunching numbers');
//       console.log('fetching reports stats: ');
//       // console.log(intendedAt);

//       console.log( Date.now() );
//       var check_campaign_status = campaign_details.find({approval_status: 1}).fetch();

//     if(check_campaign_status[0]){

//       for(var i=0; i< check_campaign_status.length; i++){

//       var book_name = check_campaign_status[i].book_name;
//       var approval_status = check_campaign_status[i].approval_status;
//       var final_payment = check_campaign_status[i].final_payment;

//       var campaign_end_date = check_campaign_status[i].campaign_end_date;
//       var campaign_start_date = check_campaign_status[i].campaign_start_date;
//       var campaign_id = check_campaign_status[i].campaign_id;
//       var campaigner_id = check_campaign_status[i].campaigner_id;

//       var todays_date = Date.now();

//       if(campaign_end_date < todays_date){

//       console.log(' book_name ' +book_name);
//       console.log(' approval_status '+approval_status);
//       console.log('final_payment ' +final_payment);
      
//       console.log(' campaign_end_date ' +campaign_end_date);
//       console.log(' campaign_start_date ' +campaign_start_date);
//       console.log(" todays_date: "+todays_date);
           
// if(approval_status != 4){
//               var result =  campaign_details.update({
//                                 campaign_id: campaign_id,
//                               }, {
//                                 $set: {
//                                   "approval_status": 4,
//                                   "status_changed_by": 'crone_jobs',

//                                   "update_at": Date.now()
//                                 } 
//                       }); 

//               console.log(result);
      
//       var check_campaign_status_2 = review_details.find({parent_id: campaign_id, content_type: "submit_review",approval_status: 1}).fetch();
//       // var check_campaign_status = review_details.find({parent_id: campaign_id}).fetch();
//       console.log("get campaign reviews");
//       // console.log(check_campaign_status_2);
//       var new_array_2 = new Array();

//       if(check_campaign_status_2[0]){

//           for(var i=0; i< check_campaign_status_2.length;i++){
//              new_array_2.push(check_campaign_status_2[i].review_id);
//           }

//       // console.log("reviewer array");
//       // console.log(new_array_2);

//       var report_id = 'report_id_'+Math.floor((Math.random() * 2465789) + 1);
//       console.log(report_id);
//                                var result = campaign_details.insert({

//                                   entry_type: "campaign_completion_report",
//                                   report_id: report_id,
//                                   campaign_id: campaign_id,
//                                   campaigner_id: campaigner_id,
//                                   review_listing: new_array_2,

//                                   campaign_started_on: campaign_start_date,
//                                   campaign_completed_on: Date.now(),
//                   });

//                 var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
//                   var result2 = notification_details.insert({

//                                 notification_id: notification_id,
//                                 notification_by: "crone_jobs",
//                                 notification_to: campaigner_id,

//                                 campaign_id: campaign_id,
//                                 notification_status: 0,

//                                 report_id: report_id,
//                                 notification_type: "campaign_completion_report",
//                                 created_at: Date.now()
//                 });

//       console.log("succes inserted");
//       }
//               console.log(i);
//               console.log( "******************************************" );

// //next line is for getting the completed campaigns count directly fron the campaign_detail table
//       var check_campaign_status_for_stats = campaign_details.find({approval_status: 4}).fetch();

//       var check_general_records = general_records.find({"record_type": "campaign_count"}).fetch();
//         if(check_general_records[0]){
//                               var result =  general_records.update({
//                                 campaign_id: check_general_records[0].general_record_id,
//                               }, {
//                                 $set: {
//                                   "campaign_count": check_campaign_status_for_stats.length,
//                                   "update_at": Date.now()
//                                 } 
//                               }); 
//           }else{

//              var general_record_id = 'general_record_id_'+Math.floor((Math.random() * 2465789) + 1);
//              var result = general_records.insert({
//                           "general_record_id": general_record_id,
//                           "record_type": "campaign_count",
//                           "campaign_count": check_campaign_status_for_stats.length,
//                           "created_at": Date.now(),
//                         });
//               }

//               }

//            }
//          }
//               console.log("stop");
//            }
//         }
//   });

// END crone jobs for capturing the report stats



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
   author_description,amazon_link, book_cover, final_release_date,book_price,editors_pick_status){

   var result = book_details.insert({
      "book_id": book_id,
      "book_name": book_name,
      "book_summary": book_summary,
      "book_catagries": book_catagries,
      "author_name": author_name,
      "author_description": author_description,
      "amazon_link": amazon_link,
      "book_cover": book_cover,
      "editors_pick_status": editors_pick_status,
      "book_price": book_price,
      "final_release_date": final_release_date,
      "created_at": Date.now(),
    });

         var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
                  var result2 = feed.insert({

                             "post_id": post_id,
                             "post_type": 'post',
                             "post_content_type": 'book_post',
                             "book_id": book_id,
                             "post_by": 'writersmelon',
                             "post_status": 1,
                             "created_at": Date.now()
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
      "first_time_signup": 0, 
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
   author_description,amazon_link, book_cover, final_release_date,book_price,editors_pick_status){
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
      "editors_pick_status": editors_pick_status,
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

if(newUser[0].blog_author != 'user_admin'){
if(status == 2){
 var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      notification_type: "blog_rejected",
                      created_at: Date.now()
      });
}else if(status == 1){
 var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({
                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      notification_type: "blog_accepted",
                      created_at: Date.now()
      });
}
}
      return result;
    }
  },

    "change_blog_approval_status": function (blog_id, status,logged_in_user) {

    // console.log(interest_id + ' & ' + status);
    var newUser = blog.find({
      "blog_id": blog_id
    }).fetch();

    if (newUser[0]) {

      var blog_author = newUser[0].blog_author;
if(status == 2){
  console.log("case 1");
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_status: status,
          updated_at: Date.now,
        }
      });
       var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({
                      notification_id: notification_id,
                      
                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      notification_type: "blog_rejected",
                      created_at: Date.now()
      });

      return result;
 }else{
  console.log("case 2");
  console.log("status: "+status);
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_status: status,
          updated_at: Date.now,
        }
      });

                 var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
                  var result2 = feed.insert({

                             "post_id": post_id,
                             "post_type": 'post',
                             "post_content_type": 'blog_post',
                             "blog_id": newUser[0].blog_id,
                             "post_by": newUser[0].blog_author,
                             "post_status": 1,
                             "created_at": Date.now()
                    });


if(blog_author != "user_admin"){
    var new_result = content.find({
      "content_type": "reward_points"
    }).fetch();

    var reward_value = new_result[0].blog_approval;
    var reward_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);

    var latest_result = reward_details.insert({
    
          reward_id: reward_id,
          reward_value: reward_value,
          parent_id: blog_id,
          entry_type: 'reward_point',
          reward_to: blog_author,
          reward_trigger_type: "blog_approval",

          reward_redeem_status: 0,
          created_at: Date.now(),

      });

     var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({
                      notification_id: notification_id,
                      
                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      notification_type: "blog_approved",
                      created_at: Date.now(),
      });
}

      return result;
    }
  }  
  },

    "change_blog_approval_status_with_comment": function (blog_id, status,logged_in_user,reject_comment) {

    console.log(blog_id + ' & ' + status+ ' & ' + logged_in_user+ ' & ' + reject_comment);
    var newUser = blog.find({
      "blog_id": blog_id
    }).fetch();

    if (newUser[0]) {
      var blog_author = newUser[0].blog_author;
  
  if(status == 2){
  console.log("case 1");
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_status: status,
          reject_comment: reject_comment,
          updated_at: Date.now,
        }
      });
       var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({
                      notification_id: notification_id,
                      
                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      reject_comment: reject_comment,
                      notification_type: "blog_rejected",
                      created_at: Date.now()
      });

      return result;
 }else{
  console.log("case 2");
  console.log("status: "+status);
      // console.log(newUser[0]);
      var result = blog.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          blog_status: status,
          updated_at: Date.now,
        }
      });

                 var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
                  var result2 = feed.insert({

                             "post_id": post_id,
                             "post_type": 'post',
                             "post_content_type": 'blog_post',
                             "blog_id": newUser[0].blog_id,
                             "post_by": newUser[0].blog_author,
                             "post_status": 1,
                             "created_at": Date.now()
                    });

if(blog_author != "user_admin"){
    var new_result = content.find({
      "content_type": "reward_points"
    }).fetch();

    var reward_value = new_result[0].blog_approval;
    var reward_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);

    var latest_result = reward_details.insert({
    
          reward_id: reward_id,
          reward_value: reward_value,
          parent_id: blog_id,
          entry_type: 'reward_point',
          reward_to: blog_author,
          reward_trigger_type: "blog_approval",

          reward_redeem_status: 0,
          created_at: Date.now(),

      });

     var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({
                      notification_id: notification_id,
                      
                      notification_by: logged_in_user,
                      notification_to: newUser[0].blog_author,
                      blog_id: blog_id,

                      notification_status: 0,
                      notification_type: "blog_approved",
                      created_at: Date.now(),
      });
}

      return result;
    }
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

  user_details_update: function(user_id,user_name,fb_handler,twitter_handler,goodreads_handler,personal_blog,user_contact,user_location,user_headline,account_number)
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
                          'personal_blog': personal_blog,
                          'account_number': account_number,

                          'user_headline': user_headline,
                          'updated_at': Date.now()
                        }
                      });
    return result;
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
                                   
       save_blog: function(blog_title,blog_type,blog_discription,logged_in_user,blog_cover)
      {
        var blog_id = 'blog_id_'+Math.floor((Math.random() * 2465789) + 1);
        // console.log('i am here');
var result = blog.insert({
                      blog_id: blog_id,
                      blog_title: blog_title,
                      blog_type: blog_type,
                      blog_discription: blog_discription,

                      blog_status: 1,
                      // blog_approval_status: 1,
                      blog_cover: blog_cover,
                      blog_author: logged_in_user,

                      created_at: Date.now(),
                });

                 var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
                  var result2 = feed.insert({

                             "post_id": post_id,
                             "post_type": 'post',
                             "post_content_type": 'blog_post',
                             "blog_id": blog_id,
                             "post_by": logged_in_user,
                             "post_status": 1,
                             "created_at": Date.now()
                    });

                return result;
      },
                                   
       submit_blog: function(blog_title,blog_type,blog_discription,logged_in_user,blog_cover)
      {                      
        var blog_id = 'blog_id_'+Math.floor((Math.random() * 2465789) + 1);
        // console.log('i am here');
var result = blog.insert({
                      blog_id: blog_id,
                      blog_title: blog_title,
                      blog_type: blog_type,
                      blog_discription: blog_discription,

                      blog_status: 0,
                      blog_cover: blog_cover,
                      // blog_approval_status: 0,
                      blog_author: logged_in_user,

                      created_at: Date.now(),
                });
// console.log("notification_type: blog_submit_request");
      var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: 'writersmelon',
                      blog_id: blog_id,
                      notification_type: "blog_submit_request",

                      notification_status: 0,
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
                      // blog_approval_status: 1,
                      // blog_author: logged_in_user,

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
                         

//****************** promotion ( For admin ) Ending **************************//

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


  create_book_details_from_campaign(book_id, book_name, book_summary, book_catagries, author_name,
   author_description,amazon_link, book_cover, final_release_date,book_price,campaign_id,editors_pick_status){


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
      "editors_pick_status": editors_pick_status,
      "campaign_id": campaign_id,
      "final_release_date": final_release_date,
      "created_at": Date.now(),
    });

                      var result2 =  campaign_details.update({
                                campaign_id: campaign_id,
                              }, {
                                $set: {
                                  "book_id": book_id,
                                } 
                              }); 
      
      var post_id = 'post_id_'+Math.floor((Math.random() * 2465789) + 1);
                  var result2 = feed.insert({

                             "post_id": post_id,
                             "post_type": 'post',
                             "post_content_type": 'book_post',
                             "book_id": book_id,
                             "post_by": 'writersmelon',
                             "post_status": 1,
                             "created_at": Date.now()
                    });

      return result;
  },


    change_reward_request_status(request_id,status){ 
  
           var result_2 =  reward_details.update({
                                       request_id: request_id,
                                       }, {
                                 $set: {
                                   "request_status": status,
                                   "update_at": Date.now()
                                } 
                              });
             return result_2;
            },

 update_review_text(review_text,campaign_id,review_id){
   console.log(review_text +' & '+campaign_id+' & '+review_id);
   var check_status4 =  review_details.find({"review_id": review_id}).fetch();

if(check_status4[0]){

          var result =  review_details.update({
              _id: check_status4[0]._id,
            }, {
              $set: {
                      "review_text": review_text,
                      "update_at": Date.now(),
                    }
            });
      return result;
}

  },

 submit_lvl_0_comment_for_blog: function(logged_in_user,blog_id,comment_text )
      { 
        var comment_id = 'comment_id_'+Math.floor((Math.random() * 2465789) + 1);
        
                    var result = blog.insert({                
                      comment_id: comment_id,
                      comment_text: comment_text,
                      parent_id: blog_id,
                      parent_post_type: 'Blog',
                      post_type: 'comment_lvl_0',
                      comment_status: 1,
                      comment_by: logged_in_user,
                      created_at: Date.now() 
      });
            return result;
    },
                       
       submit_lvl_1_comment_for_blog: function(logged_in_user,parent_id,comment_text )
      { 
console.log(logged_in_user+' & '+parent_id+' & '+comment_text);
        var comment_id = 'comment_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = blog.insert({
                      comment_id: comment_id,
                      comment_text: comment_text,
                      parent_id: parent_id,
                      parent_post_type: 'Blog',
                      post_type: 'comment_lvl_1',
                      comment_status: 1,
                      comment_by: logged_in_user,
                      created_at: Date.now()
      });
            return result;
    },    

      update_blog_like_comment_lvl_0: function(comment_id,liked_by){
      var checkForAlreadyExists = blog.find({
                                              parent_id: comment_id,
                                              parent_post_type: 'comment_lvl_0',
                                              liked_by: liked_by,
                                              post_type: 'like',

                                  }).fetch();

          console.log('checkForAlreadyExists: ');
          console.log(checkForAlreadyExists);

          if(checkForAlreadyExists[0]){
          if(checkForAlreadyExists[0].like_status == 0){
                      var result = blog.update({
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
          var result = blog.update({
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

                    var result = blog.insert({
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
  

      get_logged_in_user_info: function(logged_in_user){
      var result = user_details.find({
                                    user_id: logged_in_user,
                                  }).fetch();
      return result;
},

  async send_contact_us_email(user_name, user_email,phone, query_type, text_details){

var result = await send_email_with_contact_us_details_to_admin(user_name, user_email,phone, query_type, text_details);
   return result;
  },


  send_redeem_request(logged_in_user,requested_value,account_number){ 

     var result = reward_details.find({reward_to: logged_in_user}).fetch();
      if(result[0]){
      var new_array = new Array();
            for(var i=0; i< result.length; i++){
              new_array.push(result[i].reward_id);

               var result_2 =  reward_details.update({
                                reward_id: result[i].reward_id,
                              }, {
                                $set: {
                                  "reward_redeem_status": 3,
                                  "update_at": Date.now()
                                } 
                              });
            }

        var request_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);
        var latest_result = reward_details.insert({
        
              request_id: request_id,
              requested_value: requested_value,
              requested_by: logged_in_user,
              entry_type: 'redeem_request',
              account_number: account_number,
              involved_id: new_array,

              request_status: 0,
              created_at: Date.now(),

          });

   return result; 
   }
  }, 


  check_for_first_timer_to_send_email(user_id){ 

     var result = user_details.find({user_id: user_id}).fetch();
      if(result[0]){
        if(result[0].first_time_signup == 1){
          return false;
        }else{

               var result_2 =  user_details.update({
                                user_id: user_id,
                              }, {
                                $set: {
                                  "first_time_signup": 1,
                                  "update_at": Date.now()
                                } 
                              });

          
                var notification_text = 'Hi "'+result[0].user_name +'", welcome to writersmelon';
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: 'writersmelon',
                      notification_to: user_id,

                       notification_status: 0,
                      notification_type: "Welcome_email",
                      created_at: Date.now()
                });
                      return result2;

        
        }
      }
    },


  change_notification_seen_status(){
    // console.log(logged_in_user+' & '+book_id+ ' & '+campaign_id+ ' & '+user_location);
    var fetch_all_unread = notification_details.find({notification_status: 0, notification_to: 'writersmelon'}).fetch();
    if(fetch_all_unread[0]){

      for(var i=0; i < fetch_all_unread.length; i++){
                  var result =  notification_details.update({
                         _id: fetch_all_unread[i]._id,
                          },{
                           $set: {
                                  "notification_status": 1,
                                  "update_at": Date.now(),
                                }
            });
      }
      return result;
}
  },

  change_notification_seen_status_client(logged_in_user){
    // console.log(logged_in_user+' & '+book_id+ ' & '+campaign_id+ ' & '+user_location);
    var fetch_all_unread = notification_details.find({notification_status: {$ne: 1}, notification_to: logged_in_user}).fetch();
    if(fetch_all_unread[0]){

      for(var i=0; i < fetch_all_unread.length; i++){
                  var result =  notification_details.update({
                         _id: fetch_all_unread[i]._id,
                          },{
                           $set: {
                                  "notification_status": 1,
                                  "update_at": Date.now(),
                                }
            });
      }
      return result;
    }
  },


      check_for_google_login:function(getEmail,getName,getImageUrl,source){
        //alert(userid);
        var check_similar_mail_exists = user_details.find({user_email: getEmail , source: source}).fetch();

        if(check_similar_mail_exists[0]){

          if(check_similar_mail_exists[0].headline){

            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/feed',"userID": userID
              }

              return message;
          }
          else{

            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/signup',"userID": userID
              }

              return message;
}
        }else{

    var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);

                    var result =  user_details.insert({
                      user_id:userID,
                      user_name: getName,
                      user_email: getEmail,
                      email_status: 1,
                      source: source,
                      user_status: '',
                      user_profile_pic: getImageUrl,
                      createdAt: Date.now() 
                    });

              var message = {
                "send_url": '/signup',"userID": userID
              }
              
              return message;
          }
      },


      check_for_facebook_login:function(getEmail,getName,getImageUrl,source){
        //alert(userid);
        var check_similar_mail_exists = user_details.find({user_email: getEmail , source: source}).fetch();
        if(check_similar_mail_exists[0]){

          if(check_similar_mail_exists[0].headline){
            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/feed',"userID": userID
              }

              return message;
          }
          else{

            var userID = check_similar_mail_exists[0].user_id;
              var message = {
                "send_url": '/signup',"userID": userID
              }

              return message;
}
        }else{

    var userID = 'user_'+Math.floor((Math.random() * 2465789) + 1);

                    var result =  user_details.insert({
                      user_id:userID,
                      user_name: getName,
                      user_email: getEmail,
                      email_status: 1,
                      source: source,
                      user_status: '',
                      user_profile_pic: getImageUrl,
                      createdAt: Date.now() 
                    });

              var message = {
                "send_url": '/signup',"userID": userID
              }

              return message;

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Dear "+name +",</td></tr><tr><td colspan="+spacing+">ThankYou for your signing up with Writers Melon."+
"</td></tr><tr><td colspan="+spacing+">Please click on the confirmation link to activate your account.</td></tr><tr><td colspan="+div_style11
+"><br/><a href=http://13.233.93.182/activate_email/"+userID + ">Link</a><br/></td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
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
var url = 'http://13.233.93.182';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Dear "+name +",</td></tr><tr><td colspan="+spacing+">Please click on the Password reset link to change your password. "+
"</td></tr><tr><td colspan="+div_style11
+"><br/>"+
"<a href="+url+"/change_forgot_password/"+userId +"> Reset Password link</a></td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
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
var url = 'http://13.233.93.182';

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
// console.log('Password: ');
// console.log(password);
var userId = Base64.encode(user_id);
var url = 'http://13.233.93.182';

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

 function send_email_to_reviewer_about_book_delivery_option_1(user_id,book_name){

var result = user_details.find({ user_id: user_id }).fetch();
var name = result[0].user_name;
var user_email = result[0].user_email;
var password = result[0].user_password;

console.log('Password: ');
console.log(password);
var userId = Base64.encode(user_id);

var url = 'http://13.233.93.182';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Congrats!!! You have been selected for reviewing the book "+book_name+"."+
"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">The book will be shipped to you once you update your postal address and contact number on your profile . Please inform us if you don't receive it within 7-10 days of this mail. Do share a pic of the book on Twitter/Instagram and tag us. Please submit your review links from your blog + Goodreads + Amazon/Flipkart on write review form. </td></tr><tr><td colspan="+spacing
+">within 15 days of receiving the book. Do read our review policy, if you are participating for the first time. In case you no longer wish to participate in this review program, please cancel your sign up at the earliest.  </td></tr><tr><td colspan="+spacing
+">P.S. If you are not "+name+", just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: user_email,
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Review acceptence mail",
            html: htmlCode,
        };

               Email.send(email);
               // console.log(htmlCode);
var message = { "msg": "User succesfully created. "}
          return message;
}


 function send_email_to_reviewer_about_book_delivery_option_2(user_id,book_name){

var result = user_details.find({ user_id: user_id }).fetch();
var name = result[0].user_name;
var user_email = result[0].user_email;
var password = result[0].user_password;

console.log('Password: ');
console.log(password);
var userId = Base64.encode(user_id);

var url = 'http://13.233.93.182';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">You have been selected for reviewing the book "+book_name+"."+
"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">Please order the book from Amazon within 2-3 days of this mail. The book cost will be added to your reward points. Do share a pic of the book on Twitter/Instagram and tag us. Please submit your review links from your blog + Goodreads + Amazon/Flipkart on write a review form within 15 days of receiving the book. Do read our review policy if you are participating for the first time. In case you no longer wish to participate in this review program, please cancel your sign up at the earliest.</td></tr><tr><td colspan="+spacing
+">P.S. If you are not "+name+", just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: user_email,
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Review acceptence mail",
            html: htmlCode,
        };

               Email.send(email);
               // console.log(htmlCode);
var message = { "msg": "User succesfully created. "}
          return message;
}



 function send_email_with_contact_us_details_to_admin(user_name, user_email,phone, query_type, text_details){

// user_name, user_email,phone, query_type, text_details

var name = user_name;
var user_email = user_email;
var phone = phone;
var query_type = query_type;
var text_details = text_details;
// console.log('Password: ');
// console.log(password);
// var userId = Base64.encode(user_id);
var url = 'http://13.233.93.182';

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
"colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+" style="+div_style14+">Hi "+name +",</td></tr><tr><td colspan="+spacing+">Hi, someone just contacted you with the contact us form. Down below are this details."+
"!</td></tr><tr><td colspan="+div_style11
+"><br/><p>Name: "+name+" </p></br><p>Email: "+user_email+" </p></br><p>Phone: "+phone+" </p></br><p>Query Type: "+query_type+" </p></br><p>Message : "+text_details+"</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing
+">P.S. If you are not "+name+", just ignore this email; we will never again send you an email.</td></tr><tr><td colspan="+spacing
+">&nbsp;</td></tr><tr><td colspan="+spacing+">Regards</td></tr><tr><td colspan="+spacing
+">The Writersmelon Team</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr><tr><td colspan="+spacing+">&nbsp;</td></tr></tbody></table></div><div style="+div_style15+"><table style="+div_style6+"><tbody><tr><td><center><small style="+div_style6+">This email was intended for "+name+".<br/>Copyright Writersmelon, 2018.</small></center></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>";

 var email = {
            to: 'writersmelonteam@gmail.com',
            from: 'writersmelonteam@gmail.com',
            subject: "Writersmelon | Writermelon Contact Query",
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

// function get_modality_list(instance_path) {    
//     return new Promise((resolve, reject) => {   
//     var request = require("request");

//     var options = { method: 'GET',
//       url: instance_path,
//       headers: 
//        { 'Postman-Token': '76e6c2af-3265-4fc8-b02d-8d96663c911d',
//          'Cache-Control': 'no-cache' } };

//     request(options, function (error, response, body) {
//       if (error) throw new Error(error);
//       resolve(body);
//       });
//     });
// }