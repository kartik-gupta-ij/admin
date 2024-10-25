import React from "react";

//pagination
import TablePagination from "react-js-pagination";

const ServerPagination = (props) => {
  const handlePage = (page) => {
    props.handlePageChange(page);
  };

  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  };
  return (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <span>Rows Per Page</span>
        <div className="d-flex">
          <select
            class="form-select form-control mr-3 ml-2 mb-2 mb-md-0 mb-lg-0 text-center "
            style={{ marginLeft: 5}}
            onChange={(e) => {
              handleRowsPerPage(e.target.value);
            }}
          >
            <option class="text-dark" value="5">
              5
            </option>
            <option class="text-dark" value="10" selected>
              10
            </option>
            <option class="text-dark" value="25">
              25
            </option>
            <option class="text-dark" value="50">
              50
            </option>
            <option class="text-dark" value="100">
              100
            </option>
            <option class="text-dark" value="200">
              200
            </option>
            <option class="text-dark" value="500">
              500
            </option>
            <option class="text-dark" value="1000">
              1000
            </option>
            <option class="text-dark" value="5000">
              5000
            </option>
            <option class="text-dark" value={props.userTotal}>
              ALL
            </option>
          </select>
        </div>
        <div className="align-middle">
          <TablePagination
            activePage={props.activePage}
            itemsCountPerPage={props.rowsPerPage}
            totalItemsCount={props.userTotal}
            pageRangeDisplayed={2}
            onChange={(page) => handlePage(page)}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    </>
  );
};

export default ServerPagination;
