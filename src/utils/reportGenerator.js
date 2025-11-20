export const generateReport = (storeId, appliances, checklist) => {
  const reportData = appliances.map(app => ({
    name: app.name,
    model: app.model,
    serial: app.serialNumber,
    checked: checklist[app.id].isChecked ? 'Yes' : 'No',
    status: checklist[app.id].status,
    remarks: checklist[app.id].remarks || 'N/A',
    lastUpdated: checklist[app.id].lastUpdated || 'Not inspected'
  }));

  // Generate CSV
  const headers = ['Appliance Name', 'Model', 'Serial Number', 'Checked', 'Status', 'Remarks', 'Last Updated'];
  const csvContent = [
    headers.join(','),
    ...reportData.map(row => 
      `"${row.name}","${row.model}","${row.serial}","${row.checked}","${row.status}","${row.remarks}","${row.lastUpdated}"`
    )
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `store-${storeId}-report-${Date.now()}.csv`;
  a.click();
};
