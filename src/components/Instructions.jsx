import React from "react";
import images from "../images/instructions_images/index";

const Instructions = () => {
  return (
    <div>
      <h3 className="text-center m-3">Instructions</h3>
      <p>
        In order to interface with this site, you need to input your race data
        to a discord bot.
      </p>
      <div className="text-center m-3">
        <img src={images.botProfile} alt=""></img>
      </div>
      <p>
        You can direct message the bot commands, or run commands from any server
        that the bot is a part of.
      </p>
      <p>
        To start with, you must create a profile on the site, type the command
        /newuser
      </p>
      <div className="text-center m-3">
        <img src={images.newUser} alt=""></img>
      </div>
      <p>
        This site knows who you are based on your discordID, which is a unique
        18 digit number assigned to each discord user. The bot knows your
        Discord ID from each message you send it, so if your account is lost you
        will no longer be able to interface with this site as that user on
        discord any more.
      </p>
      <p>
        There are two methods of entering race data. Option 1 is to stream your
        capture card to the Video Scan page, where image recognition technology
        will be able to automatically fill out race data for submission. Option
        2 is to manually input race data to the discord bot.
      </p>
      <h3 className="text-center m-2">Automatic Entry</h3>
      <div className="text-center m-1">
        <a href="mk8dx-race-history-tracker.com/scan">
          mk8dx-race-history-tracker.com/scan
        </a>
      </div>
      <p>
        To begin with, you must enable the webpage to be able to view your
        desktop video sources when prompted.
      </p>
      <div className="text-center m-3">
        <img src={images.videoPermission} alt=""></img>
      </div>
      <p>
        After accepting, refresh the page to see a list of video sources. Your
        video source must be a complete window of the game without any
        extraneous images on it in the standard 16:9 aspect ratio. Also make
        sure that you your switch screen size is at 100%.
      </p>
      <div className="text-center m-3">
        <img src={images.expectedCaptureFeed} alt=""></img>
      </div>
      <p>
        At this point, that's all the setup you need to do. If you attempt some
        online races, you should see the table below populate with race data.
      </p>
      <div className="text-center m-3">
        <img src={images.exampleRace} alt=""></img>
      </div>
      <p>
        In order to be able to insert races directly from this page, we're going
        to need to talk to the discord bot one more time. Run the command
        /generate_apikey, and paste in the provided string into the field in the
        submit tab. If you have cookies enabled, this string should permanently
        save to your browser. If for any reason you lose it, you can run this
        command as much as you like to get a new key.
      </p>
      <p>
        Once you've pasted in your apiKey and selected the race mode, you should
        be able to submit your races played.
      </p>
      <div className="text-center m-3">
        <img src={images.exampleInsertion} alt=""></img>
      </div>
      <p>
        You can follow the link upon the successful insertion to check if your
        races updated correctly.
      </p>
      <h2 className="text-center m-2">Debugging</h2>
      <p>
        An important function used in the program to grab the current frame of
        the video stream is not supported on all browsers. Here is a list as of
        9/20/2023 of all supported browsers that have been tested to work for
        video scan.
      </p>
      <div className="text-center m-3">
        <img
          style={{ width: "480px", height: "auto" }}
          src={images.debugging1}
          alt=""
        ></img>
      </div>
      <p>
        If the scan still doesn't work, right click the page, click the inspect
        tab at the bottom, then go to the console tab and check if you receieve
        an error message like the one below.
      </p>
      <div className="text-center m-3">
        <img
          style={{ width: "auto", height: "480px" }}
          src={images.debugging2}
          alt=""
        ></img>
      </div>
      <p>
        This error likely occurs because you are attempting to use a video
        source in more than one location on a windows computer, which is not
        allowed. I'm going to guess this is probably happening because you also
        have obs open to get game audio or to stream your gameplay. You can
        bypass this by using obs's virtual cam feature, which creates another
        instance of the video, so you can use the scan and still have your obs
        pick up the capture card.
      </p>
      <div className="text-center m-3">
        <img
          style={{ width: "auto", height: "480px" }}
          src={images.debugging3}
          alt=""
        ></img>
      </div>
      <p>
        If the scan page doesn't let you pick any option as a video source, try
        closing obs, then refreshing your page to see a list of video sources.
        If you pick obs virtual cam, it should save that option for whenever you
        refresh the page.
      </p>
      <p>
        If that still doesn't work, try finding me on discord and I'll give a
        shot at debugging it.
      </p>
      <h3 className="text-center m-2">Manual Entry</h3>
      <p>
        To begin entering data, type the command /newrace, which accepts 3
        arguments.
      </p>
      <div className="text-center m-3">
        <img src={images.newRaceMode} alt=""></img>
      </div>
      <p>
        It's important to catagorize each race you play, because the level of
        competition you may face for each is different. There are 3 accepted
        modes of competitive play: Mogi, Tournament, and War. If you'd like to
        enter races for any other reason, select Casual.
      </p>
      <div className="text-center m-3">
        <img src={images.newRaceTrack} alt=""></img>
      </div>
      <p>Enter the abbreviation for the track on which the race was played.</p>
      <div className="text-center m-3">
        <img src={images.newRaceResult} alt=""></img>
      </div>
      <p>Enter a number 1-12 that represents the placement within the race.</p>
      <div className="text-center m-3">
        <img src={images.insertedRace} alt=""></img>
      </div>
      <p>
        If all goes well, you should be able to see the ID of the race that was
        just inserted. There is going to be no moderation of the race results
        posted by any users. If somebody wants to input that they won 1st 1000
        races in a row then that's on them. If you need to delete a race for any
        reason, run the command /deleterace, with the ID of the race that you
        want to delete.
      </p>
      <div className="text-center m-3">
        <img src={images.deleteRace} alt=""></img>
      </div>
      <p>This command can only work on races that belong to you as a user.</p>
      <p>
        Tips for typing data more quickly, there are commands that use shorthand
        so that you can type even less when inserting data.
      </p>
      <div className="text-center m-3">
        <img src={images.shorthandRace} alt=""></img>
      </div>
      <p>
        There are 4 shorthand commands, c_race, m_race, t_race and w_race. These
        correspond to a casual race, mogi race, tournament race, and war race.
        If you use these commands to insert, you will not have to input the mode
        when you try and insert a new race. Also if you hit up arrow on your
        keyboard, your current message will jump to your previously typed
        message, so if you enter in a lot of races in a row, you can just hit up
        arrow and alter your previous command.
      </p>
    </div>
  );
};

export default Instructions;
