import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './index.css'

const generateSortingIndicator = (column) => {
  return column.isSorted ? (column.isSortedDesc ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>) : "";
};

const ReactTable = ({ columns, data, defaultPageSize = 10}) => {
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex }
   } =
    useTable({ columns, data, initialState: {pageSize: defaultPageSize}, }, useSortBy, usePagination);
    const handleOnProjectClick = (id) => {
      window.location.href = `/project/${id}`;
    }

  return (
    <div className="w-full">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {generateSortingIndicator(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="cursor-pointer" onClick={() => handleOnProjectClick(row.original.id)}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}> {cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div className='p-4 flex flex-row gap-4 justify-center items-center'>
        <button disabled={pageIndex === 0} onClick={()=> gotoPage(0)} className='w-8 border-black border-2 rounded-md font-bold text-xl pb-1 '>{"«"}</button>
        <button disabled={!canPreviousPage} onClick={previousPage} className={`w-8 pb-1  border-black border-2 rounded-md font-bold text-xl ${!canPreviousPage && 'bg-zinc-500 cursor-default'}`}>{"‹"}</button>
        <span className=" font-semibold">{pageIndex + 1} of {pageCount}</span>
        <button disabled={!canNextPage} onClick={nextPage} className={` w-8 pb-1  border-black border-2 rounded-md font-bold text-xl ${!canNextPage && 'bg-zinc-500 cursor-default'}`}>{"›"}</button>
        <button disabled={pageIndex === pageCount-1} onClick={() => gotoPage(pageCount-1)} className="border-black border-2 rounded-md font-bold text-xl w-8 pb-1 ">{"»"}</button>
      </div>
    </div>
  );
};

export default ReactTable;