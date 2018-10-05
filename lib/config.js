
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

Router.route('/feed', function () {
  this.render('feed');
},{
    onAfterAction: function() {
      return setTitle('feed');
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



// Router.route('/admin_login', function () {
//   this.render('admin_login');
// },{
//     onAfterAction: function() {
//       return setTitle('Admin login');
//     }
//   });


Router.route('/', function () {
  this.render('admin_login');
},{
    onAfterAction: function() {
      return setTitle('admin_login');
    }
  });
