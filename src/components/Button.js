import React from 'react';
export const Button = (props) => {
  const textColorClass =
    props.className?.match(/text-[\w-]+/g)?.[0] === 'text-white';

  return (
    <button
      onClick={props.onClick}
      className={props.className ? props.className : ''}
      disabled={props.loading}
      style={{
        cursor: props.loading ? 'no-drop' : 'pointer',
      }}
    >
      <span style={{ display: 'flex' }}>
        {/* {props.loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-3"
          viewBox="0 0 24 24"
          fill="#ffffff"
        ></svg>
      ) : (
        ''
      )} */}
        
      </span>

      {props.label}
    </button>
  );
};
