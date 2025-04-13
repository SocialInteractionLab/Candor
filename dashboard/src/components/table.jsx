import { useState, useEffect } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import Papa from 'papaparse';
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Container,
  UnstyledButton,
} from '@mantine/core';
import classes from './TableSort.module.css';
import { useNavigate } from 'react-router-dom';

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (sortBy === 'transcript_id') {
        // Use string comparison for other columns
        if (payload.reversed) {
          return b[sortBy].localeCompare(a[sortBy]);
        }
        return a[sortBy].localeCompare(b[sortBy]);
      }
      // Convert to numbers for numeric comparison
      const aNum = Number(a[sortBy]);
      const bNum = Number(b[sortBy]);
      return payload.reversed ? bNum - aNum : aNum - bNum;
    }),
    payload.search
  );
}

export function TableSort() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/src/data/transcript_summary_data.csv')
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        setData(result.data);
        setSortedData(result.data);
      })
      .catch(error => console.error('Error loading CSV:', error));
  }, []);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  // Dynamically generate headers based on the first row of data
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const handleRowClick = (row) => {
    const id = row.id || Object.values(row)[0]; // Fallback to first value if no id
    navigate(`/details/${id}`, { state: { rowData: row } });
  };

  const rows = sortedData.map((row, index) => {
    return (
      <Table.Tr 
        key={index} 
        onClick={() => handleRowClick(row)} 
        style={{ cursor: 'pointer' }}
        className={classes.tableRow}
      >
        {headers.map((header) => (
          header !== 'annotators' ? (
            <Table.Td key={header}>{row[header]}</Table.Td>
          ) : null
        ))}
      </Table.Tr>
    );
  });

  return (
    <>
      <Container size="xl" style={{ padding: "20px", marginBottom: "30px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
             {`Total number of transcripts: ${data.length} | Total number of annotators: ${data.reduce((sum, row) => sum + row.number_annotators, 0)}`}
      </Container>
      <TextInput
        placeholder="Search by transcript ID"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea h="calc(100vh - 120px)">
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              {headers.map((header) => (header !== 'annotators' ?
                <Th
                  key={header}
                  sorted={sortBy === header}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(header)}
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </Th> : null
              ))}
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={headers.length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}