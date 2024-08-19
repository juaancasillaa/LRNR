import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './Home';
import '@testing-library/jest-dom';


describe('HomePage Unit Tests', () => {
  test('renders the logo image', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const logo = screen.getByAltText('LRNR logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders the main heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  
    // Check for the first part of the heading in the h1 element
    const h1Element = screen.getByText(/Your guided path to/i);
    expect(h1Element).toBeInTheDocument();
  
    // Check for the second part of the heading in the span element
    const spanElement = screen.getByText(/programming enlightenment/i);
    expect(spanElement).toBeInTheDocument();
  });  
  

  test('renders the begin journey button', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: /BEGIN JOURNEY/i });
    expect(button).toBeInTheDocument();
  });

  test('renders all boxes with correct content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Personalized Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Rewarding')).toBeInTheDocument();
    expect(screen.getByText('Personal SME')).toBeInTheDocument();
  });
});
