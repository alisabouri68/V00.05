import React, { useEffect, useState } from "react";
import TableLinear from "RCMP/RCMP_tableLinear_V00.05";
import type { IColumn } from "RCMP/RCMP_tableLinear_V00.05";

// =======================
// Columns
// =======================

export const columns: IColumn[] = [
  {
    key: "avatar",
    title: "Avatar",
    render: (value) => (
      <img
        src={value}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover"
      />
    ),
  },

  {
    key: "name",
    title: "Full Name",
    sortable: true,
    // filterable: true,
    editable: true,
  },

  {
    key: "email",
    title: "Email",
    sortable: true,
    // filterable: true,/
    editable: true,
  },

  {
    key: "age",
    title: "Age",
    sortable: true,
    render: (value) => <span className="font-mono">{value} years</span>,
  },

  {
    key: "gender",
    title: "Gender",
    sortable: true,
    // filterable: true,
  },

  {
    key: "city",
    title: "City",
    sortable: true,
    // filterable: true,
  },

  {
    key: "country",
    title: "Country",
    sortable: true,
  },

  {
    key: "phone",
    title: "Phone",
  },

  {
    key: "status",
    title: "Status",
    sortable: true,

    render: (value) => (
      <span
        className={`
        inline-flex items-center gap-2
        rounded-full px-3 py-1 text-xs font-medium

        ${
          value === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
        `}
      >
        <span
          className={`
          w-2 h-2 rounded-full

          ${value === "Active" ? "bg-green-500" : "bg-red-500"}
          `}
        />

        {value}
      </span>
    ),
  },

  {
    key: "salary",
    title: "Salary",
    sortable: true,

    render: (value) => new Intl.NumberFormat("en-US").format(value),
  },
];

// =======================
// Component
// =======================

const FullExample = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =======================
  // Fetch API
  // =======================

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=200")
      .then((res) => res.json())

      .then((result) => {
        const users = result.results.map((user: any, index: number) => ({
          id: index + 1,

          avatar: user.picture.large,

          name: `${user.name.first} ${user.name.last}`,

          email: user.email,

          age: user.dob.age,

          gender: user.gender,

          city: user.location.city,

          country: user.location.country,

          phone: user.phone,

          status: Math.random() > 0.25 ? "Active" : "Inactive",

          salary: Math.floor(Math.random() * 60000000) + 20000000,
        }));

        setData(users);

        setLoading(false);
      });
  }, []);

  // =======================
  // Events
  // =======================

  const handleSelect = (rows: any[]) => {
    console.log("Selected:", rows);
  };

  const handleEdit = (row: any) => {
    setData((prev) =>
      prev.map((item) => (item.id === row.id ? { ...item, ...row } : item)),
    );
  };

  const handleDelete = (row: any) => {
    if (window.confirm("Delete this user?")) {
      setData((prev) => prev.filter((item) => item.id !== row.id));
    }
  };

  const handleBulkDelete = (rows: any[]) => {
    const ids = new Set(rows.map((r) => r.id));

    setData((prev) => prev.filter((item) => !ids.has(item.id)));
  };

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const handleSort = (sort: any) => {
    console.log("Sort:", sort);
  };

  const handleFilter = (filter: any) => {
    console.log("Filter:", filter);
  };

  const handleExport = (rows: any[]) => {
    console.log("Export:", rows);
  };

  const handleRowClick = (row: any, index: number) => {
    console.log("Row:", index, row);
  };

  return (
    <TableLinear
      meta={{
        title: "User Management",
      }}
      geo={{
        width: "100%",
        maxHeight: "600px",
      }}
      logic={{
        columns,

        data,

        loading,

        rowKey: "id",

        selection: true,

        pagination: true,

        pageSize: 10,

        title: "Users List",

        editable: "edit",

        actions: {
          view: true,
          edit: true,
          delete: true,
          expand: true,
        },

        agreeBar: true,

        enableColumnResize: true,

        enableExport: true,

        emptyText: "No users found",

        onSelect: handleSelect,

        onEdit: handleEdit,

        onDelete: handleDelete,

        onBulkDelete: handleBulkDelete,

        onSearch: handleSearch,

        onSort: handleSort,

        onFilter: handleFilter,

        onExport: handleExport,

        onRowClick: handleRowClick,
      }}
    
    />
  );
};

export default FullExample;
