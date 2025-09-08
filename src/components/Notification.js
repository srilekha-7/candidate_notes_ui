import React, { useEffect, useState } from 'react';
import { Popover, Badge, Button, List, Empty } from 'antd';
import { IoIosNotifications } from 'react-icons/io';

export const Notification = (props) => {
  const [items, setItems] = useState(
    props.items || [],
  );
  const [visible, setVisible] = useState(false);

  const popoverContentStyle = {
    minWidth: '300px',
    maxWidth: '100%',
    maxHeight: '300px',
    overflow: 'auto',
  };

  useEffect(() => {
    if (props.items) {
      setItems(props.items);
    }
  }, [props.items]);

  const handleItemClick = (
    event,
    item
  ) => {
    event.stopPropagation(); 
    if (props.onClick) {
      props.onClick(item);
    }
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const popoverContent = (
    <div style={popoverContentStyle}>
      {items.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              onClick={(event) => handleItemClick(event, item)}
              style={{ cursor: 'pointer',
    backgroundColor: item.isRead ? "#f9f9f9" : "#f0f0f0", 
    fontWeight: item.isRead ? "normal" : "bold",}}
              
            >
              <List.Item.Meta
    title={
      <span>
        <span
          style={{
            color: item.isRead ? "red" : "green",
            marginRight: 6,
            fontSize: "12px",
          }}
        >
          ●
        </span>
        {item.text}
      </span>
    }
    description={item.time}
  />
</List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );

  return (
    <Popover
      className={props.className}
      content={popoverContent}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement={props.placement}
    >
      <Button
        className={props.buttonClassName}
        onClick={() => setVisible(!visible)}
      >
        <Badge
          size="small"
          count={items.length >= 1000 ? '999+' : items.length}
        >
          <span className={props.iconsClassName}>
            <IoIosNotifications />
          </span>
        </Badge>
      </Button>
    </Popover>
  );
};
