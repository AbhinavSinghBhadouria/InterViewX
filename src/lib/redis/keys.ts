const APP_PREFIX = "interviewx";  //prevents collision with keys from other apps
const KEY_VERSION = "v1";


//function for generating the keys

function makeKey(...parts: Array<string | number>) {
  return [APP_PREFIX, KEY_VERSION, ...parts].join(":");
}



export const cacheKeys = {
  chatSession: (chatId: string) => makeKey("chat", "session", chatId), //cacheKeys.chatSession("abc")
  chatMessages: (chatId: string) => makeKey("chat", "messages", chatId),  

  assessmentsByUser: (userId: string) => makeKey("assessments", userId),

 
  roadmapsByUser: (userId: string) => makeKey("roadmaps", "user", userId),

  industryInsights: (industry: string) =>
    makeKey("industry-insights", industry.toLowerCase()),
};

export const cachePrefixes = {
  app: makeKey(),
  chat: makeKey("chat"),
  assessments: makeKey("assessments"),
  roadmaps: makeKey("roadmaps"),
  insights: makeKey("industry-insights"),
};