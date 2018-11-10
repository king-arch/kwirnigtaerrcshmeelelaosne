
import { Base64 } from 'meteor/ostrio:base64';
import { Session } from 'meteor/session'

this.setTitle = function(title) {
  var base;
  base = "Writer's melon";
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


Router.route('/edit_blog_details/:blog_id', 
function () {
     var  params = this.params; 
  this.render('edit_blog');
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
      return setTitle('feed');
    }
  });

Router.route('/create_interest', function () {
  this.render('create_interest');
},{
    onAfterAction: function() {
      return setTitle('create_interest');
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
      return setTitle('Email | Writersmelon');
    }
  });
Router.route('/signup', function () {
  this.render('signup');
},{
    onAfterAction: function() {
      return setTitle('Sign up | Writersmelon');
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



// Router.route('/admin_login', function () {
//   this.render('admin_login');
// },{
//     onAfterAction: function() {
//       return setTitle('Admin login');
//     }
//   });


Router.route('/admin', function () {
  this.render('admin_login');
},{
    onAfterAction: function() {
      return setTitle('admin_login');
    }
  });

Router.route('/', function () {
  this.render('index');
},{
    onAfterAction: function() {
      return setTitle('Home | Writersmelon');
    }
  });

Router.route('/create_promotion', function () {
  this.render('create_ads');
},{
    onAfterAction: function() {
      return setTitle('Promotion Listing | Writersmelon');
    }
  });

Router.route('/promotion_listing', function () {
  this.render('promotion_listing');
},{
    onAfterAction: function() {
      return setTitle('Promotion Listing | Writersmelon');
    }
  });

Router.route('/blog_listing', function () {
  this.render('blog_listing');
},{
    onAfterAction: function() {
      return setTitle('Blog Listing | Writersmelon');
    }
  });

Router.route('/create_blog', function () {
  this.render('create_blog');
},{
    onAfterAction: function() {
      return setTitle('Create Listing | Writersmelon');
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
      return setTitle('Email Activation');
    }
  });