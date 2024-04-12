import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders the no graph selected text', () => {
  render(<App />);
  const linkElement = screen.getByText(/select a graph to display/i);
  expect(linkElement).toBeInTheDocument();
});

test('tests can fail', () => {
  render(<App />);
  const linkElement = screen.queryByText(/gibberish fdlmvxcwjvci/i);
  expect(linkElement).toBeNull();
});
