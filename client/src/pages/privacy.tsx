import { Link } from 'react-router'
import { Alert } from '@mantine/core'
import './privacy.scss'

export function Privacy() {
  return (
    <div className="privacy">
      <Alert variant="light" color="orange" w="800px" title="This page discusses features in progress.">
        In this document, product features are sometimes discussed in both the present and future tense.  Do not use this as an indicator of their completeness in the product.  Instead, look at the <Link to="https://github.com/pitrak1/dogsplayingpoker">Features section of the README</Link> to get the current status of features.
      </Alert>
      <h1>Privacy and security</h1>
      <p>I worked on a Trust and Safety team for more than three years, building tools to moderate content and protect users for a voice/video/text platform.  It taught me that protecting users (whether from data breaches, bad actors, spam, or whatever) is a massive problem and that it needs to be taken seriously.</p>
    
      <section id="limiting-data-visibility">
        <h2>Limiting data visibility</h2>
        <p>Perhaps one of the biggest security features to note is that <strong>your email address and your phone number will never be available to other users unless you directly give it to them in a message</strong>.  Email addresses will be used to log in and for password recovery, but to other users, you will only be identified as your chosen username.  Phone numbers may be used in password recovery or multi-factored authentication but will never be shown to other users.</p>
      </section>

      <section id="tiered-access">
        <h2>Tiered access</h2>
        <p>DogsPlayingPoker will work with a tiered access system.  This will hopefully allow users to engage with the app to see what possible connections can be made in their area while enforcing stricter security guidelines to learn more specific info about other users or message them.</p>
        <p>The three tiers are these:</p>
        <ol>
          <li><strong>Logged out user</strong> - These users can search for locations and see map markers, but are <strong>unable to see the usernames and pets for those markers</strong>.  This means the only information a logged out user can get about other users is the location and range of their map marker and the profile picture it is labelled with.  They are also <strong>unable to send chat invites, message, or add their location to the map.</strong></li>
          <li><strong>Logged in user with verified email</strong> - These users can see other users' profile info, but they will still be <strong>unable to send chat invites, message, or add their location to the map.</strong></li>
          <li><strong>Logged in user with verified email and MFA enabled</strong> - These users can see other users' profile information, send chat invites to other users, and add their location to the map.</li>
        </ol>
        <p>The value of this tiered system has multiple purposes.  <strong>While having account features like verified emails and multi-factor authentication increases the security of your account and allows for things like password recovery, it also deters spam accounts and bad actors.</strong>  What I learned working in Trust and Safety those years is that every barrier to creating an account or harassing other users means the effort of spam users or bad actors is increased.  These steps may be significant to good users of the platform, but setting them up once increases the security of your account and creates a massive cost of creating multiple accounts, whether as spam or because a user's actions keep getting them removed from the platform.</p> 
        <p>For example, if a person wanted to create spam users on the platform and we had no email verification, all they would need to do is register with any valid and unique string of characters that looked like an email.  With email verification, they now need to also create valid emails with actual access on another platform to do so.  If those users then wanted to spam message another user, they would now also need to set up MFA, requiring another device or MFA app.</p>
        <p>With these barriers in place, <strong>the hope is to strike a balance between allowing real users to engage with the platform and discouraging bad actors and spam accounts from affecting those users' experience.</strong></p>
      </section>

      <section id="location-protection">
        <h2>Location protection</h2>
        <p>For an individual user, sharing their exact location online can pose privacy risks.  <strong>DogsPlayingPoker allows you to share an approximate location to display to other users.</strong> We've implemented a way for the user to provide their location and select a distance, and DogsPlayingPoker will generate a point within that distance to show on the map.  To see it working, I would say to make an account and enter your own location, but you need a verified email and MFA to see it.  For now, there's a more detailed explanation <Link to="/about#location-obfuscation">here</Link>.</p>
        <p>Another benefit of this system is that <strong>your actual location never even goes to our servers.</strong>  The maps, the range, and the generation logic are all done in the browser on your local computer.  All we store on our servers is the latitude and longitude of your obfuscated location and the range you chose to obfuscate it.  Our team can't see or leak your location data because we never even receive it.  You can even confirm this yourself by looking at the dev tools of your browser when saving your location.  I may put a step by step guide in the FAQ.</p>
      </section>

      <section id="safety-in-messaging">
        <h2>Safety in messaging</h2>
        <p>When messaging another user on DogsPlayingPoker (which can only happen between two users with verified emails and MFA enabled), <strong>users will always see a chat invite before an actual chat is opened.</strong>  This chat invite will show you the user's first message (if they provided one), provide a link to view their profile, and provide a link to see their marker on the map.</p>
        <p>You can then choose to accept or decline their invite.  Invites expire after two weeks. <strong>If you decline an invite, the other user cannot send one for another two weeks</strong>, and in that time, it will appear as pending to the other user (as if you hadn't responded).  After two weeks, the invite will be automatically removed and either user can send a new one.</p>
        <p>If you never want to receive a chat invite from a particular user, the chat invite they sent (as well as their profile) provides an opportunity to block them from ever messaging you again.  <strong>Blocking a user will hide their chat invites sent to you and hide their marker when you're using the map.</strong> If you change your mind and would like the opportunity to message them again, the users you currently have blocked can be managed in your account.</p>
        <p>It's also worth noting that other than a user's profile picture and the pictures they set for their pets, <strong>no user can post any multimedia to their account or send multimedia to other users.</strong>  This is partly an engineering limitation and partly a safety concern which I elaborate on <Link to="/about#multi-media-uploads">here</Link>.</p>
      </section>
        
      <section id="reporting-and-moderation">
        <h2>Reporting and moderation</h2>
        <p>Many times, it's not only best for a bad actor or spam account to be prevented from messaging you specifically, but to be entirely removed from the platform.  Whether this is for creating obvious spam accounts, spam messaging users with inappropriate messages, or uploading inappropriate images to their profile, <strong>I hope users will help the community by reporting these users and this content with as much regularity and specificity as possible.</strong></p>
        <p>Options to report users for inappropriate profile information (profile pictures, pet pictures, usernames, pet names, or pet details) will be available on their search result on the map and on their profile.  Chat invites can be reported from every chat invite displayed in your invites list, and messages can be reported from within every chat.</p>
        <p><strong>Moderators and engineers will be able to view all messages, chat invites, and profiles on the platform.</strong>  While it may seem extreme to allow moderators to view every bit of data on the platform despite messages seeming private and not being visible to other users, it's an unfortunate and extremely common security measure taken by online platforms.  There's a longer explanation for the necessity of this <Link to="/about#moderator-data-access">here</Link>.</p>
        <p>In order to make their job easier, <strong>moderators operate through a moderation panel, a set of tools for moderators to manage content on the platform</strong>.  This can include removing messages, images, and users.  The tools on this panel will empower them to identify problems quickly and be able to alter or remove whatever content necessary.</p>
        <p>Because inappropriate images can be much more harmful to users, <strong>DogsPlayingPoker will also utilize third-party services designed to help identify illicit content.</strong> For more information about these tools specifically, check the FAQ <Link to="/about#moderation-tools">here</Link>.</p>
      </section>

      <section id="community-empowerment">
        <h2>Community enpowerment</h2>
        <p>Moderating an online platform like DogsPlayingPoker in a quick and safe way is a difficult task, and with the possibility of several thousand spam accounts being made, identifing trustworthy users can be an incredible help.  <strong>We would like the platform to encourage users to be proactive in reporting bad users/content and be rewarded for doing so.</strong></p>
        <p>The way this will be done is through a score.  <strong>A newly created user will start with a baseline score, but it will change over time to indicate their trust in the community.</strong>  If a piece of content is reported and then viewed by a human moderator, they can then decide if the report is justified based on the Terms of Service.  If it is, they can decrease the score of the user who posted the content and increase the score of the user who reported it.  If they see that the report is spam to the moderation team or an attempt to get the poster banned, the users who made the reports will have their score lowered.  <strong>This allows moderators to better prioritize reports and can also inform automated action when it must be taken.</strong>  For example, if a user gets a certain number of reports in a certain amount of time, DogsPlayingPoker will probably hide the user or the content for a certain period of time until a human moderator can assess the situation.  If the users making the reports have very low scores, it will take many, many more of them to force this type of automated action, but if the users making the reports have very high scores, it will probably take very few.</p>
        <p><strong>DogsPlayingPoker will have badges to indicate trustworthy users and their significant contributions to the community.</strong>  These badges will be displayed on a user's profile and map search result:</p>
        <ol>
          <li><strong>Community Member</strong> - For users with a score higher than a certain threshold</li>
          <li><strong>Community Leader</strong> - For users who have a high trust score and have individually been recognized by moderators as good actors who have a long history of participation</li>
        </ol>
        <p><strong>These badges will be shown to other users and will indicate a user who is trusted by the community.</strong>  There may be other specific benefits, like search weighting based on these badges or a search filter by badge, but I imagine the additional attention the badges would bring you would be incentive enough to participate in community protection.</p>
        <p>I should also note that the score of each user will be directly controlled by the moderation team, and badges can be taken away at any time for any reason. Of course, I hope this reason is justified, but we want to trust our moderators. <strong>Moderators have a big job, and we need to give them all the tools we can.  Being a user with a community badge is a privilege, and our moderators can directly edit a user's score and badges.</strong> While appeals will be considered, moderators should be empowered to protect the community and take whatever moderation action necessary if there is reason to doubt a user's good intentions.</p>
      </section>
    </div>
  )
}
