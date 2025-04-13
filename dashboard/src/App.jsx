import { useState } from 'react'
import { Container, Title, Button, TextInput } from '@mantine/core';
import { TableSort } from './components/table'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DetailsPage } from './components/DetailsPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Container size="lg" style={{ marginTop: 40 }}>
            <Title order={2} align="center" mb="md">
              Candor Annotation Data
            </Title>
            <TableSort />
          </Container>
        } />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
