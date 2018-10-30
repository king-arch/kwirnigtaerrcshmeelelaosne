
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import swal from 'sweetalert';

import { user_details }  from './../../import/collections/insert.js';
import { following_list }  from './../../import/collections/insert.js';
import { book_details }  from './../../import/collections/insert.js';
import { feed }  from './../../import/collections/insert.js';

// import { ServiceConfiguration } from 'meteor/service-configuration';

var all_feed;



Template.feed_design.onDestroyed(function(){
  all_feed.stop();
});

var tracker;

Template.feed_design.onRendered(function () {
   all_feed = Meteor.subscribe("fetch_feed_content");
});

Template.feed_design.helpers({

      user_cover_pic_display(){
      if(this.user_cover_pic){
        return this.user_cover_pic;
      }
      else{
        return 'img/top-header1.jpg';
      }
    },


	show_logged_in(){
		// console.log('mm');
		var user_id = Session.get("userId");
	  Meteor.subscribe("user_info_based_on_id",user_id);
      var result = user_details.find({ user_id: user_id }).fetch();
      // console.log('show logged in user detail');
      // console.log(result);
      return result;
	},

	    show_user_info(){
      var user_id = Session.get("userId");
      user_info_list_all = Meteor.subscribe("user_info_all");
      var result = user_details.find({user_id: {$ne: user_id} },{limit: 50}).fetch();
      // console.log('showing user list all');
      // console.log(result);
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
         var result = feed.find({post_by: {$in: all_friends_array },post_status: 1},{sort: {created_at: -1} }).fetch();
         // console.log('show result');
         // console.log(result);
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
      // alert(this.post_by+' '+logged_in_user);
      if(this.post_by == logged_in_user){
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
          // Meteor.subscribe('fetch_feed_content');
            var result = feed.find({
                                     parent_id: this.post_id,
                                     parent_post_type: 'post',
                                     liked_by: liked_by,
                                     post_type: 'like',
                             }).fetch();

          // var result = feed.find({
          //                            parent_id: this.post_id,
          //                            parent_post_type: 'post',
          //                            liked_by: liked_by,
          //                            post_type: 'like',
          //                    }).fetch();

            // console.log('like status');
            // console.log(result);
            // console.log(this.post_id);
            if(result[0].like_status > 0){
                return true;
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

  display_books(){
         var liked_by = Session.get("userId");

         Meteor.subscribe("fetch_book_listing");
         var result = book_details.find({}).fetch();

    console.log('show result: ');
    console.log(result);
    return result;
  },



});

Template.feed_design.events({
  'click .like_event':function(){
      // alert('inside like handle');
      // alert(this.post_id);
      handle_like_event(this.post_id);
    },

    'click .remove_post':function(event){
    var post_id = this.post_id;
    // alert(post_id);
    if(confirm("Sure, You want to remove this post ?")){
      Meteor.call('remove_post_from_feed',Session.get("userId"),post_id,function(error,result){
      if(error){
          alert("Error");
      }else{
        console.log('successfully removed');
      }
    });  
    }
    
  },


    'click .editHubPost':function(event){
      var post_id = this.post_id;
      // alert(post_id);
    $('#edit_post_text_'+post_id).removeClass("loader_visiblity_block");
    $('#post_text_'+post_id).addClass("loader_visiblity_block");
    
    $("#hidden_hub_post_"+ post_id).removeClass("loader_visiblity_block");
    $("#visible_hub_post_"+ post_id).addClass("loader_visiblity_block ");

    $("#show_less_"+post_id).addClass("loader_visiblity_block ");
    $("#show_more_"+post_id).addClass("loader_visiblity_block ");
  },


  'click .click_on_follow':function(){
    // alert('here');
    var follow_user_id = this.user_id; 
    var logged_in_user = Session.get("userId");  
    // alert('follow_user_id: '+follow_user_id+' logged_in_user: '+logged_in_user);

      Meteor.call('follow_people',follow_user_id,logged_in_user,function(error,result){
              if(error){
                alert("Some error occure.");
              }else{
                // console.log('successfully following ');
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

          Meteor.call('save_feed_post',post_text,logged_in_user,function(error,result){
              if(error){
                alert("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });

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
                alert("Some error occure.");
              }else{
                // console.log('successfully following ');
              }
          });

    $('#edit_post_text_'+this.post_id).addClass("loader_visiblity_block");
    $('#post_text_'+this.post_id).removeClass("loader_visiblity_block");
    
  },

});


function handle_like_event(post_id){
      // alert('inside handle function');    
      var liked_by = Session.get("userId");

      // var post_id=data.post_id;    
      // var check_ifliked_before = feed.find({post_id: post_id, post_by: post_by,post_type: 'like'}).fetch();     
      //   if(check_ifliked_before.length > 0){
      //     var post_id = check_ifliked_before[0].post_id;
      //        remove_like(post_id);
      //   }
      //   else{
      //         add_like(like_id);
      //       }

      add_like(post_id,liked_by);
}


function remove_like(like_id){
   Meteor.call('remove_blog_likes', function(error,result){
              if(error){
                    alert('error');
                }else{
                    // console.log('Like sucessfully removed');
                    }
              });
}

function add_like(post_id,liked_by)
{
  // alert(post_id+liked_by);
  Meteor.call('update_hub_like',post_id,liked_by, function(error,result){
              if(error){
                    alert('error');
                }else{
                    // console.log('hub post sucessfully liked');
                    }
              });
}
