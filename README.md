# AI-Assisted Pneumonia Detection & Risk Stratification System

## Problem Statement
Early detection of pneumonia is difficult in rural and urban India due to
lack of specialists, delayed diagnosis, and limited access to hospitals.
This project provides an AI-powered, multi-stage pneumonia detection
and triage system using X-ray analysis, environmental data, symptom assessment,
and smartphone-based physiological sensing.

## Project Workflow (3 Stages)

### Stage 1: Patient Details & X-ray Upload
- Basic details (Name, Age, Gender, City, Address)
- Chest X-ray upload
- ResNet-50 based image classification

### Stage 2: Intelligent Questionnaire
- City-based AQI & pollution risk
- Smoking / alcohol habits
- Pneumonia symptoms
- Medical history
- Rural / Urban adaptive questions

### Stage 3: Smartphone-Based Severity Tests
- Flash-Tissue Oxygen Mapping (PPG)
- IMU-based Breathing & Heart Analysis
- Activity Crash Detection (Step Data)

## Risk Classification
- 🔴 High Risk (Immediate Doctor Allocation)
- 🟡 Mild Risk (Scheduled Appointment)
- 🟢 Normal (Home Care & Optional Consultation)

## Doctor & Hospital Allocation
Patients are automatically routed to nearby lung specialists
based on severity, city, and hospital load.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- AI Model: ResNet-50
- APIs: AQI, Location, Activity Sensors

  
## How to Run (Prototype)
1. Clone the repository
2. Install Python dependencies
3. Run backend using Flask
4. Open frontend/index.html in browser
