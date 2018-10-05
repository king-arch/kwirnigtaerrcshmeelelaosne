
import { Meteor } from 'meteor/meteor';
import { admin_details } from './../import/collections/insert.js';
import { book_details } from './../import/collections/insert.js';
import { user_details } from './../import/collections/insert.js';

     Meteor.publish('fetch_admin_details', function() {
      return admin_details.find({});
    });

     Meteor.publish('fetch_book_listing', function() {
      return book_details.find({});
    });


     Meteor.publish('fetch_user_listing', function() {
      return user_details.find({});
    });

     Meteor.publish('fetch_user_details', function(user_id) {
      return user_details.find({user_id: user_id});
    });


Meteor.startup(() => {
  // code to run on server at startup
});



Meteor.methods({

  Check_admin_login_auth(email,password){

    console.log(email + ' & ' + password);

    var result = admin_details.find({
      admin_email: email,
      admin_password: password
    }).fetch();
    console.log(result);

    // console.log('case 1');
    if (result[0]) {
      // console.log('case 1.1');
      var message = {
        "msg": 'Welcome back',
        "status": "1",
        "login_type": "admin",
        "active_user": result[0].user_id
      };
      console.log(message);
      return message;
    } else {
          // console.log('case 4');
          var message = {
            "msg": 'Wrong email or password',
            "status": "0"
          };
          console.log(message);
          return message;
        }
  },

  save_book_details(book_id, book_name, book_summary, book_catagries, author_name,
   author_description,amazon_link, book_cover, final_release_date,book_price){

   var result = book_details.insert({
      "book_id": book_id,
      "book_name": book_name,
      "book_summary": book_summary,
      "book_catagries": book_catagries,
      "author_name": author_name,
      "author_description": author_description,
      "amazon_link": amazon_link,
      "book_cover": book_cover,
      "book_price": book_price,
      "final_release_date": final_release_date,
      "created_at": Date.now(),
    });

      return result;
  },


  save_user_details(user_id, user_name, user_email,user_role, user_contact, interest, location, password,user_cover){
      var check_if_email_exist = user_details.find({user_email: user_email}).fetch();
if(check_if_email_exist[0]){
    var message = { "msg" : "email already exist" ,"response_status": 0 };
    return message;
}
else{

   var result = user_details.insert({
      "user_id": user_id,
      "user_name": user_name,
      "user_email": user_email,
      "user_role": user_role,
      "user_contact": user_contact,
      "user_interest": interest,
      "user_location": location,
      "user_password": password,
      "user_cover": user_cover,
      "user_status": 1,
      "created_at": Date.now(),
    });

   var message = { "msg" : result ,"response_status": 1 };
    return message;

}

  },


  edit_save_book_details(book_id, book_name, book_summary, book_catagries, author_name,
   author_description,amazon_link, book_cover, final_release_date,book_price){
    var check_if_exist = book_details.find({ book_id: book_id }).fetch();
if(check_if_exist[0]){
   var result = book_details.update({
        _id: check_if_exist[0]._id
    },
    {
    $set: {
      "book_id": book_id,
      "book_name": book_name,
      "book_summary": book_summary,
      "book_catagries": book_catagries,
      "author_name": author_name,
      "author_description": author_description,
      "amazon_link": amazon_link,
      "book_cover": book_cover,
      "book_price": book_price,
      "final_release_date": final_release_date,
      "updated_at": Date.now(),
      }
      
    });
}
      return result;
  },



  edit_save_user_details(user_id, user_name, user_email,user_role, user_contact, interest, location, password,user_cover){

    var check_if_exist = user_details.find({ user_id: user_id }).fetch();
if(check_if_exist[0]){
   var result = user_details.update({
        _id: check_if_exist[0]._id
    },
    {
    $set: {
      "user_id": user_id,
      "user_name": user_name,
      "user_email": user_email,
      "user_role": user_role,
      "user_contact": user_contact,
      "user_interest": interest,
      "user_location": location,
      "user_password": password,
      "user_cover": user_cover,
      "updated_at": Date.now(),
      }
    });
}
      return result;
  },

  fetch_book_details(book_id){

   var result = book_details.find({ "book_id": book_id }).fetch();
   return result;

  },

  fetch_user_details(user_id){

   var result = user_details.find({ "user_id": user_id }).fetch();
   return result;

  },

    "change_user_details_status": function (user_id, status) {
    console.log(user_id + ' & ' + status);
    var newUser = user_details.find({
      "user_id": user_id
    }).fetch();

    if (newUser[0]) {

      console.log(newUser[0]);
      var result = user_details.update({
        _id: newUser[0]._id,
      }, {
        $set: {
          user_status: status,
          updated_at: Date.now,
        }
      });
      return result;
    }
  },



});