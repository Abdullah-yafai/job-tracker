import { createJobAction, deleteApplication, getJobStats } from "@/actions/jobActions";
import DeleteBtn from "@/components/DeleteBtn";
import LoginBtn from "@/components/LoginBtn";
import LogoutBtn from "@/components/LogoutBtn";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-2xl text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-blue-600">JobTracker Pro</h1>
          <p className="text-gray-500 mb-8">Please login to manage your job applications</p>
          <LoginBtn />
        </div>
      </div>
    )
  }

  await dbConnect();

  // Database se jobs nikalna (Newest first)
  const rawJobs = await Job.find({ userId: session.user.id }).sort({ createdAt: -1 });
  const stats = await getJobStats();

  const jobs = rawJobs.map(job => {
    const jobObject = job.toObject(); 
    jobObject._id = jobObject._id.toString();
    return jobObject;
  });

  console.log(stats, 'stats')

  return (
    <main className="p-10 max-w-10xl mx-auto flex gap-10 flex-col">
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hi, {session.user.name} 👋</h1>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>
        <LogoutBtn />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard title="Total Applied" value={stats.total} color="bg-gray-100" />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-100 text-yellow-800" />
        <StatCard title="Interviews" value={stats.interview} color="bg-green-100 text-green-800" />
        <StatCard title="Rejected" value={stats.rejected} color="bg-red-100 text-red-800" />
      </div>

      <div className="flex gap-10 justify-center">
        {/* Left Side: Form */}
        <div className="w-2/5">
          <h1 className="text-2xl font-bold mb-5">Add Job</h1>
          <form action={createJobAction} className="flex flex-col gap-4">
            <input name="title" placeholder="Job Title" className="border p-2 rounded text-black" required />
            <input name="company" placeholder="Company" className="border p-2 rounded text-black" required />
            <select name="status" className="border p-2 rounded text-black">
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Add Job
            </button>
          </form>
        </div>

        {/* Right Side: Jobs List */}
        <div className="w-2/5">
          <h2 className="text-2xl font-bold mb-5">Applied Jobs ({jobs.length})</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id.toString()} className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white text-black">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'interview' ? 'bg-green-100 text-green-800' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {job.status}
                  </span>
                  <div className='px-3 py-1 rounded-full text-sm font-medium'>
                    <DeleteBtn id={job?._id} />
                  </div>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500">No jobs found. Add your first one!</p>}
          </div>
        </div>
      </div>
    </main >
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-sm border ${color}`}>
      <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}