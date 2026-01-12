import { useEffect,useMemo,useState } from "react";
import AIChatBox from "../../components/AIChatBox";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
export default function TeachersDashboard(){
const token=localStorage.getItem("accessToken");
const [subjects,setSubjects]=useState([]);
const [students,setStudents]=useState([]);
const [loadingSubjects,setLoadingSubjects]=useState(false);
const [loadingStudents,setLoadingStudents]=useState(false);
const [errorSubjects,setErrorSubjects]=useState("");
const [errorStudents,setErrorStudents]=useState("");
const [markSubjectId,setMarkSubjectId]=useState("");
const [markStudentId,setMarkStudentId]=useState("");
const [examType,setExamType]=useState("quiz");
const [score,setScore]=useState("");
const [markDate,setMarkDate]=useState(()=>new Date().toISOString().slice(0,10));
const [attSubjectId,setAttSubjectId]=useState("");
const [attStudentId,setAttStudentId]=useState("");
const [attDate,setAttDate]=useState(()=>new Date().toISOString().slice(0,10));
const [present,setPresent]=useState(true);
const [msg,setMsg]=useState("");
const [attendanceByDate,setAttendanceByDate]=useState([{name:"Present",count:0},{name:"Absent",count:0}]);
useEffect(()=>{
if(!token)return;
setLoadingSubjects(true);
setErrorSubjects("");
fetch("http://127.0.0.1:8000/api/teacher/subjects/",{headers:{Authorization:`Bearer ${token}`}})
.then(r=>r.json())
.then(data=>{
if(Array.isArray(data))setSubjects(data);
else if(data?.detail)setErrorSubjects(data.detail);
else setErrorSubjects("Unexpected response.");
})
.catch(()=>setErrorSubjects("Failed to load subjects."))
.finally(()=>setLoadingSubjects(false));
},[token]);
useEffect(()=>{
if(!markSubjectId){setStudents([]);return;}
setLoadingStudents(true);
setErrorStudents("");

const selectedSubject = subjects.find(s => s.id == markSubjectId);
if(!selectedSubject || !selectedSubject.classroom_id){
  setErrorStudents("Subject has no classroom assigned");
  setLoadingStudents(false);
  return;
}

fetch(`http://127.0.0.1:8000/api/teacher/classes/${selectedSubject.classroom_id}/students/`,{headers:{Authorization:`Bearer ${token}`}})
.then(r=>r.json())
.then(data=>{
if(Array.isArray(data))setStudents(data);
else if(data?.detail){setStudents([]);setErrorStudents(data.detail);}
else{setStudents([]);setErrorStudents("Unexpected response.");}
})
.catch((err)=>{setStudents([]);setErrorStudents("Failed to load students.");console.error(err);})
.finally(()=>setLoadingStudents(false));
},[token,markSubjectId,subjects]);
useEffect(()=>{
if(attSubjectId&&!markSubjectId)setMarkSubjectId(attSubjectId);
if(markSubjectId&&!attSubjectId)setAttSubjectId(markSubjectId);
},[markSubjectId,attSubjectId]);
const studentsOptions=useMemo(()=>students.map(s=>({id:s.id,label:`${s.username} (Roll: ${s.roll_number})`})),[students]);
const submitMark=async(e)=>{
e.preventDefault();
setMsg("");
if(!markStudentId || !markSubjectId || !examType || !score || !markDate) {
setMsg("All fields are required");
return;
}
const res=await fetch("http://127.0.0.1:8000/api/teacher/marks/",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({student_id:parseInt(markStudentId),subject_id:parseInt(markSubjectId),exam_type:examType,score:parseFloat(score),date:markDate})});
const data=await res.json();
if(!res.ok){setMsg(data?.detail||"Failed to add mark.");return;}
setMsg("Mark added successfully!");
setScore("");
setMarkStudentId("");
};
const submitAttendance=async(e)=>{
e.preventDefault();
setMsg("");
if(!attStudentId || !attSubjectId || !attDate) {
setMsg("All fields are required");
return;
}
const res=await fetch("http://127.0.0.1:8000/api/teacher/attendance/",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({student_id:parseInt(attStudentId),subject_id:parseInt(attSubjectId),date:attDate,present:present})});
const data=await res.json();
if(!res.ok){setMsg(data?.detail||"Failed to mark attendance.");return;}
setMsg("Attendance marked successfully!");
setAttStudentId("");
// Update local chart counts to reflect this marking (no admin permissions required)
setAttendanceByDate(prev=>{
  const presentIndex = prev.findIndex(p=>p.name==="Present");
  const absentIndex = prev.findIndex(p=>p.name==="Absent");
  const next = prev.map(p=>({...p}));
  if(present){
    if(presentIndex!==-1) next[presentIndex].count = (next[presentIndex].count||0) + 1;
  } else {
    if(absentIndex!==-1) next[absentIndex].count = (next[absentIndex].count||0) + 1;
  }
  return next;
});
};
return(
<>
<div className="space-y-6">
<div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
<h1 className="text-2xl font-bold">Teacher Dashboard</h1>
<p className="text-blue-100 mt-1">Manage marks and attendance for your students</p>
</div>
{msg&&<div className={`rounded-xl px-4 py-3 text-sm font-medium ${msg.includes("successfully")?"bg-green-50 border border-green-200 text-green-700":"bg-red-50 border border-red-200 text-red-700"}`}>{msg}</div>}
<div className="grid md:grid-cols-2 gap-6">
<div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition">
<h2 className="text-lg font-bold text-blue-700 mb-4">Add Marks</h2>
{loadingSubjects&&<p className="text-sm text-gray-600">Loading subjects...</p>}
{errorSubjects&&<p className="text-sm text-red-600 mb-3">{errorSubjects}</p>}
<form onSubmit={submitMark} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
<select value={markSubjectId} onChange={(e)=>{setMarkSubjectId(e.target.value);setMarkStudentId("");}} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
<option value="">Select Subject</option>
{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
{loadingStudents&&<p className="text-xs text-gray-600">Loading students...</p>}
{errorStudents&&<p className="text-xs text-red-600">{errorStudents}</p>}
<select value={markStudentId} onChange={(e)=>setMarkStudentId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!markSubjectId||studentsOptions.length===0}>
<option value="">{!markSubjectId?"Select subject first":"Select Student"}</option>
{studentsOptions.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
<select value={examType} onChange={(e)=>setExamType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required>
<option value="quiz">Quiz</option>
<option value="midterm">Mid-term</option>
<option value="final">Final</option>
<option value="assignment">Assignment</option>
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
<input type="date" value={markDate} onChange={(e)=>setMarkDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
<input type="number" step="0.01" value={score} onChange={(e)=>setScore(e.target.value)} placeholder="e.g. 85.5" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
</div>

<button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition">Submit Mark</button>
</form>
</div>

<div className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition">
<h2 className="text-lg font-bold text-green-700 mb-4">Mark Attendance</h2>
<form onSubmit={submitAttendance} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
<select value={attSubjectId} onChange={(e)=>{setAttSubjectId(e.target.value);setAttStudentId("");if(!markSubjectId)setMarkSubjectId(e.target.value);}} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required>
<option value="">Select Subject</option>
{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
<select value={attStudentId} onChange={(e)=>setAttStudentId(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required disabled={!attSubjectId||studentsOptions.length===0}>
<option value="">{!attSubjectId?"Select subject first":"Select Student"}</option>
{studentsOptions.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
</select>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
<input type="date" value={attDate} onChange={(e)=>setAttDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
<select value={present?"true":"false"} onChange={(e)=>setPresent(e.target.value==="true")} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required>
<option value="true">Present</option>
<option value="false">Absent</option>
</select>
</div>

<button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition">Submit Attendance</button>
</form>
</div>
</div>

{attendanceByDate.length > 0 && (
<div className="bg-white border rounded-2xl p-6 shadow-md">
<h2 className="text-lg font-bold text-purple-700 mb-4">Attendance Tracking</h2>
<div style={{width: '100%', height: '300px'}}>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={attendanceByDate}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Legend />
<Bar dataKey="count" fill="#a855f7" />
</BarChart>
</ResponsiveContainer>
</div>
</div>
)}
</div>
<AIChatBox/>
</>
);
}
