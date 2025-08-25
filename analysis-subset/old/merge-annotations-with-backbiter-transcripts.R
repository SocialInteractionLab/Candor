# merge annotations with backbiter CANDOR transcripts
# author: helen schmidt
# description: this script merges experimental annotations with raw, backbiter 
# transcripts from the CANDOR conversation dataset

# HS note: this script is set up with the idea that people download the project
# folder from github/osf. the annotation data transformed from raw output is 
# included in a "data" subfolder and the CANDOR transcripts are separately 
# downloaded and saved in a "transcripts" subfolder. this script would exist in a 
# "scripts" subfolder.

# project folder
# -- data subfolder
# -- transcripts subfolder
# -- scripts subfolder
# ---- merge-annotations-with-backbiter-transcripts.R

# ----- ONLY CHANGE ITEMS IN THIS ZONE ----- #

# define working directory 
cwd <- "/Users/helenschmidt/Library/CloudStorage/GoogleDrive-helenschmidt129@gmail.com/My Drive/SANLab/Experiments/CANDOR"
setwd(cwd)

# load annotation data
annotation1 <- read.csv("./analysis/data/dense_subset1.csv")
annotation2 <- read.csv("./analysis/data/dense_subset2.csv")

# define path to raw backbiter transcripts
transcripts <- paste0(cwd, "/transcripts/raw", sep = "")

# ----------- END OF CHANGE ZONE ----------- #

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

# combine annotated conversations
annotation <- rbind(annotation1, annotation2)

# get list of currently annotated conversations
annotated_convos <- unique(annotation$transcript_id)

# select only backbiter transcripts that have associated annotations
backbiter_subset <- subset(backbiter, transcript_id %in% annotated_convos)

# merge backbiter transcript data with annotation data
final <- merge(backbiter_subset, annotation, 
               by = c("turn_id", "speaker", "transcript_id"), 
               all = TRUE, sort = TRUE)

# save final merged data
write.csv(final, "./analysis/data/dense_subset1_and_subset2_processed.csv", row.names = FALSE)
