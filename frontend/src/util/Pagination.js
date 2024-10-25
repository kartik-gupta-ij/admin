//react
import React from "react";


const Pagination = (props) => {

  const { count, page, rowsPerPage, onPageChange } = props;

  //firstPage button
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  // back button
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  //next page button
  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  //last page button
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <>
      <div className="paginationRoot">
        <button
          style={page === 0 ? { opacity: 0.5 } : {}}
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
       <i class="fa-solid fa-angles-left"></i>
        </button>
        <button
          style={page === 0 ? { opacity: 0.5 } : {}}
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
           <i class="fa-solid fa-angle-left"></i>

        </button>
        <button
         style={page >= Math.ceil(count / rowsPerPage) - 1? { opacity: 0.5 } : {}}
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
            <i class="fa-solid fa-angle-right"></i>

        </button>
        <button
          style={page >= Math.ceil(count / rowsPerPage) - 1? { opacity: 0.5 } : {}}
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <i class="fa-solid fa-angles-right"></i> 
        </button>
      </div>
    </>
  );
};

export default Pagination;
