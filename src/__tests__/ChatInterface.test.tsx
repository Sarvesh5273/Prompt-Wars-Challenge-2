import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatInterface from '@/components/ChatInterface';

describe('ChatInterface', () => {
  const defaultProps = {
    messages: [],
    isLoading: false,
    onSendMessage: jest.fn(),
    language: 'en' as const,
  };

  it('renders chat input with correct placeholder', () => {
    render(<ChatInterface {...defaultProps} />);
    const input = screen.getByPlaceholderText('Ask a question...');
    expect(input).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatInterface {...defaultProps} />);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it('renders preset questions (3 buttons)', () => {
    render(<ChatInterface {...defaultProps} />);
    const presetButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label') !== 'Send message'
    );
    expect(presetButtons.length).toBe(3);
  });
});
