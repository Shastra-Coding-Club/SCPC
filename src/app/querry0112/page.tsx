export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import Query from "@/lib/models/Query";

export default async function QueryDashboard() {
  await connectDB();
  const queries = await Query.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-3xl font-bold mb-6">Feedback Responses</h1>

      <p className="mb-4">Total entries: {queries.length}</p>

      <div className="overflow-x-auto">
        <table className="border border-black w-full">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q: any) => (
              <tr key={q._id}>
                <td className="border p-2">{q.Name}</td>
                <td className="border p-2">{q.Email}</td>
                <td className="border p-2">{q.Subject}</td>
                <td className="border p-2">{q.Message}</td>
                <td className="border p-2">
                  {new Date(q.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// export default function TestPage() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "white",
//         color: "black",
//         padding: "40px",
//         fontSize: "24px",
//       }}
//     >
//       <h1>TEST PAGE WORKING</h1>
//       <p>If you see this, routing is fine.</p>
//     </div>
//   );
// }
