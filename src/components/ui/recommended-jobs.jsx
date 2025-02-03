// import React from "react";
// import { useJobRecommendations } from "../../hooks/use-fetch";

// const RecommendedJobs = ({ userId }) => {
//   const { recommendedJobs } = useJobRecommendations(userId);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Jobs You May Like</h2>
//       {recommendedJobs.length > 0 ? (
//         recommendedJobs.map((job) => (
//           <div key={job.id} className="p-4 border rounded shadow hover:shadow-lg">
//             <h3 className="text-lg font-semibold">{job.title}</h3>
//             <p className="text-gray-600">{job.description}</p>
//           </div>
//         ))
//       ) : (
//         <p>No recommendations found.</p>
//       )}
//     </div>
//   );
// };

// export default RecommendedJobs;
