"use client";

import { useEffect, useState } from 'react';
import PromptCard from '@components/PromptCard';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

const Page = () => {
    const [drivercarpoolData, setDriverCarpoolData] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const router = useRouter();
    const { data: session } = useSession();

    const fetchCarpoolData = async () => {
        setLoading(true); // Start loading
        const response = await fetch(`/api/findcarpools/drivers/${session.user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          // Sort the data by date and then by time in increasing order
          data.sort((a, b) => {
            const dateDiff = new Date(a.date) - new Date(b.date);
            if (dateDiff === 0) { // if dates are the same, compare by time
              return a.time.localeCompare(b.time);
            }
            return dateDiff;
          });
          setDriverCarpoolData(data);
        } else {
          console.error('Failed to fetch carpool data');
        }
        setLoading(false); // Stop loading
      };

    useEffect(() => {
        fetchCarpoolData();
    }, []);

    return (
      <div className="flex flex-col w-full max-w-xl mx-auto mb-2 p-4 rounded-lg text-white">
        <h1 className='text-4xl md:text-5xl font-bold text-center mt-10'>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600'>Available Rideshares</span>
        </h1>
        <p className="text-lg text-center mt-4">
          Explore a variety of ride requests from our community members who are drivers looking for passengers. Find a match for your route and connect instantly!
        </p>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <CircularProgress sx={{ color: 'white' }} /> {/* Use CircularProgress */}
          </div>
        ) : (
          <div className="prompt_layout grid grid-cols-1 mx-auto w-full" style={{marginBottom: '0px'}}> 
            {drivercarpoolData.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleEdit={() => handleEdit && handleEdit(post)}
                handleDelete={() => handleDelete && handleDelete(post)}
              />
            ))}
          </div>
        )}

        <p className="text-lg font-bold text-center mt-4">
          Can't find what you're looking for?
        </p>
        <button
          onClick={() => {
              router.push("/create-prompt");
          }}
          className=" text-blue-600 hover:text-blue-800 underline font-bold py-2 px-4 transition duration-300 ease-in-out">
          Create Rideshare Request
        </button>
      </div>
    )
}

export default Page;
