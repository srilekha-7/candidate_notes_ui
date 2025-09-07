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
import {
  Dropdown,
  Modal,
  Popover,
  ConfigProvider,
  InputRef,
  Tabs,
  Collapse,
  CollapseProps,
} from 'antd';
// import { TabsPosition } from 'antd/es/tabs';
// import moment from 'moment';
import Draggable from 'react-draggable';


// import { UploadFile } from 'antd';
// import Tooltip, { TooltipPlacement } from 'antd/es/tooltip';
// import { MenuProps } from 'rc-menu';
// import {
//   SortableDNDList,
//   SortableDNDListItem,
//   SortableDNDListProps,
// } from './SortableDNDList';


export const ElementExecutor = (props) => {
    
    
  // const [data, setData] = useState<DummyData[]>([]);
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
    //   case 'input-number':
    //     return (
    //       <NumberElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'input-textarea':
    //     return (
    //       <TextareaElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'single-select':
    //     return (
    //       <SelectElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'sortable-list': {
    //     const node = elementProps as unknown as SortableDNDListProps;
    //     return (
    //       <SortableDNDList
    //         {...node}
    //         items={node.items || []}
    //         onReorder={(newItems: SortableDNDListItem[]) => {
    //           const order = newItems.reduce(
    //             (
    //               acc: Record<string, unknown>,
    //               curr: SortableDNDListItem,
    //               index,
    //             ) => {
    //               acc[curr?.name] = index + 1;
    //               return acc;
    //             },
    //             {},
    //           );
    //           onHandleChange(elementProps.name || '', order);
    //         }}
    //         renderFields={
    //           renderFields as (fields: Record<string, unknown>[]) => ReactNode
    //         }
    //       />
    //     );
    //   }
    //   case 'input-checkbox':
    //     return (
    //       <CheckboxElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'input-radio':
    //     return (
    //       <RadioElement
    //         {...(elementProps as RadioSchemaField)}
    //         variant={
    //           elementProps.variant as 'chip' | 'circled' | 'flat' | undefined
    //         }
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
      // case 'input-single-select':
      //   return (
      //     <SingleSelectElement
      //       {...elementProps}
      //       dropDownOptions={data.length > 0 ? data : []}
      //       onChange={(value) => onHandleChange(elementProps.name || '', value)}
      //       onClick={handleSelectData}
      //     />
      //   );
      // case 'input-multiple-select':
      //   return (
      //     <MultipleSelectElement
      //       {...elementProps}
      //       dropDownOptions={data.length > 0 ? data : []}
      //       onChange={(value) => onHandleChange(elementProps.name || '', value)}
      //       onClick={handleSelectData}
      //     />
      //   );
    //   case 'div':
    //     return <DivContainer {...elementProps} />;

    //   case 'span':
    //     return (
    //       <SpanElement
    //         {...elementProps}
    //         onClick={() =>
    //           props.selectedRecord && props.selectedRecord(elementProps)
    //         }
    //       />
    //     );
      
    //   case 'splitbutton':
    //     return (
    //       <SplitButton
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'sidebar':
    //     return (
    //       <Sidebar
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'navbar':
    //     return (
    //       <div className={elementProps.className}>
    //         {renderFields(elementProps.fields || [])}
    //       </div>
    //     );
    //   case 'table':
    //     return (
    //       <TableElement
    //         {...(elementProps as PaginationSchemaField)}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'table-element':
    //     return (
    //       <TableCopyComponent
    //         {...(elementProps as PaginationSchemaField)}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'kanban':
    //     return (
    //       <KanbanBoard
    //       // {...(elementProps as PaginationSchemaField)}
    //       // onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'google-map':
    //     return <GoogleMapWidget {...elementProps} />;
    //   case 'time-schedule-table': {
    //     return (
    //       <TimeScheduleTable
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   }
    //   case 'daterangepicker':
    //     return (
    //       <DateRangePickerElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
      
    //     case 'daterange-picker':
    //     return (
    //       <DateRangeSegments
    //         {...(elementProps as DateRangeSchemaField)}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'timerangepicker':
    //     return (
    //       <TimeRangeComponent
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'datepicker':
    //     return (
    //       <DatePickerElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'timepicker':
    //     return (
    //       <TimePickerElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'datetimepicker':
    //     return (
    //       <DatePickerElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'upload':
        // return (
        //   <FileUpload
        //     {...elementProps}
        //     onChange={(value) => onHandleChange(elementProps.name || '', value)}
        //   />
        // );
      
    //     case 'avatar-upload':
    //     return (
    //       <AvatarUpload
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'image-upload':
    //     return (
    //       <MediaUpload
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'image':
    //     return (
    //       <Image
    //         {...elementProps}
    //         onClick={() =>
    //           props.selectedRecord && props.selectedRecord(elementProps)
    //         }
    //       />
    //     );
    //   case 'video':
    //     return (
    //       <Video
    //         {...elementProps}
    //         // onClick={() =>
    //         //   props.selectedRecord && props.selectedRecord(elementProps)
    //         // }
    //       />
    //     );
    //   case 'document':
    //     return (
    //       <Document
    //         {...elementProps}
    //         // onClick={() =>
    //         //   props.selectedRecord && props.selectedRecord(elementProps)
    //         // }
    //       />
    //     );
    //   case 'input-password':
    //     return (
    //       <PasswordElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'auto-complete':
    //     return (
    //       <AutoCompleteInput
    //         {...(elementProps as AutoCompleteField)}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'single-checkbox':
    //     return (
    //       <SingleCheckbox
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'dropdown-group':
    //     return (
    //       <DropDownGroup
    //         {...(elementProps as DropDownSchemaField)}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'tabs':
    //     if (elementProps?.hasChildren) {
    //       return (
    //         <Tabs
    //           tabPosition={elementProps.tabPosition || 'top'}
    //           defaultActiveKey={elementProps.value as string}
    //           activeKey={elementProps.value as string}
    //           className={elementProps.containerClassName}
    //           onChange={(activeKey) => {
    //             onHandleChange(elementProps.name || '', activeKey);
    //           }}
    //           items={elementProps.fields
    //             ?.filter((option) => option.visible !== false)
    //             ?.map((option) => {
    //               return {
    //                 key: option.name || '',
    //                 label: (
    //                   <span className={elementProps.className}>
    //                     <img
    //                       src={option.icon}
    //                       className={elementProps.iconsClassName}
    //                     />
    //                     {option.label}
    //                   </span>
    //                 ),
    //                 children: (
    //                   <div className={option.className || ''}>
    //                     {renderFields(option.fields || [])}
    //                   </div>
    //                 ),
    //               };
    //             })}
    //         />
    //       );
    //     } else {
    //       return (
    //         <TabsElement
    //           {...elementProps}
    //           onChange={(value) =>
    //             onHandleChange(elementProps.name || '', value)
    //           }
    //         />
    //       );
    //     }

    //   case 'otp':
    //     return (
    //       <OtpElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'color-picker':
    //     return (
    //       <ColorPickerElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'alert':
    //     return (
    //       <NotificationAlert
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'switch':
    //     return (
    //       <SwitchElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'custom-stepper':
    //     return (
    //       <CustomStepper
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );

      
    //   case 'collapse': {
    //     const collapseItems: CollapseProps['items'] = (
    //       elementProps.fields || []
    //     ).map((field: SchemaField) => ({
    //       key: field.key || field.name,
    //       label: field.label,
    //       children: (
    //         <div className={elementProps.className}>
    //           {renderFields(field.fields || [])}
    //         </div>
    //       ),
    //     }));

    //     return (
    //       <Collapse
    //         activeKey={
    //           elementProps.value as string | number | (string | number)[]
    //         }
    //         accordion
    //         className={elementProps.containerClassName}
    //         bordered={elementProps.bordered}
    //         defaultActiveKey={
    //           elementProps.value as string | number | (string | number)[]
    //         }
    //         ghost={!elementProps.bordered}
    //         items={collapseItems}
    //         style={
    //           elementProps.mask === false
    //             ? {
    //                 position: 'absolute',
    //                 pointerEvents: 'none',
    //               }
    //             : {}
    //         }
    //       />
    //     );
    //   }

    //   case 'clickable-widget':
    //     return (
    //       <div
    //         className={elementProps.className}
    //         onClick={() =>
    //           props.selectedRecord && props.selectedRecord(elementProps)
    //         }
    //       >
    //         {renderFields(elementProps.fields || [])}
    //       </div>
    //     );
    //   case 'tooltip':
    //     return (
    //       <Tooltip title={elementProps.tooltip_title}>
    //         {renderElement({
    //           ...elementProps,
    //           element: elementProps.child_element,
    //         })}
    //       </Tooltip>
    //     );
    //   case 'popover':
    //     return (
    //       <Popover content={elementProps.content}>
    //         <button>
    //           {renderElement({
    //             ...elementProps,
    //             element: elementProps.child_element,
    //           })}
    //         </button>
    //       </Popover>
    //     );
    //   case 'dropdown':
    //     return (
    //       <DropdownElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'profile-dropdown':
    //     return (
    //       <Dropdown
    //         menu={
    //           {
    //             items: elementProps.items,
    //             onClick: (e) => onHandleChange(elementProps.name || '', e),
    //           } as MenuProps
    //         }
    //       >
    //         <button>
    //           {renderElement({
    //             ...elementProps,
    //             element: elementProps.child_element,
    //           })}
    //         </button>
    //       </Dropdown>
    //     );
    //   case 'barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <BarChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'circle-doughnut':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <DoughnutChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'piechart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <PieChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'horizontal-barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <HorizontalBarchartCoponent {...elementProps} />
    //       </div>
    //     );
    //   case 'vertical-barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <VerticalBarchartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'columnrange-barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <ColumnRangeChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'linechart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <LineChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'wordcloud':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <WordCloudComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'funnel-chart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <FunnelChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'multi-barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <MultiBarChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'groupedstack-barchart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <GroupedStackChartComponnet {...elementProps} />
    //       </div>
    //     );
    //   case 'variable-piechart':
    //     return (
    //       <div style={{ width: '100%' }}>
    //         <VarablePieChartComponent {...elementProps} />
    //       </div>
    //     );
    //   case 'input-abha-number':
    //     return (
    //       <AbhaNumberComponent
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'aadhar':
    //     return (
    //       <AadharComponent
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'timeline':
    //     return <DisplayTimeline {...elementProps} />;
    //   case 'profile':
    //     return <Profile {...elementProps} />;
    //   case 'custom-notificatiion':
    //     return (
    //       <div className={elementProps.className}>
    //         {renderFields(elementProps.fields || [])}
    //       </div>
    //     );
    //   case 'notifications':
    //     return (
    //       <Notification
    //         {...elementProps}
    //         onClick={(value) => onHandleClick(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'segmented':
    //     return (
    //       <SegmentedElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'capcha':
    //     return (
    //       <Capcha
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'text-editor':
    //     return (
    //       <TextEditorComponent
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'QR-code':
    //     return (
    //       <QRCodeElement
    //         {...elementProps}
    //         onChange={(value) => onHandleChange(elementProps.name || '', value)}
    //       />
    //     );
    //   case 'html-content':
    //     return (
    //       <div
    //         className={`html-content ${elementProps.className}`}
    //         dangerouslySetInnerHTML={{
    //           __html: elementProps.content as string | TrustedHTML,
    //         }}
    //       />
    //     );
    //   case 'card':
    //     return (
    //       <CardElement
    //         {...elementProps}
    //         onClick={() =>
    //           props.selectedRecord && props.selectedRecord(elementProps)
    //         }
    //       />
    //     );
    //   case 'button':
    //     if (elementProps.buttonVariant || elementProps.variant) {
    //       return (
    //         <AntButton
    //           {...elementProps}
    //           onClick={() =>
    //             props.selectedRecord && props.selectedRecord(elementProps)
    //           }
    //         />
    //       );
    //     } else {
    //       return (
    //         <ButtonElement
    //           {...elementProps}
    //           onClick={() =>
    //             props.selectedRecord && props.selectedRecord(elementProps)
    //           }
    //         />
    //       );
    //     }

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

