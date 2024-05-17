import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import _ from "lodash";

//true and false framing for each topic
const trueFraming = [
  "Angels are not real.",
  "Everything that happens can eventually be explained by science.",
  "The position of the planets at the time of your birth has no influence on your personality.",
  "A “body cleanse,” in which you consume only particular kinds of nutrients over 1-3 days, does not help your body to eliminate toxins.",
  "Regular fasting will not improve your health.",
  "The US deficit decreased after President Obama was first elected.",
  "The United States doesn’t have the highest federal income tax rate of any Western country.",
];
const falseFraming = [
  "Angels are real.",
  "Everything that happens cannot eventually be explained by science.",
  "The position of the planets at the time of your birth can influence your personality.",
  "A “body cleanse,” in which you consume only particular kinds of nutrients over 1-3 days, helps your body to eliminate toxins.",
  "Regular fasting will improve your health.",
  "The US deficit increased after President Obama was first elected.",
  "The United States has the highest federal income tax rate of any Western country.",
];

//WANT DATA TO GO HERE

topic = 0;
Empirica.onGameStart(({ game }) => {
  //grab topic index for tweet
  //if topic greater than length wrap around
  if (topic >= trueFraming.length) {
    topic = topic % trueFraming.length;
  }
  game.set("topic", trueFraming[topic]);

  trueFrame = true;
  //set true and false framing for each player, half the players get false framing half get true
  game.players.forEach((player) => {
    player.set("tweet", trueFrame ? trueFraming[topic] : falseFraming[topic]);
    trueFrame = !trueFrame;
  });
  game
    .addRound({
      name: "Intro",
      task: "Introduction",
    })
    .addStage({ name: "Introduction", duration: 90 });
  game
    .addRound({
      name: "Initial Opinion",
      task: "Opinion",
    })
    .addStage({ name: "opinion", duration: 120 });
  game
    .addRound({
      name: "Post Opinion",
      task: "Opinion",
    })
    .addStage({ name: "opinion", duration: 120 });
  //TO DO: ADD STAGE, RENDER TRANSCRIPT BASED ON SERVER VALUE
});
Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {
  topic = topic + 1;
});
