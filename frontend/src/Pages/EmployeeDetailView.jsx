import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Buttons from '../Components/Buttons';

export default function EmployeeDetailView() {
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserLog, setSelectedUserLog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/v1/admin/admin',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        const { users,userLogs } = response.data;
        
        

        const user = users.find(user => user._id === id);
        setSelectedUser(user);
        const userlog = userLogs.filter(userlog => userlog.user === id);
        setSelectedUserLog(userlog);
        console.log(userLogs);
        
        
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    console.log('Edit user:', selectedUser);
    // Implement logic to edit the selected user
  };

  const handleDelete = () => {
    console.log('Delete user:', selectedUser._id);
    // Implement logic to delete the selected user
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div>
      <h2>User Details</h2>
      {selectedUser && (
        <>
          <p>Email: {selectedUser.username}</p>
          <h3>User Logs</h3>
          <p>Job Role: {selectedUser.jobRole}</p>
          <ul>
            {selectedUserLog &&
              selectedUserLog
                .filter((log) => log.user === id && log.loginTime && log.logoutTime)
                .map((log) => (
                  <li key={log._id}>
                    <p>Login Time: {formatDateTime(log.loginTime)}</p>
                    <p>Logout Time: {formatDateTime(log.logoutTime)}</p>
                  </li>
                ))}
          </ul>
        </>
      )}
      <div>
        <Buttons onClick={handleEdit} label={'Edit'} />
        <Buttons onClick={handleDelete} label={'Delete'} />
      </div>
    </div>
  );
}
