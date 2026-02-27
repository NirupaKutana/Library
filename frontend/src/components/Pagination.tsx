import React from 'react'
import '../style/Pagination.css'
interface PaginationProps{
    currentPage :number;
    totalItems: number;
    itemPerPage :number;
    onPageChange :(page:number)=>void;
}
const Pagination :React.FC<PaginationProps> = ({currentPage,totalItems,itemPerPage,onPageChange}) => {
    const totalPages = Math.ceil(totalItems/itemPerPage);
    return (
   
      <div className="simple-pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ▶
      </button>
    </div>
  
  )
}

export default Pagination
