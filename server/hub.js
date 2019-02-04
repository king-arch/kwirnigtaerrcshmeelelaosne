

import { Meteor } from 'meteor/meteor';

import { feed } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';
import { UserInfo } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';

     Meteor.publish('fetch_feed_content', function() {
      return  feed.find({});
    });

     Meteor.publish('fetch_feed_content_details', function(post_id){
      return  feed.find({post_id: post_id});
    });

     Meteor.publish('fetch_feed_post_dependencies', function(post_id){
      return  feed.find({parent_id: post_id});
    });

    Meteor.publish('fetch_feed_content_for_hub', function(user_id,check_limit) {

         var allFriends = following_list.find({ follower: user_id , current_follow_status: 1 }).fetch();
         var all_friends_array = new Array();
        
         for(var i=0;i<allFriends.length;i++){
              all_friends_array.push(allFriends[i].following);
         }

         all_friends_array.push(user_id);
  
         if(user_id != 'user_admin'){
         var include_admin = 'user_admin';
         all_friends_array.push(include_admin);
         }
         // console.log(all_friends_array);
         // console.log("here we are");
         return feed.find({$or: [{post_by: {$in: all_friends_array }},{post_by: 'writersmelon'}],post_status: 1},{sort: {created_at: -1},limit: check_limit});
    });


Meteor.methods({
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


             var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
 
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_by: logged_in_user,

                      notification_to: follow_user_id,

                      notification_status: 0,
                      notification_type: "Follow",
                      created_at: Date.now()
      });

          }

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


      var fetch_post_creator_for_feed = feed.find({
                                              post_id: post_id
                                  }).fetch();

if(liked_by != fetch_post_creator_for_feed[0].post_by){
var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_by: liked_by,
                      notification_to: fetch_post_creator_for_feed[0].post_by,
                      post_id: post_id,
                      like_id: like_id,

                      notification_status: 0,
                      notification_type: "feed_like",
                      created_at: Date.now()
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

      var fetch_post_creator_for_feed = feed.find({
                                              post_id: post_id
                                  }).fetch();

if(liked_by != fetch_post_creator_for_feed[0].post_by){
var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_by: liked_by,
                      notification_to: fetch_post_creator_for_feed[0].post_by,
                      post_id: post_id,
                      like_id: like_id,

                      notification_status: 0,
                      notification_type: "feed_like",
                      created_at: Date.now()
      });
}

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

});