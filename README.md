# CSCI-3308-[102-3]-Project-Code

Java Tutorials is a web based coding resource to assist the user with learning Java programming language. We wanted to highlight our thorough tutorial content with a sleek and elegant design and functionality. The content offered ranges from simple variable syntax to more complicated concepts like 2-D Arrays and Variable Length Arguments. Users are able to register accounts and leave comments with any supplemental information or feedback. User accounts have individual passwords and usernames so that they remain secure. Comments will also stay for all other users to see across different platforms and can be removed by the developers/moderators. Users also have a system in which they are able to track their progress by a system that can return the logged in user to where they last were. Our goal was to create an experience for the user and make the process of learning Java more efficient.

The code that you see here is the code needed in order to locally run the site, there are slight modifications to server.js for the code to be hosted.

## Running Website

Java Tutorials is currently hosted on Heroku and can be found at: https://javatutorials.herokuapp.com/

## Testing Code

For the front end of the website, it can be tested using Telerik to test if all the HTML features are working propperly. To test the comment functionalities you can create comments on any of the content pages and then reload the site/open new pages and return and see that the comments are still there. To test the user functionality, you can register a new username and password and then sign in and see that you are now signed in. You can also test that you will not be signed in if the username or password are incorrect. Only once you have signed in can you test the user location system. To test this you can go to any page, select "Set Location" on the navbar, then change pages and select "Go To Last Location" to return you to the page that you set. You can even log into a different account and then log back in and see that "Go To Last Location" will still return you to the page that you set.

## Repository Structure

To see the code for any individual page, one can search in /views/pages.

To see the node that runs most of the site's function one can regard server.js
