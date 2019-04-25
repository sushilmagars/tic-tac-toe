import React from 'react';
import { debug } from 'util';

export default function ErrorMessage(props) {
  debugger
  return (
    <div className="error-message">
      <label>{props.message}</label>
    </div>
  );
}