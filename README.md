# AI-Assisted Pneumonia Detection & Risk Stratification System

## Problem Statement
Early detection of pneumonia is challenging in rural and urban India due to:
- Limited access to specialists
- Delayed diagnosis
- Overloaded healthcare systems  

This project provides an **AI-powered, multi-stage pneumonia detection and triage system** using:
- Chest X-ray analysis
- Environmental data
- Symptom assessment
- Smartphone-based physiological sensing

---

## Project Workflow (3 Stages)

### Stage 1: Patient Details & X-ray Upload
- Collect basic patient information:
  - Name, Age, Gender, Mobile Number, Address, City
- Chest X-ray image upload
- **ResNet-50** based image classification to detect:
  - Normal
  - Viral Pneumonia
  - Bacterial Pneumonia

### Stage 2: Intelligent Questionnaire
- City-based AQI & pollution risk
- Smoking / alcohol habits
- Pneumonia symptoms:
  - Shortness of breath, Fever, Chills, Cough, Chest pain, Fatigue, Body ache
- Medical history & symptom duration
- Adaptive questions:
  - Rural: Exposure to smoke from chulha, hookah, etc.
  - Urban: Pollution level considerations

### Stage 3: Smartphone-Based Physiological Tests
1. **Flash-Tissue Oxygen Mapping (PPG)**
   - Finger over camera & flash
   - Measures SpO₂ (oxygen saturation)
   - Flags:
     - >95% → Mild / walking pneumonia
     - <92% → High severity bacterial pneumonia
2. **IMU-Based Breathing & Heart Analysis**
   - Phone placed on stomach for 30s
   - Detects shallow/fast vs deep/labored breathing
   - Flags high probability of pneumonia
3. **Invisible Scan: Step & Fatigue Detection**
   - Access last 48 hours of activity data
   - Detects sudden activity drop + high heart rate
   - Helps doctors assess emergency vs stable patients

---

## Risk Classification
- 🔴 **High Risk**: Immediate doctor allocation
- 🟡 **Mild Risk**: Scheduled appointment
- 🟢 **Normal**: Home care, optional consultation

---

## Doctor & Hospital Allocation
- Patients routed automatically to nearby lung specialists
- Allocation based on:
  - Severity
  - City & address
  - Hospital load

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **AI Model:** ResNet-50
- **APIs:** AQI, Location, Activity Sensors

---

## Dataset
- Chest X-ray images sourced from publicly available datasets:
  - **Kaggle: Chest X-ray Pneumonia Dataset**
    - Normal
    - Viral Pneumonia
    - Bacterial Pneumonia
- >5,000 labeled images used for training and validation
- Images **not stored on GitHub**, referenced via dataset links

---

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pneumonia-ai-detection.git
