import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizMode from '@/components/QuizMode';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ questions: [] }),
  })
) as jest.Mock;

describe('QuizMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton on mount', () => {
    const { container } = render(<QuizMode language="en" />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('calls fetch to /api/quiz on mount', () => {
    render(<QuizMode language="en" />);
    expect(global.fetch).toHaveBeenCalledWith('/api/quiz', expect.any(Object));
  });
});
