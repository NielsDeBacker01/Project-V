import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders the no graph selected text on start', () => {
  render(<App />);
  const textElement = screen.queryByText(/select a graph to display/i);
  expect(textElement).not.toBeNull();
});

test('renders sidebar', () => {
  render(<App />);
  const sidebarElement = screen.getByTestId('sidebar');
  expect(sidebarElement).not.toBeNull();
});
