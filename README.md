# Proactive

Proactive is a to-do list and bookmark manager in one, to take control my on-line life.

## Rationale

Every once in a while, I need to visit and login to many on-line communities, SaaS, self-hosted web applications, or just random web-sites I found online. If I didn't, My sessions would expire, I might forget what I have, I might miss out useful information, and I might not perform necessary actions in time. 

I do not want to rely on notifications or emails reminders sent from those sites, because many sites have a dark agenda trying to maximize my engagement to the detriment of my time managment and even mental health. On the other hand, many ethical sites do not send notifications or don't even have a way to send notifications. 

Furthermore, responding to notifications and email reminders is reactive and makes browsering a chore instead of an exploration as it is supposed to be. A better approach is to be proactive and take control my on-line life, by polling all the sites with different time intervals each required. Hence I wrote Proactive.

## Design

Proactive is written as a javascript SPA with no backend, all user data stored in the browser with indexed DB. 

Different sites need different check-in intervals, from weekly for forums, to monthly for banks. Some should be checked annually, for stuffs that moved at a slow pace. Proactive organizes sites into 5 bins of daily, weekly, monthly, quarterly, and yearly, and show a much reduced list of sites whose "last visited" time stamp have expired according to the preset.

## Disclaimer

The main branch is hosted on [https://pro.roastidio.us](https://pro.roastidio.us) by me. All are welcome to use my instance. Since the software is free, one can also clone it and host it somewhere else; it is all upto you. 

Proactive is a tiny application: it has zero dependencies and requires zero build steps. Furthermore, all javascript and CSS files are hand written by me. I plan to keep it this way, so please refrain from making contributions. 

This software is tailored to my needs alone and may never become a full-featured to-do list or bookmark manager. I use it everyday as my browser homepage, your mileage may vary. 
