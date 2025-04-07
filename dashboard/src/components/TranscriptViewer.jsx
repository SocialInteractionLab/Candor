import React from 'react';
import { Title, Text, Badge, Box, Paper, Group, Stack, ScrollArea } from '@mantine/core';
import TranscriptBubble from './TranscriptBubble';
import './transcript.css';

export function TranscriptViewer({ transcriptData, loading, error, annotationData, selectedTurnId, concensusData }) {
  console.log("TranscriptViewer props:", { transcriptData, selectedTurnId });
  
  if (loading) return <Text>Loading transcript data...</Text>;
  if (error) return <Text color="red">Error: {error}</Text>;
  if (!transcriptData || !transcriptData.content || transcriptData.content.length === 0) {
    return <Text>No transcript data available</Text>;
  }

  // Group utterances by topic
  const utterancesByTopic = {};
  let currentTopic = "Starting The Call";
  
  transcriptData.content.forEach(utterance => {
    if (utterance.New_Topic && utterance.New_Topic !== "") {
      currentTopic = utterance.New_Topic;
    }
    
    if (!utterancesByTopic[currentTopic]) {
      utterancesByTopic[currentTopic] = [];
    }
    
    utterancesByTopic[currentTopic].push(utterance);
  });
  
  return (
    <Stack spacing="md">
      <Title order={3}>Transcript Details</Title>

      {Object.entries(utterancesByTopic).map(([topic, utterances], topicIndex) => (
        <Paper 
          key={topicIndex} 
          withBorder 
          p="md"
          sx={(theme) => ({
            borderLeft: `4px solid ${theme.colors.blue[6]}`,
          })}
        >
          <Group mb="md">
            {/* <Badge>{utterances.length} utterances</Badge> */}
          </Group>

          <ScrollArea h="50vh" type="auto">
            <Box p="md">
              {utterances.map((utterance, idx) => {
                const turnId = utterance.Number || idx + 1;
                return (
                  <Box 
                    key={idx} 
                    id={`transcript-turn-${turnId}`}
                    className={selectedTurnId === turnId ? 'highlight-turn' : ''}
                  >
                    <TranscriptBubble 
                      index={idx} 
                      data={utterance} 
                      annotationData={annotationData || []} 
                      concensusData={concensusData}
                    />
                  </Box>
                );
              })}
            </Box>
          </ScrollArea>
        </Paper>
      ))}
    </Stack>
  );
} 