
import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session'


this.setTitle = function(title) {

// if(Session.get("userId") == null || Session.get("userId") == ""){
//   Router.go('/');  
//   return false;
// }

  var base;
  base = "Writersmelon";
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }
};

Router.route('/profile',function () {
  if(Session.get("userId")!=""){
  this.render('profile');

}else{
  Router.go('/');  
}
},{
    onAfterAction: function() {
      return setTitle('Profile');
    }
  });

Router.route('/edit_profile',function () {
  if(Session.get("userId")!=""){
  this.render('edit_profile');

}else{
  Router.go('/');  
}
},{
    onAfterAction: function() {
      return setTitle('Edit Profile');
    }
  });

Router.configure({

    loadingTemplate: "loading",
    notFoundTemplate: "page_not_found"

});

Router.route('/view_profile/:user_id', 
function () {
   var  params = this.params; 
    var userId = params.user_id; 
    userId = Base64.decode(userId); 
  Session.setPersistent("show_connection",userId);  
  this.render('view_profile');
},{
    onAfterAction: function() {
      return setTitle('View Profile');
    }
  },
);

Router.route('/edit_book_details/:book_id', 
function () {
     var  params = this.params; 
  this.render('edit_book_details');
},{
    onAfterAction: function() {
      return setTitle('Edit book details');
    }
  },
);

Router.route('/edit_user_details/:user_id', 
function () {
     var  params = this.params; 
  this.render('edit_user_details');
},{
    onAfterAction: function() {
      return setTitle('Edit user details');
    }
  },
);

Router.route('/edit_promotion_details/:promotion_id', 
function () {
     var  params = this.params; 
  this.render('edit_promotion');
},{
    onAfterAction: function() {
      return setTitle('Edit Promotion details');
    }
  },
);

Router.route('/blog_detail/:blog_id', 
function () {
     var  params = this.params; 
  this.render('blog_detail');
},{
    onAfterAction: function() {
      return setTitle('Blog details');
    }
  },
);

Router.route('/edit_blog_details/:blog_id', 
function () {
     var  params = this.params; 
  this.render('edit_blog_admin');
},{
    onAfterAction: function() {
      return setTitle('Edit Blog details');
    }
  },
);

Router.route('/edit_interest/:interest_id', 
function () {
  var  params = this.params; 
  this.render('edit_interest');
},{
    onAfterAction: function() {
      return setTitle('Edit Interest details');   
    }
  },
);

Router.route('/feed', function () {
  this.render('feed');
},{
    onAfterAction: function() {
      return setTitle('Home');
    }
  });

Router.route('/create_interest', function () {
  this.render('create_interest');
},{
    onAfterAction: function() {
      return setTitle('Create Intrest');
    }
  });

Router.route('/header', function () {
  this.render('header');
},{
    onAfterAction: function() {
      return setTitle('feed');
    }
  });

Router.route('/email', function () {
  this.render('email');
},{
    onAfterAction: function() {
            var title = 'Email Confirmation';
  var base;
  base = "Writersmelon";
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }
  
      // return setTitle('Email Confirmation');
    }
  });

Router.route('/signup', function () {
  this.render('signup');
},{
    onAfterAction: function() {
      return setTitle('Sign up');
    }
  });

Router.route('/edit_terms', function () {
  this.render('edit_terms');
},{
    onAfterAction: function() {
      return setTitle('Edit Terms & Conditions');
    }
  });

Router.route('/edit_reward_policy', function () {
  this.render('edit_reward_policy');
},{
    onAfterAction: function() {
      return setTitle('Edit Reward Policy');
    }
  });

Router.route('/edit_privacy_policy', function () {
  this.render('edit_privacy_policy');
},{
    onAfterAction: function() {
      return setTitle('Edit Privacy Policy');
    }
  });

Router.route('/edit_cancellation_policy', function () {
  this.render('edit_cancellation_policy');
},{
    onAfterAction: function() {
      return setTitle('Edit Cancelation Policy');
    }
  });

Router.route('/edit_review_policy', function () {
  this.render('edit_review_policy');
},{
    onAfterAction: function() {
      return setTitle('Edit Review Policy');
    }
  });

Router.route('/edit_copyright_policy', function () {
  this.render('edit_copyright_policy');
},{
    onAfterAction: function() {
      return setTitle('Edit Copyright Policy');
    }
  });

Router.route('/edit_work_with_us', function () {
  this.render('edit_work_with_us');
},{
    onAfterAction: function() {
      return setTitle('Edit Edit Work With Us');
    }
  });


Router.route('/book_management', function () {
  this.render('book_management');
},{
    onAfterAction: function() {
      return setTitle('Book Management');
    }
  });


Router.route('/create_book', function () {
  this.render('create_book');
},{
    onAfterAction: function() {
      return setTitle('Create book');
    }
  });


Router.route('/create_user', function () {
  this.render('create_user');
},{
    onAfterAction: function() {
      return setTitle('Create user');
    }
  });

Router.route('/user_management', function () {
  this.render('user_management');
},{
    onAfterAction: function() {
      return setTitle('User management');
    }
  });

Router.route('/interest_management', function () {
  this.render('interest_management');
},{
    onAfterAction: function() {
      return setTitle('Interest management');
    }
  });



Router.route('/admin_settings', function () {
  this.render('admin_settings');
},{
    onAfterAction: function() {
      return setTitle('Admin settings');
    }
  });

Router.route('/content_listing', function () {
  this.render('content_listing');
},{
    onAfterAction: function() {
      return setTitle('Content listing');
    }
  });

Router.route('/point_management', function () {
  this.render('point_master');
},{
    onAfterAction: function() {
      return setTitle('Point master');
    }
  });

Router.route('/admin', function () {
  this.render('admin_login');
},{
    onAfterAction: function() {
      return setTitle('admin_login');
    }
  });

Router.route('/', function () {

// if(Session.get("email_status") == 1){
//   Router.go('/feed');  
//   return false;
// }

  this.render('index');
},{
    onAfterAction: function() {
      return setTitle('Home');
    }
  });

Router.route('/create_promotion', function () {
  this.render('create_ads');
},{
    onAfterAction: function() {
      return setTitle('Promotion Listing');
    }
  });

Router.route('/promotion_listing', function () {
  this.render('promotion_listing');
},{
    onAfterAction: function() {
      return setTitle('Promotion Listing');
    }
  });

Router.route('/report_analyze', function () {
  this.render('report_analyze');
},{
    onAfterAction: function() {
      return setTitle('Report Analyze');
    }
  });

Router.route('/blog_listing', function () {
  this.render('blog_listing');
},{
    onAfterAction: function() {
      return setTitle('Blog Listing');
    }
  });

Router.route('/blog_create', function () {
  this.render('blog_create');
},{
    onAfterAction: function() {
      return setTitle('Blog Create');
    }
  });


Router.route('/create_blog_admin', function () {
  this.render('create_blog_admin');
},{
    onAfterAction: function() {
      return setTitle('Create Blog Admin');
    }
  });


Router.route('/community', function () {
  this.render('community');
},{
    onAfterAction: function() {
      return setTitle('Blog Community');
    }
  });

Router.route('/my_collections', function () {
  this.render('my_collections');
},{
    onAfterAction: function() {
      return setTitle('My Collections');
    }
  });

Router.route('/blog_edit_draft', function () {
  this.render('blog_edit_draft');
},{
    onAfterAction: function() {
      return setTitle('Edit Blog Draft');
    }
  });

Router.route('/blog_listing_admin', function () {
  this.render('blog_listing_admin');
},{
    onAfterAction: function() {
      return setTitle('Blog Listing Admin');
    }
  });



Router.route('/forgot_password', function () {
  this.render('forgot_password');
},{
    onAfterAction: function() {

var title = 'Forgot Password';
  var base;
  base = "Writersmelon";
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }
    }
  });



Router.route('/change_forgot_password/:id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
    userId = Base64.decode(userId); 
  this.render('change_forgot_password');
},{
    onAfterAction: function() {
      // return setTitle('Change Forgot Password');

var title = 'Change Forgot Password';
  var base;
  base = "Writersmelon";
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }
  
    }
  });


Router.route('/activate_email/:id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
    userId = Base64.decode(userId); 
      // alert("decrypt" + userId);
  Session.set("makeUserActive","true");
  Session.setPersistent("userId",userId);
  this.render('email');

},{
    onAfterAction: function() {

      var title = 'Email Activation';
  var base;
  base = "Writersmelon";
  window.scrollTo(0,0);
  if (title) {
    return document.title = title + ' | ' + base;
  } else {
    return base;
  }

      // return setTitle('Email Activation');
    }
  });

Router.route('/feed_detail/:post_id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
  this.render('feed_detail');
},{
    onAfterAction: function() {
      return setTitle('Feed detail page');
    }
  });

Router.route('/privacy', function () {
  this.render('privacy');
},{
    onAfterAction: function() {
      return setTitle('Privacy');
    }
  });

Router.route('/book_listing', function () {
  this.render('book_listing');
},{
    onAfterAction: function() {
      return setTitle('Book Listing');
    }
  });

Router.route('/campaign_listing', function () {
  this.render('campaign_listing');
},{
    onAfterAction: function() {
      return setTitle('Campaign Listing');
    }
  });


Router.route('/user_settings', function () {
  this.render('user_settings');
},{
    onAfterAction: function() {
      return setTitle('User settings');
    }
  });

Router.route('/create_campaign', function () {
  this.render('create_campaign');
},{
    onAfterAction: function() {
      return setTitle('Create Campaign');
    }
  });

Router.route('/create_campaign_admin', function () {
  this.render('create_campaign_admin');
},{
    onAfterAction: function() {
      return setTitle('Create Campaign Admin');
    }
  });


Router.route('/campaign_listing_admin', function () {
  this.render('campaign_listing_admin');
},{
    onAfterAction: function() {
      return setTitle('Campaign Listing');
    }
  });


Router.route('/review_approval_listing', function () {
  this.render('review_approval_listing');
},{
    onAfterAction: function() {
      return setTitle('Review Approval listing');
    }
  });


Router.route('/invoice_management', function () {
  this.render('invoice_management');
},{
    onAfterAction: function() {
      return setTitle('Invoice Management listing');
    }
  });

Router.route('/reward_detail_page', function () {
  this.render('reward_detail_page');
},{
    onAfterAction: function() {
      return setTitle('Reward details');
    }
  });

Router.route('/admin_dashboard', function () {
  this.render('admin_dashboard');
},{
    onAfterAction: function() {
      return setTitle('Admin Dashboard');
    }
  });

Router.route('/reward_management', function () {
  this.render('reward_management');
},{
    onAfterAction: function() {
      return setTitle('Reward Management');
    }
  });

Router.route('/review_request_listing', function () {
  this.render('review_request_listing');
},{
    onAfterAction: function() {
      return setTitle('Review Request listing');
    }
  });

Router.route('/payment_status', function () {
  this.render('payment_status');
},{
    onAfterAction: function() {
      return setTitle('Payment Status');
    }
  });

Router.route('/contact_us', function () {
  this.render('contact_us');
},{
    onAfterAction: function() {
      return setTitle('Contact Us');
    }
  });

Router.route('/campaign_detail/:campaign_id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
  this.render('campaign_detail');
},{
    onAfterAction: function() {
      return setTitle('Campaign Detail');
    }
  });

Router.route('/search/:campaign_id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
  this.render('search_listing');
},{
    onAfterAction: function() {
      return setTitle('Search Listing');
    }
  });

Router.route('/book_create_campaign/:campaign_id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
  this.render('book_create_campaign');
},{
    onAfterAction: function() {
      return setTitle('Create Book Campaign');
    }
  });


Router.route('/book_detail/:book_id', function () {
  var  params = this.params; // { _id: "5" }
  var userId = params.id; // "5"
  this.render('book_detail');
},{
    onAfterAction: function() {
      return setTitle('Book detail');
    }
  });


Router.route('/write_review/:review_id', function () {
  var  params = this.params; 
  var userId = params.id; 
  this.render('write_review');
},{
    onAfterAction: function() {
      return setTitle('Write Review');
    }
  });

Router.route('/invoice_detail/:campaign_id', function () {
  var  params = this.params; 
  var userId = params.id; 
  this.render('invoice_detail');
},{
    onAfterAction: function() {
      return setTitle('Invoice Detail');
    }
  });


Router.route('/reviewer_details/:campaign_id', function () {
  var  params = this.params; 
  var userId = params.id; 
  this.render('reviewer_details');
},{
    onAfterAction: function() {
      return setTitle('Invoice Detail');
    }
  });
