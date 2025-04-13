'use client';

import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopButtonProps {
    isVisible: boolean;
    onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isVisible, onClick }) => {
    if (!isVisible) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 right-2 md:bottom-8 md:right-8 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-in-out transform hover:scale-110"
            aria-label='Scroll to top'
            title="Scroll back to top"
        >
            <FaArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTopButton;