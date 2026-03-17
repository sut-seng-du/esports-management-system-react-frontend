import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Pricing from '../pages/Pricing';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('Pricing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPricing = [
    { id: 1, name: 'Normal', price: 1000, hour: 1 },
    { id: 2, name: 'Premium', price: 2500, hour: 3 },
  ];

  test('renders pricing packages and formatted currency', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockPricing } });

    render(<Pricing />);

    await waitFor(() => {
      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument(); // Formatted
      expect(screen.getByText('1 Hour Access')).toBeInTheDocument();

      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('2,500')).toBeInTheDocument(); // Formatted
      expect(screen.getByText('3 Hours Access')).toBeInTheDocument();
    });
  });

  test('handles empty pricing data', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Pricing />);

    await waitFor(() => {
      expect(screen.getByText(/No pricing packages found/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    api.get.mockRejectedValueOnce(new Error('Pricing fetch error'));

    render(<Pricing />);

    await waitFor(() => {
      expect(screen.getByText('Pricing fetch error')).toBeInTheDocument();
    });
  });
});
