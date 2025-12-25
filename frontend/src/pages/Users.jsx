import React,{useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCard from "../Cards/UserCard";
import { setAllUsers } from "../store/userSlice"; 
import axiosInstance from "../utils/axiosinstance";

function Users() {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.user.allUsers);
  const token = sessionStorage.getItem("token");

  const handleDeleteUser = (id) => {
    fetchUsers();
  };

    async function fetchUsers(){
      try {
      const res = await axiosInstance.get("/api/admin/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
      if(res){
        dispatch(setAllUsers(res.data));
      }
    } catch (error) { 
      console.log('Error fetching allUsers',error);
    }
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
      {allUsers.length === 0 ? (
        <p className="text-gray-400">No users found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} user={user} onDelete={handleDeleteUser} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;