import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _,jobData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random()*90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

   const {error:storageError} = await supabase.storage.from("resumes").upload(fileName, jobData.resume);

   if(storageError){
    console.error("Error Uploading Resume:", storageError);
    return null;
}

const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;
    
        const {data, error} = await supabase.from("applications").insert([
            {
                ...jobData,
                resume
            },
        ])
        .select();
    
        
        if(error){
            console.error("Error Submitting Applications:", error);
            return null;
        }
       return data
    }

    export async function updateApplicationStatus(token,{ job_id }, status) {
        const supabase = await supabaseClient(token);
    
    
        
            const {data, error} = await supabase
            .from("applications")
            .update({status})
            .eq("job_id",job_id)
            .select();
        
            
            if(error || data.length === 0){
                console.error("Error Updating Application Status:", error);
                return null;
            }
           return data
        }



// export async function getApplications(token, { user_id }) {
//             const supabase = await supabaseClient(token);
        
        
            
//                 const {data, error} = await supabase
//                 .from("applications")
//                 .select("*,job:jobs(title, company: companies(name))")
//                 .eq("candidate_id",user_id)
                
            
                
//                 if(error){
//                     console.error("Error Fetching Applications:", error);
//                     return null;
//                 }
//                return data
//             }
        
export async function getApplications(token, { user_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("applications")
        .select("*, job:jobs(title, company: companies(name))")
        .eq("candidate_id", user_id);

    if (error) {
        console.error("Error Fetching Applications:", error);
        return null;
    }

    // Apply A* Search to rank applications
    return aStarSearch(data);
}

// A* Search Algorithm for ranking applications
function aStarSearch(applications) {
    applications.forEach((app) => {
        app.priority = calculatePriority(app);
    });

    // Sort applications by priority (higher is better)
    return applications.sort((a, b) => b.priority - a.priority);
}

// Heuristic function for A* (Ranking Applications)
function calculatePriority(app) {
    let g = 0; // Past Cost (Relevance Score)
    let h = 0; // Heuristic (Status Weight)

    // 1. Compute relevance score (g) → Based on job title match
    if (app.job.title.toLowerCase().includes("developer")) {
        g += 10;
    }else if (app.job.title.toLowerCase().includes("designer")) {
        g += 8;
    } else if (app.job.title.toLowerCase().includes("manager")) {
        g += 7;
    } else {
        g += 5; // Default relevance
    }

    // 2. Compute status weight (h)
    const statusWeights = {
        accepted: 20,
        pending: 10,
        rejected: 0,
    };
    h = statusWeights[app.status.toLowerCase()] || 5;

    // 3. Final priority score
    return g + h;
}

