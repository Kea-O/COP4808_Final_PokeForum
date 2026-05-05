# Web Development Final Project - *PokéForum*

Submitted by: **Keagan O'Leary, Z23695171**

This web app: **is a place for users to discuss and react to Pokémon. Initially, users can see a list of posts. To interact or create their own, however, they must create an account. Users can create posts of varying types (discussion, news, etc) and either learn more about Pokémon or teach others about it. Posts support images and text, and must be tagged with a type. Users can also sort through posts by either their type, the number of people who liked them, and the time they were created at. Users can interact with posts by commenting underneath them. Each post also has an AI Professor Oak that the user can ask to generate a summary of the post content and comments. Each user can only edit/delete their own posts. Posts have scores attached to them that users can increase or decrease depending on how much they enjoyed the content.**

Time spent: **17** hours spent in total

## Required Features

The following **required** functionality is completed:


- [X] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [X] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [X] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [X] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times
- [X] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [X] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [X] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [X] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [ ] None

The following **required** features for Canvas Submission are implemented:

- [X] Web App Deployment (5 points). Use one of the following cloud deployment sites: netlify, heroku, etc.
  - provide your deployment URL in the github readme and submit your github repo link as part of this submission.

- [X] Create a User Login & Signup and tie it in with Supabase backend (5 points)
  - Login 1pt - Signup - userid/pw - 1pts - Google/Apple id - 1pt - pw reset flow - 1pt. logout 1pt

- [X] Use of LLM for app (5 points)
  - Have LLM provide an overall summary of Post.  Need to provide title, description, posts, upvotes, comments. 
  - Display LLM summary in a nice way on the UI

## App Deployment

App was deployed on Netlify. You can access it via: https://pokeforums.netlify.app/ 
Warning: Supabase has an email limit of 2 for every hour. If you want to test it, make sure not to reach the limit or else no emails will go through.

## Video Walkthrough

### CodePath Video:

[![Youtube Video going over the Final Project and CodePath functionality](https://img.youtube.com/vi/S1DLt5JE7Qw/0.jpg)](https://www.youtube.com/watch?v=S1DLt5JE7Qw)

### Canvas Video:

[![Youtube Video going over the Final Project and Canvas functionality](https://img.youtube.com/vi/ZtyJINmWz8s/0.jpg)](https://www.youtube.com/watch?v=ZtyJINmWz8s)


## Notes

The most difficulty I had with this app was working through the user authentication with Supabase. There was just so much that needed to be done; connect to Supabase, have a login/logout/signup/reset password, make sure the authentication is going through, having a separate table for users and their usernames, etc. I also neeed to wrap some of my routes in ProtectedRoutes, which basically means only people who are logged in can enter. Saving the user data when people login was also confusing, mostly because we never went over it in class. Creating a supabase session and everything associated with it was head-scratching. 

## License

    Copyright 2026 Keagan O'Leary

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
