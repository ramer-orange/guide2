import React from "react";

export function CurrentDay({ index, onSelectedDayChange }) {
  return (
    <button key={index} onClick={() => onSelectedDayChange(index)}>Day {index + 1}</button>
  )
}
