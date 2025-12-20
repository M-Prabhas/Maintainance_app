import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StoreDetails = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { getAppliancesByStore, getStoreById, checklist } = useApp();
  const store = getStoreById(parseInt(storeId));
  const appliances = getAppliancesByStore(parseInt(storeId));

  const handleDownloadReport = () => {
    const reportData = appliances.map(app => {
      const item = checklist[app.id];
      return {
        name: app.name,
        model: app.model,
        serial: app.serialNumber,
        checked: item.isChecked ? 'Yes' : 'No',
        status: item.status,
        remarks: item.remarks || 'N/A',
        lastUpdated: item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'Not inspected'
      };
    });

    const headers = ['Appliance Name', 'Model', 'Serial Number', 'Checked', 'Status', 'Remarks', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(row =>
        `"${row.name}","${row.model}","${row.serial}","${row.checked}","${row.status}","${row.remarks}","${row.lastUpdated}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${store.name}-report-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="store-details">
      <div className="header">
        <div>
          <h1>{store?.name} - Appliances Checklist</h1>
          <p>{store?.address}</p>
        </div>
        <button className="download-btn" onClick={handleDownloadReport}>
          Download Report (CSV)
        </button>
      </div>

      <div className="appliances-list">
        {appliances.map(appliance => {
          const checklistItem = checklist[appliance.id];
          return (
            <div key={appliance.id} className="appliance-card">
              <div className="appliance-info">
                <input
                  type="checkbox"
                  checked={checklistItem.isChecked}
                  disabled
                />
                <div>
                  <h3>{appliance.name}</h3>
                  <p><strong>Model:</strong> {appliance.model} | <strong>Serial:</strong> {appliance.serialNumber}</p>
                  <p><strong>AMC Vendor:</strong> {appliance.amcVendor} | <strong>AMC Status:</strong> {appliance.amcStatus}</p>
                  <p><strong>Category:</strong> {appliance.category}</p>
                </div>
              </div>
              <div className="checklist-status">
                <span className={`status-badge ${checklistItem.status}`}>
                  {checklistItem.status.toUpperCase()}
                </span>
                {checklistItem.remarks && (
                  <div className="remarks">
                    <strong>Remarks:</strong> {checklistItem.remarks}
                  </div>
                )}
                {checklistItem.lastUpdated && (
                  <p className="timestamp">
                    Updated: {new Date(checklistItem.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-back" onClick={() => navigate('/manager')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default StoreDetails;
