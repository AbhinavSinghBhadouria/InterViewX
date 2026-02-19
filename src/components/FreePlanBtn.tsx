"use client"

import { handleFreeAccess } from "../actions/payment"

import React, { useState } from 'react'

const FreePlanBtn = () => {
    const [error ,setError]=useState("");
 
    const onClick=async()=>{
        const res=await handleFreeAccess();
        if(res?.restricted){
            setError(res.message);
        }

    }
  return (
    <>
      <button
        onClick={onClick}
        className="bg-gray-800 hover:bg-gray-700 rounded-xl py-3 w-full"
      >
        Get Started
      </button>

      {error && (
        <p className="mt-3 font-bold text-red-500! text-center">
          {error}
        </p>
      )}
    </>
  );
}

export default FreePlanBtn
