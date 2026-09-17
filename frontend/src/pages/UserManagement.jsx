import React from 'react';
import { UserCog, Shield, Users, Mail, Building } from 'lucide-react';

export default function UserManagement() {
  const users = [
    {
      name: 'Arjun Singh',
      email: 'arjun.singh@gov.in',
      role: 'Senior Procurement Officer',
      department: 'Ministry of Finance',
      status: 'Active'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gov.in',
      role: 'Procurement Evaluator',
      department: 'Ministry of Defence',
      status: 'Active'
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gov.in',
      role: 'Audit Officer',
      department: 'Ministry of Railways',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-4 font-sans animate-fade-up">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Procurement officers, evaluators, and administrative system roles</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
              <th className="py-2.5 px-4">Officer Name</th>
              <th className="py-2.5 px-4">Email Address</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4">Department</th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                <td className="py-3 px-4 text-blue-700 font-semibold">{u.role}</td>
                <td className="py-3 px-4 text-slate-600">{u.department}</td>
                <td className="py-3 px-4">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}