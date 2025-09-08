import React, { useEffect, useState } from "react";
import { Mentions } from "antd";

export const MentionElement = (props) => {
  const [val, setVal] = useState("");
  const [selectedMention, setSelectedMention] = useState(null);
  useEffect(()=>{
    if (props.value){
        setVal(props.value)
    }
  },[])
  const handleChange = (value) => {
    setVal(value);
    if (props.onChange) {
      props.onChange({
        value,           
        mention: selectedMention, 
      });
    }
  };

  const handleSelect = (option) => {
    setSelectedMention(option);
    if (props.onChange) {
      props.onChange({
        value: val,      
        mention: option,   
      });
    }
  };

  return (
    <Mentions
      className={props.className}
      style={{ width: "100%" }}
      value={val}
      onChange={handleChange}
      onSelect={handleSelect}
      options={props.options}
    />
  );
};
