import { useState, useEffect } from "react";
import axios from "axios";
import Buttons from "../Components/Buttons";
import { useNavigate } from "react-router-dom";
import AppBar from "../Components/AppBar";


export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [userLogs, setUserLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/admin/admin",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { users, userLogs } = response.data;
        setUsers(users);
        setUserLogs(userLogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  

  const handleView = (user) => {
    setSelectedUser({ ...user, userLogs });
    console.log(user);
    
  };

  

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };


  return (
    <>
    <AppBar />
    
      <>
    
      
      <ul className="m-6 py-0 px-3 bg-gray-200  border-black rounded-md">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleView(user)}
            style={{ cursor: "pointer" }}
          >
            <li className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="h-12 w-12 flex-none rounded-full bg-gray-500 flex items-center justify-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.firstName[0].toUpperCase()}
                  </p>
                </div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.firstName}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {user.username}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {user.jobRole}
                </p>

                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
      </>
    
      {selectedUser && (
  <div className="p-4 bg-gray-100 border border-gray-300 rounded shadow-md m-4">
  <div className="mb-4">
    <h2 className="text-lg font-semibold">User Details</h2>
    <p className="mt-2">Email: {selectedUser.username}</p>
    <p className="mt-2">Job Role: {selectedUser.jobRole}</p>
  </div>
  <div className="flex justify-end mb-4">
  </div>
  <div className="overflow-x-auto">
  <table className="min-w-full border-collapse">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
        <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
      </tr>
    </thead>
    <tbody>
      {selectedUser.userLogs
        ?.filter(
          (log) =>
            log.user?._id === selectedUser._id && log.loginTime && log.logoutTime
        )
        .map((log) => (
          <tr key={log._id} className="bg-white">
            <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(log.loginTime)}</td>
            <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(log.logoutTime)}</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

</div>

)}

    </>
  );
}
