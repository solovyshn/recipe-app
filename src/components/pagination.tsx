import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 7;

        let startPage = Math.max(1, currentPage - 3);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        if (startPage > 1) {
            if (startPage > 2) {
                pageNumbers.unshift(<li key="ellipsis-start" className="page-item">...</li>);
            }
            pageNumbers.unshift(
                <li key="start" className="page-item">
                    <button className="page-link" onClick={() => onPageChange(1)}>
                        1
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<li key="ellipsis-end" className="page-item">...</li>);
            }
            pageNumbers.push(
                <li key={totalPages} className="page-item">
                    <button className="page-link" onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pageNumbers;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handlePrevPage} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handleNextPage} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;