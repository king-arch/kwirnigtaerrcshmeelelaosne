

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

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';

     Meteor.publish('fetch_blog_content', function() {
      return  blog.find({});
    });

      Meteor.publish('user_info_based_on_id_for_blog', function(user_id) {
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

     Meteor.publish('fetch_blog_content_with_optimization', function(limit) {
      return  blog.find({blog_status: 1},{limit: limit,sort: {created_at: -1}});
    });
     
     Meteor.publish('fetch_blog_content_for_slider', function() {
      return  blog.find({},{ limit: 10, fields: { blog_id: 1,blog_cover: 1,blog_title: 1 ,created_at: 1 } });
    });
     
     Meteor.publish('fetch_blog_comments_with_blog_id', function(blog_id) {
      return  blog.find({ parent_id: blog_id, parent_post_type: 'Blog'});
    });

     Meteor.publish('fetch_blog_comments_with_comment_id', function(comment_id) {
      return  blog.find({ parent_id: comment_id, post_type: 'like'});
    });

     Meteor.publish('fetch_blog_comments_like_lvl_0_with_comment_id', function(comment_id) {
      return  blog.find({ parent_id: comment_id, parent_post_type: 'Blog'});
    });

     Meteor.publish('fetch_blog_comments_like_lvl_1_with_comment_id', function(comment_id) {
      return  blog.find({ parent_id: comment_id, parent_post_type: 'comment_lvl_0'});
    });

     Meteor.publish('fetch_blog_content_with_blog_id', function(blog_id) {
      var v1 = blog.find({ "blog_id": blog_id }).fetch();
      console.log("new blog loggin subscription");

      console.log(blog_id);
      console.log(v1);
      
      return blog.find({ "blog_id": blog_id });
    });

Meteor.methods({
 
 fetch_all_blogs_listing_count(limit){
      console.log("here i am");
      console.log(limit);
      var result = blog.find({ blog_status: 1 },{limit: limit,sort: {created_at: -1} }).count();
      console.log("fetch_all_blogs_listing_count: ");
      console.log(result);
      return result;
  },

});