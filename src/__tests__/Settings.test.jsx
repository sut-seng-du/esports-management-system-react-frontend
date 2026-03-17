import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../pages/Settings';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  post: jest.fn(),
}));

describe('Settings Component', () => {
  const mockSetTheme = jest.fn();
  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify(mockUser));
  });

  test('renders user info and appearance settings', () => {
    render(<Settings theme="dark" setTheme={mockSetTheme} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  test('toggles theme when clicking options', () => {
    render(<Settings theme="dark" setTheme={mockSetTheme} />);

    fireEvent.click(screen.getByText('Light Mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    fireEvent.click(screen.getByText('Dark Mode'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('handles profile update', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(<Settings theme="dark" setTheme={mockSetTheme} />);

    fireEvent.click(screen.getByText('Edit Profile'));
    
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/user/profile', { name: 'Updated User' });
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });

    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser.name).toBe('Updated User');
  });

  test('validates password update', async () => {
    render(<Settings theme="dark" setTheme={mockSetTheme} />);

    fireEvent.click(screen.getByText('Edit Profile'));
    
    fireEvent.change(screen.getByLabelText(/^Current Password$/i), { target: { value: 'oldpass' } });
    fireEvent.change(screen.getByLabelText(/^New Password$/i), { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), { target: { value: 'mismatch' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
});
