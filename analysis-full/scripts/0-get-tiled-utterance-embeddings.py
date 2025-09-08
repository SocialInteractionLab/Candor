import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# define data input location
input_dir = "../../../candor_data/all_transcripts.csv"
# define data output location
output_dir = "../../../output/"

# load pre-trained sentence transformer model (aka SBERT)
model = SentenceTransformer('all-MiniLM-L6-v2')

# load all modified transcripts and combine into one data frame
all_dfs = []
for dirpath, dirnames, filenames in os.walk(input_dir):
    for filename in filenames:
        if filename == 'transcript_backbiter_transformed_noLine1.csv':
            file_path = os.path.join(dirpath, filename)
            df = pd.read_csv(file_path)
            relative_path = os.path.relpath(dirpath, input_dir)
            transcript_id = relative_path.split(os.sep)[0] if relative_path else ''
            # add new variable for transcript ID from folder name
            df['transcript_id'] = transcript_id
            all_dfs.append(df)

# Concatenate all dataframes by rows (like row bind)
df = pd.concat(all_dfs, ignore_index=True)

# only need a few variables from df for tiling
# turn_id, speaker, transcript_id, utterance
selected_df = df[['turn_id', 'speaker', 'utterance', 'transcript_id']]

# also create a test subset to make sure tiling function works 
test_df = selected_df.head(10).copy()

# preview subset
selected_df.head()

# define euclidean distance function
def euclidean_dist(vec1, vec2):
    return np.linalg.norm(vec1 - vec2)

# create a function to get tiled cosine similarities between aggregated utterances w/ specified gap size
def tiled_cosine_similarity(df, window_size, gap_size):
    # create empty list to store output
    results = []
    # iterate over each group of transcript_id
    for idx, (transcript_id, group) in enumerate(df.groupby('transcript_id'), start = 1):
        # sort by turn_id to maintain conversation order
        group = group.sort_values(by = "turn_id")
        # extract all utterances for this transcript
        utterances = group['utterance'].tolist()
        print(f"Processing transcript {idx} out of {df['transcript_id'].nunique()}: {transcript_id}")
        #print(f"Length utterances = {len(utterances)} for transcript {transcript_id}")
        # now move to sliding window approach to get similarity between consecutive windows
        for i in range(len(utterances) - window_size):
            #i = i + 2
            # get start row and end row of window A
            A_start = i # inclusive
            A_end = A_start + window_size # exclusive
            window_A = df['utterance'].iloc[A_start:A_end].str.cat(sep = " ")
            # get start row and end row of window B 
            B_start = i + window_size + gap_size
            B_end = B_start + window_size
            window_B = df['utterance'].iloc[B_start:B_end].str.cat(sep = " ")
            # ensure that both windows are not empty
            if len(window_A) > 0 and len(window_B) > 0:
                # get embeddings for both windows
                embeddings_A = model.encode(window_A)
                embeddings_B = model.encode(window_B)
                # ensure embeddings are 2D arrays
                embeddings_A = embeddings_A.reshape(1, -1)
                embeddings_B = embeddings_B.reshape(1, -1)
                # alert me if embeddings have different shapes
                assert embeddings_A.shape[1] == embeddings_B.shape[1], \
                    f"Dimensionality mismatch: A={embeddings_A.shape[1]}, B={embeddings_B.shape[1]}"
                # get cosine similarity between utterances in windows A and B
                similarity = cosine_similarity(embeddings_A, embeddings_B)
                # save output
                output = {
                    'transcript_id': transcript_id,
                    'window_size': window_size,
                    'gap_size': gap_size,
                    'A_start_turn': A_start + 1, # account for 0-bounding python
                    'A_end_turn': A_end,
                    'A_utterances': window_A,
                    'A_embeddings': embeddings_A,
                    'B_start_turn': B_start + 1, # account for 0-bounding python
                    'B_end_turn': B_end,
                    'B_utterances': window_B,
                    'B_embeddings': embeddings_B,
                    'cosine_similarity': similarity[0][0]
                }
                results.append(output)
    
    # convert results list to data frame
    results_df = pd.DataFrame(results)
    print(results_df.head())
    # add euclidean distance rowwise
    results_df['euclidean_distance'] = results_df.apply(lambda row: euclidean_dist(row['A_embeddings'], row['B_embeddings']), axis=1)
    # return
    return results_df

# apply tiling function
#tile_3_0 = tiled_cosine_similarity(selected_df, 3, 0)
# save
#tile_3_0.to_pickle(output_dir + "/full_sample_tile_3_0.pkl")
#tile_3_0.to_csv(output_dir + "/full_sample_tile_3_0.csv", index = False)
# preview
#tile_3_0.head()

# apply tiling function
tile_10_0 = tiled_cosine_similarity(selected_df, 10, 0)
# save
tile_10_0.to_pickle(output_dir + "/full_sample_tile_10_0.pkl")
tile_10_0.to_csv(output_dir + "/full_sample_tile_10_0.csv", index = False)
# preview
tile_10_0.head()