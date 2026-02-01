// ====== Flash-Tissue Real Implementation with Graph ======
const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const resultText = document.getElementById("result");
const pulseCanvas = document.getElementById("pulseCanvas");
const ctx = pulseCanvas.getContext("2d");

let redValues = [];
let captureInterval;

startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // back camera
    });
    video.srcObject = stream;
    redValues = [];
    startCapture();
  } catch (err) {
    alert("Cannot access camera. Allow camera permissions!");
    console.error(err);
  }
};

function startCapture() {
  const canvas = document.createElement("canvas");
  const cctx = canvas.getContext("2d");

  captureInterval = setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    cctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = cctx.getImageData(
      canvas.width / 4,
      canvas.height / 4,
      canvas.width / 2,
      canvas.height / 2
    );

    let redSum = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
      redSum += frame.data[i]; // red channel
    }
    const redAvg = redSum / (frame.data.length / 4);
    redValues.push(redAvg);

    drawGraph(redValues);

  }, 50); // ~20fps

  setTimeout(stopCapture, 15000); // 15 seconds
}

// ===== Graphing function =====
function drawGraph(values) {
  const maxPoints = pulseCanvas.width;
  const slice = values.slice(-maxPoints);
  const max = Math.max(...slice);
  const min = Math.min(...slice);

  ctx.clearRect(0, 0, pulseCanvas.width, pulseCanvas.height);
  ctx.beginPath();
  slice.forEach((v, i) => {
    const y = pulseCanvas.height - ((v - min) / (max - min + 0.0001)) * pulseCanvas.height;
    if (i === 0) ctx.moveTo(i, y);
    else ctx.lineTo(i, y);
  });
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===== Filter + Peak Detection =====
function movingAverage(data, windowSize = 5) {
  return data.map((v, i, a) => {
    const start = Math.max(0, i - windowSize + 1);
    const subset = a.slice(start, i + 1);
    return subset.reduce((x, y) => x + y, 0) / subset.length;
  });
}

function detectPeaks(data) {
  const peaks = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) peaks.push(data[i]);
  }
  return peaks;
}

// ===== Estimate SpO2 =====
function stopCapture() {
  clearInterval(captureInterval);

  const filtered = movingAverage(redValues, 5);
  const peaks = detectPeaks(filtered);
  const AC = peaks.length > 0 ? Math.max(...peaks) - Math.min(...peaks) : 0;
  const DC = filtered.reduce((a, b) => a + b, 0) / filtered.length;

  // approximate SpO2 calculation
  let ratio = AC / DC;
  let spo2 = 100 - ratio * 30; // experimental calibration
  spo2 = Math.max(85, Math.min(99, Math.round(spo2)));

  resultText.innerText = `SpO₂: ${spo2}%`;

  if (spo2 > 95) resultText.innerText += "\nLikely Mild / Walking Case";
  else if (spo2 < 92) resultText.innerText += "\nHigh Severity – Seek Medical Help";
  else resultText.innerText += "\nModerate Risk";
}

// ===== Simulated X-ray + Symptoms (unchanged) =====
const predictBtn = document.getElementById("predictBtn");
const xrayInput = document.getElementById("xrayInput");
const xrayResult = document.getElementById("xrayResult");

predictBtn.onclick = () => {
  if (!xrayInput.files[0]) return alert("Select an X-ray image!");
  const fakePredictions = ["Normal", "Pneumonia"];
  const prediction = fakePredictions[Math.floor(Math.random() * 2)];
  const confidence = (Math.random() * 0.3 + 0.7).toFixed(2);
  xrayResult.innerText = `Prediction: ${prediction} (Confidence: ${Math.round(confidence*100)}%)`;
};

const riskBtn = document.getElementById("riskBtn");
riskBtn.onclick = () => {
  const fever = document.getElementById("fever").checked ? 1 : 0;
  const cough = document.getElementById("cough").checked ? 1 : 0;
  const sob = document.getElementById("sob").checked ? 1 : 0;

  let riskScore = 0;
  const spo2Val = parseInt(resultText.innerText.split(":")[1]) || 97;
  if (spo2Val < 92) riskScore += 2;
  else if (spo2Val < 95) riskScore += 1;
  riskScore += fever + cough + sob;

  let riskLabel = "Low";
  if (riskScore >= 4) riskLabel = "High";
  else if (riskScore >= 2) riskLabel = "Moderate";

  document.getElementById("riskResult").innerText = `Risk: ${riskLabel}`;
};
