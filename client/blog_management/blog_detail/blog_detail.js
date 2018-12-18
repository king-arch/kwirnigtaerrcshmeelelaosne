
import {
  Template
} from 'meteor/templating';

import {
  ReactiveVar
} from 'meteor/reactive-var';

import {
  Session
} from 'meteor/session';

import swal from 'sweetalert';
import { promotion } from './../../../import/collections/insert.js';
import { campaign_details } from './../../../import/collections/insert.js';
import { review_details } from './../../../import/collections/insert.js';
import { blog } from './../../../import/collections/insert.js';

import { book_details } from './../../../import/collections/insert.js';
import { notification_details } from './../../../import/collections/insert.js';
import { user_details } from './../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';

var book_listing;
var book_comment_listing;
var user_details_subscribe;
var campaign_details_subscribe;

Template.display_blog_detail.onDestroyed(function () {
  book_listing.stop();
  book_comment_listing.stop();
  user_details_subscribe.stop();
  campaign_details_subscribe.stop();
});

Template.display_blog_detail.onCreated(function eventlistOnCreated(){

});

Template.display_blog_detail.onRendered(function () {

  var url = window.location.href;
  var new_url = url.split("/");
  url = new_url[new_url.length - 1];
  var blog_id = Base64.decode(url);
  Session.set("get_blog_id",blog_id);

      setTimeout(function () {
        $('#loading_div').addClass('loader_visiblity_block');
      }, 2000);

    user_details_subscribe = Meteor.subscribe("fetch_user_details",Session.get("userId"));
    book_comment_listing = Meteor.subscribe("fetch_blog_comments_with_blog_id",blog_id);

    });

 Template.display_blog_detail.helpers({

    show_blog_details(){

      // console.log("show_detail here");
      var blog_id = Session.get("get_blog_id");
      // console.log(blog_id);
      Meteor.subscribe("fetch_blog_content_with_blog_id",blog_id);

      var result = blog.find({
                        blog_id: blog_id,
                      }).fetch();
      // console.log("show blog result: ");
      // console.log(result);
      return result;
    },

      show_users_liked_on_comment_lvl_1(){
            var result = blog.find({
                                     parent_id: this.comment_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },


    check_for_user_already_liked_on_comment_lvl_0(){
          var liked_by = Session.get("userId");
          Meteor.subscribe("fetch_blog_comments_like_lvl_0_with_comment_id",this.comment_id);
            var result = blog.find({
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
          Meteor.subscribe("fetch_blog_comments_like_lvl_1_with_comment_id",this.comment_id);
            var result = blog.find({
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

    display_lvl_1_commenting(){
         var logged_in_user = Session.get("userId");
         Meteor.subscribe("fetch_blog_comments_with_comment_id",this.comment_id);
         var result = blog.find({
                                     parent_id: this.comment_id,
                                     parent_post_type: 'Blog',
                                     post_type: 'comment_lvl_1',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: -1 
                                    } }).fetch();
         return result;
    },

    check_if_already_requested_for_review(){
      
      Meteor.subscribe("review_details_with_campaign_id",this.campaign_id);
      // console.log("show_detail here");
      
      var result = review_details.find({
                        parent_id: this.campaign_id,
                        content_type: "review_request",
                        review_request_by: Session.get("userId")
                      }).fetch();
      if(result[0]){
      // return result; 
      }

    },

    check_if_user_is_campaigner(){
      
      Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var result = campaign_details.find({campaign_id: this.campaign_id}).fetch();
      if(result[0]){
        if(result[0].campaigner_id == Session.get("userId")){
              return false;
        }else{
          return true;
        }
    }else{
      return true;
    }
    },

      temp_data(blog_description){
        Session.set("temp_data",blog_description);
      },


    check_if_campaign_expired(){
      
      Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var result = campaign_details.find({approval_status: 1,campaign_end_date: {$gte: Date.now()} }).fetch();
      if(result[0]){
        return true;
    }else{
      return false;
    }
    },

    show_review_details(){
      
      Meteor.subscribe("review_details_with_campaign_id",this.campaign_id);
      console.log("show_detail here");
      
      var result = review_details.find({
                        parent_id: this.campaign_id,
                        content_type: "submit_review",
                        approval_status: 1
                      }).fetch();
      if(result[0]){
        console.log("show_review_details");
        console.log(result);
      return result;
      }

    },

        show_user_details(){
          console.log(this.review_request_by);
          Meteor.subscribe("fetch_user_details",this.review_request_by);
          var result = user_details.find({"user_id": this.review_request_by}).fetch();
        console.log('show result: ');
        console.log(result);
        return result;
    },

        fetch_user_info(){
         var user_id = this.blog_author;  
         // console.log(user_id);            
         Meteor.subscribe("user_info_based_on_id",user_id);
         var result = user_details.find({user_id: user_id},{sort: {created_at: -1}}).fetch();
         // console.log('show author details');
         // console.log(result);
         return result;
    },

    blog_creation_date(){
      var new_year  = moment(this.created_at).format('YYYY');
      var new_month  = moment(this.created_at).format('MMM');
      var new_day  = moment(this.created_at).format('DD');
      // console.log("new_year: "+ new_year +" new_month: "+ new_month + " new_day: "+ new_day );
      var new_date = new_month + ' '+new_day+' , '+new_year;
      return new_date;
    },

    display_lvl_0_commenting(){
         var logged_in_user = Session.get("userId");
         // var blog_id = Session.get("get_blog_id");
         console.log(this.blog_id);
         console.log(logged_in_user);
                        var result = blog.find({
                                     parent_id: this.blog_id,
                                     parent_post_type: 'Blog',
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 }}).fetch();
console.log("comment list");
console.log(result);

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

          check_for_edited_comment(comment_id){
      // Meteor.subscribe("comment_based_comment_id",comment_id);
        var result = blog.find({ comment_id: comment_id }).fetch()
        if(result[0])
        {
          if(result[0].updated_at)
          {
          return true;
        }
      }
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

      total_liked_on_comment_lvl_0(comment_id){
          Meteor.subscribe("fetch_blog_comments_like_lvl_0_with_comment_id",comment_id);
            var result = blog.find({
                                     parent_id: comment_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  
  },

  comment_count_lvl_0(){
         var logged_in_user = Session.get("userId");
         // var blog_id = Session.get("get_blog_id");
         console.log(this.blog_id);
         console.log(logged_in_user);
                        var result = blog.find({
                                     parent_id: this.blog_id,
                                     parent_post_type: 'Blog',
                                     post_type: 'comment_lvl_0',
                                     comment_status : 1,
                             },{$sort: {
                                      created_at: 1 }}).count();
// console.log("comment list_new");
// console.log(result);
return result;
  },

  total_liked_on_comment_lvl_1(comment_id){
 Meteor.subscribe("fetch_blog_comments_like_lvl_1_with_comment_id",comment_id);
         
            var result = blog.find({
                                     parent_id: comment_id,
                                     post_type: 'like',
                                     like_status: 1,
                             }).count();
    return result;  
  },

    show_users_liked_on_comment_lvl_0(){
       Meteor.subscribe("fetch_blog_comments_like_lvl_1_with_comment_id",Session.get("show_comment_lvl_0_id"));

            var result = blog.find({
                                     parent_id: Session.get("show_comment_lvl_0_id"),
                                     post_type: 'like',
                                     like_status: 1,
                             }).fetch();
    return result;
  },

  show_users_liked_on_comment_lvl_1(){
       Meteor.subscribe("fetch_blog_comments_like_lvl_1_with_comment_id",Session.get("show_comment_lvl_1_id"));
            var result = blog.find({
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

});

Template.display_blog_detail.events({


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

    "click .go_to_write_review_page":function(){
          
            var parent_id = this.parent_id;
            var parent_id = Base64.encode(parent_id);
            
            var url = '/write_review/'+parent_id;
            console.log(url);
            window.location.href = url;
    },

    "click .apply_for_review":function(){
      // alert("apply now");
      var logged_in_user = Session.get("userId");
      var book_id = this.book_id;
      var campaign_id = this.campaign_id;

      var fetch_results = user_details.find({"user_id": logged_in_user}).fetch();

      campaign_details_subscribe = Meteor.subscribe("campaign_details_with_id",this.campaign_id);
      var fetch_campaign_details = campaign_details.find({campaign_id: this.campaign_id}).fetch();

if(fetch_campaign_details[0]){
  // alert('case 1');
  // alert('this');
  // console.log(this);
  if(fetch_campaign_details[0].delivery_option == "2"){

        user_location = "";

         Meteor.call('send_review_request',logged_in_user,book_id,campaign_id,user_location, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review is succesfully submited");
                window.location.reload();
              }
            });


  }else{

    user_location = fetch_results[0].user_location;
        swal('You have entered "'+user_location+'" as your postal address.'+
'If you want, You can change the postal adress from the edit information section of profile page.'+
' Make sure you have inserted your fully detailed address.'+
' If its not complete, we will reject your request as a reviewer.', {
        buttons: {
          cancel: "Cancel",
          catch: {
            text: "Sure",
            value: "catch",
          },
        },
      })
      .then((value) => {
        switch (value) {
          case "defeat":
            swal("Pikachu fainted! You gained 500 XP!");
            break;

          case "catch":
     Meteor.call('send_review_request',logged_in_user,book_id,campaign_id,user_location, function (error, result) {
              if (error) {
                console.log("Some error occured.");
              } else {
                swal("Review is succesfully submited");
                window.location.reload();
              }
            });
            break;
        }
      });


  }

}
    },


  'click .lvl_0_comment_submitted':function(event){
    // swal('cool');
      event.preventDefault();
      var blog_id = this.blog_id;

// swal(' blog_id '+blog_id+' & comment_text '+comment_text);

      var comment_text = $("#comment_lvl_0_"+blog_id).val();

             if(comment_text == null || comment_text == '')
              {
                $("#comment_lvl_0_"+blog_id).addClass('emptyfield2').focus();
                return false;
              }
              else
              {
                $("#comment_lvl_0_"+blog_id).removeClass('emptyfield2');
              }
// swal(' blog_id: '+blog_id+' & comment_text '+comment_text);
// return false;
    Meteor.call('submit_lvl_0_comment_for_blog',Session.get("userId"),blog_id,comment_text,function(error,result){
      if(error){
          swal("Error");
      }else{
        // console.log('successfully removed');
        $("#comment_lvl_0_"+blog_id).val("")
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
              // swal(parent_id+' & '+comment_text);
    Meteor.call('submit_lvl_1_comment_for_blog',Session.get("userId"),parent_id,comment_text,function(error,result){
        if(error){ 
            swal("Error"); 
        }else{ 
          // console.log('successfully removed');   
          swal('successfully replied');   
          $("#comment_lvl_1_"+comment_id).val("");  
          $('#reply_lvl0_'+comment_id).addClass("loader_visiblity_block");
        }  
    });  
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

});

function handle_like_comment_lvl_0_event(comment_id)
{
  var liked_by = Session.get("userId");
  Meteor.call('update_blog_like_comment_lvl_0',comment_id,liked_by, function(error,result){
              if(error){
                    swal('shhh');
                }else{
                    // console.log('hub post sucessfully liked');
                    }
              });
}
