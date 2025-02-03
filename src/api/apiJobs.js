//import supabaseClient from "@/utils/supabase";

// export async function getJobs(token,{location, company_id, searchQuery}) {
//     const supabase = await supabaseClient(token);

//     let query  = supabase
//     .from("jobs")
//     .select("*, company:companies(name,logo_url),saved: saved_jobs(id)");

//     if(location){
//         query = query.eq("location",location);
//     }

//     if(company_id){
//         query = query.eq("company_id",company_id);
//     }

//     if(searchQuery){
//         query = query.ilike("title",`%${searchQuery}%`);
//     }

//     const {data, error} = await query;

//     if(error){
//         console.error("Error fetching Jobs:", error);
//         return null;
//     }

//     return data;
// }


 import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery, sortField = "created_at" }) {
    const supabase = await supabaseClient(token);

    let query = supabase
        .from("jobs")
        .select("*, company:companies(name,logo_url),saved: saved_jobs(id)");

    if (location) {
        query = query.eq("location", location);
    }

    if (company_id) {
        query = query.eq("company_id", company_id);
    }

    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching Jobs:", error);
        return null;
    }

    // Apply Heap Sort to prioritize/sort jobs by the given field
    if (data && data.length > 0) {
        data.sort(heapSort((a, b) => a[sortField] > b[sortField]));
    }

    return data;
}

// Heap Sort Algorithm
function heapSort(compare) {
    return function (data) {
        const heapify = (arr, n, i) => {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && compare(arr[left], arr[largest])) largest = left;
            if (right < n && compare(arr[right], arr[largest])) largest = right;

            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                heapify(arr, n, largest);
            }
        };

        // Build the max heap
        for (let i = Math.floor(data.length / 2) - 1; i >= 0; i--) {
            heapify(data, data.length, i);
        }

        // Extract elements one by one from the heap
        for (let i = data.length - 1; i >= 0; i--) {
            [data[0], data[i]] = [data[i], data[0]];
            heapify(data, i, 0);
        }
    };
}




export async function saveJob(token,{alreadySaved},saveData) {
    const supabase = await supabaseClient(token);

if(alreadySaved){
    
    const {data, error:deleteError} = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id",saveData.job_id);

    
    if(deleteError){
        console.error("Error deleting saved Job:", error);
        return null;
    }

    return data;
} else{
    const {data, error:insertError} = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select()

    
    if(insertError){
        console.error("Error fetching Jobs:", insertError);
        return null;
    }

    return data;
   }
}

export async function getSingleJob(token,{job_id}) {
    const supabase = await supabaseClient(token);


    
        const {data, error} = await supabase
        .from("jobs")
        .select("*,company:companies(name,logo_url), applications: applications(*)")
        .eq("id",job_id)
        .single();
    
        
        if(error){
            console.error("Error Fetching Job:", error);
            return null;
        }
       return data
    }


    export async function updateHiringStatus(token,{job_id}, isOpen) {
        const supabase = await supabaseClient(token);
    
    
        
            const {data, error} = await supabase
            .from("jobs")
            .update({isOpen})
            .eq("id",job_id)
            .select();
        
            
            if(error){
                console.error("Error Updating Job:", error);
                return null;
            }
           return data
        }
    
        export async function addNewJob(token, _, jobData) {
            const supabase = await supabaseClient(token);
        
        
            
                const {data, error} = await supabase
                .from("jobs")
                .insert([jobData])
                .select();
            
                
                if(error){
                    console.error("Error Creating Job:", error);
                    return null;
                }
               return data
            }

            export async function getSavedJobs(token) {
                const supabase = await supabaseClient(token);
            
            
                
                    const {data, error} = await supabase
                    .from("saved_jobs")
                    .select("*, job:jobs(*, company: companies(name,logo_url))");
                
                    
                    if(error){
                        console.error("Error Fetching Saved Jobs:", error);
                        return null;
                    }
                   return data
                }

                
            export async function getMyJobs(token,{ recruiter_id }) {
                const supabase = await supabaseClient(token);
            
            
                
                    const {data, error} = await supabase
                    .from("jobs")
                    .select("*, company: companies(name,logo_url)")
                    .eq("recruiter_id", recruiter_id);
                
                    
                    if(error){
                        console.error("Error Fetching Jobs:", error);
                        return null;
                    }
                   return data
                }


         
                export async function deleteJob(token,{ job_id }) {
                    const supabase = await supabaseClient(token);
                
                
                    
                        const {data, error} = await supabase
                        .from("jobs")
                        .delete()
                        .eq("id", job_id)
                        .select();
                    
                        
                        if(error){
                            console.error("Error Deleting Job:", error);
                            return null;
                        }
                       return data
                    }




                    //new okay tdif
                    import { createClient } from "@supabase/supabase-js";
                    const SUP_URL = import.meta.env.VITE_SUPABASE_URL;
                    const SUP_ANNKEY = import.meta.env.VITE_SUPABASE_ANON_KEY;



                    const supabase = createClient(SUP_URL, SUP_ANNKEY);
                    
                    export const fetchAllJobs = async () => {
                      const { data, error } = await supabase.from("jobs").select("id, title, description");
                      if (error) throw error;
                      return data;
                    };
                    
                    export const fetchUserAppliedJobs = async (userId) => {
                      const { data, error } = await supabase
                        .from("user_interactions")
                        .select("job_title")
                        .eq("user_id", userId);
                      if (error) throw error;
                      return data.map((item) => item.job_title);
                    };
                    




// import { createClient } from "@supabase/supabase-js";

// // Supabase configuration (hardcoded for self-containment)
// // Replace with your Supabase anon key
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// // Initialize Supabase client
// const supabaseClient = (token) =>
//   createClient(supabaseUrl, supabaseAnonKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   });

// // API Route Handler
// export default async function handler(req, res) {
//   const token = req.headers.authorization;

//   try {
//     if (req.method === "GET") {
//       const { location, company_id, searchQuery, sortField, job_id, recruiter_id } = req.query;

//       if (job_id) {
//         // Fetch a single job
//         const job = await getSingleJob(token, { job_id });
//         return res.status(200).json(job);
//       }

//       if (recruiter_id) {
//         // Fetch jobs posted by a recruiter
//         const jobs = await getMyJobs(token, { recruiter_id });
//         return res.status(200).json(jobs);
//       }

//       // Fetch all jobs with filters
//       const jobs = await getJobs(token, { location, company_id, searchQuery, sortField });
//       return res.status(200).json(jobs);
//     }

//     if (req.method === "POST") {
//       const { alreadySaved, saveData, jobData } = req.body;

//       if (alreadySaved !== undefined) {
//         // Save or unsave a job
//         const result = await saveJob(token, { alreadySaved }, saveData);
//         return res.status(200).json(result);
//       }

//       if (jobData) {
//         // Add a new job
//         const newJob = await addNewJob(token, null, jobData);
//         return res.status(201).json(newJob);
//       }
//     }

//     if (req.method === "PUT") {
//       const { job_id, isOpen } = req.body;

//       // Update hiring status
//       const updatedJob = await updateHiringStatus(token, { job_id }, isOpen);
//       return res.status(200).json(updatedJob);
//     }

//     if (req.method === "DELETE") {
//       const { job_id } = req.body;

//       // Delete a job
//       const deletedJob = await deleteJob(token, { job_id });
//       return res.status(200).json(deletedJob);
//     }

//     // Handle unsupported methods
//     return res.status(405).json({ message: "Method not allowed" });
//   } catch (error) {
//     console.error("Error in API route:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// // Function to get jobs with filters
// export async function getJobs(token, { location, company_id, searchQuery, sortField = "created_at" }) {
//   const supabase = await supabaseClient(token);

//   let query = supabase
//     .from("jobs")
//     .select("*, company:companies(name,logo_url), saved: saved_jobs(id)");

//   if (location) query = query.eq("location", location);
//   if (company_id) query = query.eq("company_id", company_id);
//   if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     throw error;
//   }

//   // Apply Heap Sort to prioritize/sort jobs by the given field
//   if (data && data.length > 0) {
//     data.sort(heapSort((a, b) => a[sortField] > b[sortField]));
//   }

//   return data;
// }

// // Heap Sort Algorithm
// function heapSort(compare) {
//   return function (data) {
//     const heapify = (arr, n, i) => {
//       let largest = i;
//       const left = 2 * i + 1;
//       const right = 2 * i + 2;

//       if (left < n && compare(arr[left], arr[largest])) largest = left;
//       if (right < n && compare(arr[right], arr[largest])) largest = right;

//       if (largest !== i) {
//         [arr[i], arr[largest]] = [arr[largest], arr[i]];
//         heapify(arr, n, largest);
//       }
//     };

//     // Build the max heap
//     for (let i = Math.floor(data.length / 2) - 1; i >= 0; i--) {
//       heapify(data, data.length, i);
//     }

//     // Extract elements one by one from the heap
//     for (let i = data.length - 1; i >= 0; i--) {
//       [data[0], data[i]] = [data[i], data[0]];
//       heapify(data, i, 0);
//     }
//   };
// }

// // Function to save or unsave a job
// export async function saveJob(token, { alreadySaved }, saveData) {
//   const supabase = await supabaseClient(token);

//   if (alreadySaved) {
//     const { data, error: deleteError } = await supabase
//       .from("saved_jobs")
//       .delete()
//       .eq("job_id", saveData.job_id);

//     if (deleteError) {
//       console.error("Error deleting saved Job:", deleteError);
//       throw deleteError;
//     }

//     return data;
//   } else {
//     const { data, error: insertError } = await supabase
//       .from("saved_jobs")
//       .insert([saveData])
//       .select();

//     if (insertError) {
//       console.error("Error saving Job:", insertError);
//       throw insertError;
//     }

//     return data;
//   }
// }

// // Function to get a single job
// export async function getSingleJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .select("*, company:companies(name,logo_url), applications: applications(*)")
//     .eq("id", job_id)
//     .single();

//   if (error) {
//     console.error("Error Fetching Job:", error);
//     throw error;
//   }

//   return data;
// }

// // Function to update hiring status
// export async function updateHiringStatus(token, { job_id }, isOpen) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .update({ isOpen })
//     .eq("id", job_id)
//     .select();

//   if (error) {
//     console.error("Error Updating Job:", error);
//     throw error;
//   }

//   return data;
// }

// // Function to add a new job
// export async function addNewJob(token, _, jobData) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .insert([jobData])
//     .select();

//   if (error) {
//     console.error("Error Creating Job:", error);
//     throw error;
//   }

//   return data;
// }

// // Function to get saved jobs
// export async function getSavedJobs(token) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("saved_jobs")
//     .select("*, job:jobs(*, company: companies(name,logo_url))");

//   if (error) {
//     console.error("Error Fetching Saved Jobs:", error);
//     throw error;
//   }

//   return data;
// }

// // Function to get jobs posted by a recruiter
// export async function getMyJobs(token, { recruiter_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .select("*, company: companies(name,logo_url)")
//     .eq("recruiter_id", recruiter_id);

//   if (error) {
//     console.error("Error Fetching Jobs:", error);
//     throw error;
//   }

//   return data;
// }

// // Function to delete a job
// export async function deleteJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .delete()
//     .eq("id", job_id)
//     .select();

//   if (error) {
//     console.error("Error Deleting Job:", error);
//     throw error;
//   }

//   return data;
// }