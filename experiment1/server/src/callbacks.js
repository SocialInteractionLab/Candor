import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import _ from "lodash";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { getFile } from './google.js';

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
  // "/Users/pranavdronavalli/Research/Candor/transcript_backbiter.csv";
  "/Users/zhoucy/Desktop/RAship/Candor/experiment1/transcript_backbiter.csv"

// Parse CSV file
// const data = parseCSV(csvFilePath);

Empirica.onGameStart(({ game }) => {
  getFile().then((file) => {
    game.set('data', file.content)
    console.log('file loaded')
    game
    .addRound({
      name: "Cycle",
      task: "Cycle",
    })
    .addStage({ name: "Cycle", duration: 9000 })

  })
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {
});