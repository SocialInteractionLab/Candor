import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import _ from "lodash";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
//WANT DATA TO GO HERE
const parseCSV = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records;
};

// Path to your CSV file
const csvFilePath =
  "/Users/pranavdronavalli/Research/Candor/experiment1/server/dist/transcript_backbiter.csv";

// Parse CSV file
const data = parseCSV(csvFilePath);

console.log(data);

Empirica.onGameStart(({ game }) => {
  game
    .addRound({
      name: "Intro",
      task: "Introduction",
    })
    .addStage({ name: "Introduction", duration: 90 });
  game
    .addRound({
      name: "Cycle",
      task: "Cycle",
    })
    .addStage({ name: "Cycle", duration: 900 });
  //Set data as csv from backend
  game.set("data", data);
});
Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
