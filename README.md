# Web Development Final Project - *PokéForum*

Submitted by: **Keagan O'Leary, Z23695171**

This web app: **is a place for users to discuss and react to Pokémon. Users can create posts of varying types (discussion, news, etc) and either learn more about Pokémon or teach others about it. Posts support images and text. Users can also sort through posts by either their type, the number of people who liked them, and the time they were created at. Users can interact with posts by commenting underneath them.**

Time spent: **10** hours spent in total

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

- [ ] Web App Deployment (5 points). Use one of the following cloud deployment sites: netlify, heroku, etc.
  - provide your deployment URL in the github readme and submit your github repo link as part of this submission.

- [ ] Create a User Login & Signup and tie it in with Supabase backend (5 points)
  - Login 1pt - Signup - userid/pw - 1pts - Google/Apple id - 1pt - pw reset flow - 1pt. logout 1pt

- [ ] Use of LLM for app (5 points)
  - Have LLM provide an overall summary of Post.  Need to provide title, description, posts, upvotes, comments. 
  - Display LLM summary in a nice way on the UI

## Video Walkthrough

### CodePath Video:

[![Youtube Video going over the Final Project and CodePath functionality](https://img.youtube.com/vi/S1DLt5JE7Qw/0.jpg)](https://www.youtube.com/watch?v=S1DLt5JE7Qw)

### Canvas Video:



## Notes

The most difficulty I had with this app was working through the optional challenge of assigning an ID to a user. I initially thought that I might have to assign an ID in the root file, main.jsx, and spread it to every route from there, but that still leaves a risk of someone refreshing a page. After researching it a bit, I found that React has a "createContext" function that works well for this king of thing. It stores the user's ID on local storage, so no web refreshing will disrupt it. I just needed to export the function that returns the ID and it worked wonderfully.

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
