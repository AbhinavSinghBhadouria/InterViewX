import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript:{
    ignoreBuildErrors:true ,
  } ,
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,  //this will allow webassembly modules to load asynchoronously
    };

    return config;
  },
 
  
}; 

export default nextConfig;
