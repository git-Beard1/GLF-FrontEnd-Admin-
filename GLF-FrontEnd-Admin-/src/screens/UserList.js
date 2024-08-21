// UserList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import "../styles/App.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [mostSavedEvent, setMostSavedEvent] = useState([]);
  const localhostapi = "http://localhost:5000";
  const serverlessapi = "https://adminilftest-4tmd.onrender.com";
  const navigate = useNavigate();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let token = localStorage.getItem("token");

        await axios({
          headers: {
            authorization: "Bearer " + token,
          },
          method: "get",
          url: `${serverlessapi}/validateLogin`,
        })
          .then(function (response) {
            console.log("Test", response.data);
            if (response.data.message == "Unauthorized access") {
              localStorage.clear();
              navigate("/login");
            } else if (response.data.role !== "Admin") {
              navigate("../");
            }
          })
          .catch(function (response) {
            // Handle error
            console.dir(response);
          });

        const response = await axios.get(`${serverlessapi}/users`);
        setUsers(response.data);

        const rolesResponse = await axios.get(`${serverlessapi}/roles`);
        const usersResponse = await axios.get(`${serverlessapi}/users`);

        console.log("Roles data:", rolesResponse.data);
        console.log("Users data:", usersResponse.data);

        setRoles(rolesResponse.data);
        setUsers(usersResponse.data);

        // Fetch most saved event data
        const mostSavedEventResponse = await axios.get(
          `${serverlessapi}/mostsavedEvent`
        );
        setMostSavedEvent(mostSavedEventResponse.data.rows[0]);
        console.log("Most saved event:", mostSavedEventResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const deleteadmin = async (roleId) => {
    try {
      const response = await axios.delete(
        `${serverlessapi}/deladmin/${roleId}`
      );
      console.log("API Response:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteadmin(roleIdToDelete);
      setShowDeleteConfirmation(false);
      setRoleIdToDelete(null);
    } catch (error) {
      console.error("Error deleting information:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getTypeCount = (type) => {
    if (type === "All") {
      return roles.length + users.length;
    }

    return (
      roles.filter((role) => role.type === type).length +
      users.filter((user) => user.type === type).length
    );
  };

  const filterOptions = ["All", "Admin", "Event Manager", "User"];

  const combinedData = [...roles, ...users];

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8">
          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {filterOptions.map((option, index) => (
              <React.Fragment key={option}>
                <span
                  className={`cursor-pointer ${
                    filter === option ? "text-blue-500 font-bold" : ""
                  }`}
                  onClick={() => handleFilterChange(option)}
                >
                  {option} ({getTypeCount(option)})
                </span>
                {index !== filterOptions.length - 1 && (
                  <span className="border-r mx-2 h-5 border-gray-300"></span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Combined User and Role Table */}
          <table className="w-full max-w-md bg-white border border-gray-300 shadow-md mt-4">
            <thead>
              <tr>
                <th className="p-2 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </span>
                </th>
                <th className="p-2 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </span>
                </th>
                <th className="p-2 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {combinedData
                .filter((data) => filter === "All" || data.type === filter)
                .map((data, index) => (
                  <tr
                    key={data.userId || data.roleId}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    style={{ height: "80px" }}
                  >
                    <td className="p-2 text-center">
                      {data.username ||
                        `${data.first_name || "N/A"} ${data.last_name || ""}`}
                    </td>
                    <td className="p-2 text-center">{data.type || "N/A"}</td>
                    <td className="p-2 text-center">
                      {data.roleid && (
                        <>
                          {roleIdToDelete !== data.roleid && (
                            <button
                              onClick={() => {
                                setRoleIdToDelete(data.roleid);
                                setShowDeleteConfirmation(true);
                              }}
                              className="text-red-500"
                              style={{
                                color: "white",
                                backgroundColor: "#e84646",
                                width: "70px",
                                boxShadow: "none",
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Display Most Saved Event */}
          {mostSavedEvent && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Most Saved Event:</h2>
              <p>Title: {mostSavedEvent.title}</p>
              <p>Saved Count: {mostSavedEvent.savedcount}</p>
            </div>
          )}

          {/* Add Manager Button */}
          <Link to="/addmanager">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md my-2 hover:bg-blue-600">
              Add Manager
            </button>
          </Link>

          {showDeleteConfirmation && (
            <DeleteConfirmationModal
              onConfirm={handleDelete}
              onCancel={() => {
                setShowDeleteConfirmation(false);
                setRoleIdToDelete(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
