// --- Elements ---
const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const resultText = document.getElementById("result");

const predictBtn = document.getElementById("predictBtn");
const xrayInput = document.getElementById("xrayInput");
const xrayResult = document.getElementById("xrayResult");

const riskBtn = document.getElementById("riskBtn");

// --- Variables ---
let redValues = [];
let captureInterval;

// --- Flash-Tissue Start ---
startBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    startCapture();
  } catch (err) {
    alert("Cannot access camera. Make sure to allow camera permissions.");
    console.error(err);
  }
};

// --- Capture frames ---
function startCapture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  redValues = [];

  captureInterval = setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(
      canvas.width/4,
      canvas.height/4,
      canvas.width/2,
      canvas.height/2
    );

    let redSum = 0;
    for (let i=0; i<frame.data.length; i+=4) redSum += frame.data[i];
    const redAvg = redSum / (frame.data.length / 4);
    redValues.push(redAvg);

  }, 50); // 20 fps

  setTimeout(stopCapture, 15000); // 15 seconds measurement
}

// --- Stop capture & calculate SpO2 ---
function stopCapture() {
  clearInterval(captureInterval);
  const spo2 = estimateSpO2(redValues);

  resultText.innerText = `SpO₂: ${spo2}%`;

  if(spo2 > 95) resultText.innerText += "\nLikely Mild / Walking Case";
  else if(spo2 < 92) resultText.innerText += "\nHigh Severity – Seek Medical Help";
  else resultText.innerText += "\nModerate Risk";
}

// --- Moving average filter ---
function movingAverage(data, windowSize=5){
  return data.map((v,i,a)=>{
    const start = Math.max(0,i-windowSize+1);
    const subset = a.slice(start,i+1);
    return subset.reduce((x,y)=>x+y)/subset.length;
  });
}

// --- Estimate SpO2 using red AC/DC ratio ---
function estimateSpO2(redValues){
  const filtered = movingAverage(redValues,5);

  // detect approximate AC (peak-to-peak)
  const maxV = Math.max(...filtered);
  const minV = Math.min(...filtered);
  const AC = maxV - minV;

  const DC = filtered.reduce((a,b)=>a+b)/filtered.length;

  const ratio = AC / DC;
  let spo2 = 100 - ratio*30; // rough calibration factor
  spo2 = Math.max(85, Math.min(99, spo2));
  return Math.round(spo2);
}

// --- X-ray Upload (Simulated) ---
predictBtn.onclick = () => {
  if(!xrayInput.files[0]) return alert("Select an X-ray image!");
  const fakePredictions = ["Normal","Pneumonia"];
  const prediction = fakePredictions[Math.floor(Math.random()*2)];
  const confidence = (Math.random()*0.3 + 0.7).toFixed(2);
  xrayResult.innerText = `Prediction: ${prediction} (Confidence: ${Math.round(confidence*100)}%)`;
}

// --- Symptoms + Risk Score ---
riskBtn.onclick = () => {
  const fever = document.getElementById("fever").checked ? 1 : 0;
  const cough = document.getElementById("cough").checked ? 1 : 0;
  const sob = document.getElementById("sob").checked ? 1 : 0;

  let riskScore = 0;
  const spo2Val = parseInt(resultText.innerText.split(":")[1]) || 97;
  if(spo2Val < 92) riskScore += 2;
  else if(spo2Val < 95) riskScore += 1;
  riskScore += fever + cough + sob;

  let riskLabel = "Low";
  if(riskScore >=4) riskLabel = "High";
  else if(riskScore >=2) riskLabel = "Moderate";

  document.getElementById("riskResult").innerText = `Risk: ${riskLabel}`;
};
