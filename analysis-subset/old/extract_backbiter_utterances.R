# extract utterances from backbiter CANDOR transcripts
# author: helen schmidt
# description: this script extracts utterances in preparation for tiling

# define working directory 
cwd <- "/Users/helenschmidt/Library/CloudStorage/GoogleDrive-helenschmidt129@gmail.com/My Drive/SANLab/Experiments/CANDOR"
setwd(cwd)
# define path to raw backbiter transcripts
transcripts <- paste0(cwd, "/transcripts/raw", sep = "")

# load necessary libraries
library(stringr)
library(dplyr)

# get all subfolder paths to backbiter transcripts
# note: takes a while to run
backbiter <- list.files(transcripts,
                        full.names = TRUE,
                        pattern = "transcript_backbiter.csv",
                        recursive = TRUE)

# bind backbiter data into one data frame and add transcript_id from folder name
backbiter <- do.call(rbind, lapply(backbiter, function(x) { data = read.csv(x, header = TRUE)
      convo = str_extract(x, "(?<=raw/)[^/]+")
      data$transcript_id = convo
      return(data)}))

# select only some variables of interest
backbiter <- backbiter |>
  select(turn_id, speaker, transcript_id, utterance)

# save
write.csv(backbiter, "/Users/helenschmidt/Library/CloudStorage/GoogleDrive-helenschmidt129@gmail.com/My Drive/SANLab/Experiments/Conversation-Structure/data/raw/all_backbiter_transcripts.csv", row.names = FALSE)
