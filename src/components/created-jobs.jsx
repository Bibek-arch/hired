// import { getMyJobs } from '@/api/apiJobs';
// import useFetch from '@/hooks/use-fetch';
// import { useUser } from '@clerk/clerk-react'
// import React, { useEffect } from 'react'
// import { BarLoader } from 'react-spinners';
// import JobCard from './job-card';

// const CreatedJobs = () => {
//     const { user } = useUser();

//     const{
//         loading: loadingCreatedJobs,
//         data: createdJobs,
//         fn: fnCreatedJobs,
//     } = useFetch(getMyJobs, {
//         recruiter_id: user.id,
//     });

//     useEffect(()=>{
//         fnCreatedJobs();
//     }, []);

    
//     if(loadingCreatedJobs){
//         return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
//       }
//   return (
//     <div>
//          <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
//           {createdJobs?.length?(
            
//             createdJobs.map((job)=>{
//               return <JobCard 
//               key={job.id} 
//               job={job}
//               onJobSaved={fnCreatedJobs}
//               isMyJob
//               />
//             })

//           ):(
//             <div> No Jobs Found 😔</div>
//           )}
//         </div>
//     </div>
//   )
// }

// export default CreatedJobs


import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';

const CreatedJobs = () => {
    const { user } = useUser();
    const [sortedJobs, setSortedJobs] = useState([]);
    const [sortField, setSortField] = useState("salary"); // Default sorting by salary

    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, {
        recruiter_id: user.id,
    });

    useEffect(() => {
        fnCreatedJobs();
    }, []);

    // Sorting jobs whenever createdJobs or sortField changes
    useEffect(() => {
        if (createdJobs?.length) {
            const sorted = [...createdJobs].sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));
            setSortedJobs(sorted);
        }
    }, [createdJobs, sortField]);

    if (loadingCreatedJobs) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
    }

    return (
        <div>
            <div className="flex bg-black justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Created Jobs</h2>
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="p-2 bg-black border rounded"
                >
                    <option value="created_at">Date Posted</option>
                    <option value="salary">Salary</option>
                </select>
            </div>

            <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {sortedJobs?.length ? (
                    sortedJobs.map((job) => (
                        <JobCard key={job.id} job={job} onJobSaved={fnCreatedJobs} isMyJob />
                    ))
                ) : (
                    <div> No Jobs Found 😔</div>
                )}
            </div>
        </div>
    );
};

export default CreatedJobs;
