import React from 'react';
import { render, screen, act } from '@testing-library/react';
import QuizMode from '@/components/QuizMode';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ questions: [] }),
  })
) as jest.Mock;

describe('QuizMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton on mount', async () => {
    const { container } = render(<QuizMode language="en" />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
    
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('calls fetch to /api/quiz on mount', async () => {
    render(<QuizMode language="en" />);
    expect(global.fetch).toHaveBeenCalledWith('/api/quiz', expect.any(Object));
    
    await act(async () => {
      await Promise.resolve();
    });
  });
});
