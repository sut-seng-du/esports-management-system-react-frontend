import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Inventory from '../pages/Inventory';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('Inventory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInventory = [
    { id: 1, item_name: 'Coke', type: 'drink', qty: 15, price: 1500 },
    { id: 2, item_name: 'Red Bull', type: 'drink', qty: 5, price: 3500 },
    { id: 3, item_name: 'Water', type: 'drink', qty: 0, price: 500 },
  ];

  test('renders inventory items and status', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockInventory } });

    render(<Inventory />);

    await waitFor(() => {
      expect(screen.getByText('Coke')).toBeInTheDocument();
      expect(screen.getByText('15 Qty')).toBeInTheDocument();
      expect(screen.getByText('Red Bull')).toBeInTheDocument();
      expect(screen.getByText('5 Qty')).toBeInTheDocument();
      expect(screen.getByText('Water')).toBeInTheDocument();
      expect(screen.getByText('0 Qty')).toBeInTheDocument();
    });

    expect(screen.getByText('3 Items Available')).toBeInTheDocument();
  });

  test('renders empty state', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Inventory />);

    await waitFor(() => {
      expect(screen.getByText(/No drinks found/i)).toBeInTheDocument();
    });
  });

  test('handles API error and allows retry', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch inventory'));

    render(<Inventory />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch inventory')).toBeInTheDocument();
      expect(screen.getByText('Retry Connection')).toBeInTheDocument();
    });

    api.get.mockResolvedValueOnce({ data: { data: [mockInventory[0]] } });
    fireEvent.click(screen.getByText('Retry Connection'));

    await waitFor(() => {
      expect(screen.getByText('Coke')).toBeInTheDocument();
      expect(screen.queryByText('Failed to fetch inventory')).not.toBeInTheDocument();
    });
  });
});
