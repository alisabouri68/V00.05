// TableLinearDemo.tsx
import React, { useState, useEffect } from 'react'
import TableLinear from 'RCMP/RCMP_tableLinear_V00.05'

// ============================================
// Types
// ============================================
interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: { lat: string; lng: string }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
  avatar?: string
}

// ============================================
// Main Demo Component
// ============================================
const TableLinearDemo: React.FC = () => {
  // --- State ---
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [paginationEnabled, setPaginationEnabled] = useState(true)
  const [selectionEnabled, setSelectionEnabled] = useState(true)
  const [editableMode, setEditableMode] = useState<'edit' | 'view'>('view')
  const [virtualization, setVirtualization] = useState(false)
  const [columnResize, setColumnResize] = useState(true)
  const [exportEnabled, setExportEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [agreeBarVisible, setAgreeBarVisible] = useState(true)

  // --- Fetch data from JSONPlaceholder + add avatars ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        )
        const data: User[] = await response.json()
        // Add avatar from Pravatar (using id as seed)
        const usersWithAvatar = data.map(user => ({
          ...user,
          avatar: `https://i.pravatar.cc/150?img=${user.id}`
        }))
        setUsers(usersWithAvatar)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // --- Columns definition ---
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: 60,
      sortable: true,
      },
    {
      key: 'avatar',
      title: 'Avatar',
      width: 70,
  
      render: (value: string) => (
        <img
          src={value}
          alt='avatar'
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #e2e8f0'
          }}
        />
      )
    },
    {
      key: 'name',
      title: 'Full Name',
      width: 180,
      sortable: true,
      editable: true
    },
    {
      key: 'email',
      title: 'Email',
      width: 200,
      sortable: true,
      editable: true
    },
    {
      key: 'phone',
      title: 'Phone',
      width: 150,
      sortable: true
    },
    {
      key: 'website',
      title: 'Website',
      width: 140,
      sortable: true,
      render: (value: string) => (
        <a
          href={`https://${value}`}
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#0891b2', textDecoration: 'none' }}
        >
          {value}
        </a>
      )
    },
    {
      key: 'company',
      title: 'Company',
      width: 160,
      sortable: true,
      render: (value: { name: string }) => value?.name || '-'
    },
    {
      key: 'address',
      title: 'City',
      width: 120,
      sortable: true,
      render: (value: { city: string }) => value?.city || '-'
    }
  ]

  // --- Summary Data ---
  const summaryData = [
    { label: 'Total Users', value: users.length },
    {
      label: 'Companies',
      value: new Set(users.map(u => u.company?.name)).size
    },
    {
      label: 'Unique Cities',
      value: new Set(users.map(u => u.address?.city)).size
    }
  ]

  // --- Event Handlers ---
  const handleSelect = (rows: any[]) => console.log('Selected:', rows)
  const handleEdit = (row: any) => console.log('Edit:', row)
  const handleDelete = (row: any) => console.log('Delete:', row)
  const handleSearch = (value: string) => console.log('Search:', value)
  const handleSort = (config: any) => console.log('Sort:', config)
  const handleFilter = (filters: any) => console.log('Filter:', filters)
  const handleRowClick = (row: any, index: number) =>
    console.log('Row click:', row, index)
  const handleBulkDelete = (rows: any[]) => console.log('Bulk delete:', rows)
  const handleExport = (data: any[]) => console.log('Export:', data)
  const handlePageChange = (page: number) => console.log('Page change:', page)

  // --- Logic Props ---
  const logicProps = {
    columns,
    data: users,
    selection: selectionEnabled,
    pagination: paginationEnabled,
    pageSize: 5,
    editable: editableMode,
    title: 'User Management',
    agreeBar: agreeBarVisible,
    actions: {
      view: true,
      edit: true,
      delete: true,
      expand: true
    },
    loading,
    emptyText: 'No users found',
    enableVirtualization: virtualization,
    virtualItemHeight: 48,
    enableColumnResize: columnResize,
    enableExport: exportEnabled,
    rowKey: 'id',
    summaryData,
    enableDarkMode: darkMode,
    defaultDarkMode: false,
    onSelect: handleSelect,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSearch: handleSearch,
    onSort: handleSort,
    onFilter: handleFilter,
    onRowClick: handleRowClick,
    onBulkDelete: handleBulkDelete,
    onExport: handleExport,
    onPageChange: handlePageChange
  }

  const styleProps = {
    headerBg: '#d9e7ff',
    rowHoverBg: '#f0f7ff',
    stripeColor: '#f9fafc',
    borderColor: '#e2e8f0',
    textColor: '#1e293b',
    fontSize: compactMode ? '0.7rem' : '0.75rem',
    compact: compactMode
  }

  // ============================================
  // Render
  // ============================================
  return (
    <div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#0f172a'
        }}
      >
        📊 TableLinear – Full Demo
      </h1>
      <p style={{ marginBottom: '2rem', color: '#475569' }}>
        This demo fetches real user data from <strong>JSONPlaceholder</strong>{' '}
        with avatars from <strong>Pravatar</strong>. Toggle the options below to
        test every feature of the table component.
      </p>

      {/* Control Panel – English labels with checkboxes */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem 1.5rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}
      >
        <ControlItem
          label='Pagination'
          checked={paginationEnabled}
          onChange={() => setPaginationEnabled(!paginationEnabled)}
        />
        <ControlItem
          label='Row Selection'
          checked={selectionEnabled}
          onChange={() => setSelectionEnabled(!selectionEnabled)}
        />
        <ControlItem
          label='Edit Mode'
          checked={editableMode === 'edit'}
          onChange={() =>
            setEditableMode(editableMode === 'view' ? 'edit' : 'view')
          }
          isToggle
        />
        <ControlItem
          label='Virtualization'
          checked={virtualization}
          onChange={() => setVirtualization(!virtualization)}
        />
        <ControlItem
          label='Column Resize'
          checked={columnResize}
          onChange={() => setColumnResize(!columnResize)}
        />
        <ControlItem
          label='CSV Export'
          checked={exportEnabled}
          onChange={() => setExportEnabled(!exportEnabled)}
        />
        <ControlItem
          label='Dark Mode'
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <ControlItem
          label='Compact Mode'
          checked={compactMode}
          onChange={() => setCompactMode(!compactMode)}
        />
        <ControlItem
          label='Agree Bar'
          checked={agreeBarVisible}
          onChange={() => setAgreeBarVisible(!agreeBarVisible)}
        />
      </div>

      {/* The Table */}
      <TableLinear
        meta={{
          id: 'user-table',
          title: 'User Management',
          version: '02.01.00',
          lastUpgrade: 'D2026.07.14',
          owner: 'apps68'
        }}
        geo={{
          width: '100%',
          maxHeight: '500px'
        }}
        logic={logicProps}
        style={styleProps}
      />

      {/* Feature Description (English) */}
      <div
        style={{
          marginTop: '2rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#0f172a'
          }}
        >
          ✨ Key Features
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '0.75rem'
          }}
        >
          <Feature desc='Select rows individually or all at once' />
          <Feature desc='Sort columns ascending/descending' />
          <Feature desc='Filter each column by text' />
          <Feature desc='Global search across all columns' />
          <Feature desc='Inline cell editing (double‑click)' />
          <Feature desc='Pagination with page navigation' />
          <Feature desc='Show/hide columns via settings menu' />
          <Feature desc='Resize columns by dragging edges' />
          <Feature desc='Dark / Light theme toggle' />
          <Feature desc='Export filtered/selected data to CSV' />
          <Feature desc='Bulk delete selected rows' />
          <Feature desc='Agree bar with summary statistics' />
          <Feature desc='Horizontal column scrolling (if many columns)' />
          <Feature desc='Fixed action column with view/edit/delete/expand' />
          <Feature desc='Expandable row details' />
          <Feature desc='Keyboard shortcuts (Ctrl+A, Ctrl+E)' />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Helper Components
// ============================================

const ControlItem: React.FC<{
  label: string
  checked: boolean
  onChange: () => void
  isToggle?: boolean
}> = ({ label, checked, onChange, isToggle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#1e293b' }}>
      {label}:
    </label>
    {isToggle ? (
      <button
        onClick={onChange}
        style={{
          padding: '2px 10px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.8rem',
          background: checked ? '#0891b2' : 'white',
          color: checked ? 'white' : '#1e293b',
          cursor: 'pointer'
        }}
      >
        {checked ? 'Edit' : 'View'}
      </button>
    ) : (
      <input type='checkbox' checked={checked} onChange={onChange} />
    )}
  </div>
)

const Feature: React.FC<{ desc: string }> = ({ desc }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      color: '#334155'
    }}
  >
    <span style={{ color: '#0891b2', fontWeight: 'bold' }}>✓</span>
    {desc}
  </div>
)

export default TableLinearDemo
