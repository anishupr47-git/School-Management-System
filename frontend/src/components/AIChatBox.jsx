import {useState} from "react";
export default function AIChatBox(){
const token=localStorage.getItem("accessToken");
const [message,setMessage]=useState("");
const [chat,setChat]=useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState("");
const send=async(e)=>{
e.preventDefault();
setError("");
if(!message.trim())return;
if(!token){setError("Not logged in.");return;}
const userText=message.trim();
setChat(prev=>[...prev,{by:"you",text:userText}]);
setMessage("");
setLoading(true);
try{
const res=await fetch("http://127.0.0.1:8000/api/ai/chat/",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({message:userText})});
const data=await res.json().catch(()=>null);
if(!res.ok){setChat(prev=>[...prev,{by:"ai",text:(data&&data.detail)?data.detail:"AI is currently unavailable. Add HF_TOKEN environment variable to enable AI features."}]);setLoading(false);return;}
setChat(prev=>[...prev,{by:"ai",text:data?.reply||"No reply"}]);
}catch{
setChat(prev=>[...prev,{by:"ai",text:"Failed to fetch AI. Make sure the backend is running."}]);
}
setLoading(false);
};
return(
<div className="bg-white border rounded-2xl p-5">
<div className="flex items-center justify-between">
<h2 className="text-lg font-semibold">AI Help</h2>
<span className="text-xs text-gray-500">HuggingFace</span>
</div>
<div className="mt-3 h-52 overflow-y-auto border rounded-xl p-3 bg-gray-50 space-y-2 text-sm">
{chat.length===0&&<div className="text-gray-500">Ask anything about marks, attendance, or how to use the dashboard.</div>}
{chat.map((m,i)=>(
<div key={i} className={m.by==="you"?"text-right":""}>
<div className={"inline-block px-3 py-2 rounded-xl "+(m.by==="you"?"bg-blue-600 text-white":"bg-white border")}>{m.text}</div>
</div>
))}
{loading&&<div className="text-gray-500">Thinking...</div>}
</div>
{error&&<div className="text-sm text-red-600 mt-2">{error}</div>}
<form onSubmit={send} className="mt-3 flex gap-2">
<input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type a question..." className="flex-1 border rounded-xl px-3 py-2 text-sm"/>
<button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm">Send</button>
</form>
</div>
);
}
