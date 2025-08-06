import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import { useAuth } from "@nfid/identitykit/react"
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/core_protocol_canister/core_protocol_canister.did.js";
import { useAgent } from "@nfid/identitykit/react"
import { useIdentity } from "@nfid/identitykit/react"
import { createAgent } from "@dfinity/utils";

import { AuthClient } from "@dfinity/auth-client";


// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};
const Header = () => {
  const { connect, disconnect, isConnecting, user } = useAuth()
  // const [agent, setAgent] = useState(null);
  const  [client, setClient] =useState(null);
  const [myIdentity, setMyIdentity] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);
  // const authenticatedAgent = useAgent();
  // const identity = useIdentity()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({
    username: "",
    profilePicUrl: "",
    bio: "",
  });
  const [editError, setEditError] = useState(null);
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  // const agent = useAgent()
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  useEffect(() => {
    console.log("📦 useEffect triggered");
    let cancelled = false;

    const fetchProfile = async (agent) => {
      try {
        if (!user?.principal) {
          console.warn("🚨 No user principal. Are you logged in?");
          await connect();
          return;
        }
        if (!agent) {
          console.warn("🚨 No authenticated agent yet.");
          return;
        }
        try {
          // if (isLocal) {
          await agent.fetchRootKey();
          // await authenticatedAgent.fetchRootKey();
          console.log("✅ Root key fetched for both agents");
          // }
        } catch (err) {
          console.warn("Unable to fetch root key");
          console.error(err);
        }
        // Only create actors after root key is fetched (or immediately if not local)

        const canisterID = "u6s2n-gx777-77774-qaaba-cai"
        // const authenticatedActor = useMemo(() => {
          // if (!authenticatedAgent || !user) return null;
          // return Actor.createActor(idlFactory, {
            // agent: authenticatedAgent,
            // canisterId: canisterID,
          // });
        // }, [authenticatedAgent, user]);
        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId: canisterID,
        });
        // if (process.env.NODE_ENV === "development") {
          

        console.log("🎭 actor created");
        // console.log("✅ Root key fetched:", Buffer.from(agent.rootKey).toString("base64"));
        // const identity = await agent.getIdentity();
        // console.log("Delegation chain:", JSON.stringify(myIdentity.getDelegation().toJSON(), null, 2));
        // const expiration = Number(agent.delegation.expiration) / 1_000_000; // Convert nanoseconds to milliseconds
        // console.log("Delegation expiration:", new Date(expiration).toISOString());
        // await actor.set_profile({
        //   username: "NimbuDev",
        //   bio: "IC Builder",
        //   profilePicUrl: "example.com",
        //   joinedAt: Date.now()
        // });

        console.log("✅ set_profile called",user.principal);

        const fetchedProfile = await actor.get_profile(user?.principal);
        if(fetchedProfile){
          console.log("🎯 fetchedProfile:", fetchedProfile);

          if (!cancelled && fetchedProfile !== null) {
            setProfile(fetchedProfile);
          }
        }else{
          console.log("No Profile", fetchedProfile)
        }
      } catch (err) {
        console.error("❌ Error in fetchProfile:", err);
      }
    };
    if (!user?.principal) {
      // User not logged in, do not create agent or fetch profile
      return;
    }

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1:4943";
    const host = isLocal ? "http://127.0.0.1:4943" : "https://icp0.io"; // <-- update to your backend server if needed

    // AuthClient.create().then(async (client) => {
    //   setClient(client);
    //   const myIdentity = client.getIdentity();
    //   setMyIdentity(myIdentity);
    //   console.log("Agent identity:", myIdentity.getPrincipal().toText());
    //   setUserPrincipal(myIdentity.getPrincipal());
    //   const agent = new HttpAgent({
    //     identity: myIdentity,
    //     host,
    //     fetchRootKey: isLocal, 
    //   });
    //   setAgent(agent);

    //   if (isLocal) {
    //     try {
    //       await agent.fetchRootKey();
    //     } catch (err) {
    //       console.warn("⚠️ Could not fetch root key from local replica");
    //       console.error(err);
    //       return; 
    //     }
    //   }

    //   fetchProfile(agent, myIdentity);
    // }).catch((err) => {
    //   console.error("AuthClient error:", err);
    // });
    const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' })
    agent.fetchRootKey().then(()=>{
      console.log("fetched root key in header");
      fetchProfile(agent);
    }).catch((err)=>console.log("error fethcing root key", err))
    

    }, [user]);
  
  const handleProfileEdit = async (e) => {
    e.preventDefault();
    setEditError(null);
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1:4943";
    const host = isLocal ? "http://127.0.0.1:4943" : "https://icp0.io"; // <-- update to your backend server if needed
    const agent = new HttpAgent({ host, fetchRootKey: isLocal });
    // const agent = authenticatedAgent; // Use the authenticated agent directly
    try {
      await agent.fetchRootKey();
    } catch (err) {
      console.warn("⚠️ Could not fetch root key");
      console.error(err);
      setEditError("Failed to fetch root key. Please try again.");
      return;
    }

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: "u6s2n-gx777-77774-qaaba-cai",
    });

    try {
      await actor.set_profile({
        username: editProfile.username,
        bio: editProfile.bio,
        profilePicUrl: editProfile.profilePicUrl,
        joinedAt: profile.joinedAt, // Keep the original joinedAt value
      });
      setProfile({ ...profile, ...editProfile }); // Update local profile state
      setIsEditingProfile(false);
      setEditProfile({ username: "", profilePicUrl: "", bio: "" }); // Reset form
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setEditError("Failed to update profile. Please try again.");
    }
  };
  return (
    <motion.header
      ref={headerRef}
      className="flex justify-between items-center py-4 px-4 lg:px-20 bg-transparent relative z-50"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
    >
      {/* Logo */}
      <motion.h1
        className="flex items-center gap-2 text-2xl md:text-3xl opacity-60 m-0 text-white"
        variants={navVariants}
      >
        <motion.img
          className="h-10 w-10 md:h-8 md:w-8 object-contain"
          src="/logo.png"
          alt="Logo"
          variants={navVariants}
        />
        VAULTIC PROTOCOL
      </motion.h1>

      {/* Desktop Nav */}
      <motion.nav className="hidden md:flex items-center gap-8" variants={navVariants}>
        {[
          { name: "Get a loan", path: "/loan" },
          { name: "Give a loan", path: "/lend" },
          { name: "Active Loans", path: "/active-loans" },
          { name: "Dashboard", path: "/dashboard" },
        ].map(({ name, path }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link className="text-base text-white hover:text-gray-300" to={path}>
              {name}
            </Link>
          </motion.div>
        ))}
      </motion.nav>

      {/* Right Side: Wallet + Profile */}
      <div className="flex items-center gap-4 relative z-50">
          {!user ? (
            <button
              onClick={()=>connect()}
              
            className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-6 rounded-full shadow-lg hover:shadow-xl"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <>
              <span className="text-xs md:text-sm opacity-80">{user.principal.toText()}</span>
              <button
                onClick={disconnect}
                className="px-3 py-1 bg-gray-700 rounded text-white hover:bg-gray-800 transition ml-2"
              >
                Disconnect
              </button>
            </>
          )}
        {/* Profile Icon */}
        <div>
          {user&& profile? profile:"USernot login"}
        </div>
        <motion.div
          className="relative cursor-pointer"
          onClick={toggleProfile}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="bx bx-user-circle text-white text-3xl" />
          {/* Dropdown */}
            <AnimatePresence>
              {isProfileOpen && profile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 text-black"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {profile.profilePicUrl && (
                      <img src={profile.profilePicUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{profile.username}</p>
                      <p className="text-xs text-gray-600">{user.principal.toText()}</p>
                    </div>
                  </div>
                  {profile.bio && <p className="text-sm text-gray-700 mb-2">{profile.bio}</p>}
                  <hr className="my-2" />
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="hover:underline text-black w-full text-left"
                      >
                        Edit Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => alert("Go to Settings")}
                        className="hover:underline text-black w-full text-left"
                      >
                        Settings
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => alert("Go to Notifications")}
                        className="hover:underline text-black w-full text-left"
                      >
                        Notifications
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => alert("Help & Support")}
                        className="hover:underline text-black w-full text-left"
                      >
                        Help & Support
                      </button>
                    </li>
                    <li>
                      <hr className="my-2" />
                      <button
                        onClick={() => alert("Logged out")}
                        className="text-red-500 hover:underline w-full text-left"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Joined: {profile.joinedAt ? new Date(Number(profile.joinedAt)).toLocaleDateString() : ''}</p>
                </motion.div>
              )}
            </AnimatePresence>
          {/* Edit Profile Modal */}
          {isEditingProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>
                <form onSubmit={handleProfileEdit}>
                  <input
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Username"
                    value={editProfile.username}
                    onChange={e => setEditProfile({ ...editProfile, username: e.target.value })}
                    required
                  />
                  <input
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Profile Pic URL"
                    value={editProfile.profilePicUrl}
                    onChange={e => setEditProfile({ ...editProfile, profilePicUrl: e.target.value })}
                  />
                  <textarea
                    className="w-full border p-2 rounded mb-2"
                    placeholder="Bio"
                    value={editProfile.bio}
                    onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
                    <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                  </div>
                  {editError && <p className="text-red-500 text-xs mt-2">{editError}</p>}
                </form>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hamburger (Mobile) */}
        <motion.button
          onClick={toggleMobileMenu}
          className="md:hidden text-3xl text-white"
          aria-label="Menu"
        >
          <i className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}></i>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden bg-black bg-opacity-80 backdrop-blur-lg z-40"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
          >
            <nav className="flex flex-col items-center gap-6 text-white">
              {["Get a loan", "Give a loan", "Dashboard"].map((item, i) => (
                <a key={i} href="#" className="text-lg">
                  {item}
                </a>
              ))}
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-500 py-2 px-6 rounded-full text-white"
                onClick={() => {
                  toggleMobileMenu();
                  navigate("/loan-lend");
                }}
              >
                CONNECT WALLET
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
