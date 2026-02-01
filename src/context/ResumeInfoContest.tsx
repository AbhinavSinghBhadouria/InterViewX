import { createContext, Dispatch, SetStateAction  } from "react"

export interface ResumeInfoContextType {
  resumeId: string;
  resumeInfo: any;
  setResumeInfo: Dispatch<SetStateAction<any>>;
  

}

export const ResumeInfoContext =
  createContext<ResumeInfoContextType | null>(null);