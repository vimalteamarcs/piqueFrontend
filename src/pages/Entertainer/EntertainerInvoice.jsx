import React, { useEffect, useState } from 'react'
import DashLayoutEnter from '../../components/Entertainer/DashLayoutEnter'
import { ToastContainer } from 'react-toastify'
import EnterAccountSidebar from '../../components/Entertainer/EnterAccountSidebar'
import EntertainerInvoiceData from '../../components/Entertainer/EntertainerInvoiceData'
import axios from 'axios'

export default function EntertainerInvoice() {
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoiceData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}invoice`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          const rawData = response.data?.data;
      
          if (Array.isArray(rawData)) {
            setInvoiceData(rawData);
          } else {
            setInvoiceData([]); 
          }
        } catch (error) {
          console.error('Error fetching invoice data:', error);
          setInvoiceData([]);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchInvoiceData();
      }, []);

    return (
        <>
            <DashLayoutEnter
                title="Profile"
                description="View and manage your profile"
            >
                <ToastContainer />
                <div className="container d-flex">
                    <EnterAccountSidebar />
                    <EntertainerInvoiceData loading={loading} invoices={invoiceData}/>
                </div>
            </DashLayoutEnter>
        </>
    )
}
