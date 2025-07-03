import React from "react";

function CurrentDay({ index, onSelectedDayChange }) {
  return (
    <button key={index} onClick={() => onSelectedDayChange(index)}>Day {index + 1}</button>
  )
}

export default CurrentDay;
