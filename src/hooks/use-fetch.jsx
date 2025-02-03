import { useSession } from "@clerk/clerk-react";
import { useState } from "react";


const useFetch = (cb,options = {})=>{
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

      const {session} = useSession();

      const fn = async(...args) => {
        setLoading(true);
        setError(null);


        try{
            const supabaseAccessToken = await session.getToken({
                template: "supabase",
              });

              const response = await cb(supabaseAccessToken, options, ...args);
              setData(response);
              setError(null);
        } catch(error){
            setError(error)
        } finally{
            setLoading(false)
        }
      };

      return {fn, data, loading, error};
    
};

export default useFetch;



// //new usefetch 
// import { useEffect } from "react";
// import { fetchAllJobs, fetchUserAppliedJobs } from "../api/apiJobs";
// import { TfIdf } from 'natural';
// export const useJobRecommendations = (userId) => {
//   const [jobs, setJobs] = useState([]);
//   const [recommendedJobs, setRecommendedJobs] = useState([]);

//   useEffect(() => {
//     const getJobs = async () => {
//       const allJobs = await fetchAllJobs();
//       const userJobs = await fetchUserAppliedJobs(userId);
      
//       console.log("All Jobs:", allJobs);  // Add logging to check
//       console.log("User Jobs:", userJobs); // Add logging to check
  
//       const recommendations = computeRecommendations(userJobs, allJobs);
//       setJobs(allJobs);
//       setRecommendedJobs(recommendations);
//     };
//     getJobs();
//   }, [userId]);

//   return { jobs, recommendedJobs };
// };

// const computeRecommendations = (userJobs, allJobs) => {
  
 
//   const tfidf = new TfIdf();
  
//   allJobs.forEach((job) => tfidf.addDocument(`${job.title} ${job.description}`));

//   let recommendations = [];
//   userJobs.forEach((userJob) => {
//     tfidf.tfidfs(userJob, (i, measure) => {
//       if (!userJobs.includes(allJobs[i].title)) {
//         recommendations.push({ job: allJobs[i], similarity: measure });
//       }
//     });
//   });

//   recommendations.sort((a, b) => b.similarity - a.similarity);
//   return recommendations.map((item) => item.job);
// };






// import { useState, useEffect } from "react";
// import { fetchAllJobs, fetchUserAppliedJobs } from "../api/apiJobs";

// export const useJobRecommendations = (userId) => {
//   const [jobs, setJobs] = useState([]);
//   const [recommendedJobs, setRecommendedJobs] = useState([]);

//   useEffect(() => {
//     const getJobs = async () => {
//       const allJobs = await fetchAllJobs();
//       const userJobs = await fetchUserAppliedJobs(userId);

//       console.log("All Jobs:", allJobs);
//       console.log("User Jobs:", userJobs);

//       const recommendations = computeRecommendations(userJobs, allJobs);
//       setJobs(allJobs);
//       setRecommendedJobs(recommendations);
//     };
//     getJobs();
//   }, [userId]);

//   return { jobs, recommendedJobs };
// };

// // Simple TF-IDF implementation
// const computeRecommendations = (userJobs, allJobs) => {
//   const calculateTF = (document) => {
//     const tf = {};
//     const words = document.split(" ");
//     const totalWords = words.length;

//     words.forEach((word) => {
//       tf[word] = (tf[word] || 0) + 1;
//     });

//     for (let word in tf) {
//       tf[word] /= totalWords;
//     }

//     return tf;
//   };

//   const calculateIDF = (allJobs) => {
//     const idf = {};
//     const totalDocs = allJobs.length;

//     allJobs.forEach((job) => {
//       const words = new Set(job.title.split(" ").concat(job.description.split(" ")));

//       words.forEach((word) => {
//         idf[word] = (idf[word] || 0) + 1;
//       });
//     });

//     for (let word in idf) {
//       idf[word] = Math.log(totalDocs / (1 + idf[word]));
//     }

//     return idf;
//   };

//   const calculateTFIDF = (tf, idf) => {
//     const tfidf = {};
//     for (let word in tf) {
//       tfidf[word] = tf[word] * (idf[word] || 0);
//     }
//     return tfidf;
//   };

//   // Calculate TF-IDF for all jobs
//   const idf = calculateIDF(allJobs);
//   const recommendations = [];

//   userJobs.forEach((userJob) => {
//     const tf = calculateTF(`${userJob.title} ${userJob.description}`);
//     const tfidf = calculateTFIDF(tf, idf);

//     allJobs.forEach((job) => {
//       const jobText = `${job.title} ${job.description}`;
//       const jobTF = calculateTF(jobText);
//       const jobTFIDF = calculateTFIDF(jobTF, idf);

//       const similarity = Object.keys(tfidf).reduce((sum, word) => {
//         return sum + (tfidf[word] || 0) * (jobTFIDF[word] || 0);
//       }, 0);

//       recommendations.push({ job, similarity });
//     });
//   });

//   // Sort jobs by similarity score
//   recommendations.sort((a, b) => b.similarity - a.similarity);

//   return recommendations.map((item) => item.job);
// };
