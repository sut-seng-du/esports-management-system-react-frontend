import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TopMembers from '../pages/TopMembers';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('TopMembers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMembers = [
    { member_ID: 'MEM-001', total_member_amount: 50000 },
    { member_ID: 'MEM-002', total_member_amount: 35000 },
    { member_ID: 'MEM-003', total_member_amount: 20000 },
    { member_ID: 'MEM-004', total_member_amount: 10000 },
  ];

  test('renders top members leaderboard with correct formatting', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockMembers } });

    render(<TopMembers />);

    await waitFor(() => {
      expect(screen.getByText('MEM-001')).toBeInTheDocument();
      expect(screen.getByText('50,000')).toBeInTheDocument();
      expect(screen.getByText('MEM-004')).toBeInTheDocument();
      expect(screen.getByText('10,000')).toBeInTheDocument();
    });

    expect(screen.getByText('Top 4 by total amount')).toBeInTheDocument();
  });

  test('renders icons for top 3 ranks', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockMembers } });

    render(<TopMembers />);

    await waitFor(() => {
      // Top 3 should have medal icons (mocked as icon-medal data-testid in setupTests)
      const medals = screen.getAllByTestId('icon-medal');
      expect(medals.length).toBe(3);
      
      // Rank 4 should show #4
      expect(screen.getByText('#4')).toBeInTheDocument();
    });
  });

  test('handles empty member list', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<TopMembers />);

    await waitFor(() => {
      expect(screen.getByText(/No members found/i)).toBeInTheDocument();
    });
  });
});
