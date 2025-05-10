import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  payment_method: string;
  creation_time: string;
  receipt_pdf_path: string;
  description: string | null;
  transaction_id: string | null;
  subscription_id: string | null;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!isAdmin()) {
          navigate('/');
          return;
        }

        const token = await getToken();
        const response = await axios.get('http://localhost:8000/api/payments/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPayments(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [getToken, isAdmin, navigate]);

  const downloadReceipt = async (paymentId: string) => {
    try {
      const token = await getToken();
      const response = await axios.get(`http://localhost:8000/api/payments/${paymentId}/receipt/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setError('Failed to download receipt. Please try again later.');
    }
  };

  const formatPaymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">Payment History</h1>
        <p className="text-[#FEF7CD] text-lg max-w-2xl mx-auto">
          View and manage all payment records
        </p>
      </div>

      <Card className="max-w-6xl mx-auto bg-[#1A1F2C] border-[#1EAEDB]/20">
        <CardHeader>
          <CardTitle className="text-[#1EAEDB] text-2xl">All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : payments.length === 0 ? (
            <div className="text-center text-white">No payments found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#1EAEDB]">Date</TableHead>
                  <TableHead className="text-[#1EAEDB]">User</TableHead>
                  <TableHead className="text-[#1EAEDB]">Type</TableHead>
                  <TableHead className="text-[#1EAEDB]">Method</TableHead>
                  <TableHead className="text-[#1EAEDB]">Amount</TableHead>
                  <TableHead className="text-[#1EAEDB]">Status</TableHead>
                  <TableHead className="text-[#1EAEDB]">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-white">
                      {format(new Date(payment.creation_time), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-white">
                      {payment.user ? `${payment.user.first_name} ${payment.user.last_name}` : 'Anonymous'}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatPaymentType(payment.payment_type)}
                    </TableCell>
                    <TableCell className="text-white">
                      {payment.payment_method?.toUpperCase() || 'N/A'}
                    </TableCell>
                    <TableCell className="text-white">
                      {payment.amount} {payment.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'succeeded'
                          ? 'bg-green-500/20 text-green-500'
                          : payment.status === 'failed'
                          ? 'bg-red-500/20 text-red-500'
                          : payment.status === 'canceled'
                          ? 'bg-gray-500/20 text-gray-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.receipt_pdf_path && (
                        <button
                          onClick={() => downloadReceipt(payment.id)}
                          className="text-[#1EAEDB] hover:underline"
                        >
                          Download
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments; 