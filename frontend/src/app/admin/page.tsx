"use client";

import { useEffect, useState } from "react";
import { getRsvps, updateRsvp, deleteRsvp } from "@/app/actions/rsvp";
import { Toaster, toast } from "sonner";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded credentials as requested
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "wedding2026") {
      setIsAuth(true);
      fetchData();
    } else {
      toast.error("Invalid credentials");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const data = await getRsvps();
    setRsvps(data);
    setLoading(false);
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    const res = await updateRsvp(id, { [field]: value });
    if (res.success) {
      toast.success("Updated successfully");
      fetchData();
    } else {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this RSVP?")) {
      const res = await deleteRsvp(id);
      if (res.success) {
        toast.success("Deleted successfully");
        fetchData();
      }
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 font-sans">
        <Toaster />
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-orange-200">
          <h2 className="text-3xl font-serif text-pink-700 mb-6 text-center">Admin Login</h2>
          <input 
            type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400" 
          />
          <input 
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-6 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400" 
          />
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f2] p-8 font-sans text-orange-950">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-pink-700">RSVP Dashboard</h1>
          <button onClick={() => setIsAuth(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Logout</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-200 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-100 text-orange-900 border-b border-orange-200">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">People</th>
                  <th className="p-4 font-bold">Room</th>
                  <th className="p-4 font-bold">Transport</th>
                  <th className="p-4 font-bold">Carpool</th>
                  <th className="p-4 font-bold">Seats</th>
                  <th className="p-4 font-bold">Timestamp</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-500">No RSVPs yet.</td></tr>
                ) : (
                  rsvps.map((rsvp: any) => (
                    <tr key={rsvp.id} className="border-b border-orange-100 hover:bg-orange-50/50">
                      <td className="p-4">
                        <input 
                          type="text" 
                          defaultValue={rsvp.name} 
                          onBlur={(e) => handleUpdate(rsvp.id, "name", e.target.value)}
                          className="bg-transparent outline-none w-full border-b border-dashed border-transparent hover:border-gray-400 focus:border-orange-500"
                        />
                      </td>
                      <td className="p-4">
                        <input 
                          type="number" 
                          defaultValue={rsvp.people} 
                          onBlur={(e) => handleUpdate(rsvp.id, "people", e.target.value)}
                          className="bg-transparent outline-none w-full border-b border-dashed border-transparent hover:border-gray-400 focus:border-orange-500"
                        />
                      </td>
                      <td className="p-4">
                        <select 
                          defaultValue={rsvp.room} 
                          onChange={(e) => handleUpdate(rsvp.id, "room", e.target.value)}
                          className="bg-transparent outline-none w-full cursor-pointer"
                        >
                          <option value="single">Single</option>
                          <option value="shared">Shared</option>
                          <option value="none">Not staying</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select 
                          defaultValue={rsvp.transport} 
                          onChange={(e) => handleUpdate(rsvp.id, "transport", e.target.value)}
                          className="bg-transparent outline-none w-full cursor-pointer"
                        >
                          <option value="car">Car</option>
                          <option value="train">Train</option>
                          <option value="bus">Bus</option>
                          <option value="flight">Flight</option>
                        </select>
                      </td>
                      <td className="p-4">{rsvp.carStatus || "-"}</td>
                      <td className="p-4">{rsvp.vacantSeats || "-"}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(rsvp.timestamp).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(rsvp.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded bg-red-50">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
