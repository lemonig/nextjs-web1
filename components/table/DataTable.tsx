'use client'

import { Table } from 'antd'
import type { TableProps } from 'antd'

export interface DataTableProps<T> extends TableProps<T> {
  columns: TableProps<T>['columns']
  dataSource: readonly T[]
  rowKey: TableProps<T>['rowKey']
}

export default function DataTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination,
  scroll,
  ...rest
}: DataTableProps<T>) {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource as T[]}
      rowKey={rowKey}
      loading={loading}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              ...pagination,
            }
      }
      scroll={scroll}
      {...rest}
    />
  )
}
