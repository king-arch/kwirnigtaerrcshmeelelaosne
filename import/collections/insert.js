
import { Mongo } from 'meteor/mongo';
                               
export const book_details = new Mongo.Collection('book_details');                                 
export const user_details = new Mongo.Collection('user_details'); 

export const categories_selection = new Mongo.Collection('categories_selection');                                 
export const following_list = new Mongo.Collection('following_list');                                 
export const interest_list = new Mongo.Collection('interest_list');  
export const campaign_details = new Mongo.Collection('campaign_details');  
export const review_details = new Mongo.Collection('review_details');  

export const feed = new Mongo.Collection('feed');                                 
export const promotion = new Mongo.Collection('promotion');                                 
export const content = new Mongo.Collection('content');                                 
export const blog = new Mongo.Collection('blog');                                 
export const notification_details = new Mongo.Collection('notification_details');                                 

