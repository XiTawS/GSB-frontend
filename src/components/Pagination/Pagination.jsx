import React from 'react';

export default function Pagination({ currentPage, totalPages, setCurrentPage, indexOfFirstBill, indexOfLastBill, totalResults }) {
  return (
    <div className="pagination-container">
      <div className="pagination-mobile">
        <button className="pagination-button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Précédent</button>
        <button className="pagination-button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Suivant</button>
      </div>
      <div className="pagination-desktop">
        <div>
          <p className="pagination-info">
            Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span> — Affichage de <span className="font-medium">{indexOfFirstBill + 1}</span> à <span className="font-medium">{Math.min(indexOfLastBill, totalResults)}</span> sur <span className="font-medium">{totalResults}</span> résultats
          </p>
        </div>
        <div>
          <nav className="pagination-nav" aria-label="Pagination">
            <button className="pagination-nav-button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <span className="sr-only">Précédent</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Affichage des numéros de page */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i+1} className={`pagination-nav-button${currentPage === i+1 ? ' pagination-nav-button-active' : ''}`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
            ))}
            <button className="pagination-nav-button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <span className="sr-only">Suivant</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 