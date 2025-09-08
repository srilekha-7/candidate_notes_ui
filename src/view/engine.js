import React, {
  JSXElementConstructor,
  LegacyRef,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextElement } from '../components/TextElement';
import { Button } from '../components/Button';
import { DivContainer } from '../components/DivContainer';
import { TableElement } from '../components/TableElement';
import { MentionElement } from '../components/Mention';
import { Notification } from '../components/Notification';
import {
  Modal,
} from 'antd';
import Draggable from 'react-draggable';


export const ElementExecutor = (props) => {
    
    
  const [schema, setSchema] = useState(props?.data?.schema);
  useEffect(() => {
    if (props?.data?.schema) {
      setSchema(props?.data?.schema);
    }
  }, [props?.data?.schema]);
  const onHandleChange = (
    name,
    value
  ) => {

    const updateSchema = (schema) => {
      return schema.map((field) => {
        if (field.name === name) {
          field['value'] = value;
          props.selectedRecord && props.selectedRecord(field);
        }

        if (field.fields && field.fields.length) {
          field.fields = updateSchema(field.fields);
        }
        return field;
      });
    };

    const updatedSchema = updateSchema(schema);
    setSchema(updatedSchema);
    props.setData && props.setData({ ...props.data, schema: updatedSchema });
  };
  const onHandleClick = (
    name,
    value
  ) => {
    const updateSchema = (schema) => {
      return schema.map((field) => {
        if (field.name === name) {
          field['value'] = value;
          props.selectedRecord && props.selectedRecord(field);
        }

        if (field.fields && field.fields.length) {
          field.fields = updateSchema(field.fields);
        }
        return field;
      });
    };

    const updatedSchema = updateSchema(schema);
    setSchema(updatedSchema);
    props.setData && props.setData({ ...props.data, schema: updatedSchema });
  };


  const renderElement = (
    elementProps
  ) => {
    switch (elementProps?.element) {

      case 'input-text':
        return (
          <TextElement
            {...elementProps}
            onChange={(value) => onHandleChange(elementProps.name || '', value)}
          />
        );
        case 'button':
            
        return (
          <Button
            {...elementProps}
            onClick={() =>
              props.selectedRecord && props.selectedRecord(elementProps)
            }
          />
        );
         case 'div':
        return <DivContainer {...elementProps} onClick={() =>
              props.selectedRecord && props.selectedRecord(elementProps)
            } />;
             case 'table':
        return (
          <TableElement
            {...(elementProps)}
            onChange={(value) => onHandleChange(elementProps.name || '', value)}
          />
        );
        case 'modal':
        // console.log(elementProps.mask);
        return (
          <Modal
            open={elementProps.visible}
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
            closable={false}
            className={elementProps.containerClassName}
            width={elementProps.width}
            footer={null}
            centered={true}
            // mask={elementProps.mask || true}
            mask={elementProps.mask ?? true}
            styles={{
              mask: elementProps.mask === false ? { display: 'none' } : {},
            }}
            style={
              elementProps.mask === false
                ? {
                    position: 'absolute',
                    pointerEvents: 'none',
                  }
                : {}
            }
            // maskClosable={elementProps.maskClosable || true}
            modalRender={(modal) => {
              // Only wrap in Draggable if draggable prop is true
              // if (elementProps?.draggable) {
              //   const [disabled, setDisabled] = useState(true);
              //   const [bounds, setBounds] = useState({
              //     left: 0,
              //     top: 0,
              //     bottom: 0,
              //     right: 0,
              //   });
              //   const draggleRef = useRef<HTMLDivElement>(null);

              //   const onStart = (
              //     _event,
              //     uiData,
              //   ) => {
              //     const { clientWidth, clientHeight } =
              //       window.document.documentElement;
              //     const targetRect =
              //       draggleRef.current?.getBoundingClientRect();
              //     if (!targetRect) {
              //       return;
              //     }
              //     setBounds({
              //       left: -targetRect.left + uiData.x,
              //       right: clientWidth - (targetRect.right - uiData.x),
              //       top: -targetRect.top + uiData.y,
              //       bottom: clientHeight - (targetRect.bottom - uiData.y),
              //     });
              //   };

              //   return (
              //     <Draggable
              //       disabled={disabled}
              //       bounds={bounds}
              //       nodeRef={draggleRef}
              //       onStart={(event, uiData) => onStart(event, uiData)}
              //     >
              //       <div
              //         ref={draggleRef}
              //         style={{
              //           cursor: elementProps.draggable ? 'move' : 'default',
              //         }}
              //         onMouseOver={() =>
              //           elementProps.draggable && setDisabled(false)
              //         }
              //         onMouseOut={() =>
              //           elementProps.draggable && setDisabled(true)
              //         }
              //       >
              //         {modal}
              //       </div>
              //     </Draggable>
              //   );
              // }

              // If not draggable, return modal as-is
              return modal;
            }}
          >
            <div className={elementProps.className}>
              {renderFields(elementProps.fields || [])}
            </div>
          </Modal>
        );
         case 'input-mention':
        return (
          <MentionElement
            {...elementProps}
            onChange={(value) => onHandleChange(elementProps.name || '', value)}
          />
        );
        case 'notifications':
        return (
          <Notification
            {...elementProps}
            onClick={(value) => onHandleClick(elementProps.name || '', value)}
          />
        );
    
      default:
        return null;
    }
  };

  const renderFields = (
    schema
  )=> {
    return (
      schema &&
      schema?.map((eachSection, index) => {
        if (eachSection?.visible !== false) {
          if (eachSection?.showSkeleton) {
            return (
              <React.Fragment key={index}>{eachSection.loader}</React.Fragment>
            );
          }
          return (
            <React.Fragment key={index}>
              {![
                'modal',
                'collapse',
                'clickable-widget',
                'profile-dropdown',
                'navbar',
                'custom-notification',
              ].includes(eachSection?.element || '') &&
              !(eachSection?.hasChildren && eachSection.element === 'tabs') &&
              eachSection?.fields &&
              eachSection?.fields.length > 0 ? (
                <React.Fragment>
                  {eachSection?.showSkeleton
                    ? eachSection?.loader
                    : renderElement(eachSection)}

                  <div
                    className={
                      eachSection?.showSkeleton ? '' : eachSection?.className
                    }
                    style={
                      eachSection?.showSkeleton
                        ? undefined
                        : (eachSection?.styles)
                    }
                    key={index}
                    ref={eachSection.divRef}
                  >
                    {renderFields(eachSection?.fields)}
                  </div>
                  {eachSection?.dateTime ? (
                    <p
                      style={{
                        fontSize: '10px',

                        textAlign:
                          eachSection.source === 'bot' ? 'left' : 'right',
                      }}
                    >
                      {/* {moment(eachSection.dateTime).format('LT')} */}
                    </p>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {renderElement(eachSection)}
                  {eachSection.dateTime ? (
                    <p
                      style={{
                        fontSize: '10px',

                        textAlign:
                          eachSection.source === 'bot' ? 'left' : 'right',
                      }}
                    >
                      {/* {moment(eachSection.dateTime).format('LT')} */}
                    </p>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          );
        }
        return null;
      })
    );
  };
  return (
  
      <div className={props?.data?.className}>{renderFields(schema)}</div>
 
  );
};

