import '@testing-library/jest-dom/vitest';
import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import HomePage from "../components/Home/Home";

describe('Home', () => {
    it('should have HomePage div', () => {
        render(
            <MemoryRouter>
                <HomePage />
             </MemoryRouter>
        );
        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Welcome Home');
    });
});