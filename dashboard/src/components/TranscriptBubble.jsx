import React from 'react';
import './textbubble.css';
import { Box, Text, Group, Paper, Badge } from '@mantine/core';

const TranscriptBubble = ({ index, data, annotationData, concensusData}) => {
  const messageClass = `${index % 2 === 0 ? "bubble-left" : "bubble-right"}`;
  const alignment = index % 2 === 0 ? "flex-start" : "flex-end";
  const textAlignment = index % 2 === 0 ? "left" : "right";

  const annotation = annotationData?.find(item => item.turn_id === index);
  const consensus = concensusData?.find(item => item.turn_id === index);
  
  return (
    <Box 
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignment,
        width: '100%',
        padding: theme.spacing.md,
        backgroundColor: consensus ? 'red' : 'transparent'
      })}
    >
      {index === 0 && (
        <Group position="apart" sx={{ maxWidth: '80%', marginBottom: 8 }}>
          <Text size="sm" color="dimmed" truncate>
            Starting Topic: {data.New_Topic || "Starting The Call"}
          </Text>
        </Group>
      )}

    {consensus && (
        <Badge 
          variant="light" 
          color="red" 
          sx={{ alignSelf: alignment, marginBottom: 4 }}
        >
          Consensus Turn
        </Badge>
      )}

      {annotation && (
        <Paper 
        //   p="xs" 
          sx={(theme) => ({
            maxWidth: '80%',
            marginBottom: 2,
            alignSelf: alignment,
          })}
        >
          <Text size="sm" color="dimmed" align={textAlignment}>
            <span>{`#${index}`} | </span>
            <span>Previous Topic: {annotation.previous_topic} | </span>
            <span>New Topic: {annotation.new_topic}</span>
          </Text>
        </Paper>
      )}
      
      <Box className={messageClass} sx={{ alignSelf: alignment }}>
        <Text size="lg">{data.utterance}</Text>
      </Box>
    </Box>
  );
};

export default TranscriptBubble; 