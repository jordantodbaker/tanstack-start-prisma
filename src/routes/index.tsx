import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from "@tanstack/react-start"; 
import { prisma } from '../db'; 
import '../index.css'


import {
  createColumn,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react';

type Changelog = {
  id: number,
  projectId: number,
  cvrId: number,
  description: string,
  status: string
  createdAt: Date,
  updatedAt: Date
}

export const Route = createFileRoute('/')({ component: App, loader: () => {return getChangelogs(); }})

const getChangelogs = createServerFn({ method: "GET" }).handler(async () => { 
  return prisma.changelog.findMany(); 
}); 

const columnHelper = createColumnHelper<Changelog>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.projectId, {
    id: 'projectId',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Project Id</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('cvrId', {
    header: () => 'CVR ID',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('description', {
    header: () => <span>Description</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    footer: (info) => info.column.id,
  }),
]

const defaultData: Changelog[] = [{
  id: 0,
  projectId: 0,
  cvrId: 0,
  description: '',
  status: '',
  createdAt: new Date(),
  updatedAt: new Date()
}]

function App() {
  
  const rerender = React.useReducer(() => ({}), {})[1]


  const logs: Changelog[] = Route.useLoaderData();
  const [data, _setData] = React.useState(() => [...logs]);

    const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {fuzzy: ()=>{ return true}}
  })
  console.log(logs)
  return (
    <main >
       <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </main>
  )
}
