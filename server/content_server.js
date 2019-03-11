

import { Meteor } from 'meteor/meteor';
import { feed } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { book_collections } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';

import { book_details } from './../import/collections/insert.js';
import { UserInfo } from './../import/collections/insert.js';
import { campaign_details } from './../import/collections/insert.js';
import { blog } from './../import/collections/insert.js';

import { user_details } from './../import/collections/insert.js';
import { content } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';


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

     Meteor.publish('show_about_us', function() {
      return  content.find({content_type: "about_us"});
    });

Meteor.methods({
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

       display_about_us: function(){
          var result = content.find({content_type: "about_us"}).fetch();
          return result;
       },

       update_about_us: function(about_us)
      { 
          var newUser = content.find({content_type: "about_us"}).fetch();
          if(newUser[0]){
          var result =  content.update({
              _id: newUser[0]._id,
            }, {
              $set: {
                      about_us_text: about_us,
                      updated_at: Date.now(),
                    }
            });
          }
      else{
        var content_id = 'content_id_'+Math.floor((Math.random() * 2465789) + 1);
       
                    var result = content.insert({
                      content_id: content_id,
                      content_type: "about_us",
                      about_us_text: about_us,
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

});