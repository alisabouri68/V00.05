import React, { useEffect, useState } from 'react'

import TableLinear from 'RCMP/RCMP_tableLinear_V00.05'
import type { IColumn } from 'RCMP/RCMP_tableLinear_V00.05'

// ============================
// Columns
// ============================

const columns: IColumn[] = [
  {
    key: 'avatar',
    title: 'Avatar',

    render: value => (
      <img
        src={value}
        alt='avatar'
        className='
          w-7 h-7
          rounded-full
          object-cover
        '
      />
    )
  },

  {
    key: 'name',
    title: 'Full Name',

    sortable: true,
    // filterable: true,
    editable: true
  },

  {
    key: 'email',
    title: 'Email',

    sortable: true,
    // filterable: true,
    editable: true
  },

  {
    key: 'age',
    title: 'Age',

    sortable: true,

    render: value => <span className='font-mono'>{value}</span>
  },

  {
    key: 'gender',
    title: 'Gender',

    sortable: true,
    // filterable: true
  },

  {
    key: 'company',
    title: 'Company',

    sortable: true
  },

  {
    key: 'city',
    title: 'City',

    sortable: true,
    // filterable: true
  },

  {
    key: 'country',
    title: 'Country',

    sortable: true
  },

  {
    key: 'phone',
    title: 'Phone'
  },

  {
    key: 'role',
    title: 'Role',

    sortable: true
  },

  {
    key: 'status',
    title: 'Status',

    render: value => (
      <span
        className={`
          inline-flex
          items-center
          gap-2
          rounded-full
          px-2.5
          py-1
          text-xs
          font-medium

          ${
            value === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }
        `}
      >
        <span
          className={`
            w-1.5
            h-1.5
            rounded-full

            ${value === 'Active' ? 'bg-green-500' : 'bg-red-500'}
          `}
        />

        {value}
      </span>
    )
  },

  {
    key: 'salary',
    title: 'Salary',

    sortable: true,

    render: value => new Intl.NumberFormat('en-US').format(value)
  }
]

// ============================
// Component
// ============================

const FullExample = () => {
  const [data, setData] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  // ============================
  // Get API
  // ============================

  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=1000')
      .then(res => res.json())

      .then(result => {
        const users = result.users.map((user: any) => ({
          id: user.id,

          avatar: user.image,

          name: `${user.firstName} ${user.lastName}`,

          email: user.email,

          age: user.age,

          gender: user.gender,

          company: user.company?.name,

          city: user.address?.city,

          country: user.address?.country,

          phone: user.phone,

          role: user.role,

          status: Math.random() > 0.2 ? 'Active' : 'Inactive',

          salary: Math.floor(Math.random() * 60000000) + 25000000
        }))

        setData(users)

        setLoading(false)
      })
  }, [])

  // ============================
  // Events
  // ============================

  const handleSelect = (rows: any[]) => {
    console.log('Selected', rows)
  }

  const handleEdit = (row: any) => {
    setData(prev =>
      prev.map(item =>
        item.id === row.id
          ? {
              ...item,
              ...row
            }
          : item
      )
    )
  }

  const handleDelete = (row: any) => {
    if (window.confirm('Delete user?')) {
      setData(prev => prev.filter(item => item.id !== row.id))
    }
  }

  const handleBulkDelete = (rows: any[]) => {
    const ids = new Set(rows.map(r => r.id))

    setData(prev => prev.filter(item => !ids.has(item.id)))
  }

  const handleExport = (rows: any[]) => {
    console.log('Export', rows)
  }

  const handleSearch = (value: string) => {
    console.log('Search', value)
  }

  const handleSort = (config: any) => {
    console.log('Sort', config)
  }

  const handleFilter = (filters: any) => {
    console.log('Filter', filters)
  }

  const handleRowClick = (row: any, index: number) => {
    console.log(index, row)
  }

  return (
    <TableLinear
      meta={{
        title: 'User Management'
      }}
      geo={{
        width: '100%',

        maxHeight: '600px'
      }}
      logic={{
        columns,

        data,

        loading,

        rowKey: 'id',

        selection: true,

        pagination: false,

        editable: 'edit',

        title: 'Users List',

        agreeBar: true,

        actions: {
          view: true,

          edit: true,

          delete: true,

          expand: true
        },

        enableColumnResize: true,

        // enableExport: true,

        emptyText: 'No users found',

        onSelect: handleSelect,

        onEdit: handleEdit,

        onDelete: handleDelete,

        onBulkDelete: handleBulkDelete,

        // onExport: handleExport,

        onSearch: handleSearch,

        onSort: handleSort,

        onFilter: handleFilter,

        onRowClick: handleRowClick
      }}
      style={{
        headerBg: '#e6f0ff',

        rowHoverBg: '#f0f7ff',

        stripeColor: '#f9fafc'
      }}
    />
  )
}

export default FullExample
