import { Mongo } from 'meteor/mongo';
                               
export const book_details = new Mongo.Collection('book_details');                                 
export const user_details = new Mongo.Collection('user_details'); 

export const categories_selection = new Mongo.Collection('categories_selection');                                 
export const following_list = new Mongo.Collection('following_list');                                 
export const interest_list = new Mongo.Collection('interest_list');  

export const feed = new Mongo.Collection('feed');                                 
export const promotion = new Mongo.Collection('promotion');                                 
export const blog = new Mongo.Collection('blog');                                 

