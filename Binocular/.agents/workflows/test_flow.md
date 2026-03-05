---
description: Test workflow for all eye tests (RAN, VRG, PUR)
---

# Eye Test Execution Workflow

Follow these steps to perform a complete eye test cycle (RAN, VRG, or PUR) and verify the results.

### 1. Initialize Test Selection
- **Page**: `TakeTestPage`
- **Action**: Select one of the three test types:
  - **RAN**: Rapid Automated Naming (Fixation + Saccades)
  - **VRG**: Vergence
  - **PUR**: Smooth Pursuit
- **Trigger**: Click the **"Start Test"** button on the selected test card.

### 2. Camera Access & Initialization
- **Page**: Camera Permission Screen
- **Expectation**: The page will request camera access. The AI models (face-api.js) will begin loading.
- **Verification**: Ensure the "Detection Status" updates from "Requesting camera access..." to "AI models loaded."

### 3. Eyes Detection
- **Page**: Eyes Detected Screen
- **Action**: Position your face within the camera view.
- **Expectation**: The AI should identify your face and landmarks.
- **Verification**: Look for the green checkmark and the message **"✓ Eyes Detected!"**. Wait for the automatic transition (approx. 2 seconds).

### 4. Fixation Calibration
- **Page**: Red Dot Screen
- **Action**: Keep your eyes focused on the center of the screen.
- **Expectation**: A red dot will appear for 3 seconds to stabilize your gaze.

### 5. Test Sequence Tracking
- **Page**: Blue Dot Sequence Screen
- **Action**: Follow the blue dot with your eyes as it moves.
  - **RAN**: Random jumps.
  - **VRG**: Changes in size/opacity (simulating depth).
  - **PUR**: Smooth movement in patterns (horizontal, circular, etc.).
- **Duration**: 2 minutes (120 seconds).
- **Verification**: Ensure the progress bar moves and the countdown timer decreases.

### 6. Data Finalization
- **Page**: Saving Eye Data Screen
- **Expectation**: The system will batch upload the captured eye movement samples to the backend.
- **Verification**: The screen should display **"Saving Data"** with a pulse animation.

### 7. AI Analysis Processing
- **Page**: AI Analysis Screen
- **Expectation**: The backend processes the uploaded data using AI algorithms to calculate scores and findings.
- **Verification**: The screen should display a loading spinner and **"AI Analysis"** title.

### 8. Review Results
- **Page**: Results Screen
- **Action**: Inspect the generated report.
- **Verification**:
  - Score percentage.
  - Severity level (Normal, Mild Issue, Needs Attention).
  - Metrics: Stability, Tracking, Reaction, and Accuracy.
  - AI Analysis Notes.

### 9. Return to Dashboard
- **Page**: Results Screen (Bottom)
- **Action**: Click the **"Back to Home"** button (Home icon).
- **Expectation**: You should be redirected back to the **User Dashboard**.
