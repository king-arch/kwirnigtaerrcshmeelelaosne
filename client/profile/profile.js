
import { Template } from 'meteor/templating';
import { user_details }  from './../../import/collections/insert.js';

import { following_list }  from './../../import/collections/insert.js';
import { interest_list }  from './../../import/collections/insert.js';
import { feed }  from './../../import/collections/insert.js';
import { book_details }  from './../../import/collections/insert.js';
import { categories_selection }  from './../../import/collections/insert.js';
   // import { categories_selection } from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

import { Session } from 'meteor/session';
import {  Email } from 'meteor/email';
import swal from 'sweetalert';

var user_info_list_all;
var user_info_based_on_email;
var follow_list_all;
var categories_selected;
var result_interested;

Template.profile_content.onDestroyed(function(){
  user_info_list_all.stop();
  user_info_based_on_email.stop();
  follow_list_all.stop();
  result_interested.stop();
  categories_selected.stop();

});

Template.profile_content.onRendered(function(){

   Session.set("intrest_array","");
   result_interested = Meteor.subscribe('fetch_result_interest');
   categories_selected = Meteor.subscribe('categories_selection_for_user',Session.get("userId"));

   // var results = categories_selection.find({"user_id": Session.get("userId")}).fetch();



       // if(result[i]){
         // console.log(results[i].selected_category_id);
         // new_array.push(results[i].selected_category_id);

         Meteor.call('fetch_categories_selection',Session.get("userId"),function(error,result){
              if(error){
                console.log("Some error occure.");
              }else{    
              var new_array = new Array();
              for(var i=0; i<result.length; i++){
   console.log('show new on render selected: ');
   console.log(result);
                new_array.push(result[i].selected_category_id);
              }
                Session.set("intrest_array",new_array);
            }
        });

  $('#loading_div').addClass("loader_visiblity_block");
  // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.4.3/cropper.min.js",function(){
  // swal('loaded');
  // });

   Session.set("set_feed_content_limit",3);
  var loading;
var block=0;
var $loading = $('<div class="loading"><img class="loading-icon" src="http://imageserver.webpropartners.com/AdminMedia/SpecialtyImages/CaptchaImages/loading.gif" width="25"></div>');
var $icon = $loading.find('img');

$(document).ready(function() {
  window.onscroll = function() {
      if (block === -1) {
        return;
    }
    var scrollTop = $(document).scrollTop();
    var windowHeight = $(window).height();     var bodyHeight = $(document).height() - windowHeight;
   
    var scrollPercentage = (scrollTop / bodyHeight);
    if(scrollPercentage > 0.9 && !loading) {
        loading = true;
        var old_post_count = Session.get("set_feed_content_limit");
        var close_interval = setInterval(function () {
            $icon.show();
            Session.set("set_feed_content_limit",Session.get("set_feed_content_limit")+3);
              if(Session.get("set_feed_content_limit") !=old_post_count){
              loading = false;
              clearInterval(close_interval)
            }
            
        }, 2500);
    }

 }
});


  Meteor.subscribe("user_info_based_on_id",Session.get("userId"));

    setTimeout(function(){
       // swal('call sending mail function');
       // $("#send_mail").click();
    },3000);

    var user_id = Session.get("userId");
    user_info_based_on_email = Meteor.subscribe("user_info_based_on_id",user_id);

      // swal('here: ');
      // swal('user_id: '+user_id );
       Meteor.call('check_signup_statusss',user_id,function(error,result){
              if(error){
                console.log("Some error occure.");
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

Template.profile_content.helpers({


      user_cover_pic_display(){
      if(this.user_cover_pic){
        return this.user_cover_pic;
      }
      else{
        return '/img/top-header1.jpg';
      }
    },
    

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
        // swal(profile_pic);
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

        show_categories_selection(){
           
              var result = categories_selection.find({"user_id": Session.get("userId")}).fetch();
            console.log('show catagries selected: ');
            console.log(result);
            return result;
},

        show_interest_details(selected_category_id){
            console.log(JSON.stringify(this));
            console.log(this.selected_category_id);
              var result = interest_list.find({"interest_id": this.selected_category_id}).fetch();
            console.log('show Intrest selected: ');
            console.log(result);
            return result;
},

        show_interest_details_all(){
            // console.log(JSON.stringify(this));
            // console.log(this.selected_category_id);
              var result = interest_list.find({"interest_status": 1}).fetch();
            console.log('show Intrested selected: ');
            console.log(result);
            return result;
},

        validate_categories_selection(){
    
            var result = categories_selection.find({"user_id": Session.get("userId"),selected_category_id: this.interest_id}).fetch();
            console.log('show catagries selected: ');
            console.log(result);
            if(result[0]){
                // var new_array = new Array();
                //   if(Session.get("intrest_array") != ""){
                //     console.log(Session.get("intrest_array"));
                //     new_array = Session.get("intrest_array");
                //    }
                // new_array = new_array.push(this.interest_id);
                // Session.set("intrest_array",new_array);
                // console.log(new_array);
              
              return true;
            }
            else{
              return false;
            }
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

      // console.log('showing user list all with check');
      // console.log(result);

      if(result[0]){
        // console.log('case 1');
        return false;
      }else{
        // console.log('case 2');
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

  logged_in_user_cover_pic_display(){
      if(this.user_cover_pic){
        return this.user_cover_pic;
      }
      else{
        return '/img/top-header1.jpg';
      }
    },

  show_logged_in(){
    // console.log('mm');
    var user_id = Session.get("userId");
    Meteor.subscribe("user_info_based_on_id",user_id);
      var result = user_details.find({ user_id: user_id }).fetch();
      // console.log('show logged in user detail');
      // console.log(result);
      if(result[0]){
        Session.set("logged_in_user_profile_pic",result[0].user_profile_pic);
      }
      return result;
  },

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
        // console.log(result[i]);

          if(count <= 5 && result[i].user_id != admin_id){
            var result2 = following_list.find({ $and: [{ "following": result[i].user_id },{ "follower": logged_in_user },{current_follow_status: 1} ] }).fetch();
             if(result2[0]){

             }else{
              new_result.push(result[i]);
              count = count + 1;
             }    
          }
        }

      // console.log('new array');
      // console.log(new_result);
                                

      return new_result;
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
      // console.log('showing user list all with check');
      // console.log(result);
      if(result[0]){
        // console.log('case 1');
        return false;
      }else{
        // console.log('case 2');
        return true;
      }
    },

    fetch_feed_posts(){
   var user_id = Session.get("userId");
   Meteor.subscribe("follow_list_all");

   var allFriends = following_list.find({ follower: user_id , current_follow_status: 1 }).fetch();
   // console.log('allFriends');
   // console.log(allFriends);
   var all_friends_array = new Array();
   for(var i=0;i<allFriends.length;i++){
        all_friends_array.push(allFriends[i].following);
   }
   all_friends_array.push(user_id);
  
          if(user_id != 'user_admin'){
         var include_admin = 'user_admin';
         all_friends_array.push(include_admin);
         }
         // console.log('all_friends_array: ');
         // console.log(all_friends_array);
        
         Meteor.subscribe('fetch_feed_content');
         var check_limit = Session.get("set_feed_content_limit");


            var result = feed.find({post_by: user_id,post_status: 1},{sort: {created_at: -1},limit: check_limit}).fetch();
         // if(Session.get("load_lvl1_comments") == 0){
         //    var result = feed.find({post_by: {$in: all_friends_array },post_status: 1},{sort: {created_at: -1}}).fetch();
         
         // }
         // else{
         // var result = feed.find({post_by: {$in: all_friends_array },post_status: 1},{sort: {created_at: -1},limit: Session.get("load_lvl1_comments")}).fetch();
         // }

         return result;
    },


    fetch_user_info(){
         var user_id = this.post_by;
         Meteor.subscribe('fetch_feed_content');                
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id}).fetch();
         // console.log('show result');
         // console.log(result);
         return result;
    },

    // fetch_like_user_info(){
    //      var user_id = this.liked_by;
    //      Meteor.subscribe('fetch_feed_content');                
    //      Meteor.subscribe("user_info_based_on_id",user_id);
    //      var result = user_details.find({user_id: user_id}).fetch();
    //      // console.log('show result');
    //      // console.log(result);
    //      return result;
    // },


    fetch_user_info_for_comment(){
         var comment_by = this.comment_by;

         Meteor.subscribe("user_info_based_on_id",comment_by);
         var result = user_details.find({user_id: comment_by}).fetch();
         return result;
    },

    post_content_type(){
         var result = this.post_content_type;
         return result;
    },

            check_summary_for_br_tag(){
      var discussion_detail =this.post_text;
      if(discussion_detail.includes('<br/>') ){
          return true;
      }
      else{
        return false; 
      }
  },

  BreakAsArray(){
    var discussion_detail = this.post_text;
    discussion_detail = discussion_detail.substring(0,400);
    var new_discussion_detail = discussion_detail.split("<br/>");
    // console.log('new_discussion_detail: ');
    // console.log(new_discussion_detail);
    var discussion_detail_array =new Array();
    for(var i=0;i<new_discussion_detail.length;i++){

     discussion_detail_array.push({tag:new_discussion_detail[i]})
    }
    return discussion_detail_array;
  },

  BreakAsArrayfull(){
    var discussion_detail = this.post_text;
    // discussion_detail = discussion_detail.substring(0,400);
    var new_discussion_detail = discussion_detail.split("<br/>");
    // console.log('new_discussion_detail: ');
    // console.log(new_discussion_detail);
    var discussion_detail_array =new Array();
    for(var i=0;i<new_discussion_detail.length;i++){

     discussion_detail_array.push({tag:new_discussion_detail[i]})
    }
    return discussion_detail_array;
  },

      check_if_logged_in_user(){
      var logged_in_user = Session.get("userId");
      // swal(this.post_by+' '+logged_in_user);
      if(this.post_by == logged_in_user){
        return true;
      }
      else{
        return false;
      }
    },

      check_if_current_user_is_commenter(){
        // console.log(JSON.stringify(this));
      var logged_in_user = Session.get("userId");
      // swal(logged_in_user +' & '+this.comment_by);
      if(this.comment_by == logged_in_user){
        return true;
      }
      else{
        return false;
      }
    },

      check_user_profile_pic(){

      if(this.user_profile_pic){
        return this.user_profile_pic;
      }
      else{
        return '/img/avatar1.jpg';
      }

    },

    // check_for_user_already_liked(){
    //       var liked_by = Session.get("userId");
    //         var result = feed.find({
    //                                  parent_id: this.post_id,
    //                                  parent_post_type: 'post',
    //                                  liked_by: liked_by,
    //                                  post_type: 'like',
    //                          }).fetch();
    //       if(result[0]){
    //         if(result[0].like_status > 0){
    //             return true;
    //         }
    //         else{
    //             return false;
    //         }
    //       }
    //       else{
    //         return false;
    //       }
    // },

    check_for_user_already_liked_on_comment_lvl_0(){
          var liked_by = Session.get("userId");
            var result = feed.find({
                                     parent_id: this.comment_id,
                                     parent_post_type: 'comment_lvl_0',
                                     liked_by: liked_by,
                                     post_type: 'like',
                             }).fetch();
          if(result[0]){
            if(result[0].like_status > 0){
                return true;
            }
            else{
                return false;
            }
          }
          else{
            return false;
          }
    },

    check_for_user_already_liked_on_comment_lvl_1(){
          var liked_by = Session.get("userId");
            var result = feed.find({
                                     parent_id: this.comment_id,
                                     parent_post_type: 'comment_lvl_1',
                                     liked_by: liked_by,
                                     post_type: 'like',
                             }).fetch();
          if(result[0]){
            if(result[0].like_status > 0){
                return true;
            }
            else{
                return false;
            }
          }
          else{
            return false;
          }
    },

  // total_liked_on_post(post_id){
  //           var result = feed.find({
  //                                    parent_id: this.post_id,
  //                                    post_type: 'like',
  //                                    like_status: 1,
  //                            }).count();
  //   return result;  

  // },

  total_liked_on_comment_lvl_0(comment_id){
            var result = feed.find({
                                     parent_id: this.comment_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  
  },

  total_liked_on_comment_lvl_1(comment_id){
            var result = feed.find({
                                     parent_id: this.comment_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  
  },

  // show_comment_count(){

  //   var result = feed.find({
  //                             "parent_id": this.post_id,
  //                             "post_type": "comment_lvl_0",
  //                             "comment_status": 1,
  //                     }).count();
  //   return result; 

  // },

  check_if_comments_exist(){
    var result = feed.find({
                              "parent_id": this.post_id,
                              "post_type": "comment_lvl_0",
                              "comment_status": 1,
                      }).count();
    if(result  > 3){
      return true;
    }
    else{
    return false; 
    }
  },

  // show_users_liked_on_post(){
  //           var result = feed.find({
  //                                    parent_id: this.post_id,
  //                                    post_type: 'like',
  //                                    like_status: 1,
  //                            }).fetch();
  //   return result;
  // },


  show_users_liked_on_comment_lvl_0(){
            var result = feed.find({
                                     parent_id: Session.get("show_comment_lvl_0_id"),
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },

  show_users_liked_on_comment_lvl_1(){
            var result = feed.find({
                                     parent_id: Session.get("show_comment_lvl_1_id"),
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },

  display_books(){
         var liked_by = Session.get("userId");

         Meteor.subscribe("fetch_book_listing");
         var result = book_details.find({}).fetch();
    return result;
  },

  show_logged_inuser_profile_pic(){
    var profile_pic = Session.get("logged_in_user_profile_pic");
    return profile_pic;
  },

  book_name_trimmed(){
         var logged_in_user = Session.get("userId");

         var book_name = this.book_name;
         if(book_name.length > 21){
            return book_name.slice(0, 21)+'...';
         }
         else{
            return book_name; 
         } 
  },

      'show_profile_image' : function(){
      var profile_pic = Session.get("post_image_session");
      if(profile_pic){
        var result = profile_pic;
      }else{
        var result = "img/focus.png"
      }
      return result;
    },

    display_lvl_0_commenting(){
         var logged_in_user = Session.get("userId");


         if(Session.get("load_lvl1_comments") == 0){
            var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 },limit: 3 }).fetch();

         }
         else{
       var get_id = Session.get("get_comment_id_to_view_all");
       var count = Session.get("load_lvl1_comments");

                        var result = feed.find({
                                     parent_id: get_id,
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 },limit: count }).fetch();
            }
         return result;

    },

    display_lvl_1_commenting(){
         var logged_in_user = Session.get("userId");
         var result = feed.find({
                                     parent_id: this.comment_id,
                                     parent_post_type: 'Image',
                                     post_type: 'comment_lvl_1',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 
                                    } }).fetch();
         return result;
    },

    show_following_count(){
        var logged_in_user = Session.get("userId"); 
        var result = following_list.find({ "follower": logged_in_user , "current_follow_status": 1 }).count();
        if(result > 1){
        return result;
        }
        else{
        return 0;
        }
    },

    show_followers_count(){
        var logged_in_user = Session.get("userId"); 
        var result = following_list.find({ "following": logged_in_user , "current_follow_status": 1 }).count();
        if(result > 1){
          return result;
          }
          else{
          return 0;
          }
    },

        //START feed like structure helpers


    check_for_user_already_liked(){
          var liked_by = Session.get("userId");
            var result = feed.find({
                                     parent_id: this.post_id,
                                     parent_post_type: 'post',
                                     liked_by: liked_by,
                                     post_type: 'like',
                             }).fetch();
          if(result[0]){
            if(result[0].like_status > 0){
                return true;
            }
            else{
                return false;
            }
          }
          else{
            return false;
          }
    },



  total_liked_on_post(post_id){
            var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  

  },

    fetch_like_user_info(){
         var user_id = this.liked_by;
         Meteor.subscribe('fetch_feed_content');                
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{limit: 10}).fetch();
         // console.log('show result');
         // console.log(result);
         return result;
    },


  show_users_liked_on_post(){
            var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },


     display_liked_content(post_id){
        Meteor.subscribe("follow_list_all");
        var logged_in_user = Session.get("userId");
        var check_friend = following_list.find({"follower": logged_in_user },{current_follow_status: 1}).fetch(); 
        
        var new_friend_list = new Array();

        for(var i=0;i<check_friend.length;i++){
          new_friend_list.push(check_friend[i].following);
        }
        new_friend_list.push(logged_in_user);

        console.log("show_user_listing");
        console.log(new_friend_list);

        var check_likers = feed.find({
                         parent_id: this.post_id,
                         post_type: 'like',
                         like_status: 1,
                         liked_by: {$in: new_friend_list },
                        }).fetch();

        var total_likes = feed.find({
                         parent_id: this.post_id,
                         post_type: 'like',
                         like_status: 1,
                        }).fetch();

        var final_likers_count = total_likes.length;
        final_likers_count = parseInt(final_likers_count);

        console.log("check if liked by friend");
        console.log(check_likers);

        console.log("final_likers_count");
        console.log(final_likers_count);

        if(check_likers.length == 1){
          if(check_likers[0].liked_by == logged_in_user){
            return 'you liked this';
          }else{
              Meteor.subscribe("user_info_based_on_id",check_likers[0].liked_by);
              var user_name = user_details.find({ user_id: check_likers[0].liked_by }).fetch();
              console.log('show singled liker friend');
              console.log(user_name[0].user_name);
              return user_name[0].user_name+' liked this';
          }
        }
        else if(check_likers.length == 2){
            if(check_likers[0].liked_by == logged_in_user || check_likers[1].liked_by == logged_in_user){
              
              if(check_likers[0].liked_by == logged_in_user){
              
              Meteor.subscribe("user_info_based_on_id",check_likers[1].liked_by);
              var user_name = user_details.find({ user_id: check_likers[1].liked_by }).fetch();
             return 'you & '+user_name[0].user_name+' liked this';
                            
              }else{
              Meteor.subscribe("user_info_based_on_id",check_likers[0].liked_by);
              var user_name = user_details.find({ user_id: check_likers[0].liked_by }).fetch();
              return 'you & '+user_name[0].user_name+' liked this';
              } 

            }
            else{
              Meteor.subscribe("user_info_based_on_id",check_likers[0].liked_by);
              var user_name = user_details.find({ user_id: check_likers[1].liked_by }).fetch();
              return user_name[0].user_name+' & 1 more liked this';
            }
        }
      else if(check_likers.length > 2){
        var check_list_friends_who_liked = new Array();
        for(var i=0; i< check_likers.length; i++){
          check_list_friends_who_liked.push(check_likers[i].liked_by)
        }
          if(check_list_friends_who_liked.includes(logged_in_user)){
            if(check_list_friends_who_liked[0] == logged_in_user){

              Meteor.subscribe("user_info_based_on_id",check_likers[1].liked_by);
              var user_name = user_details.find({ user_id: check_likers[1].liked_by }).fetch();
              return 'you, '+user_name[0].user_name+' & '+(final_likers_count-2) +' more liked this';

            }
            else{
              Meteor.subscribe("user_info_based_on_id",check_likers[0].liked_by);
              var user_name = user_details.find({ user_id: check_likers[0].liked_by }).fetch();
              return 'you, '+user_name[0].user_name+' & '+(final_likers_count-2) +' more liked this';
            } 
          }else{
              Meteor.subscribe("user_info_based_on_id",check_likers[0].liked_by);
              var user_name = user_details.find({ user_id: check_likers[0].liked_by }).fetch();
              return user_name[0].user_name+' & '+(final_likers_count-1 )+' more liked this';            
          }
      }

     },


       show_comment_count(){

    var result = feed.find({
                              "parent_id": this.post_id,
                              "post_type": "comment_lvl_0",
                              "comment_status": 1,
                      }).count();
    return result; 

  },

    //END feed like structure helpers

});

Template.profile_content.events({

    'click .go_to_detail_page':function(){      

            var post_id = Base64.encode(this.post_id);  
              var url = '/feed_detail/'+post_id;
            console.log(url);
            window.location.href = url;
    },  

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

  'click #signup_complete':function(e, template){
    // swal('show');
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
      // swal('catagriey submition clicked');
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
    if(catagries_array.length <  1)
    {
      swal("we need to select at least one category");
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
  // swal('1');
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
        // var user_email = $('#user_email').val().trim();
        var user_contact = $('#user_contact').val().trim();

        var user_location = $('#user_location').val().trim();
        var user_headline = $('#user_headline').val().trim(); 

        var fb_handler = $('#fb_handler').val().trim(); 
        var twitter_handler = $('#twitter_handler').val().trim(); 
        var goodreads_handler = $('#goodreads_handler').val().trim(); 

        if(user_name == null || user_name == "")
        {
          $('#user_name').addClass('emptyfield').focus();
          return false;
        }
        else{
          $('#user_name').removeClass('emptyfield');
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
           swal('phone number can only have digits');
           return false;
        }
        // swal('above update');

        var check_len = user_contact.length;
        var user_contact = parseFloat(user_contact);
        // swal(check_len);  
        if(check_len != 10 )
        {
          swal('Phone number should be of 10 degits only');
          return false;   
        }
        var user_id = Session.get("userId");

        user_name = user_name.charAt(0).toUpperCase()+ user_name.slice(1);
        // swal(name+gender+marital_status+phone+datepicker+autocomplete+user_id);
        // user_contact_with_check
        Meteor.call('user_details_update',user_id,user_name,fb_handler,twitter_handler,goodreads_handler,user_contact,user_location,user_headline,function(){
          if(result){
             console.log('error');
          }else{
             console.log('User details successfully updated');
          }
        });

        $('#edit_user_details').modal('toggle');
    },


  'change .make_interest_array': function(event){

    console.log('intrest array creation');
    // alert(this.interest_id);
    var new_array = new Array();

    if(Session.get("intrest_array") != ""){
      console.log(Session.get("intrest_array"));
      new_array = Session.get("intrest_array");
     }
        if(document.getElementById('check_id_'+this.interest_id).checked){
              // alert('case 1');
              new_array.push(this.interest_id);
            }
            else{
              new_array.pop(this.interest_id);
            }
            Session.set("intrest_array",new_array);
  },  

  'click #save_categories': function(event){
        event.preventDefault();

        var catagries_array = Session.get("intrest_array");
        // alert(catagries_array);
        var user_id = Session.get("userId");
        // user_name = user_name.charAt(0).toUpperCase()+ user_name.slice(1);

        Meteor.call('update_catagries',catagries_array,user_id,function(error,result){
          if(error){
             console.log('error');
          }else{
             console.log('User details successfully updated');
          }
        });

        $('#edit_user_interest').modal('toggle');
    },


  'click .like_event':function(){      
      handle_like_event(this.post_id);    
    },  

  'click .load_more_button':function(){      

    if(Session.get("set_feed_content_limit") == 3){
        Session.set("set_feed_content_limit",6);
      }else{
            var limit = Session.get("set_feed_content_limit");
            limit = limit + 3;
            Session.set("set_feed_content_limit",limit);
      }
      console.log('show feed limit');
      console.log(Session.get("set_feed_content_limit"));
    },  

  'click .show_like_count_on_feed_comment_lvl_1_text':function(){ 
      // console.log("show_comment_lvl_1_id");     
      // console.log(this.comment_id);     
      Session.set("show_comment_lvl_1_id",this.comment_id);    
    },

  'click .show_like_count_on_feed_comment_lvl_0_text':function(){ 
      console.log("show_comment_lvl_0_id");     
      console.log(this.comment_id);     
      Session.set("show_comment_lvl_0_id",this.comment_id);    
    },  

  'click .like_event_comment_lvl_0':function(){      
      handle_like_comment_lvl_0_event(this.comment_id);    
    },  

  'click .view_profile':function(){      
      swal('captured');  
                  // console.log('captured');  
                  // console.log("this.post_by");  
            // console.log(JSON.stringify(this));
            console.log(this.user_id);
            var user_id = Base64.encode(this.user_id);  
            if(this.user_id == Session.get("userId")){
              var url = '/profile';
            }else{
              var url = '/view_profile/'+user_id;
            }
            console.log(url);
            window.location.href = url;
    },  

  'click .show_more_comments':function(){
    swal(Session.get("load_lvl1_comments"));

    if(Session.get("load_lvl1_comments") != 0){
        Session.set("get_comment_id_to_view_all",this.post_id);

        var count = Session.get("load_lvl1_comments");
        count = count + 1;
        Session.set("load_lvl1_comments",count);
      }
        else{
          Session.set("load_lvl1_comments",6);
        }
    },

  'click .reply_to_lvl0':function(){
    if(Session.get("toggle_on_reply") == true){
      Session.set("toggle_on_reply",false);
      $('#reply_lvl0_'+this.comment_id).addClass("loader_visiblity_block");
    }else{
          Session.set("toggle_on_reply",true);
          $('#reply_lvl0_'+this.comment_id).removeClass("loader_visiblity_block");
        }
    },

  'click .lvl_0_comment_submitted':function(event){
    // swal('cool');
      event.preventDefault();
      var post_id = this.post_id;

// swal(' post_id '+post_id+' & comment_text '+comment_text);

      var comment_text = $("#comment_lvl_0_"+post_id).val();

             if(comment_text == null || comment_text == '')
              {
                $("#comment_lvl_0_"+post_id).addClass('emptyfield2').focus();
                return false;
              }
              else
              {
                $("#comment_lvl_0_"+post_id).removeClass('emptyfield2');
              }
// swal(' post_id '+post_id+' & comment_text '+comment_text);
    Meteor.call('submit_lvl_0_comment',Session.get("userId"),post_id,comment_text,function(error,result){
      if(error){
          swal("Error44444");
      }else{
        // console.log('successfully removed');
        $("#comment_lvl_0_"+post_id).val("")
      }
    });  

    },

  'click .lvl_1_comment_submitted':function(event){ 
      event.preventDefault(); 

      // swal("lvk 1 commenting"); 
      var comment_id = this.comment_id;
      var comment_text = $("#comment_lvl_1_"+comment_id).val(); 
      // swal(comment_text); 
 
            if(comment_text == null || comment_text == '') 
              { 
                $("#comment_lvl_1_"+comment_id).addClass('emptyfield2').focus();  
                return false; 
              } 
              else 
              { 
                $("#comment_lvl_1_"+comment_id).removeClass('emptyfield2');  
              } 
 
              parent_id = comment_id; 
    Meteor.call('submit_lvl_1_comment',Session.get("userId"),parent_id,comment_text,function(error,result){
        if(error){ 
            swal("Error"); 
        }else{ 
          // console.log('successfully removed');   
          $("#comment_lvl_1_"+comment_id).val("");  
          $('#reply_lvl0_'+comment_id).addClass("loader_visiblity_block");
        }  
    });  
    },  
   
  'click #image_selection_clicked':function(){ 
      $('#post_image').click();  
    },  
    
  'change #post_image':function(e, template){  
      upload_post_image(e, template);  
      $('#display_selected_image').removeClass('loader_visiblity_block');  
  },  

    'click .remove_post':function(event){
    var post_id = this.post_id;
    // swal(post_id);
    if(confirm("Sure, You want to remove this post ?")){
      Meteor.call('remove_post_from_feed',Session.get("userId"),post_id,function(error,result){
      if(error){
          swal("Error");
      }else{
        console.log('successfully removed');
      }
    });  
    }
  },

    'click .remove_comment_lvl0':function(event){
    var comment_id = this.comment_id;
    // swal(post_id);
    if(confirm("Sure, You want to remove this comment ?")){
      Meteor.call('remove_comment_from_lvl0',Session.get("userId"),comment_id,function(error,result){
      if(error){
          swal("Error");
      }else{
        console.log('successfully removed');
      }
    });  
    }
  },


    'click .remove_comment_lvl1':function(event){
    var comment_id = this.comment_id;
    // swal(post_id);
    if(confirm("Sure, You want to remove this comment ?")){
      Meteor.call('remove_comment_from_lvl1',Session.get("userId"),comment_id,function(error,result){
      if(error){
          swal("Error");
      }else{
        console.log('successfully removed');
      }
    });  
    }
  },

    'click .editHubPost':function(event){
      var post_id = this.post_id;
      // swal(post_id);
    $('#edit_post_text_'+post_id).removeClass("loader_visiblity_block");
    $('#post_text_'+post_id).addClass("loader_visiblity_block");
    
    $("#hidden_hub_post_"+ post_id).removeClass("loader_visiblity_block");
    $("#visible_hub_post_"+ post_id).addClass("loader_visiblity_block ");

    $("#show_less_"+post_id).addClass("loader_visiblity_block ");
    $("#show_more_"+post_id).addClass("loader_visiblity_block ");
  },

      'click .edit_comment_lvl0':function(event){
        // swal('cool');
      var comment_id = this.comment_id;
      // swal(comment_id);
    $('#edit_comment_lvl0_text_'+comment_id).removeClass("loader_visiblity_block");
    $('#comment_lvl0_text_'+comment_id).addClass("loader_visiblity_block");
    
    $("#hidden_comment_lvl0_post_"+ comment_id).removeClass("loader_visiblity_block");
    // $("#visible_hub_post_"+ comment_by).addClass("loader_visiblity_block ");

    // $("#show_less_"+comment_by).addClass("loader_visiblity_block ");
    // $("#show_more_"+comment_by).addClass("loader_visiblity_block ");
  },

      'click .edit_comment_lvl1':function(event){
        swal('cool');
      var comment_id = this.comment_id;
      swal(comment_id);
    $('#edit_comment_lvl1_text_'+comment_id).removeClass("loader_visiblity_block");
    $('#comment_lvl0_text_'+comment_id).addClass("loader_visiblity_block");
    
    $("#hidden_comment_lvl1_post_"+ comment_id).removeClass("loader_visiblity_block");
    // $("#visible_hub_post_"+ comment_by).addClass("loader_visiblity_block ");

    // $("#show_less_"+comment_by).addClass("loader_visiblity_block ");
    // $("#show_more_"+comment_by).addClass("loader_visiblity_block ");
  },


  'click .click_on_follow':function(){
    // swal('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // swal('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });
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
                // console.log('successfully following ');
              }
          });
  },

  'click #submit_post':function(){

    var post_text = $('#post_text').val().replace(/\r?\n/g,'<br/>');
    if(post_text == null || post_text == '')
    {
      $("#post_text").addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $("#post_text").removeClass('emptyfield2');
    }

    var logged_in_user = Session.get("userId"); 

      var post_type= Session.get("post_type");

//for normal text  
      if(post_type != "metadata_url"){

      var post_image = Session.get("post_image_session");
      if(post_image){
      var post_image = post_image;

        Meteor.call('save_feed_post_with_image',post_text,logged_in_user,post_image,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                // console.log('successfully following ');
                Session.set("post_image_session","");
                $('#display_selected_image').addClass('loader_visiblity_block');
              }
          });
      }
        else{        
            Meteor.call('save_feed_post',post_text,logged_in_user,function(error,result){
                if(error){
                  swal("Some error occure.");
                }else{
                  // console.log('successfully following ');
                }
            });
        }
      }

//for metadata url       
      else{
      
         Meteor.call('save_metadata_post',post_text,Session.get("metadata_image"),Session.get("metadata_title"),Session.get("metadata_source")
        ,Session.get("metadata_url"),logged_in_user,function(error,result){
        if(error){
          swal("error");
        }else{
           $("#hub_posting_text").val("");
          $("#url_metadata_div").addClass("div_hide_class");
          // swal("success");
          Session.clear("metadata_image");
          Session.clear("metadata_url");
          Session.clear("metadata_title");
          Session.clear("metadata_source");
          Session.set("post_type","text");
        }
        });

      }

    $('#post_text').val('')
  },

  'click #submit_edited_post':function(){
    var post_text = $('#hidden_hub_post_'+this.post_id).val().replace(/\r?\n/g,'<br/>');
    if(post_text == null || post_text == '')
    {
      $("#post_text").addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $("#post_text").removeClass('emptyfield2');
    }
    var logged_in_user = Session.get("userId");  

          Meteor.call('save_updated_feed_post',this.post_id,post_text,logged_in_user,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });
    $('#edit_post_text_'+this.post_id).addClass("loader_visiblity_block");
    $('#post_text_'+this.post_id).removeClass("loader_visiblity_block");
  },

  'click #submit_edited_comment_lvl0':function(){

    var comment_text = $('#hidden_comment_lvl0_post_'+this.comment_id).val().replace(/\r?\n/g,'<br/>');
    if(comment_text == null || comment_text == '')
    {
      $('#hidden_comment_lvl0_post_'+this.comment_id).addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $('#hidden_comment_lvl0_post_'+this.comment_id).removeClass('emptyfield2');
    }

    var logged_in_user = Session.get("userId");  
          Meteor.call('save_updated_comment_lvl0',this.comment_id,comment_text,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });

    $('#edit_comment_lvl0_text_'+this.comment_id).addClass("loader_visiblity_block");
    $('#comment_lvl0_text_'+this.comment_id).removeClass("loader_visiblity_block");
    
  },

  'click #submit_edited_comment_lvl1':function(){

    var comment_text = $('#hidden_comment_lvl1_post_'+this.comment_id).val().replace(/\r?\n/g,'<br/>');
    if(comment_text == null || comment_text == '')
    {
      $('#hidden_comment_lvl1_post_'+this.comment_id).addClass('emptyfield2').focus();
      return false;
    }
    else
    {
      $('#hidden_comment_lvl1_post_'+this.comment_id).removeClass('emptyfield2');
    }

    var logged_in_user = Session.get("userId");  
          Meteor.call('save_updated_comment_lvl1',this.comment_id,comment_text,function(error,result){
              if(error){
                swal("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });

    $('#edit_comment_lvl1_text_'+this.comment_id).addClass("loader_visiblity_block");
    $('#comment_lvl1_text_'+this.comment_id).removeClass("loader_visiblity_block");
    
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
// swal(dataURL);
base64data = dataURL;
console.log(base64data);

  Session.setPersistent("new_cover_image_url",base64data);

  var user_id = Session.get("userId");

  $('#loading_div').removeClass("loader_visiblity_block");
   Meteor.call("upload_cover_image",user_id,base64data,function(error,result){
    $('#loading_div').addClass("loader_visiblity_block");
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
     var file = e.currentTarget.files[0];
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

            // var height = 400;
            // var width = 400;

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
// swal(dataURL);
base64data = dataURL;
console.log(base64data);
Session.setPersistent("new_profile_image_url",base64data);
var user_id = Session.get("userId");

$('#loading_div').removeClass("loader_visiblity_block");
   Meteor.call("upload_profile_image",user_id,base64data,function(error,result){
    $('#loading_div').addClass("loader_visiblity_block");
        if(error){
          console.log("Error");
        }else{
            console.log("Profile Pic Changed")
           $('#divcrop_profile').removeClass('cropper-example-lena');
        }
    });
}


 // **********************upload function profile pic END*************************************************

function handle_like_event(post_id)
{
  var liked_by = Session.get("userId");
  Meteor.call('update_hub_like',post_id,liked_by, function(error,result){
              if(error){
                    swal('error');
                }else{
                    // console.log('hub post sucessfully liked');
                    }
              });
}

function handle_like_comment_lvl_0_event(comment_id)
{
  var liked_by = Session.get("userId");
  Meteor.call('update_hub_like_comment_lvl_0',comment_id,liked_by, function(error,result){
              if(error){
                    swal('shhh');
                }else{
                    // console.log('hub post sucessfully liked');
                    }
              });
}