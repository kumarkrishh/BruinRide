"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";


const MyProfile = () => {
  const router = useRouter(); // Initialize router for navigation
  const { data: session } = useSession(); // Get session data from next-auth

  // State to store user's posts
  const [myPosts, setMyPosts] = useState([]);

  // Fetch user's posts when session user ID is available
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/trips`);
      const data = await response.json();
      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  // Handle edit post action
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  // Handle delete post action
  const handleDelete = async (post) => {
    try {
      await fetch(`/api/locations/${post._id.toString()}`, {
        method: "DELETE",
      });

      // Filter out the deleted post from the list of posts
      const filteredPosts = myPosts.filter((item) => item._id !== post._id);
      setMyPosts(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Profile
      name='My Trips'
      desc='Welcome to your dashboard for viewing and managing all your rideshare requests.'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
