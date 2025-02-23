import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Url } from "../url"; // Fix the import


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch Admin Status
  useEffect(() => {
    const checkAdmin = async () => {
        try {
            const token = localStorage.getItem("token"); // Ensure token is stored
            const res = await axios.get("http://localhost:5000/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
    
            if (res.data.role !== "admin") {
                throw new Error("Access denied! Not an admin.");
            }
            console.log("✅ Admin verified");
        } catch (error) {
            console.error("❌ Admin check failed:", error.response?.data?.message || error.message);
        }
    };
      
    checkAdmin();
  }, [navigate]);

  // Fetch Users (Only if Admin)
  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(Url + "/api/user/me", { withCredentials: true });
          setUsers(res.data);
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };
      fetchUsers();
    }
  }, [isAdmin]);

  // Handle User Deletion
  const handleDelete = async (userId) => {
    try {
      await axios.delete(Url + `/api/user/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== userId)); // Remove deleted user from state
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

//   if (!isAdmin) {
//     return <p>Loading...</p>;
//   }

  return (
    <div className="p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <th>Aarathy</th>
            <th>aarathyap2003@gmail.com</th>
            <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
          </tr>

          <tr>
            <th>Bhaamini</th>
            <th>bhaamini@gmail.com</th>
            <td>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
