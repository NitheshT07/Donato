import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DonationCard from '../components/DonationCard';
import { donorAPI } from '../services/api';
import { Package, Loader2 } from 'lucide-react';

export default function MyDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const role = window.location.pathname.split('/')[1];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const resp = await donorAPI.getDonationHistory();
      setDonations(resp.donations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this donation? This action cannot be undone.")) return;
    try {
      await donorAPI.deleteDonation(itemId);
      fetchHistory(); // Refresh list
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete donation. It may have already been accepted.");
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight uppercase">Donation History</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Retrieving Neural Archive...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="pro-card p-32 text-center bg-white border-dashed border-2">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <p className="text-slate-500 font-bold text-lg">No donation history detected in your sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donations.map((d, i) => (
              <DonationCard
                key={d._id || i}
                donation={d}
                userRole={role}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
