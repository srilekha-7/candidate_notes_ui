import React from 'react';
import { Input as AntInput } from 'antd';
export const TextElement = (props) => {
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };
  return (
    <div className={props.containerClassName}>
      {props.label && (
        <p
          className={`${props?.color && 'ac-ui_input__text--label'} ${props.labelClassName}`}
        >
          {props.label}{' '}
          {props.required ? <span style={{ color: 'red' }}>*</span> : ''}
        </p>
      )}
     
        <AntInput
          id={(props.id) || ''}
          placeholder={props.placeholder}
          allowClear={props.allowClear}
          ref={props.ref}
          value={props.value}
          suffix={props.suffix}
        //   prefix={
        //     props.isSearch ? (
        //       <div className={props.iconsClassName}>
        //         {icons[props.icon]}
        //       </div>
        //     ) : (
        //       props.prefix
        //     )
        //   }
          size={props.size}
          type={props.type}
          disabled={props.disabled}
          status={props.required && props.errorText ? 'error' : ''}
          className={`${props?.color && 'ac-ui_input__text'} ${props?.color} ${props.className}`}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      {props.required ? (
        <p className={props.errorClassName}>
          {props.errorText && props.errorText}
        </p>
      ) : (
        ''
      )}
    </div>
  );
};
