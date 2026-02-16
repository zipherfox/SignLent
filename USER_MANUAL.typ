#set text(font: "Cambria")
#set page(paper: "a4")
#set page(numbering: "— 1 —")
#show "SignLent": sl => text(font: "Calibri")[ #smallcaps(sl) ]
#show heading: set text(font: "Calibri")
#show heading.where(level: 1): set text(size: 30pt)
#show heading.where(level: 1): set heading(numbering: none)
#set heading(numbering: (first, ..nums) => numbering("I.", ..nums))
#let header(content) = text(blue)[ *#content* ]
#show raw: set text(font: "JetBrainsMono NF")

#text(font: "New Computer Modern")[
  PBL 2 for Computer Engineering

  No. 23, 26, 27, 35
]
= #text(blue)[SignLent] User Manual
#line(length: 100%)
#image("assets/deaf.jpg", height: 20%, width: 100%)

== #header[ Introduction ]
SignLent is an IoT-based smart glove designed to enable deaf individuals to communicate more effectively. The system translates sign language gestures into text and speech in real time using flex sensors and a gyroscope (MPU6050) mounted on an ESP32 microcontroller. The glove captures finger and hand movements, processes them using Machine Learning, and outputs both readable text and audible communication through a connected web app.

Intended Users:
- Individuals who are deaf or hard of hearing
- Sign language interpreters
- Healthcare professionals
- Educational institutions
- Family members and caregivers
== #header[ System Overview ]

=== System Architecture

SignLent is a comprehensive communication system consisting of three integrated components:

+ Hardware Component (Smart Glove)

  - Wearable glove equipped with five flex sensors for finger bend detection
  - MPU6050 inertial measurement unit (IMU) for hand orientation and motion tracking
  - ESP32 microcontroller for data processing and wireless communication
  - Rechargeable battery power system
  - LED status indicators and haptic feedback motor

+ Software Component (Web Application)
  - Cross-platform web interface accessible via smartphone or computer
  - Real-time gesture recognition display
  - Text-to-Speech (TTS) output engine
  - Gesture history logging and analytics

+ AI/Machine Learning Component
  - LSTM (Long Short-Term Memory) neural network for gesture recognition
  - Edge AI inference capability on ESP32 for reduced latency
  - Adaptive calibration algorithms
  - Continuous learning from user-specific gesture patterns

=== System Workflow

The SignLent system operates through the following sequence:
```
      User Makes Gesture
      ↓
      Sensors Detect Movement (Flex Sensors + MPU6050)
      ↓
      ESP32 Processes Raw Sensor Data
      ↓
      Data Transmitted via Bluetooth Low Energy (BLE)
      ↓
      Web App Receives Data
      ↓
      AI Model Recognizes Gesture
      ↓
      Output Generated (Text Display + Speech Synthesis)
```

=== Technical Specifications

*Data Transmission Protocol*:

- Protocol: Bluetooth Low Energy (BLE)
- GATT Characteristic UUID: `7094fd70-4532-4d73-a118-473a0a63701a`
- Packet Size: 50 bytes per transmission
- Data Format (Big-Endian):
  - 5 × 16-bit integers (flex sensor values: little finger → thumb)
  - 4 × 32-bit floats (quaternion rotation: x, y, z, w)
  - 3 × 32-bit floats (acceleration in g-forces: x, y, z)
  - 3 × 32-bit floats (gyroscope angular velocity in deg/s: x, y, z)

*Performance Metrics*:

- Gesture Recognition Latency: < 200ms
- Recognition Accuracy: Up to 95% (after calibration)
- Battery Life: 4-6 hours continuous use
- Wireless Range: Up to 10 meters
- Supported Gestures: Extensible vocabulary (base model: 100+ common signs)
== #header[ Installation / Setup ]

=== Hardware Requirements

*Glove Device:*
- ESP32 microcontroller (pre-installed)
- 5 × flex sensors
- 1 × MPU6050 gyroscope/accelerometer

*User Device (for Web App):*
- Smartphone or tablet with:
  - Operating System: iOS 12.0+ or Android 8.0+
  - Bluetooth 4.0 or higher (BLE compatible)
  - Modern web browser (Chrome, Safari, Firefox, Edge)
  - Internet connection (for initial setup and updates)

- *OR* Computer with:
  - Operating System: Windows 10+, macOS 10.14+, or Linux
  - Bluetooth 4.0 adapter
  - Modern web browser with BLE support
  - Internet connection

=== Software Requirements

- Web browser with JavaScript enabled
- Bluetooth permissions enabled
- Microphone/speaker access (for TTS features)


== #header[ Getting Started ]
#figure(
  image("assets/ui.png", width: 80%),
  caption: [The SignLent Web UI.],
)

=== Step 1: Web Application Access

*Method A: Smartphone Access*

+ Open your device's web browser (Chrome recommended)
+ Navigate to the Web UI
+ Grant necessary permissions when prompted

*Method B: Desktop/Laptop Access*

+ Launch a Bluetooth-compatible browser:
  - Google Chrome (version 90+)
  - Microsoft Edge (version 90+)
  - Opera (version 76+)
+ Navigate to the Web UI
+ Grant necessary permissions when prompted

*Note:* Safari and Firefox have limited Bluetooth Web API support. Chrome is strongly recommended for optimal compatibility.


=== Step 2: Device Pairing Configuration
#figure(
  image("assets/glove.png", width: 80%),
  caption: [The SignLent Glove.],
)

+ *Prepare the glove:*
  - Plug in your gloves
  - Relax your hand and allow it to fall towards gravity, in it's natrual position flush with your torso.
  - Allow up to 15 seconds for the glove to calibrate.

+ *Initiate pairing from web app:*
  - Click *"Connect Gloves"*
  - The app will scan for available BLE devices

+ *Select your device:*
  - Identify your glove in the list: *"SignGoGlove"*
  - Click on your device name

+ *Complete pairing:*
  - Browser will request permission to connect, click *"Pair"*
  - Wait for connection confirmation (typically 5-10 seconds)
  - Web app will display: *"Device Connected Successfully"*
== #header[ Features and Functions ]

*Real-Time Gesture Recognition*
- Continuous translation of sign language gestures into text and speech
- LSTM-based machine learning for accurate pattern recognition
- Recognition latency: `<`200ms
- Accuracy: 85-95% (up to 98% with adaptive learning)

*Gesture History & Logging*
- Chronological record of all recognized gestures

*Confidence Meter*
- Real-time accuracy indication (0-100%)
- Color-coded feedback (green/yellow/orange/red)
- Configurable minimum threshold

*Bluetooth Connectivity*
- BLE (Bluetooth Low Energy) wireless connection
- Range: Up to 10 meters
- Auto-reconnect capability
- Single-connection pairing for security

*Sensors*
- 5 flex sensors (one per finger)
- MPU6050 gyroscope + accelerometer (IMU)
- Real-time hand position and orientation tracking

*Power*
- 4-6 hours continuous use (standard mode)
- USB rechargeable battery
- 2-3 hour full charge time
- 48-hour standby time

*Design*
- Comfortable wearable glove
- Lightweight and ergonomic
== #header[ Troubleshooting & FAQ ]
#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + gray,
  fill: (x, y) => if y == 0 { rgb("#e9ecef") } else if calc.rem(y, 2) == 0 {
    rgb("#f8f9fa")
  },
  align: left,
  [*Problem*], [*Solutions*],

  [Device not appearing in pairing list],
  [
    - Verify Bluetooth is enabled on your phone/computer
    - Move closer to the device (within 1 meter during pairing)
    - Restart both glove and browser
    - Clear browser cache and refresh page
  ],

  [Browser doesn't support Bluetooth],
  [
    - Switch to Google Chrome or Microsoft Edge
    - Update browser to latest version
    - Enable experimental web platform features (`chrome://flags`)
    - Use a different device if compatibility issues persist
  ],

  [Calibration fails or shows low quality],
  [
    - Ensure glove fits
    - Check that flex sensors are properly aligned with fingers
    - Perform calibration in a stable position (standing, arm flush with torso)
    - Avoid excessive movement during calibration capture
  ],
)
== #header[ Support & Contact ]
If you need assistance with using SignLent, Please contact the appropriate team members for your issue.

*General Support*
- #link("mailto:66991026@kmitl.ac.th") - Pradubfah Thanataweerat
- #link("mailto:66991027@kmitl.ac.th") - Worawalan Woradee
*Software Support*
- #link("mailto:66991035@kmitl.ac.th") - Thad Choyrum
- #link("mailto:66991023@kmitl.ac.th") - Ekburut Dongsaensuk


