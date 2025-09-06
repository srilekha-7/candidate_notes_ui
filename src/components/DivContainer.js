import React from 'react';
export const DivContainer = (props) => {
  return (
    <div
      className={props.className}
      style={props.style}
      onClick={props.onClick}
    >
      {props.label && typeof props.label === 'string' ? (
        <>
          <span className={props.labelClassName}>{props.label}</span>
          {props.fillText1}
        </>
      ) : (
        <p className={props.labelClassName}>{props.label}</p>
      )}
      {props.required ? <span style={{ color: 'red' }}>*</span> : ''}
    </div>
  );
};
