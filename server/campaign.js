
// import { UserInfo } from './../import/collections/insert.js';

import { feed } from './../import/collections/insert.js';
import { following_list } from './../import/collections/insert.js';
import { notification_details } from './../import/collections/insert.js';
import { campaign_details } from './../import/collections/insert.js';

import { user_details } from './../import/collections/insert.js';
import { general_records } from './../import/collections/insert.js';
import { review_details } from './../import/collections/insert.js';
import { content } from './../import/collections/insert.js';

import { book_details } from './../import/collections/insert.js';

import { Meteor } from 'meteor/meteor';
import { Base64 } from 'meteor/ostrio:base64';
// import urlMetadata from 'url-metadata';


     Meteor.publish('campaign_details_all_list', function() {
      return  campaign_details.find({});
    });


     Meteor.publish('campaign_details_all_active', function() {
      return  campaign_details.find({approval_status: 1,campaign_end_date: {$gte: Date.now()} });
      
    });

     Meteor.publish('campaign_details_with_id', function(campaign_id) {
      return  campaign_details.find({campaign_id: campaign_id});
    });

     Meteor.publish('get_campaign_count', function(campaign_id) {
      return  general_records.find({"record_type": "campaign_count"});
    });


Meteor.methods({


   save_campaign_details_for_admin:function(select_package,book_name,book_summary,author_name,
        author_description,amazon_link,delivery_option,additional_information,book_price,
        book_catagries,book_cover,final_payment,logged_in_user){

      var campaign_start_date = Date.now();
      var campaign_end_date = moment(campaign_start_date).add(select_package, 'day');
      campaign_end_date = moment(campaign_end_date).valueOf();


console.log(select_package+book_name+book_summary+author_name+author_description+amazon_link+delivery_option+additional_information+book_price+book_catagries+final_payment);
   var campaign_id = 'campaign_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result = campaign_details.insert({

                      campaign_id: campaign_id,
                      campaigner_id: logged_in_user,
                      select_package: select_package,
                      book_name: book_name,
                      book_summary: book_summary,

                      author_name: author_name,
                      author_description: author_description,
                      amazon_link: amazon_link,

                      delivery_option: delivery_option,
                      additional_information: additional_information,
                      book_price: book_price,
                      book_cover: book_cover,
                      final_payment: final_payment,
                      book_catagries: book_catagries,
                      approval_status: 1,
                      payment_status: 1,

                      status_changed_by: logged_in_user,

                      campaign_end_date: campaign_end_date,
                      campaign_start_date: campaign_start_date,

                      created_at: campaign_start_date,
      });
                   return result;
},

    save_campaign_details:function(select_package,book_name,book_summary,author_name,
        author_description,amazon_link,delivery_option,additional_information,book_price,
        book_catagries,book_cover,final_payment,logged_in_user){ 

console.log(select_package+book_name+book_summary+author_name+author_description+amazon_link+delivery_option+additional_information+book_price+book_catagries+final_payment);
   var campaign_id = 'campaign_id_'+Math.floor((Math.random() * 2465789) + 1);

                   var result = campaign_details.insert({

                      campaign_id: campaign_id,
                      campaigner_id: logged_in_user,
                      select_package: select_package,
                      book_name: book_name,
                      book_summary: book_summary,

                      author_name: author_name,
                      author_description: author_description,
                      amazon_link: amazon_link,

                      delivery_option: delivery_option,
                      additional_information: additional_information,
                      book_price: book_price, 
                      book_cover: book_cover,

                      final_payment: final_payment,
                      payment_status: 0,
                      book_catagries: book_catagries,
                      approval_status: 0,
                      created_at: Date.now()
      });

    var notification_text = 'Recived a request on campaign of book : "'+check_for_campaign_id+'"';
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: 'writersmelon',
                      campaign_id: campaign_id,
                      review_id: review_id,
                      notification_status: 0,
                      notification_type: "campaign_request",
                      created_at: Date.now()
      });

                   return campaign_id;
},

   payment_campaign_status_with_payment_details:function(payment_id,payment_status,payment_request_id,campaign_id){

      console.log(payment_id+ ' & '+payment_status+ ' & '+payment_request_id+ ' & '+campaign_id);
      
          var check_status =  campaign_details.find({campaign_id: campaign_id}).fetch();
          if(check_status[0]){
          if(check_status[0].payment_status == 0){

                   var result =  campaign_details.update({
                                campaign_id: check_status[0].campaign_id,
                              }, {
                                $set: {
                                  "payment_id": payment_id,
                                  "payment_status": payment_status,
                                  "payment_request_id": payment_request_id,
                                  "payment_status": 1,

                                  "updated_at": Date.now()
                                } 
                              }); 
                   return result;
                }
                }
      },


async make_campaign_payment(final_payment,phone,logged_in_user){

  console.log(final_payment+ ' & ' +phone+ ' & ' +logged_in_user);
  var result = user_details.find({ user_id: logged_in_user }).fetch();

  if(result[0]){
   var user_name = result[0].user_name;
   var user_email = result[0].user_email;
  }

  var purpose = 'Campaign Payment';
  var amount = final_payment;
  var buyer_name = user_name;

  var send_sms;
  var email = user_email;
  
  console.log(purpose+ ' & ' +amount+ ' & ' +phone+ ' & ' +buyer_name+ ' & ' +email);
  var result = await make_payment_for_campaign(purpose,amount,phone,buyer_name,email);
  console.log('returned results');
  console.log(result);
  return result;

},


  send_review_request(logged_in_user,book_id,campaign_id,user_location){
    console.log(logged_in_user+' & '+book_id+ ' & '+campaign_id+ ' & '+user_location);

   var check_for_campaign_id = campaign_details.find({book_id: book_id}).fetch();
   if(check_for_campaign_id[0]){

   var review_id = 'review_id_'+Math.floor((Math.random() * 2465789) + 1);
   var result = review_details.insert({
      "review_id": review_id,
      "content_type": "review_request",
      "parent_id": campaign_id,
      "approval_status": 0,
      "user_location": user_location,
      "review_request_by": logged_in_user,
      "created_at": Date.now(),
    });

             var notification_text = 'Recived a request on campaign of book : "'+check_for_campaign_id+'"';
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: 'writersmelon',
                      campaign_id: campaign_id,
                      review_id: review_id,
                      book_id: book_id,
                       notification_status: 0,
                      notification_type: "review_request_submitted",
                      created_at: Date.now()
      });
      return result;
   }
  },

   update_review_request_status(logged_in_user, approval_status,review_id){
   console.log(logged_in_user+' & '+approval_status+ ' & '+review_id);

          var check_status =  review_details.find({review_id: review_id}).fetch();

if(approval_status == 1){

          var result =  review_details.update({
              _id: check_status[0]._id,
            }, {
              $set: {
                      "approval_status": 1,
                      "review_approved_by": logged_in_user,
                      "update_at": Date.now(),
                    }
            });

             var notification_text = "Congrats! Your request for book review got approved";
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].review_request_by,
                      campaign_id: check_status[0].parent_id,
                      review_id: review_id,
                      notification_status: 0,
                      notification_type: "review_request_accepted",
                      created_at: Date.now()
      });

          var check_delivery_option =  campaign_details.find({ campaign_id: check_status[0].parent_id }).fetch();
          if(check_status[0]){
              if(check_delivery_option[0].delivery_option == 1){
                console.log("delivery_option");
                console.log(check_delivery_option[0].delivery_option );

                var user_id = check_status[0].review_request_by;
                var book_name = check_delivery_option[0].book_name;

                 send_email_to_reviewer_about_book_delivery_option_1(user_id,book_name);
              }
              else if(check_delivery_option[0].delivery_option == 2){
                console.log("delivery_option");
                console.log(check_delivery_option[0].delivery_option );

                var user_id = check_status[0].review_request_by;
                var book_name = check_delivery_option[0].book_name;
                
                 send_email_to_reviewer_about_book_delivery_option_2(user_id,book_name);
              }
          }
      return result;
}

else if(approval_status == 2){
          var result =  review_details.update({
              _id: check_status[0]._id,
            }, {
              $set: {
                      "approval_status": 2,
                      "review_approved_by": logged_in_user,
                      "update_at": Date.now(),
                    }
            });

             var notification_text = "Your request for campaign reviewing got rejected!";
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].review_request_by,
                      campaign_id: check_status[0].parent_id,
                      review_id: review_id,
                      notification_status: 0,
                      notification_type: "review_request_rejected",
                      created_at: Date.now()
      });
      return result;
}
  },

update_review_submition_status(logged_in_user, approval_status,review_id){

   console.log(logged_in_user+' & '+approval_status+ ' & '+review_id);
   var check_status =  review_details.find({review_id: review_id}).fetch();

if(approval_status == 1){
            var result =  review_details.update({
              _id: check_status[0]._id,
            }, {
              $set: {
                      "approval_status": 1,
                      "review_approved_by": logged_in_user,
                      "update_at": Date.now(),
                    }
            });

             var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].review_request_by,
                      campaign_id: check_status[0].parent_id,
                      review_id: review_id,

                       notification_status: 0,
                      notification_type: "review_status_approved",
                      created_at: Date.now()
      });

}else if(approval_status == 2){

            var result =  review_details.update({
              _id: check_status[0]._id,
            }, {
              $set: {
                      "approval_status": 2,
                      "review_approved_by": logged_in_user,
                      "update_at": Date.now(),
                    }
            });

             var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].review_request_by,
                      campaign_id: check_status[0].parent_id,
                      review_id: review_id,

                      notification_status: 0,
                      notification_type: "review_status_rejected",
                      created_at: Date.now()
      });

}


  },

 submit_review(logged_in_user, review_text,good_reads_link,personal_blog_link,amazon_link,additional_text,campaign_id){
   console.log(logged_in_user+' & '+review_text+ ' & '+good_reads_link+ ' & '+personal_blog_link +' & '+amazon_link +' & '+campaign_id);

            var check_status4 =  review_details.find({"content_type": "review_request","parent_id": campaign_id,"approval_status": 1}).fetch();

if(check_status4[0]){

          var result =  review_details.update({
              _id: check_status4[0]._id,
            }, {
              $set: {
                      "approval_status": 3,
                      "review_approved_by": logged_in_user,
                      "update_at": Date.now(),
                    }
            });
}

   var review_id = 'review_id_'+Math.floor((Math.random() * 2465789) + 1);

   var result = review_details.insert({
      "review_id": review_id,
      "content_type": "submit_review",
      "parent_id": campaign_id,
      "review_text": review_text,
      "approval_status": 0,

      "good_reads_link": good_reads_link,
      "personal_blog_link": personal_blog_link,
      "amazon_link": amazon_link,
      "additional_text": additional_text,

      "review_request_by": logged_in_user,
      "created_at": Date.now(),
    });

             var notification_text = "Someone submitted review on campaign "+campaign_id;
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,
                      notification_text: notification_text,

                      notification_by: logged_in_user,
                      notification_to: 'writersmelon',
                      campaign_id: campaign_id,
                      review_id: review_id,

                       notification_status: 0,
                      notification_type: "submit_review",
                      created_at: Date.now()
      });

    var new_result = content.find({
      "content_type": "reward_points"
    }).fetch();

    var reward_value = new_result[0].review_submition;
    var reward_id = 'reward_id_'+Math.floor((Math.random() * 2465789) + 1);

    var latest_result = reward_details.insert({
    
          reward_id: reward_id,
          reward_value: reward_value,
          parent_id: review_id,
          entry_type: 'reward_point',
          reward_to: logged_in_user,
          reward_trigger_type: "review_submition",

          reward_redeem_status: 0,
          created_at: Date.now(),

      });

      return result;
  },


  fetch_book_detail_from_campaign(campaign_id){
      var result = campaign_details.find({ "campaign_id": campaign_id }).fetch();
      return result;
  },


    update_campaigning_status:function(logged_in_user, approval_status,campaign_id){

      console.log(logged_in_user+' & '+ approval_status+' & '+campaign_id);
          var check_status =  campaign_details.find({campaign_id: campaign_id}).fetch();
          if(check_status[0]){

      var campaign_end_date = moment(check_status[0].campaign_start_date).add(check_status[0].select_package, 'day');
            campaign_end_date = moment(campaign_end_date).valueOf();
          if(approval_status == 1){

      var fetch_book_details = book_details.find({
                        book_name: check_status[0].book_name,
                      }).fetch();

                   var result =  campaign_details.update({
                                campaign_id: check_status[0].campaign_id,
                              }, {
                                $set: {
                                  "book_id": fetch_book_details[0].book_id,
                                  "approval_status": approval_status,
                                  "status_changed_by": logged_in_user,

                                  "campaign_end_date": campaign_end_date,
                                  "campaign_start_date": Date.now()
                                } 
                              }); 

                   var result3 =  book_details.update({
                                book_id: fetch_book_details[0].book_id,
                              }, {
                                $set: {
                                  campaign_id: check_status[0].campaign_id,
                                  updated_at: Date.now()
                                }
                              }); 


          var notification_text = 'Your campaign of book: "'+check_status[0].book_name +'" was accepted and got started';
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].campaigner_id,
                      campaign_id: check_status[0].campaign_id,
                      notification_status: 0,
                      notification_type: "campaign_accepted",
                      created_at: Date.now()
      });
            return result;
          }
          else if(approval_status == 2){

                         var result =  campaign_details.update({
                                campaign_id: check_status[0].campaign_id,
                              }, {
                                $set: {
                                  "approval_status": approval_status,
                                  "status_changed_by": logged_in_user,

                                  "campaign_end_date": campaign_end_date,
                                  "campaign_start_date": Date.now()
                                }
                              }); 

                      var notification_text = 'Your campaign of book: "'+check_status[0].book_name +'" is rejected';
               var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].campaigner_id,
                      campaign_id: check_status[0].campaign_id,
                      notification_status: 0,
                      notification_type: "campaign_rejected",
                      created_at: Date.now()
      });
             return result;
          }
          else if(approval_status == 3){
                         var result =  campaign_details.update({
                                campaign_id: check_status[0].campaign_id,
                              }, {
                                $set: {
                                  "approval_status": approval_status,
                                  "review_stopped_by": logged_in_user,

                                  "updated_at": Date.now()
                                }
                              }); 

  var notification_text = 'admin has stopped review submition for campaign of book: "'+check_status[0].book_name+'"';
  var notification_id = 'notification_id_'+Math.floor((Math.random() * 2465789) + 1);
                   
                   var result2 = notification_details.insert({

                      notification_id: notification_id,

                      notification_by: logged_in_user,
                      notification_to: check_status[0].campaigner_id,
                      campaign_id: check_status[0].campaign_id,
                      notification_type: "campaign_review_stopped",
                      notification_status: 0,
                      created_at: Date.now()
      });
             return result;
          }

        }

      },

});