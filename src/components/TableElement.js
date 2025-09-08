import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import { Table, TableColumnsType, Popconfirm, Tooltip, Button } from 'antd';

import { Badge } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import {
  DownOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import {
  Key,
  TablePaginationConfig,
  SorterResult,
  FilterValue,
} from 'antd/es/table/interface';
import { SizeType } from 'antd/es/config-provider/SizeContext';


export const TableElement = (props) => {
  const { thead, tbody } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    page: props.value?.page || 1,
    pageSize: props.value?.pageSize || 30,
  });
  const [newFilters, setNewFilters] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
   const getAllExpandableKeys = useMemo(() => {
      const collectExpandableKeys = (records)=> {
        const keys= [];
        
        records.forEach(record => {
          if (record.children && record.children.length > 0 && record.key !== undefined) {
            keys.push(record.key);
            keys.push(...collectExpandableKeys(record.children));
          }
        });
        
        return keys;
      };
      
      return collectExpandableKeys(dataSource);
    }, [dataSource]);
  
    const areAllRowsExpanded = useMemo(() => {
      if (getAllExpandableKeys.length === 0) return false;
      return getAllExpandableKeys.every(key => expandedRowKeys.includes(key));
    }, [expandedRowKeys, getAllExpandableKeys]);
  
    const handleExpandAll = () => {
      setExpandedRowKeys(getAllExpandableKeys);
    };
  
    const handleCollapseAll = () => {
      setExpandedRowKeys([]);
    };
  
    const handleToggleExpandAll = () => {
      if (areAllRowsExpanded) {
        handleCollapseAll();
      } else {
        handleExpandAll();
      }
    };
  
  useEffect(() => {
    if (props.value && props.value.name === 'pagination') {
      setPagination({
        page: props.value.page || 1,
        pageSize: props.value?.pageSize || 30,
      });
    }
  }, [props.value]);
  useEffect(() => {
    if (tbody) {
      setDataSource(
        tbody.map((row, index) => {
          const pagnationIdx =
            ((pagination.page || 1) - 1) * (pagination.pageSize || 30);
          return {
            ...row,
            key: row.id || pagnationIdx + index + 1,
            index: pagnationIdx + index + 1,
            children:
              row.children && row.children?.length > 0
                ? row.children
                : undefined,
          };
        }),
      );
    }
  }, [tbody, pagination]);
  useEffect(() => {
    const firstRecordWithChildren = dataSource.find(
      (record) => record.children && record.children?.length > 0,
    );
    if (firstRecordWithChildren?.key !== undefined) {
      setExpandedRowKeys([firstRecordWithChildren.key]);
    }
  }, [dataSource]);
  const handleDelete = (record) => {
    props.onChange && props.onChange({ name: record.key, value: record });
  };
  const handleSwitch = (record) => {
    const newDataSource = dataSource.map((item) => {
      if (item.id === record.id) {
        const updatedRecord = { ...item, value: !item.value };

        props.onChange &&
          props.onChange({ name: record.key, value: updatedRecord });
        return updatedRecord;
      }
      return item;
    });
    setDataSource(newDataSource);
  };
  const handleTableChange = (
    _pagination,
    newFilters,
    _sorter,
    extra,
  ) => {
    void _sorter;
    if (extra.action === 'paginate') {
      setPagination({
        page: _pagination.current ?? 1,
        pageSize: _pagination.pageSize ?? 30,
      });

      if (props.onChange) {
        props.onChange({
          name: 'pagination',
          page: _pagination.current,
          pageSize: _pagination.pageSize,
        });
      }
    } else if (extra.action === 'filter') {
      setNewFilters(newFilters);
      if (props.onChange) {
        setPagination({
          page: 1,
          pageSize: _pagination.pageSize ?? 30,
        });
        props.onChange({ name: 'filters', value: newFilters });
       
      }
    }
  };
   const renderHeaderWithExpandCollapse = (title) => {
      if (getAllExpandableKeys.length === 0) {
        return title;
      }
      
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          width: '100%'
        }}>
          
           <Tooltip title={areAllRowsExpanded ? 'Collapse All' : 'Expand All'}>
            <Button
              type="text"
              icon={props.expandIcon?areAllRowsExpanded ? <DownOutlined /> : <RightOutlined />:areAllRowsExpanded ? <DownOutlined /> : <RightOutlined />}
             onClick={handleToggleExpandAll}
              size="small"
              style={{
                color:"#FFFFFF",
                minWidth: 'auto',
                width: 24,
                height: 24,
                padding: 0,
                marginRight:"8px",
              }}
            />
          </Tooltip>
          <span>{title}</span>
  
        </div>
      );
    };
  let columns= [];
  if (thead) {
    columns = [
      ...(props.showSerialNumber || props.showSerialNumber === undefined
        ? [
            {
              title: '#',
              dataIndex: 'index',
              key: 'index',
              width: props.indexWidth || 40,
              fixed: 'left' ,
              clickable: props.indexClickable,
            } ,
          ]
        : []),
      ...thead.map((col, index) => ({
        title: index === 0 ? renderHeaderWithExpandCollapse(col.label) : col.label,
        dataIndex: col.name,
        key: col.key,
        fixed: col.fixed,
        ellipsis: col.ellipsis,
        // width: col.width || 100,
        clickable: col.clickable,
        render:
          index === 0 && props.rowClickExpandable
            ? (text, record) => (
                <span
                  onClick={(e) => {
                    if (record.children && record.children?.length > 0) {
                      e.stopPropagation();
                      setExpandedRowKeys((prev) =>
                        prev.includes(record.key)
                          ? prev.filter((key) => key !== record.key)
                          : [...prev, record.key],
                      );
                    }
                  }}
                  style={
                    record.children?.length
                      ? {
                          cursor: 'pointer',
                          fontWeight: '600',
                          marginLeft: '8px',
                          textTransform: 'capitalize',
                        }
                      : { cursor: 'default' }
                  }
                >
                  {text}
                </span>
              )
            : col.render,

        filters: col.filters?.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        filterIcon: () => {
          const currentFilters = newFilters?.[col.name]?.length || 0;
          return currentFilters > 0 ? (
            <Badge count={currentFilters} size="small">
              <FilterFilled />
            </Badge>
          ) : (
            <FilterFilled />
          );
        },

        filterMultiple: true,
    
      })),
    ];

    if (props.isDelete) {
      columns?.push({
        title: 'Delete',
        dataIndex: 'Delete',
        key: 'Delete',
        render: (_ , record) => {
          return (
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Tooltip title="Delete">
                <p>Del</p>
                <Button/>
              </Tooltip>
            </Popconfirm>
          );
        },
      });
    }
    
  }

  const rowSelectionConfig = props.rowSelection
    ? {
        onChange: (
          selectedRows
        ) => {
          if (props.onChange) {
            props.onChange(selectedRows);
          }
        },
      }
    : undefined;
  const handleRowClick = (record) => {
    if (props.onChange) {
      props.onChange({ name: 'view', value: { ...record } });
    }
  };
  const useDynamicHeight = () => {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
      const handleResize = () => {
        setHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return height;
  };
  const height = useDynamicHeight() - 335;

 
  return (
    <div
      className={props.expandIcon ? '' : 'tree-table'}
      style={{ position: 'relative' }}
    >
      <Table
        // virtual
        style={{ userSelect: 'none' }}
        loading={props.loading}
        className={props.className}
        scroll={{
          x: 'max-content',
          y: props.fullHeight
            ? ''
            : props.tableHeight !== undefined
              ? props.tableHeight
              : height,
        }}
        pagination={
          props.pagination
            ? {
                align: 'end',
                current: pagination.page,
                pageSize: pagination.pageSize,
                pageSizeOptions: props.pageSizeOptions||[10, 20, 30, 50, 100],
                showTotal: (total) => `Total: ${total} items`,
                total: props.count,
                showSizeChanger: props.count ? props.count > 10 : 0 > 10,
                style: {
                  position: 'sticky',
                  bottom: '0',
                  left: '0',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                  padding: '5px 0',
                  zIndex: 10,
                },
              }
            : false
        }
        rowSelection={rowSelectionConfig}
        dataSource={dataSource}
        columns={columns.map((col) => ({
          ...col,
          onCell: (_record) => ({
            style: {
              cursor: col.clickable === false ? 'default' : 'pointer',
            },
          }),
        }))}
        size={props.size}
        bordered
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys((prevExpandedRowKeys) => {
              if (expanded) {
                return [...prevExpandedRowKeys, record.key];
              } else {
                return prevExpandedRowKeys.filter((key) => key !== record.key);
              }
            });
          },
          rowExpandable: (record) =>
            !!(record.children && record.children.length > 0),
          expandIcon: props.expandIcon
            ? ({
                expanded,
                onExpand,
                record,
              }) =>
                record.children && record.children?.length > 0 ? (
                  expanded ? (
                    <DownOutlined
                      onClick={(e) => onExpand(record, e)}
                      style={{
                        float: props.expandIconStyles ? 'left' : undefined,
                        paddingTop: '5px',
                      }}
                    />
                  ) : (
                    <RightOutlined
                      onClick={(e) => onExpand(record, e)}
                      style={{
                        float: props.expandIconStyles ? 'left' : undefined,
                        paddingTop: '5px',
                      }}
                    />
                  )
                ) : null
            : undefined,
        }}
        onChange={handleTableChange}
        onRow={(record) => {
          return {
            onClick: (event) => {
              const clickedCell = (event.target).closest('td');
              if (!clickedCell || !clickedCell.parentNode) return;
              const columnIndex = Array.from(
                clickedCell.parentNode.children,
              ).indexOf(clickedCell);
              const columnConfig = columns[columnIndex] ;
              if (columnConfig && columnConfig.clickable === false) {
                return;
              }

              if (props.rowClick === true || props.rowClick === undefined) {
                handleRowClick(record);
              }
              if (props.expandable && record.key !== undefined) {
                const isRowExpanded = expandedRowKeys.includes(record.key);
                setExpandedRowKeys((prev) =>
                  isRowExpanded
                    ? prev.filter((key) => key !== record.key)
                    : [...prev, record.key],
                );
              }
            },
          };
        }}
        rowClassName={() =>
          props.rowClick === true ||
          props.rowClick === undefined ||
          props.expandable
            ? 'cursor-pointer'
            : ''
        }
      />
    </div>
  );
};
