// import { getApplications } from '@/api/apiApplications'
// import useFetch from '@/hooks/use-fetch'
// import { useUser } from '@clerk/clerk-react'
// import React, { useEffect } from 'react'
// import ApplicationCard from './application-card'
// import { BarLoader } from 'react-spinners'

// const CreatedApplications = () => {
 
//     const { user } = useUser();
//     const {
//       loading: loadingApplications,
//       data: applications,
//       fn: fnApplications,
//     } = useFetch(getApplications,{
//         user_id: user.id,
//     });

//     useEffect(()=>{
//         fnApplications();

//     },[])

    
// if(loadingApplications){
//     return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
//   }
  

//   return (
//     <div className='flex flex-col gap-2'>
//           {applications?.map((application)=>{
//             return (
//             <ApplicationCard key={application.id} application={application} isCandidate />
//           );
//           })}
//     </div>
//   )
// }

// export default CreatedApplications


import { getApplications } from '@/api/apiApplications';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import ApplicationCard from './application-card';
import { BarLoader } from 'react-spinners';

const CreatedApplications = () => {
    const { user } = useUser();
    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, { user_id: user.id });
    
    const [rankedApplications, setRankedApplications] = useState([]);

    useEffect(() => {
        fnApplications();
    }, []);

    useEffect(() => {
        if (applications?.length) {
            const ranked = applications.sort((a, b) => b.priority - a.priority);
            setRankedApplications(ranked);
        }
    }, [applications]);

    if (loadingApplications) {
        return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />;
    }

    return (
        <div className='flex flex-col gap-2'>
            {rankedApplications?.map((application) => {
                return (
                    <ApplicationCard key={application.id} application={application} isCandidate />
                );
            })}
        </div>
    );
};

export default CreatedApplications;



// import { getApplications } from '@/api/apiApplications';
// import useFetch from '@/hooks/use-fetch';
// import { useUser } from '@clerk/clerk-react';
// import React, { useEffect, useState } from 'react';
// import ApplicationCard from './application-card';
// import { BarLoader } from 'react-spinners';
// import RecommendedJobs from './ui/recommended-jobs'; // Import the RecommendedJobs component

// const CreatedApplications = () => {
//     const { user } = useUser();
//     const {
//         loading: loadingApplications,
//         data: applications,
//         fn: fnApplications,
//     } = useFetch(getApplications, { user_id: user.id });
    
//     const [rankedApplications, setRankedApplications] = useState([]);

//     useEffect(() => {
//         fnApplications();
//     }, []);

//     useEffect(() => {
//         if (applications?.length) {
//             const ranked = applications.sort((a, b) => b.priority - a.priority);
//             setRankedApplications(ranked);
//         }
//     }, [applications]);

//     if (loadingApplications) {
//         return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />;
//     }

//     return (
//         <div className='flex flex-col gap-2'>
//             {/* Display RecommendedJobs once at the top */}
//             <RecommendedJobs userId={user.id} />

//             {/* Render ApplicationCard for each application */}
//             {rankedApplications?.map((application) => (
//                 <ApplicationCard key={application.id} application={application} isCandidate />
//             ))}
//         </div>
//     );
// };

// export default CreatedApplications;
