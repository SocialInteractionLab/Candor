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
      if (sortBy === 'number_annotators') {
        // Convert to numbers for numeric comparison
        const aNum = Number(a[sortBy]);
        const bNum = Number(b[sortBy]);
        return payload.reversed ? bNum - aNum : aNum - bNum;
      }
      // Use string comparison for other columns
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }
      return a[sortBy].localeCompare(b[sortBy]);
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
    // Load and parse the CSV file
    fetch('/src/data/sample.csv')
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true
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
    // You can use any unique identifier from your row data
    // For example, if you have an 'id' field:
    const id = row.id || Object.values(row)[0]; // Fallback to first value if no id
    navigate(`/details/${id}`, { state: { rowData: row } });
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr 
      key={index} 
      onClick={() => handleRowClick(row)} 
      style={{ cursor: 'pointer' }}
      className={classes.tableRow}
    >
      {headers.map((header) => (
        <Table.Td key={header}>{row[header]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea h="calc(100vh - 120px)">
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              {headers.map((header) => (
                <Th
                  key={header}
                  sorted={sortBy === header}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(header)}
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </Th>
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