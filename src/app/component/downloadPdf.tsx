"use client";
import { useState } from 'react';

const DownloadPDF = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const downloadPDF = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const response = await fetch(`/api/media?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to fetch data');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${startDate}_to_${endDate}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}

export default DownloadPDF;