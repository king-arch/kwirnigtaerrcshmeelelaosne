
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
import { promotion } from './../../../../import/collections/insert.js';
import { campaign_details } from './../../../../import/collections/insert.js';
import { interest_list } from './../../../../import/collections/insert.js';
import { Base64 } from 'meteor/ostrio:base64';
var book_listing;

Template.create_campaign_detail_admin.onDestroyed(function () {
  book_listing.stop();
});

Template.create_campaign_detail_admin.onCreated(function eventlistOnCreated(){

});

Template.create_campaign_detail_admin.onRendered(function () {
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.19/js/jquery.dataTables.min.js",function(){
      // $.getScript("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css",function(){
            $('#show_promotion_listing').DataTable();
    // });  
    });  

$(".show_packages").addClass("loader_visiblity_block");

  setTimeout(function () {
    $('#loading_div').addClass('loader_visiblity_block');
  }, 2000);
});

 Template.create_campaign_detail_admin.helpers({

    show_dates(){
      var array = new Array;
      for(var i=1;i<32;i++){
        array.push({'index': i});
      }
      console.log('here we are: ');
      console.log(array);
      return array;
    },

    import_catagries(){
      Meteor.subscribe("fetch_result_interest");
      Meteor.subscribe("campaign_details_all_list");
      var result = interest_list.find({}).fetch();
      return result;
    },

        book_cover(){
      if(Session.get("book_cover_session")){
      var user_cover = Session.get("book_cover_session");
      return user_cover;
    }else{
      return "/img/last-phot13-large.jpg";
    }
    },


});


Template.create_campaign_detail_admin.events({

    "click #create_promotion":function(){
        Router.go("/create_promotion");
    },

    "change #book_cover":function(e, template){
      upload_cover_pic(e, template);
  },

    // "change #delivery_option":function(){
    //   var delivery_option = $("#delivery_option").val();
    //     if(delivery_option == 2){
    //       $("#display_book_price_box").removeClass("loader_visiblity_block");
    //     }else{
    //       $("#display_book_price_box").addClass("loader_visiblity_block");
    //     }
    // },

    "change #select_package":function(){
      
    var select_package = $("#select_package").val();
    if(select_package == 15){
      // swal('case 15');
      $('#show_package_with_days_15').removeClass('loader_visiblity_block');

      $('#show_package_with_days_30').addClass('loader_visiblity_block');
      $('#show_package_with_days_45').addClass('loader_visiblity_block');
      $('#show_package_with_days_60').addClass('loader_visiblity_block');
      $('#show_package_with_days_90').addClass('loader_visiblity_block');
    }
      else if(select_package == 30){
      // swal('case 30');
      $('#show_package_with_days_30').removeClass('loader_visiblity_block');

      $('#show_package_with_days_15').addClass('loader_visiblity_block');
      $('#show_package_with_days_45').addClass('loader_visiblity_block');
      $('#show_package_with_days_60').addClass('loader_visiblity_block');
      $('#show_package_with_days_90').addClass('loader_visiblity_block');

    }
      else if(select_package == 45){
      // swal('case 45');
      $('#show_package_with_days_45').removeClass('loader_visiblity_block');

      $('#show_package_with_days_15').addClass('loader_visiblity_block');
      $('#show_package_with_days_30').addClass('loader_visiblity_block');
      $('#show_package_with_days_60').addClass('loader_visiblity_block');
      $('#show_package_with_days_90').addClass('loader_visiblity_block');

    }
      else if(select_package == 60){
      // swal('case 60');
      $('#show_package_with_days_60').removeClass('loader_visiblity_block');

      $('#show_package_with_days_15').addClass('loader_visiblity_block');
      $('#show_package_with_days_30').addClass('loader_visiblity_block');
      $('#show_package_with_days_45').addClass('loader_visiblity_block');
      $('#show_package_with_days_90').addClass('loader_visiblity_block');

    }
      else if(select_package == 90){
      // swal('case 90');
      $('#show_package_with_days_90').removeClass('loader_visiblity_block');

      $('#show_package_with_days_15').addClass('loader_visiblity_block');
      $('#show_package_with_days_30').addClass('loader_visiblity_block');
      $('#show_package_with_days_45').addClass('loader_visiblity_block');
      $('#show_package_with_days_60').addClass('loader_visiblity_block');

    }
      else{
      // swal("Empty selection");
      $('#show_package_with_days_15').addClass('loader_visiblity_block');
      $('#show_package_with_days_30').addClass('loader_visiblity_block');
      $('#show_package_with_days_45').addClass('loader_visiblity_block');
      $('#show_package_with_days_60').addClass('loader_visiblity_block');
      $('#show_package_with_days_90').addClass('loader_visiblity_block');

    }
  },

      "click #submit_campaign_form":function(){

        var select_package = $("#select_package").val();
        var book_name = $("#book_name").val();
        var book_summary = $("#book_summary").val();
        var author_name = $("#author_name").val();

        var author_description = $("#author_description").val();
        var amazon_link = $("#amazon_link").val();
        var delivery_option = $("#delivery_option").val();
        var additional_information = $("#additional_information").val();

        var book_price = $("#book_price").val();
        var book_catagries = $("#book_catagries").val();
        var book_cover = $("#book_cover").val();

       if (select_package == '' || select_package == undefined) {
         $('#select_package').addClass('empty_field').focus();
        return false;
       } else {
         $('#select_package').removeClass('empty_field').blur();
       }

       if (book_name == '' || book_name == undefined) {
         $('#book_name').addClass('empty_field').focus();
        return false;
       } else {
         $('#book_name').removeClass('empty_field').blur();
       }

       if (book_summary == '' || book_summary == undefined) {
         $('#book_summary').addClass('empty_field').focus();
        return false;
       } else {
         $('#book_summary').removeClass('empty_field').blur();
       }

       if (book_catagries == '' || book_catagries == undefined) {
         $('#book_catagries').addClass('empty_field').focus();
        return false;
       } else {
         $('#book_catagries').removeClass('empty_field').blur();
       }

       if (author_name == '' || author_name == undefined) {
         $('#author_name').addClass('empty_field').focus();
        return false;
       } else {
         $('#author_name').removeClass('empty_field').blur();
       }

       if (author_description == '' || author_description == undefined) {
         $('#author_description').addClass('empty_field').focus();
        return false;
       } else {
         $('#author_description').removeClass('empty_field').blur();
       }

       
       if (amazon_link == '' || amazon_link == undefined) {
         $('#amazon_link').addClass('empty_field').focus();
        return false;
       } else {
         $('#amazon_link').removeClass('empty_field').blur();
       }

            if (book_price == '' || book_price == undefined) {

             $('#book_price').addClass('empty_field').focus();
             return false;

           } else {
             $('#book_price').removeClass('empty_field').blur();
           }


       if (delivery_option == '' || delivery_option == undefined) {
         $('#delivery_option').addClass('empty_field').focus();
        return false;
       } else {
         $('#delivery_option').removeClass('empty_field').blur();
       }

       if (Session.get("book_cover_session")){
         var book_cover = Session.get("book_cover_session");
       } else {
         $('#book_cover').removeClass('empty_field').blur();
        return false;
       }


       // if(delivery_option == 2){
       //  var book_price = $("#book_price").val();

       //      if (book_price == '' || book_price == undefined) {

       //       $('#book_price').addClass('empty_field').focus();
       //       return false;

       //     } else {
       //       $('#book_price').removeClass('empty_field').blur();
       //     }
       // }

       if (additional_information == '' || additional_information == undefined) {
         var additional_information = '';
       }
console.log("show text");
       console.log("select_package "+select_package+" & book_name "+book_name+
        " &  author_name "+author_name+" &  author_description "+author_description+
        " &  delivery_option "+delivery_option+
        " &  amazon_link "+amazon_link);
swal("show text");
       swal("select_package "+select_package+" & book_name "+book_name+
        " &  author_name "+author_name+" &  author_description "+author_description+
        " &  delivery_option "+delivery_option+
        " &  amazon_link "+amazon_link);

        if(delivery_option == 1){
                
                console.log("case 1");
                if(select_package == 15){

                 var package_value = 7500;

                }
                else if(select_package == 30){
                var package_value = 15000;

                }
                else if(select_package == 45){
                 var package_value = 30000;


                }
                else if(select_package == 60){
                 var package_value = 45000;


                }
                else if(select_package == 90){
                 var package_value = 60000;
                }
console.log("case 1.1");
          var computing_formula = package_value + (package_value*(18/100) );
        }
        else if(delivery_option == 2){
        
        console.log("case 2");
        if(select_package == 15){
         var review_count = 5;
         var package_value = 7500;

        }
        else if(select_package == 30){
         var review_count = 10;
         var package_value = 15000;

        }
        else if(select_package == 45){
         var review_count = 20;
         var package_value = 30000;

        }
        else if(select_package == 60){
                   var review_count = 30;
        var package_value = 45000;

        }
        else if(select_package == 90){
                   var review_count = 60;
         var package_value = 60000;
        }

        var net_book_price = parseInt(book_price)+60;

        console.log("case 2.1");
        console.log(package_value);
        console.log(package_value*(18/100));
        console.log(package_value*(10/100));

        console.log(review_count);
        console.log(net_book_price);
        console.log(review_count*net_book_price);

        var computing_formula = package_value + package_value*(18/100)  + review_count*net_book_price + package_value*(10/100);
        console.log("package_value + package_value*(18/100)  + review_count*net_book_price: | "+package_value +'+'+ package_value +'*'+'(18 '+'/'+'100)' +'+'+ review_count +'*'+net_book_price+'+'+ package_value +'*'+'(10 '+'/'+'100)');
       }

console.log("Payable amount: "+computing_formula);
swal("Payable amount: "+computing_formula + ' | ' +'package_value '+package_value+' | GST '+package_value*(18/100) + ' | ');
var final_payment = computing_formula;
console.log("just above");

 var logged_in_user = Session.get("userId");
      Meteor.call('save_campaign_details_for_admin',select_package,book_name,book_summary,author_name,author_description,amazon_link,delivery_option,additional_information,book_price,book_catagries,book_cover,final_payment,logged_in_user,function (error, result) {
      if (error) {
        swal('Some error occured!');

      } else {
       
            swal('Campign request successfully sent. ');
            window.location.href= '/campaign_listing_admin';
        }
    });
window.location.href= '/campaign_listing_admin';
   },


});



function upload_cover_pic(e,template){

        if (e.currentTarget.files && e.currentTarget.files[0]) {
         var file = e.currentTarget.files[0];
          if (file) {
            var reader = new FileReader();
       var base64data="";
       reader.readAsDataURL(file);
       reader.onload = function () {
       console.log(reader.result);
       base64data = reader.result;
       console.log(base64data);

     Session.set("book_cover_session",base64data);

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