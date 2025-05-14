const form = document.getElementById("workoutForm");
const tableBody = document.querySelector("#logTable tbody");
const chartCanvas = document.getElementById("activityChart");
let workoutData = JSON.parse(localStorage.getItem("workouts")) || [];

function saveData() {
  localStorage.setItem("workouts", JSON.stringify(workoutData));
}

function renderTable() {
  tableBody.innerHTML = "";
  workoutData.forEach(workout => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${workout.date}</td>
      <td>${workout.activity}</td>
      <td>${workout.duration}</td>
    `;
    tableBody.appendChild(row);
  });
}

function renderChart() {
  const activityDurations = {};
  workoutData.forEach(({ activity, duration }) => {
    activityDurations[activity] = (activityDurations[activity] || 0) + parseInt(duration);
  });

  const chartData = {
    labels: Object.keys(activityDurations),
    datasets: [{
      label: 'Total Duration (min)',
      data: Object.values(activityDurations),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  if (window.barChart) {
    window.barChart.destroy();
  }

  window.barChart = new Chart(chartCanvas, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const activity = document.getElementById("activity").value.trim();
  const duration = document.getElementById("duration").value;

  if (!date || !activity || duration <= 0) return;

  workoutData.push({ date, activity, duration });
  saveData();
  renderTable();
  renderChart();
  form.reset();
});

window.addEventListener("load", () => {
  renderTable();
  renderChart();
});
