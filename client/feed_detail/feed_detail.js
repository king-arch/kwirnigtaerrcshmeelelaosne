
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';

import { book_details }  from './../../import/collections/insert.js';
import { feed }  from './../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var all_feed;

Template.feed_detail_page.onDestroyed(function(){
  all_feed.stop();
});

var tracker;

Template.feed_detail_page.onRendered(function () {

  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var post_id = Base64.decode(url);
  Session.set("show_post_id",post_id);

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

   all_feed = Meteor.subscribe("fetch_feed_content");

   Session.set("load_lvl1_comments",0);
   Session.set("post_type","text");

$(function() {
  "use strict";
  // end by a pace \s or \s$
  var url = /(([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)\s)/gi; 
  

    $("#post_text").on('paste', function(e) {
      swal('klkdslklkds');
      $(e.target).keyup();
    });

 $("#post_text").on("keyup", function(e) {
    var urls, lastURL,
      checkURL = "",
      output = "";

    if (e.keyCode == 8 && e.keyCode !== 9 && e.keyCode !== 13 && e.keyCode !== 32 && e.keyCode !== 46) {
        if($("#post_text").val()==""){
            if(Session.get("post_type")=="metadata_url"){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
            }
        };
      return;
    }
   if (e.keyCode == 17) {
      return;
    }
    Session.set("request_send","false");
    while ((urls = url.exec(this.value)) !== null) {
      output += urls[0];
      $("#result").html(output);
      if($("#post_text").val().trim()==""){
            if(Session.get("post_type")=="metadata_url"){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
            }
        };
 var urlRegex = /(https?:\/\/[^\s]+)/g;
 if(urlRegex.test($("#post_text").val())){

     fetch_meta_information_in_url(output);
 }
    }
  });
});

function fetch_meta_information_in_url(output){

 $("#loader_class").removeClass("div_hide_class");
      Meteor.call('fetch_url_information',output,function(error,result){
        if(error){
          // console.log("Error");
          swal(error);
        }else{

         if($("#post_text").val().trim()==""){
                   $("#url_metadata_div").addClass("div_hide_class");
                   $("#loader_class").addClass("div_hide_class");
                   Session.set("post_type","text");
                   return false;
        };

          if(Session.get("request_send")=="false"){
          $("#loader_class").addClass("div_hide_class");
          $("#url_metadata_div").removeClass("div_hide_class");
          Session.set("request_send","true");
          // console.log(JSON.stringify(result));
          var result_string=JSON.stringify(result);
          var title=JSON.parse(result_string);          
          if(result_string.includes("code")){
            swal("Sorry, Unable to fetch details!!!");
            return false;
          }
          if(title.image!=""){
            $("#metadata_info_image").attr("src",title.image);
            Session.set("metadata_image",title.image);
          }else{
            $("#metadata_info_image").attr("src","http://www.vayuz.com/logo.png");
            Session.set("metadata_image","http://www.vayuz.com/logo.png");
          }
            Session.set("metadata_url",title.url);
            var title1=title.title;
            if(title1.length>38){
            $("#metadata_info_heading").text(title1.substring(0,35));
            }else{
            $("#metadata_info_heading").text(title1);
            }

            $("#metadata_info_sub_heading").text(title.source);
            Session.set("post_type","metadata_url")
            Session.set("metadata_title",title.title);
            Session.set("metadata_source",title.source);  
          }
        }
      })
}


});

Template.feed_detail_page.helpers({

      user_cover_pic_display(){
      if(this.user_cover_pic){
        return this.user_cover_pic;
      }
      else{
        return '/img/top-header1.jpg';
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
        console.log(result[i]);

          if(count <= 5 && result[i].user_id != admin_id){
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
        var post_id = Session.get("show_post_id");
         Meteor.subscribe("fetch_feed_content_details", post_id);
         var check_limit = Session.get("set_feed_content_limit");


            var result = feed.find({post_id: post_id}).fetch();
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
         var post_id = Session.get("show_post_id");
         Meteor.subscribe("fetch_feed_content_details", post_id);     
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id}).fetch();
         // console.log('show result');
         // console.log(result);
         return result;
    },

    fetch_like_user_info(){
         var user_id = this.liked_by;
         var post_id = Session.get("show_post_id");
         Meteor.subscribe("fetch_feed_content_details", post_id);                
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id}).fetch();
         // console.log('show result');
         // console.log(result);
         return result;
    },


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

  total_liked_on_post(post_id){
            var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  

  },

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

  show_comment_count(){

    var result = feed.find({
                              "parent_id": this.post_id,
                              "post_type": "comment_lvl_0",
                              "comment_status": 1,
                      }).count();
    return result; 

  },

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

  show_users_liked_on_post(){
            var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },


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
                        var result = feed.find({
                                     parent_id: this.post_id,
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 }}).fetch();


       //   if(Session.get("load_lvl1_comments") == 0){
       //      var result = feed.find({
       //                               parent_id: this.post_id,
       //                               post_type: 'comment_lvl_0',
       //                               comment_status : 1,
       //                       },{$sort: {
       //                                created_at: 1 },limit: 3 }).fetch();

       //   }
       //   else{
       // var get_id = Session.get("get_comment_id_to_view_all");
       // var count = Session.get("load_lvl1_comments");

       //                  var result = feed.find({
       //                               parent_id: get_id,
       //                               post_type: 'comment_lvl_0',
       //                               comment_status : 1,
       //                       },{$sort: {
       //                                created_at: 1 },limit: count }).fetch();
       //      }
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

});

Template.feed_detail_page.events({

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
      // swal('captured');  
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
          $('#comment_lvl_1_'+this.comment_id).focus();
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
    swal('here i am');
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



function upload_post_image(e,template){
// swal('ok');
        if (e.currentTarget.files && e.currentTarget.files[0]) {
         var file = e.currentTarget.files[0];
          if (file) {
            var reader = new FileReader();
       var base64data="";
       reader.readAsDataURL(file);

       reader.onload = function () {
       // console.log(reader.result);
       base64data = reader.result;
       // console.log(base64data);

     Session.set("post_image_session",base64data);
     // swal(post_image_session);
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