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
      <p>To create a profile on the site, type the command /newuser</p>
      <div className="text-center m-3">
        <img src={images.newUser} alt=""></img>
      </div>
      <p>
        This site knows who you are based on your discordID, which is a unique
        18 digit number assigned to each discord user. The bot knows your
        discordId from each message you send it, so if your account is lost you
        will no longer be able to interface with this site as that user any
        more.
      </p>
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
        so that you can type even less when inerting data.
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
