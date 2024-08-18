document.getElementById('capture-button').addEventListener('click', () => {
    const element = document.getElementById('attendance-records-content');
    html2pdf().from(element).save('attendance-records.pdf');
  });
  