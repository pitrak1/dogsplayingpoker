# DogsPlayingPoker

_A new way for dog enthusiasts to connect_

For information about current and future features, see our [About](https://dogsplayingpoker.app/about) page or our [Privacy](https://dogsplayingpoker.app/privacy) page.  Those pages will document the planned features for the app while progress of those features are tracked here.  This page will maintain three things:

1. list of the status of each feature as described on the About and Privacy pages
2. list of relevant docs to better explain large engineering features and decisions
3. a list of smaller engineering items to keep track of progress

## Features
This list will show the status of particular features as mentioned on the [About](https://dogsplayingpoker.app/about) and [Privacy](https://dogsplayingpoker.app/privacy) pages.

- Monetization - TODO: No monetization currently
- Tiered Access
  - Logged out user
    - Cannot see usernames, pets, or profiles
    - Cannot send chat invites or add location
  - Logged in user with verified email
    - TODO: Email verification not implemented
    - TODO: Logged in users not blocked from sending chat invites, messages, or adding their location
  - Logged in user with verified email and MFA
    - TODO: MFA not implemented
- Location protection - completed
- Safety in messaging
  - Chat invites
    - Users can accept to start a chat or decline
    - Users can view the sender's profile
    - Invite expire after two weeks, and you cannot send another one if one already exists
    - TODO: Include a link to view the user's marker on the map
  - Blocking - TODO: not implemented
  - Multimedia uploads - only images are allowed only on profiles
- Reporting and moderation
  - Reporting - TODO: not implemented
    - Report user from map results
    - Report user from profile
    - Report chat invites
    - Report messages
  - Moderation panel - TODO: not implemented
    - Remove messages
    - Remove chat invites
    - Remove profile content
    - Remove users
    - Remove all
  - Third party moderation services - TODO: not implemented
- Community Empowerment
  - Trust score - TODO: not implemented
    - Alter users' trust score directly from moderation panel
  - Moderator review of reports - TODO: not implemented
    - Review reported content
    - Alter users' trust score based from reports
  - Automated moderation actions - TODO: not implemented
    - Rate limiting
    - Automated reaction to reports
  - Community badges - TODO: not implemented

## Docs

[Type Naming Conventions](https://github.com/pitrak1/dogsplayingpoker/blob/main/docs/type-naming-conventions.md)

## Engineering list:

- Better loading display for different pages
- Better work in progress for different pages
- socketing
  - message notifications by chat
  - invite notifications
- improve floating temporary alerts for async actions (ex: accepting invite should show popup alert that fades)
- Obscure profile data unless logged in
- Gate messaging by MFA
- Properly show distance on map
- Map filtering by obfuscation distance
- Support Email verification on signup
- Support logging in through Google

TODO Bugs:

TODO Possibilities:
- Support purposes (Walking/Sitting/Training, Paid/Unpaid)
- Better search filters (max obfuscation range, by purpose, by badge?)


