

import { Meteor } from 'meteor/meteor';

import { feed } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { book_collections } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';

import { book_details } from './../import/collections/insert.js';
import { UserInfo } from './../import/collections/insert.js';
import { campaign_details } from './../import/collections/insert.js';

import { Base64 } from 'meteor/ostrio:base64';
import urlMetadata from 'url-metadata';

     Meteor.publish('book_collections_all_with_user_id', function(user_id){
      return  book_collections.find({added_by: user_id});
    });

     Meteor.publish('book_collections_all_with_user_id_optimized', function(logged_in_user,limit,new_sort_order){
      return book_collections.find({added_by: logged_in_user,adding_status: {$ne: 0} },{limit: limit,sort: {created_at: new_sort_order}});
    });

     Meteor.publish('fetch_book_listing', function() {
      return book_details.find({});
    });

     Meteor.publish('fetch_book_listing_optimized', function(limit,new_sort_order) {
      return book_details.find({},{
                                    limit: limit,
                                    sort: {
                                            created_at: new_sort_order,
                                          },
                                    fields: {
                                      book_id: 1,
                                      book_name: 1,
                                      book_catagries: 1,
                                      book_cover: 1,
                                      editors_pick_status: 1,
                                      author_name: 1,
                                      created_at: 1,
                                    }
                                  });
    });

     Meteor.publish('fetch_book_for_slider', function() {
      return book_details.find({},{ limit: 10, fields: { book_id: 1,book_name: 1,book_cover: 1 ,created_at: 1 } });
    });

     Meteor.publish('fetch_book_listing_with_limit', function(limit) {
      return book_details.find({},{limit: limit ,sort: {created_at: -1}});
    });

     Meteor.publish('fetch_book_listing_with_search_string', function(search_text) {
      const query = new RegExp(search_text,'i');  
      return book_details.find({book_name: query});
    });

Meteor.methods({
 
 add_to_my_collections(logged_in_user,book_id,adding_status,adding_id){
   console.log(logged_in_user +' & '+book_id+' & '+adding_status+' & '+adding_id);
   var check_if_already_added =  book_collections.find({"added_book_id": book_id,added_by: logged_in_user}).fetch();
    if(check_if_already_added[0]){

              var result =  book_collections.update({
                  _id: check_if_already_added[0]._id,
                },{
                  $set: {
                          "adding_status": adding_status,
                          "update_at": Date.now(),
                        }
                });
          return result;
    }else{
                var result =  book_collections.insert({
                          "adding_id": adding_id,
                          "added_book_id": book_id,
                          "added_by": logged_in_user,
                          "adding_status": adding_status,
                          "created_at": Date.now(),
                });
          return result;
    }
  },


 
 fetch_all_book_count(){
    var result = book_details.find({}).count();
    console.log("fetch all books count: ");
    console.log(result);
    return result;
  },
 
 fetch_up_for_review_book_count(){
    var result = book_details.find({}).fetch();
    var up_for_review_count = 0;
        if(result[0]){
          for( var i = 0; i < result.length ; i++ ){
            var result_2 = campaign_details.find({book_id: result[i].book_id}).count();
              if(result_2 > 0){
                  up_for_review_count = up_for_review_count + 1;
              }
            } 
        }
      console.log("up_for_review_count: ");
      console.log(up_for_review_count);
      return up_for_review_count;
  },
 
 fetch_editors_pic_count(){
    var result = book_details.find({}).fetch();
    var editors_pick_status_count = 0;
        if(result[0]){

          for( var i = 0; i < result.length ; i++ ){
              if(result[i].editors_pick_status == 1){
                  editors_pick_status_count = editors_pick_status_count + 1;
              }
            } 
        }
      console.log("editors_pick_status_count: ");
      console.log(editors_pick_status_count);
      return editors_pick_status_count;
  },
 
 fetch_all_book_in_my_collections_count(logged_in_user,limit,new_sort_order){

      var result = book_collections.find({added_by: logged_in_user,adding_status: {$ne: 0} },{limit: limit,sort: {created_at: new_sort_order}}).count();

      console.log("fetch_all_book_in_my_collections_count: ");
      console.log(result);
      return result;
  },

});