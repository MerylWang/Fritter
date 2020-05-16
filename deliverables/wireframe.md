# A4: Fritter Wireframing

## Wireframing 

**Link to Moqup project**: https://app.moqups.com/P5TjraBY2c/view

​	Note: It's ok to submit link instead of pdf according to piazza post @211

​	Note 2: I had to omit many details (such as the side bar, Nav Bar, Create Post and Aboute Me sections) in subsequent pages due to running out of free objects in Moqup. Please refer to the first two pages for these details that were meant to be in subsequent pages. 

**Demo Video**: https://youtu.be/Fz_RcEsKPBU
	Since not all links/buttons on the moqup are live, this video demonstrates which ones are. It shows upvoting, refreeting, and following. 

## Heuristics

* Use Fitt's Law: The content of the webpage is very contained. Although my nav bar spanned the entire 1366 x 768 screen, my main sections only spanned some space in the middle. This both 1) leaves whitespace for aesthetics and 2) decreases the distance the user needs to move between objects. 
* Speak the user's language: I used colloquial language & contractions and avoided any technical terms. 
* Consistent naming & icons: By virtue of duplicating the pages, repeting elements are intrinsically consistent. These elements include the Nav Bar, Side Bar, sections of the Main section. Icons used (search, thumbs up for upvote, share for refreet, trash bin for delete post) are consistent and intuitive as well. 
* Information scent: The Nav Bar and the Sidebar give information scent to the user. The Nav Bar contains the main destinations of Fritter: "home" and "personal profile". The Sidebar also contains these, but any future additions to the site may also go to the sidebar. 
* Follow conventions: I noticed social media sites such as Facebook, Twitter, Instagram have a pretty standard set of webpages and navigations: Click on the logo to go to Home / Feed, click on your profile picture to see your own posts / followers / following, search function in the Nav Bar, etc. I followed these conventioned because this makes Fritter very intuitive to users who have been exposed to other social media. 
* Show location & structure: Currently my pages "Feed" and "Wall" contain corresponding labels. For future aethetic concerns, I may remove these labels. Instead, to show location I could **bold** the corresponding link in the Sidebar to show that the user is at the bolded link. 
* Accelerators: As described in following conventions, the anticipated most-accessed pages have shortcuts located in the Nav Bar and the SideBar. The NavBar shortcuts may not be immediately obvious to an user who has not used a similar site, so I put the same shortcuts in the sidebar labeled with text. Once the user familiarizes themselves, the shortcuts in NavBar will also act as accelerators. 
* Keep paths short: Currently, the paths are short. Home contains the feed. And users may access user profile from home (home -> user). 
* Undo & cancel: 
  * For upvote, after the use clicks 'upvote', the button changes color and say 'undo'. Clicking on the button again will undo the upvote and reset the button. 
  * For refreet, after a user refreets a Freet, the Freet shows up in their Wall as a Refreet. The user then may undo the refreet by deleting it from their Wall. 
  * For follow, I ran out of moqup objects but unfollow should follow something similar to upvote, where following an user changes the link to 'unfollow this user', which will undo the follow. 
* Perceptual fusion: The transition between pages should be smooth. I tried to align objects from page to page so only the object that changed shows obvious change / motion. (Except I had to remove some of these repeting objects due to moqup quota)
* Gestalt principles of grouping: I organized my page into sections: for example, navbar, sidebar, create post, feed. In the sidebar I also grouped the links, leaving space between the main links and the 'View All Freets'. I considered placing "View All Freets" and "View All Freets by Author" in a group; However, I decided to move the latter to the navbar because it is more intuitive to have a search bar there. 
* Recognition vs recall: As mentioned under Accelerators, some shortcuts may depend on recall, after using Fritter or similar sites. However, recognition-based shortcuts are also offered such as in the side bar. The intuitive icons & stencils also help users recognize purpose of each object upon first use. 
* Anticipation & content: 
  * delete post: I used a pop-up message informing the user that a deleted post is not recoverable and asking to confirm/cancel. This anticipates potential misclicks on the delete button and prevents accidental deletes. 
  * refreet: in my design I decided that user should NOT be able to refreet their own freets. So in the user's Wall where the user's posts are, I removed the 'Refreet' button. This anticipates user action and prevents actions that are not allowed. 

## User Testing

* Tasks for user to complete (upvote, refreet, follow)
  1. Go to feed, upvote the first freet. Undo your upvote. 
  2. Refreet the first freet in the feed. Check that it appears in your wall. 
  3. Delete the refreeted freet from your wall. 
  4. Find author 'Mr.Potato' and follow this author. Check that his freets appear in your feed. 
* Summary: Finding the feed and wall was straightforward, as was upvote and refreet. It was not immediately obvious where to look for author given the username, and the link for 'follow this author' is not very prominent. Lastly, removal of elements that were expected to be consistent due to moqup quota caused navigational confusion. 
* In response, next steps are to 1) improve the 'following' feature by making author search more intuitive and the following button more prominent 2) redo wireframe in another tool to restore the removed elements and 3) complete the wireframe for the site by adding user creation, login/logout, etc. 

## Ethical Implications

* I assumed the user has experience using social media. Therefore I followed conventions, shortcuts, icons, and behaviors common among major social media webapps. 

  As far as cultural assumptions, I assumed the user is American to be using  social media like Facebook and Twitter. However, with globalization and Facebook/Twitter being internationally used, the user does not need to be American to be familiar with these sites. In addition, social media in other countries (such as China's Weibo) share a similar structure & set of symbols, which means Fritter may well be intuitive to use across cultures. 

  An audience that may find Fritter hard to use may be that in non-first world countries, where perhaps fewer people can afford the technology / time for social media, as well as older generations, who generally use less social media. 

* Yes, using design heurisitcs to maximize engagement is indeed manipulative. If it were not manipulative, it would be providing a set of tools for people to communicate, in an unbiased manner. Trying to get people to spend MORE time on a site (probably trying to maximize profit) is manipulative. 

* To get children addicted to Fritter: Social media is addicting because each 'like' is like a tiny validation that sends dopamine up the brain. To make Fritter more addicting, show the number of upvotes, show the number of following / followers; give users notification on how other users are doing, encourage a sense of competition. Maybe even support mini-games, multimedia, etc to keep the children's attention gauged.  Oh wait... that's Facebook. 

  To make harder for older people to use: Incorporate tons of accelerators that are common to other social media / webapps. Whereas younger generations who spend a lot of time with technology may pick these up quickly, they will be harder for the older generations assuming the latter spends less time with technology. Also, reduce font size. 

  To stop fake news: Give accounts of confirmed new sources a badge of affirming that they are an established new source. Users will then be able to identify whether a source is credible. 

  To prevent harassement: Allow privacy settings that do not let strangers see user's  content / information.

  To prevent social anxiety, get rid of the numbers of like/dislike/comments/shares under each post. Make it so that only the owner of a post can see who has liked/commented/shared their posts (not even the number, just the list). 

  One alternative design is the one such as in social media app WeChat, in which only friends can see each other's posts and only mutual friends can see comments. This may generate less content as the visibility of each post / comment decreases; However it is refreshing take on a safe space where there are only friends, no strangers. 

* That is a potential threat to privacy because anyone on the internet can find out each user's social circle

* Stakeholders are affected by the company's profit, which means to the stakeholders, it may be desirable that Fritter is addictive as possible to maximize profit, at the cost of going against ethnic values. A choice I was was to display the number of upvotes to a post; although I debated not displaying the numbers, I ended up doing so because the purpose of upvote is my design was to demonstrate popularity of a post. This choice may benefit the stakeholders as it makes Fritter more engaging. 

* The site at the moment is primarily black, white, with dark maroon. Tested through the chrome extension 'Colorblinding', this color scheme poses no problem for various types of colorblindness. 

* As dicussed in bullet 1, I had in mind an American user of a younger generation who often uses social media. The language, icons, shortcuts, and behaviors I use folow this assumtion. 

