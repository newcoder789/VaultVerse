import React, { useEffect, useState } from "react";
import { useAuth } from "@nfid/identitykit/react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as coreIdlFactory } from "../../../declarations/core_protocol_canister/core_protocol_canister.did.js";

const Profile = () => {
  const { user, connect } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "", profilePicUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.principal) return;
      setLoading(true);
      setError(null);
      try {
        const agent = new HttpAgent({ host: window.location.hostname.includes("localhost") ? "http://127.0.0.1:4943" : "https://ic0.app" });
        if (window.location.hostname.includes("localhost")) await agent.fetchRootKey();
        const actor = Actor.createActor(coreIdlFactory, { agent, canisterId: process.env.CANISTER_ID_CORE_PROTOCOL_CANISTER });
        const fetched = await actor.get_profile(user.principal);
        if (fetched && fetched[0]) {
          setProfile(fetched[0]);
          setForm({
            username: fetched[0].username,
            bio: fetched[0].bio,
            profilePicUrl: fetched[0].profilePicUrl,
          });
        } else {
          setError("No profile found for this user.");
        }
      } catch (err) {
        setError("Failed to fetch profile: " + (err.message || err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setSuccess(null); setError(null); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const agent = new HttpAgent({ host: window.location.hostname.includes("localhost") ? "http://127.0.0.1:4943" : "https://ic0.app" });
      if (window.location.hostname.includes("localhost")) await agent.fetchRootKey();
      const actor = Actor.createActor(coreIdlFactory, { agent, canisterId: process.env.CANISTER_ID_CORE_PROTOCOL_CANISTER });
      actor.set_profile({ ...form, joinedAt: profile?.joinedAt || Date.now() }).then((b)=>console.log("Profile set worked",b)).catch((err)=> console.log("Profile set failed:",err));
      // Immediately refetch profile to verify backend update
      console.log("User pincpl ", user.principal)
      const fetched = await actor.get_profile(user.principal);
      if (fetched && fetched[0]) {
        setProfile(fetched[0]);
        setSuccess("Profile updated!");
        setEditMode(false);
      } else {
        setError("Profile update failed: backend did not return updated profile.");
      }
    } catch (err) {
      setError("Failed to update profile: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <p className="mb-4">Please connect your wallet to view your profile.</p>
        <button onClick={connect} className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full font-semibold">Connect Wallet</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={profile?.profilePicUrl || "/img/avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-pink-500"
          />
          {editMode ? (
            <>
              <input name="username" value={form.username} onChange={handleChange} className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full" placeholder="Username" />
              <input name="profilePicUrl" value={form.profilePicUrl} onChange={handleChange} className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full" placeholder="Profile Pic URL" />
              <textarea name="bio" value={form.bio} onChange={handleChange} className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full" placeholder="Bio" />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full font-semibold" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-full font-semibold">Cancel</button>
              </div>
              {error && <div className="text-red-400 text-center mb-4">{error}</div>}
              {success && <p className="text-green-400 mt-2">{success}</p>}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{profile?.username || "-"}</h2>
              <p className="text-gray-400">{user.principal.toText()}</p>
              <p className="text-gray-400">{profile?.bio}</p>
              <button onClick={handleEdit} className="mt-4 bg-pink-600 hover:bg-pink-700 transition px-6 py-2 rounded-full text-white font-semibold">Edit Profile</button>
            </>
          )}
          <div className="w-full text-left mt-6 space-y-2">
            <div className="bg-gray-700 p-3 rounded-md">
              <p className="text-sm text-gray-400">Wallet Address:</p>
              <p className="text-sm break-words">{user.principal.toText()}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-md">
              <p className="text-sm text-gray-400">Joined:</p>
              <p className="text-sm">{profile?.joinedAt ? new Date(Number(profile.joinedAt)).toLocaleDateString() : "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
