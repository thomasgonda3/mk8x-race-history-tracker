import React from "react";
import images from "../../images/blog_images/index";

const Blog1 = () => {
  return (
    <div>
      <h3 className="text-center m-3">Blog 1 - 2023-08-11</h3>
      <p>
        I've never made a blog before, but I suppose I should start by
        explaining who I am, my ambitions behind this project, and explain some
        of the technical details behind what I'm doing.
      </p>
      <p>
        I am a mid level web developer who has played Mario Kart for a long
        time. I've been unemployed for some time now, and I haven't actually
        been coding that much in the mean time. I needed to create something to
        keep up my skills and hopefully grow in the process, and this is as good
        a project as any.
      </p>
      <p>
        The purpose of this website is to create a repository for people to
        easily store the history of the races they play online. Mario Kart is a
        nintendo game, which means they don't store any sort of useful
        statistics ingame about your playing history. Given that you've
        navigated to this blog, you can see that I've already developed a
        website, which I have created working on and off for the past two weeks.
      </p>
      <p>
        The backend is a free tier mysql server being hosted on AWS, and can
        hold 20GB before I need to pay anything. The front end is created
        through React, and the website itself is being hosted on Cyclic. All of
        this was within my skillset, and I didn't need to learn anything new to
        create it, though it was helpful to brush up on some skills.
      </p>
      <p>
        My current to-do list which actually requires me to expand my skillset
        is as follows:
      </p>
      <ol>
        <li>
          Create a discord bot that can handle creating new races for users.
        </li>
        <li>
          Create/Find image recognition technology that can figure out the
          current track being played, and the race result from streamed video.
        </li>
        <li>
          Update the discord bot with the ability to watch streamed videos, and
          then use image recognition technology on it.
        </li>
      </ol>
      <p>
        I have never created a bot before, but here is the flow I have planned
        in my head for how the process would work. The user starts by typing
        command "/record" with argument "mode" which accepts string literals of
        type 'Mogi' | 'Tournament' | 'War' | 'Casual. This will enter the bot
        into a state where it expects new arguments of trackName and result,
        which get pushed into a larger array called "tracks" which is holding
        the current session history. I'm going to put a limit of maybe 100 races
        you can have during a session to prevent too much spam.
      </p>
      <p>
        When the user is done with their session they type command "/end" which
        will end the session, and bring up the current data from the session,
        which will look something like this
      </p>
      <div className="text-center m-3">
        <img src={images.blog11} alt=""></img>
      </div>
      <p>
        The user then has the choice to use command "/edit" to ammend mistakes,
        or command "/confirm" which makes the bot send the completed object to
        the site.
      </p>
      <p>
        The discordID field is the key to how I'm hoping to avoid creating a
        user/password system for the site. I haven't done too much research but
        I believe that there's some inbuilt function that allows them to obtain
        the discordID of the person interfacing with them. If the discord bot
        can use discordID to figure out who the current user is, and I make the
        discord bot the only entity capable of creating/updating/deleting on the
        database, then hopefully that prevents any malicious users from messing
        up other people's data. There probably is some method of spoofing your
        discordID when talking to a bot, but I'm really hinging on no one with
        the technical know how to do that caring enough to do anything bad.
      </p>
      <p>
        Now you may be wondering, why do all this if you could just insert data
        into an excel sheet and accomplish the same thing. Well the site can
        provide some hopefully interesting statistics on the entered stats and
        let other people easily view your data, but besides that, the exciting
        part that I'm hoping to integrate into the site is image recognition
        technology. This can provide advantages that manually entering data
        cannot, namely the ease of use for entering data, and most importantly,
        it should be able to automatically take a screenshot on the results
        screen of each race. I am no expert in how it works but here is the how
        I'm imaging the process in my head.
      </p>
      <p>
        A video is streamed to a an image recognition program. It should look
        for this screen which occurs before every online race
      </p>
      <div className="text-center m-3">
        <img src={images.blog12} width="400px" height="auto" alt=""></img>
      </div>
      <p>
        The zone marked in red is distinct for each track. I'm hoping that this
        technology can accurately distinguish the correct track. I looked at
        other examples of image recognition technology used in gaming and I
        found autosplitter but it doesn't seem like it's quite what I want
      </p>
      <div className="text-center m-3">
        <img src={images.blog13} alt=""></img>
      </div>
      <p>
        Autosplitter seems to look for a specific image within a specific region
        on the screen, but I need to look for many possibilities within a
        specific region and then identify which track it is, which is probably
        much harder to do.
      </p>
      <p>
        I'm certain it's possible, but I can't find any other examples of image
        recognition being used to scrape data from games. I've never attempted
        this before so I truly have no idea how difficult it will be to do this,
        I'm just really hoping theres a free node library that can handle video
        image recognition.
      </p>
      <p>The result screen also looks like a difficult challenge</p>
      <div className="text-center m-3">
        <img src={images.blog14} width="400px" height="auto" alt=""></img>
      </div>
      <p>
        There's no number that flashes in a distinct location that tells you
        what result you got, instead the bar that indicates your placement just
        highlights yellow and is in a different location depending on your race
        result. There are many places in many tracks with the same color yellow,
        so I'm not really sure how good the technology will be at avoiding false
        positives when it sees that color. I'm hoping to use the region
        highlighted in red to see what placement has been obtained. The rest of
        the bar can be filled with different characters, like character, name,
        flag, and score, but that part should remain the same.
      </p>
      <p>
        The endgame for the project which may or may not even be possible is
        updating the discord bot with the ability to watch you play, and then
        automatically fill out the races array shown above.
      </p>
      <p>
        I've looked for examples of discord bots that can watch video, and there
        does seem to be discord bots capable of interacting with streamed video.
        I havent been able to find any example of people building a bot with the
        intent of using image recognition technology, but if a bot can interact
        with streamed video it should be capable of such a thing.
      </p>
      <p>
        Now you may be asking why it's important that a discord bot be the one
        to examine the video, could you not just build an external application
        like autosplitter, which won't have to deal with reduced video quality
        from video streaming through the discord client? If I build an external
        application to send data to the site, you're going to have to manually
        enter some kind of id to tell the site who you are, and if you can do
        that, then you could impersonate someone else easily if I don't
        implement some kind of password system. That's why I want to limit
        interactions with the site to the bot, and have the bot use an inbuilt
        function to find your id to figure out who its talking to, so there
        would be no need for a password system when modifying site data.
      </p>
      <p>
        I also have concerns on if a bot that can watch discord streams is
        capable of handling multiple calls at once, but I'm gonna cross that
        bridge when I get to it.
      </p>
      <p>
        Thats about all I'm thinking of with my current plans for the project at
        the moment, I'm going to start by building the discord bot or modifying
        Cynda's bot to send post requests to my server, I'm not sure which I
        want to do yet.
      </p>
    </div>
  );
};

export default Blog1;
