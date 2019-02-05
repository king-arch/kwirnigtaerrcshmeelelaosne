

import { Meteor } from 'meteor/meteor';

import { feed } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';
import { UserInfo } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';


     Meteor.publish('follow_list_all', function() {
      return  following_list.find({});
    });

     Meteor.publish('follow_list_for_fetching_hub_content', function(user_id){
       return following_list.find({ follower: user_id , current_follow_status: 1 });
    });

      Meteor.publish('people_you_may_follow_listing', function(user_id,logged_in_user){

      console.log("fetch_people_you may now listing");
      console.log(user_id+ " & " +logged_in_user);

      var admin_id = "user_admin";
      var result = user_details.find({ user_id: {  $ne: logged_in_user  } }).fetch();
      var new_result = new Array();
      var count = 1;

      for(var i = 0; i < result.length; i++){

          if(count <= 5 && result[i].user_id != admin_id){
            var result2 = following_list.find({
                               $and: [{ "following": result[i].user_id },
                                      { "follower": logged_in_user },
                                      {current_follow_status: 1}
                                ]}).fetch();
             if(result2[0]){

             }else{
              new_result.push(result[i].user_id);
              count = count + 1;
             }    
          }

        }

      console.log("fetch_people_you may now listing");
      console.log(new_result);
      return user_details.find({ user_id: {  $in: new_result } });
   });

      Meteor.publish('get_follow_status_with_ids', function(user_id,logged_in_user) {
      return  following_list.find({following: user_id,follower: logged_in_user,current_follow_status: 1});     
    });


Meteor.methods({
 
});