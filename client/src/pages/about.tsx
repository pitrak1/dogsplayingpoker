import { Link, useLocation } from 'react-router'
import { Accordion, Alert } from '@mantine/core'
import { useState } from 'react';
import './about.scss'

export function About() {
  const { hash } = useLocation();
  const [value, setValue] = useState<string | null>(hash?.slice(1));

  return (
    <div className="about">
      <Alert variant="light" color="orange" w="800px" title="This page discusses features in progress.">
        In this document, product features are sometimes discussed in both the present and future tense.  Do not use this as an indicator of their completeness in the product.  Instead, look at the <Link to="https://github.com/pitrak1/dogsplayingpoker">Features section of the README</Link> to get the current status of features.
      </Alert>
      <h1>DogsPlayingPoker</h1>
      <p>Welcome to <strong>DogsPlayingPoker</strong>, a new way for dog lovers to connect.  Our mission is to provide a safe and secure way to bring dogs together with other dogs, other people, and other places that improves the lives of everybody involved.</p>

      
      <section id="our-motivation">
        <h2>Our motivation</h2>
        <p>I recently moved to the suburbs from Lakeshore East, a neighborhood in downtown Chicago that's very dog friendly.  There's two things that I most noticed in my new neighborhood:</p>
        <ol>
          <li>If you're walking a dog on the sidewalk, you will constantly be barked at by dogs seeing you from their apartments.</li>
          <li>Dog reactivity is absolutely out of control, and outside of a dog park, you'll almost never see two dogs interacting.</li>
        </ol>
        <p><strong>The benefits of socialization of dogs are innumerable</strong>, and they help both the owner and the dog.  Whether it's positive experiences with people, with kids, with other dogs, or with new environments, you want your dog to feel like the world and everyone in it is another opportunity for fun and adventure.  The opportunity to build these associations is closer than we think, and chances are, there is another dog owner or dog lover nearby who would be glad to be on the other side of this interaction. <strong>We want to remove the most signifant barrier to those connections being made: communication.</strong></p>
      </section>

      
      <section id="how-were-different">
        <h2>How we're different</h2>
        <p>Other dog care apps I have used in the past force the user to interact with a very structured model, and it's largely because of how they monetize.  Those apps monetize by taking a cut of the money exchanged between users of the app.  For example, if one user is walking a dog for another user for $25 for 30 minutes, they'll take 20% of that. However, this has a couple of negative consequences:</p>
        <ol>
          <li>These platforms will only provide a limited set of paid services because unpaid or less structured arrangements don't allow them to take a cut.</li>
          <li>These platforms require users to do scheduling and billing through their app so they can get their cut.</li>
        </ol>

        <p>I elaborate on this more in the <Link to="/about#direct-percentage-payment-model">FAQ</Link>.</p>

        <p>DogsPlayingPoker will have a much less opinionated model. The job of DogsPlayingPoker is to easily connect pet owners in their area, and that's it. We won't have to build a payment portal or robust scheduling features because users probably already have their favorite apps for those things.  That gives us more time to do what matters: allowing users to provide information about their pets and what they're looking to find on the app and allowing other users to easily find them based on that information.  <strong>DogsPlayingPoker is simply to guide you through the process of meeting people who may be able to meet the needs of you or your pet in a safe and protected way.  Any interaction beyond that is your decision.</strong></p>
        <p>This means that the way that <strong>DogsPlayingPoker will monetize will be through either ad revenue or sponsorship</strong>.  While the idea of introducing ads can be a little worrisome due to how disruptive to the user experience they can be, there are a couple things I would ask you to keep in mind:</p>  
        <ol>
          <li>I built this as a hobby project with potentially (and probably) no financial incentive.  I want this product to exist and be as good as it can be and won't allow ads that I feel will significantly harm the user experience.</li>
          <li>If this project does need funding, it's not like it needs to support a team of 50 engineers.  I'm currently working on this alone, so if I need to use ads, they will be to cover infrastructure costs and possibly my own salary if engineering takes too much of my time to work elsewhere.</li>
        </ol>
        <p>The freedom of use that comes with the advertising model far outweighs the costs, and I built this platform because I genuinely want the connections between these dog owners to be made.  I ask you to trust me to not ruin it with aggressive advertising for financial gain.</p>
        <p>While the monetization model and the benefits that provides is probably the most visible difference, there are several other features involving user data and location privacy that are documented on the <Link to="/privacy">Privacy</Link> page.</p>
      </section>
    
      <section id="faq">
        <h2>FAQ</h2>
        <Accordion order={3} value={value} onChange={setValue}>
          <Accordion.Item value="app-name" w="800px" id="app-name">
            <Accordion.Control>Why is it called "DogsPlayingPoker"?</Accordion.Control>
            <Accordion.Panel>
              <p>The whole concept of the app is for dogs to have friends.  And I thought, what would a group of dog friends do together?  Poker, of course.</p>
              <p>I looked up the name, and while I was worried it was the name of a painting, it's actually a colloquial name for a group of paintings.  I think that should make the name open for re-use, but I don't know the law.</p>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="direct-percentage-payment-model" w="800px" id="direct-percentage-payment-model">
            <Accordion.Control>What's wrong with a direct percentage payment model?</Accordion.Control>
            <Accordion.Panel>
              <p>While a platform using the direct percentage model won't have to get advertising or sponsorship, there are two main disadvantages:</p>
              <ol>
                <li>Those apps will only ever have paid services because they can only take a cut of paid services.  There are many opportunities for dogs to spend time together and have good experiences that don't involve money changing hands.  Let's say there are two dog owners whose dogs get lonely during the day while they're at work. An app that uses a direct percentage payment model would never support that connection being made, and I want DogsPlayingPoker to allow a wider range of less structured connections.</li>
                <li>Those apps require you to go through their scheduling and payment portals to do anything or else they can't verify services were rendered and take their cut. However, it makes every part of these interactions more difficult.  I hired a dog walker on one of these apps where the app required the user to log when their walk started, log when it ended, and take pictures along the way. I probably never needed this information recorded, and I definitely didn't need it after my first few walks with her after I trusted her with my dog.  Also, scheduling changes were a nightmare.  Even if I was okay with her showing up an hour earlier a particular day, we would have to go through the whole handshake of changing the schedule, confirming the schedule change, and rebilling to make the walk happen.  The app got involved in a lot of ways it didn't need to and ended up feeling like a burden when the walker and I already had an understanding.</li>
              </ol>
              <p>It's not to say that the paid model doesn't have its advantages.  There is a certain amount of security in the very structured format they provide.  If I hired a walker off of their app and they never showed up, I imagine I could call their support team and get reimbursed.  However, it would be nice if after a connection is made, the two people could decide what they wanted to do, and then message on whatever platform they liked, share pictures on whatever platform they like, and exchange money on whatever plaform they like.  This is the experience DogsPlayingPoker will provide.</p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="multi-media-uploads" w="800px" id="multi-media-uploads">
            <Accordion.Control>Why can't I send pictures and videos to my friends?</Accordion.Control>
            <Accordion.Panel>
              <p>DogsPlayingPoker intentionally does not allow sending anything but text in messages.  There are big harrassment risks and few user benefits.</p> 
              <p>If users can send multimedia files in messages, that greatly opens the door for inappropriate content on the platform. Instead of every user getting to upload one picture each for themselves and their limited number of pets, there would be an unlimited amount of pictures any user could upload.  That's not even considering the additional moderation effort that video files consume.  Limiting the number of pictures a user can upload and allowing them to upload pictures protects users on the platform by significantly reducing the moderation burden.  With this strain on moderation resources, more explicit/illegal files would fall through the cracks and end up in the sight of users.  That's something I'd like to avoid, and reading something nasty is much less troubling than seeing something nasty.</p>
              <p>Even without considering the moderation effort it would take, not building our own multimedia messaging platform is in line with our engineering philosophy.  I imagine every user already has their own favorite way to send pictures, videos, and files, so why build another one?  DogsPlayingPoker is a platform for meeting people, and I imagine most users will start conversations here that are then carried on to other platforms.</p>
              <p>However, I recognize that the app is at an early stage.  If there comes a time that multimedia messaging would be more beneficial to user experience, I would obviously reconsider.  It would have to done in a way that's as safe as possible though.  Perhaps sharing multimedia files in messages would be disabled by default, but both user could opt in to make it work.</p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="location-obfuscation" w="800px" id="location-obfuscation">
            <Accordion.Control>How is my approximate location generated and shown to other users?</Accordion.Control>
            <Accordion.Panel>
              <p>When providing your location to the app, you will take the following steps:</p>
              <ol>
                <li>Enter your actual location.  You'll be shown a map with a map marker to confirm your location is correct.</li>
                <li>Select a radius in miles to obfuscate your location.  The area that is within that range from your location will be shown on the map when your map marker is hovered.</li>
                <li>Click to generate a point for the location that will be shown to other users.  The generated point will be shown as a map marker with the range you selected being shown on hover.  You can regenerate the point if you choose a different radius or would prefer a different random location.</li>
              </ol>
              <p>The map shown in the third step is what will be shown to other users.  This process guarantees two things:</p>
              <ol>
                <li>The map marker shown to other users will be within the selected radius of your actual location.</li>
                <li>The area shown by the circular range when the map marker is hovered will contain your actual location.</li>
              </ol>
              <p>This allows users to see your map marker at the generated location, but can also see within what maximum range your actual location is from the generated point.  This gives users an ability to see where users might be around them (and with what confidence due to the range) while never providing actual location data.</p>
              <p>It's also worth noting that all this work is done in your browser, so the actual location you entered never leaves your computer.  Only the generated latitude and longitude and obfuscation distance is sent to the server to be saved with your profile.</p>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="moderator-data-access" w="800px" id="moderator-data-access">
            <Accordion.Control>What data is viewable by the DogsPlayingPoker team?</Accordion.Control>
            <Accordion.Panel>
              <p>Every single piece of data is viewable by the DogsPlayingPoker team.  This is not only an extremely common measure taken by most online platforms, but an engineering and product necessity.</p>
              <p>Ultimately, data access by DogsPlayingPoker employees is unavoidable; engineers need access to the database to do their jobs.  However, all data on the platform will also be viewable on a moderation panel, a set of tools for moderators to manage content on the platform.  Moderators have a massive job to do, and tools need to be developed to empower them to do their best.  This means that allowing them to easily access data and see what's going on in a fast and easy way is paramount to keeping the users safe.</p>
              <p>However tempting it might be to rely on reports to identify content harmful to users, there are several instances where reporting isn't enough.  For example, there is a possibility of people using the platform to communicate about other things that are in violation of the Terms of Service (hate speech, terroristic threats, etc).  Because that communication happens in private messages between the two users, there's no possibility for a good user to see it and report it.  While that content won't affect users as directly as inappropriate profile images, it still is very harmful to the platform.</p>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="moderation-tools" w="800px" id="moderation-tools">
            <Accordion.Control>On the Privacy page, you mentioned third-party tools to help moderators.  What are these and how do they work?</Accordion.Control>
            <Accordion.Panel>
              <p>Several organizations provide services for online platforms like DogsPlayingPoker to utilize when checking an uploaded file for illicit content. It's my understanding that these services all work very similarly, so I'll talk about one of the largest (and the one with which I'm most familiar), which is NCMEC.</p>
              <p>The National Center for Missing and Exploited Children hosts a service that stores the hashes of millions of files identified as CSAM (Child Sex Abuse Material).  A file's hash is a unique name/identifier created from the file's data.  Storing the hashes means you don't have to store the files themselves, and given the nature of the content, you would prefer not to.  Services like DogsPlayingPoker interact with it in two ways:</p>
              <ol>
                <li>When a user uploads an image, the platform can check the hash of the image against the NCMEC database.  If the hash exists in the database, we know the image is CSAM and can disallow the image on the platform until it can be reviewed by a human moderator.</li>
                <li>When a user uploads an image and its hash is not found in the NCMEC database but is then determined to be CSAM by a human moderator for our platform, it can be submitted as verified CSAM to the NCMEC database in addition to disallowing it from our platform. In this case, submitting to NCMEC is no benefit to the platform directly, but supports tools to identify CSAM and protect users across the internet.</li>
              </ol>
              <p>DogsPlayingPoker plans to take both these paths, both using NCMEC and supporting it, but the actual implementation of this is significantly more complicated. NCMEC maintains several lists of hashes to identify CSAM with different levels of certainty, and they also have lists for sexual content which is not technically illegal but may be CSAM related (without going into too much detail about what specifically that means).  There are also several organizations like this for different types of illegal content (GIFCT for violence/terrorism, TCAP for terrorism, etc).  Many of these lists are recommended as an indicator that content is inappropriate, not as a surety; we usually can't guarantee that content is inappropriate just because they match one of these lists.  Consequently, we shouldn't just remove content from the platform because we found it on one of these lists, rather hide it until we can review it ourselves to confirm.</p>
              <p>It's hard to say how realistic utilizing and contributing to all of these services is.  The reality is that most online services do the best they can depending on the size of their team, the size of their platform, and who their audience is.  As the platform grows and the amount of users grows, the number of bad actors and the necessity of utilizing these services grows, as does the importance of moderation tools and human verification.  All I can do at this early stage is to say that preventing this type of content from affecting users was my entire previous job.  I take it very seriously, and I promise to implement as many security features as I can with the resources I have.</p>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>
    </div>
  )
}
