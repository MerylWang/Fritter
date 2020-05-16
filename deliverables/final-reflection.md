# A5 Design Reflection

**Meryl Wang**

## Design Decisions

1. **Only show buttons when their corresponding action is allowed**

   I tried to have buttons and links show up only when their corresponding action is available / allowed. This reduces the user's chances to make an error or make an invalid action. For example, in a Freet card,

   * the `refreet` button only shows up in a Freet after the user is signed in
   * the `upvote` button only shows up in a Freet after the user is signed in
   * the dropdown containing `edit freet`  and `delete freet` only shows up in a Freet after the user is signed in AND if the user is the freet's author

   For example, image 5 shows the View All Freets view when the user is logged out. The user can stlil view freets content, upvote numbers, and visit the author's profile via provided link. However, the user cannot upvote, refreet, or edit/delete. Image 6 shows the same view but with user logged in as `bob`. Bob can upvote, edit/delete freets that he authored, and refreet the freets that he did not author.

   ![image 5](/Users/merylw/Desktop/6.170/Assignments/fritter-wangms/A5_im5.png)

   ![image 6](/Users/merylw/Desktop/6.170/Assignments/fritter-wangms/A5_im6.png)

2. **Dynamic buttons**

   * after the user clicks `upvote`,  the upvote button turns into undo upvote button, and vice versa
   * after the user clicks `follow author`, the `follow` button turns into an `unfollow` button, and vice versa

3. **On starting page, show all freets instead of create account**

   ![image 1](./A5_im1.png)

   ![image2](./A5_im2.png)

   After ethical reflections from previous assignment, I decided to make this change. In my design from A4, a new user sees a welcome page whose primary purpose is to ask them to create an account (image 1). However, after reflection I decided to make `View All Freets` the focus of the welcome page instead, to prioritize presenting information over getting the users to commit to an account. If the user's purpose is to explore the site or browse freets, this lets users do so without asking them to commit with an account. A con is that, many actions (create freet, upvote, refreet, etc.) are not available without the user logging in, and this may not be immediately obvious to an user who does not create an account.



   ![image 3](./A5_im4.png)

   A second reason I made this design change is that I found the separation of the  `create user` and `sign in` forms redundant, since the two forms are identical (both ask for username and password). So I think combining the two functions into a single pop-up form reduces confusion and removes the redundancy.

   4. **Do not display the number or list of followed authors or followers**

      ![image 4](./A5_im3.png)

      This is another design change made after A4. In A4, I had shown that the user's profile page contains links to the list of `followers` (other users who follow them) and the list of `following` (other users whomst they follow) (image 3). After further reflection, I decided to remove this option. For my concept of `feed` (list of freets by authors they follow), they do not need to know who's following them. And to observe who they follow, they can refer to their feed.

   5. **Group navigation information in Nav Bar**

      In A4, I originally had a sidebar to provide links for home, profile, view all freets, and view freets by author. However, I decided that since the same information will be provided by the nav bar, it may be more clear to simply remove the side bar. This reduces redundancy and confusion. It also follows Gestalt's Grouping Principle.

   P.S. There were some design choices I wanted to implement, but had run out of time, so I list them here as future directions of improvement.

   1. The blue links in the blue-green Nav Bar are kind of invisible. This is because the texts were originally white, but changed to blue after I implemented links on them. A future goal would be to return the text color to white.
   2. Currently, the site does not offer user feedback (other than the changes in rendering after an action is successful). This may be confusing to the user as they cannot know whether an action succeeded or failed, and why. A second future goal is to property implement and display informative success and fail messages.

   ## Ethical Reflection

   The reflection after A4 as well the lecture on Ethics changed some aspects of my design, some of which are discussed above. Primarily, the discussion on ethics led me to think about and redefine the primary goal of the application. Whereas before, I focused on making the website easy to use for experienced American social media users by following most social media conventions (e.g. clicking on the logo leads to home, clicking on the username leads to a personal profile page, etc.). After the reflection, I wanted to shift my goal to make the less more transparent and LESS addictive. This manifested in design decisions such as 1) not making create account a priority in the welcome page, 2) not showing the numbers of followers/following or the list of names, 3) not showing the number of refreets or the list of people who refreeted a freet. Generally, I wanted to avoid social media designs the make the apps addictive by linking posts with post's popularity and essentially, the user's self-esteem. 
