import { cacheKeys } from "./keys";
import { TTL } from "./ttl";
import { deleteKeys, getJSON, setJSON } from "./cache";
import type { CachedChatMessage, CachedChatSession, ChatRole } from "./types";

type AppendMessageInput = {
chatId: string;
userId: string;
role: ChatRole;
content: string;
id?: string;
createdAt?: string;
};


//this function returns the current time
function nowIso() {
return new Date().toISOString();
}

function createMessage(input: AppendMessageInput): CachedChatMessage {
return {
id: input.id ?? crypto.randomUUID(),
chatId: input.chatId,
role: input.role,
content: input.content,
createdAt: input.createdAt ?? nowIso(),
};
}

//this function ensures that a chat session exists in redis
export async function ensureActiveChatSession(chatId: string, userId: string) {
const sessionKey = cacheKeys.chatSession(chatId);
const existing = await getJSON<CachedChatSession>(sessionKey);

//is session exists then update the timestamps or create a new session
const nextSession: CachedChatSession = existing
? {
...existing,
status: "active",
updatedAt: nowIso(),
}
: {
chatId,
userId,
status: "active",
startedAt: nowIso(),
updatedAt: nowIso(),
};

//save the session to redis
await setJSON(sessionKey, nextSession, TTL.CHAT_ACTIVE_SECONDS);
return nextSession;
}


//it is for storing the chat messages
export async function appendChatMessage(input: AppendMessageInput) {
await ensureActiveChatSession(input.chatId, input.userId);  //checking if we have an active session


//get existing message
const messagesKey = cacheKeys.chatMessages(input.chatId);
const existing = (await getJSON<CachedChatMessage[]>(messagesKey)) ?? [];

const message = createMessage(input);  //create message
const next = [...existing, message];   //add message

await setJSON(messagesKey, next, TTL.CHAT_ACTIVE_SECONDS);  //store back to redis


//updating the session timestamps..this keeps the session alive while the user is chatting
const sessionKey = cacheKeys.chatSession(input.chatId);
const session = await getJSON<CachedChatSession>(sessionKey);
if (session) {
await setJSON(
sessionKey,
{ ...session, updatedAt: nowIso(), status: "active" },
TTL.CHAT_ACTIVE_SECONDS
);
}
return message;
}


//reads all the current live messages for that chat id
export async function getActiveChatMessages(chatId: string) {
const key = cacheKeys.chatMessages(chatId);
const messages = await getJSON<CachedChatMessage[]>(key);
return messages ?? [];
}


//it will return session meta data
export async function getChatSession(chatId: string) {
const key = cacheKeys.chatSession(chatId);
return getJSON<CachedChatSession>(key);
}

//this function closes the chat session
export async function markChatSessionFinalized(chatId: string) {
const sessionKey = cacheKeys.chatSession(chatId);
const existing = await getJSON<CachedChatSession>(sessionKey);

if (!existing) {
return null;
}


const finalized: CachedChatSession = {
...existing,
status: "finalized",
updatedAt: nowIso(),
};

await setJSON(sessionKey, finalized, TTL.CHAT_FINALIZED_SECONDS);
return finalized;
}

//cleaning up the session
export async function clearChatSessionCache(chatId: string) {
const sessionKey = cacheKeys.chatSession(chatId);
const messagesKey = cacheKeys.chatMessages(chatId);
await deleteKeys([sessionKey, messagesKey]);
}