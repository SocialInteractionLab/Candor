import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Group, Badge, Box, Paper, Select, Grid, Divider, Flex } from '@mantine/core';
import { useEffect, useState, useRef } from 'react';
import { TranscriptViewer } from './TranscriptViewer';
import Papa from 'papaparse';
import './transcript.css';
import csvData from '../data/denseSubset_all.csv?raw';
import csvConcensusData from '../data/consensus_turn_ids.csv?raw';
import csvConsensusMatchrate from '../data/consensus_matchrates.csv?raw';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function DetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rowData = location.state?.rowData || {};
  const [folderData, setFolderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [annotationData, setAnnotationData] = useState(null);
  const [annotator, setAnnotator] = useState(null);
  const [individualData, setIndividualData] = useState(null);
  const [selectedTurnId, setSelectedTurnId] = useState(null);
  const transcriptRef = useRef(null);

  const [concensusData, setConcensusData] = useState(null);

  const [consensusMatchrate, setConsensusMatchrate] = useState(0);

  const [participantMatchrate, setParticipantMatchrate] = useState(null);

  // Fetch data by folder name using fetch API
  useEffect(() => {
    const fetchFolderData = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`/api/folder/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch folder data: ${response.statusText}`);
          }
          
          const data = await response.json();
          setFolderData(data);
          console.log("Folder data loaded:", data);
        } catch (err) {
          console.error('Error fetching folder data:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFolderData();

    // Parse the imported CSV data directly
    try {
      console.log("Parsing CSV data...");
      const result = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
      
      if (result.errors && result.errors.length > 0) {
        console.warn('CSV parsing had some errors:', result.errors);
      }
      
      setAnnotationData(result.data);
      console.log("Parsed CSV data:", result.data);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }

    try {
        console.log("Parsing concensus data...");
        const result = Papa.parse(csvConcensusData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        
        if (result.errors && result.errors.length > 0) {
          console.warn('CSV parsing had some errors:', result.errors);
        }
        
        setConcensusData(result.data.filter(item => item.transcript_id === id));
        console.log("Parsed concensus data:", result.data);
      } catch (error) {
        console.error('Error parsing concensus data:', error);
      }

      try {
        console.log("Parsing concensus matchrate...");
        const result = Papa.parse(csvConsensusMatchrate, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        
        if (result.errors && result.errors.length > 0) {
          console.warn('CSV parsing had some errors:', result.errors);
        }
        
        setConsensusMatchrate(result.data);
        console.log("Parsed concensus matchrate:", result.data);
      } catch (error) {
        console.error('Error parsing concensus matchrate:', error);
      }
  }, [id]);

  // Parse annotators if they exist
  const renderAnnotators = () => {
    if (!rowData.annotators) return null;
    
    try {
      // The annotators are stored as a string representation of an array
      // need to parse
      const annotatorString = rowData.annotators;
      const annotators = JSON.parse(annotatorString.replace(/"/g, '"'));
      
      // Create data for the Select component
      const annotatorOptions = annotators.map(annotator => ({
        value: annotator,
        label: annotator
      }));
      
      return (
        <Box>
          <Text fw={700} mb="xs">Select Annotator:</Text>
          <Select
            placeholder="Choose an annotator"
            data={annotatorOptions}
            value={annotator}
            onChange={(value) => {
              setAnnotator(value);
              // Filter annotation data for the selected annotator
              const filtered = annotationData.filter(
                item => item.participent_id === value && item.transcript_id === id
              );
              setIndividualData(filtered);

              const matchrate = consensusMatchrate.find(item => item.PID === value && item.transcript_id === id);
              console.log("Matchrate:", matchrate);
              if (matchrate) {
                setParticipantMatchrate(matchrate.match_rate); // Access the specific matchrate property
              } else {
                setParticipantMatchrate(null);
                console.log("No matchrate found for this participant and transcript");
              }
              console.log("Filtered data:", filtered);
            }}
            style={{ width: '100%' }}
          />
        </Box>
      );
    } catch (error) {
      console.error("Error parsing annotators:", error);
      return <Text color="red">Error displaying annotators</Text>;
    }
  };

  // Prepare timeline data for the chart
  const prepareTimelineData = () => {
    if (!folderData || !folderData.content) return [];
    
    // Create an array with all turns from the transcript
    const timelineData = folderData.content.map((turn, index) => ({
      index,
      turnId: turn.Number || index + 1,
      value: 1,
      speaker: turn.speaker,
      text: turn.utterance?.substring(0, 30) + (turn.utterance?.length > 30 ? '...' : '')
    }));
    
    console.log("Timeline data prepared:", timelineData);
    return timelineData;
  };
  
  // Get the turn IDs that are in the individualData
  const getAnnotatedTurnIds = () => {
    if (!individualData) return [];
    return individualData.map(item => item.turn_id);
  };
  
  const timelineData = prepareTimelineData();
  const annotatedTurnIds = getAnnotatedTurnIds();

  // Handle click on timeline
  const handleTimelineClick = (data) => {
    console.log("Timeline clicked:", data);
    if (data && data.activePayload && data.activePayload[0]) {
      const turnId = data.activePayload[0].payload.turnId;
      console.log("Selected turn ID:", turnId);
      setSelectedTurnId(turnId);
      
      // Scroll to the selected turn
      setTimeout(() => {
        const element = document.getElementById(`transcript-turn-${turnId}`);
        console.log("Looking for element:", `transcript-turn-${turnId}`, element);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the element temporarily
          element.classList.add('highlight-turn');
          setTimeout(() => {
            element.classList.remove('highlight-turn');
          }, 2000);
        }
      }, 100);
    }
  };

  return (
    <Container fluid style={{ padding: '20px' }}>
      <Group position="apart" mb="md">
        <Title order={2}>Transcript: {id}</Title>
        <Button onClick={() => navigate(-1)}>Back to List</Button>
      </Group>
      
      <Grid gutter="md">
        {/* Left column - Metadata and Controls */}
        <Grid.Col span={3}>
          {/* Metadata section */}
          <Paper p="md" withBorder mb="md" style={{ height: 'calc(50vh - 100px)', overflowY: 'auto' }}>
            <Title order={4} mb="md">Metadata</Title>
            <div>
              {Object.entries(rowData).map(([key, value]) => {
                // Skip rendering annotators here as we'll handle them separately
                if (key === 'annotators') return null;
                
                return (
                  <div key={key} style={{ marginBottom: 15 }}>
                    <Text fw={700}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                    <Text>{value}</Text>
                  </div>
                );
              })}
            </div>
          </Paper>
          
          {/* Annotator selection */}
          <Paper p="md" withBorder mb="md">
            {renderAnnotators()}
          </Paper>
          
          {/* Additional controls or information can go here */}
          <Paper p="md" withBorder style={{ height: 'calc(50vh - 200px)', overflowY: 'auto' }}>
            <Title order={4} mb="md">Annotation Summary</Title>
            {individualData && (
              <>
                <Text>Total annotations: {individualData.length}</Text>
                {participantMatchrate !== null && (
                  <Text>Matchrate: {participantMatchrate.toFixed(2)}</Text>
                )}
                {/* Add more summary statistics as needed */}
              </>
            )}
          </Paper>
        </Grid.Col>
        
        {/* Right column - Timeline and Transcript */}
        <Grid.Col span={9}>
          {/* Timeline visualization */}
          {(annotator && individualData) ? (
            <Paper p="md" withBorder mb="md">
              <Title order={4} mb="md">Annotation Timeline for {annotator}</Title>
              <Text size="sm" mb="md">Highlighted lines show annotated turns. Click on any point to navigate to that turn.</Text>
              <div style={{ width: '100%', height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timelineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    onClick={handleTimelineClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="turnId" label={{ value: 'Turn ID', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value, name, props) => [props.payload.text, props.payload.speaker]} 
                      labelFormatter={(label) => `Turn ID: ${label}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={true} />
                    
                    {/* Add reference lines for annotated turns */}
                    {annotatedTurnIds.map(turnId => (
                      <ReferenceLine key={turnId} x={turnId} stroke="red" strokeWidth={2} />
                    ))}
                    
                    {/* Add reference lines for consensus turns */}
                    {concensusData.map(item => (
                      <ReferenceLine key={`consensus-${item.turn_id}`} x={item.turn_id} stroke="green" strokeWidth={2} strokeDasharray="3 3" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Box mt="xs">
                <Flex gap="md" align="center">
                  <Box w={16} h={2} bg="red" />
                  <Text size="xs">Annotation</Text>
                  <Box w={16} h={2} bg="green" style={{ borderStyle: 'dashed', borderWidth: '0 0 2px 0' }} />
                  <Text size="xs">Consensus turns</Text>
                </Flex>
              </Box>
            </Paper>
          ) : (
            <Paper p="md" withBorder mb="md">
              <Title order={4} mb="md">Annotation Timeline</Title>
              <Text size="sm" mb="md">Highlighted lines show annotated turns. Click on any point to navigate to that turn.</Text>
              <div style={{ width: '100%', height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timelineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    onClick={handleTimelineClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="turnId" label={{ value: 'Turn ID', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value, name, props) => [props.payload.text, props.payload.speaker]} 
                      labelFormatter={(label) => `Turn ID: ${label}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={true} />
                    
                    {/* Add reference lines for annotated turns */}
                    {annotatedTurnIds.map(turnId => (
                      <ReferenceLine key={turnId} x={turnId} stroke="red" strokeWidth={2} />
                    ))}
                    
                    {/* Add reference lines for consensus turns */}
                    {concensusData?.map(item => (
                      <ReferenceLine key={`consensus-${item.turn_id}`} x={item.turn_id} stroke="green" strokeWidth={2} strokeDasharray="3 3" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Box mt="xs">
                <Flex gap="md" align="center">
                  <Box w={16} h={2} bg="red" />
                  <Text size="xs">Annotation</Text>
                  <Box w={16} h={2} bg="green" style={{ borderStyle: 'dashed', borderWidth: '0 0 2px 0' }} />
                  <Text size="xs">Consensus turns</Text>
                </Flex>
              </Box>
            </Paper>
          )}
          
          <Paper p="md" withBorder ref={transcriptRef}>
            <TranscriptViewer 
              transcriptData={folderData} 
              loading={loading} 
              error={error} 
              annotationData={individualData}
              selectedTurnId={selectedTurnId}
              concensusData={concensusData}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}