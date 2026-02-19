import {z} from "zod";


export const onboardingScehma=z.object({

  industry: z.string().optional() , //since i am manually sending "tech" as the industry
  subIndustry: z.string().min(1, "Please select a specialization"),
  bio: z.string().max(500).optional(),
  experience:z
  .string()
  .transform((val)=>parseInt(val ,10))
  .pipe(
    z
    .number()
    .min(0 , "Experience must be atleast 0 years")
    .max(50 , "Experience cannot exceed 50 years")
  ) ,
 
 skills: z.string().min(1, "Skills are required")
  }) 



//------------------------------------------------------------------------------------------------------------------------

//SCHEMAS FOR RESUME FORM

export const contactSchema=z.object({
  email:z.email("Invalid email address"),
  mobile:z.string().optional(),
  linkedin:z.string().optional() ,
  twitter:z.string().optional() ,
});


export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );



