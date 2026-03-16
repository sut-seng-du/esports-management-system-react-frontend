import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopDebtors from '../pages/TopDebtors';
// Mock api
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
  API_BASE: '',
}));

import api from '../api';

describe('TopDebtors Component', () => {
  const mockDebtors = [
    { member_ID: 'MEM-001', total_debt: 50000 },
    { member_ID: 'MEM-002', total_debt: 30000 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockImplementation(() => Promise.resolve({ data: { data: mockDebtors } }));
  });

  test('renders top debtors list', async () => {
    render(<TopDebtors />);
    
    // Wait for initial load to finish
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/MEM-001/)).toBeInTheDocument();
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
  });

  test('applies limit filter', async () => {
    render(<TopDebtors />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    const limitInput = screen.getByLabelText(/Result Limit/i);
    fireEvent.change(limitInput, { target: { value: '20' } });
    
    // Clear mock calls to focus on the next call
    api.get.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /Apply/i }));
    
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('limit=20'));
    });
  });

  test('resets filters when "Reset" is clicked', async () => {
    render(<TopDebtors />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    const limitInput = screen.getByLabelText(/Result Limit/i);
    fireEvent.change(limitInput, { target: { value: '50' } });
    expect(limitInput.value).toBe('50');
    
    api.get.mockClear();
    fireEvent.click(screen.getByText(/Reset/i));
    
    await waitFor(() => {
      expect(limitInput.value).toBe('10');
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
    });
  });

  test('toggles date filters correctly', async () => {
    render(<TopDebtors />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    const dateSelect = screen.getByDisplayValue(/Specific Date/i);
    const dateInput = screen.getByLabelText(/Filter by Date/i);
    
    // Select Today
    fireEvent.change(dateSelect, { target: { value: 'today' } });
    expect(dateInput).toBeDisabled();
    
    api.get.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /Apply/i }));
    
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('date=today'));
    });
  });
});
