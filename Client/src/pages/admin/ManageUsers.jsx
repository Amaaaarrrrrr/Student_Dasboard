import React, { useState } from 'react';

const ManageUsers = () => {
  // Sample user data
  const initialUsers = [
    { id: 1, name: 'User One', email: 'userone@example.com', role: 'Role One' },
    { id: 2, name: 'User Two', email: 'usertwo@example.com', role: 'Role Two' },
    { id: 3, name: 'User Three', email: 'userthree@example.com', role: 'Role Three' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user deletion with confirmation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Styles moved to objects for better readability
  const styles = {
    container: { padding: '20px' },
    searchInput: { padding: '8px', width: '300px', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { borderBottom: '2px solid #ccc' },
    headerCell: { textAlign: 'left', padding: '8px' },
    row: { borderBottom: '1px solid #eee' },
    cell: { padding: '8px' },
    deleteButton: { color: 'red' },
    viewButton: { marginRight: '10px' },
    noUsersCell: { padding: '8px', textAlign: 'center' },
  };

  return (
    <div className="manage-users" style={styles.container}>
      <h1>Manage Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
        aria-label="Search users"
      />
      <table style={styles.table} aria-label="User list">
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Name</th>
            <th style={styles.headerCell}>Email</th>
            <th style={styles.headerCell}>Role</th>
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.cell}>{user.name}</td>
                <td style={styles.cell}>{user.email}</td>
                <td style={styles.cell}>{user.role}</td>
                <td style={styles.cell}>
                  <button
                    onClick={() => alert(`Viewing user: ${user.name}`)}
                    style={styles.viewButton}
                    aria-label={`View details for ${user.name}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={styles.deleteButton}
                    aria-label={`Delete user ${user.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noUsersCell}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
