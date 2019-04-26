import React from 'react';
import { debug } from 'util';

export default function ErrorMessage(props) {
  return (
    <div className="error-message">
      <label>{props.message}</label>
    </div>
  );
}