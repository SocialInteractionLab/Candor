import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
// import _ from "lodash";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { getFile, test } from './google.js';

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
// const csvFilePath =
//   "/experiment1/Intro_example.csv"

const csvFilePath = path.join(__dirname, 'Intro_example.csv');

// Parse CSV file
const intro_example = parseCSV(csvFilePath);

Empirica.onGameStart(({ game }) => {
  const { fileNumber } = game.get("treatment");

  console.log(fileNumber)
    getFile(fileNumber).then((file) => {
      game.set('count', file.count_no) // better track for which file is read
      game.set('data', file.content) // convos
      game.set('conversation_id', file.file_id) // actual file id
      console.log('file loaded')
      const round = game.addRound({
        name: "Candor",
        task: "Candor",
      })
      round.addStage({name: "Instruction", duration: 30000000})
      round.addStage({name: "Annotation", duration: 30000000 })
  
    })
});

Empirica.onRoundStart(({ round }) => {
  round.set('example', intro_example)
});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {
  round.set('example', '')
});

Empirica.onGameEnded(({ game }) => {
  game.set('data', '')
});