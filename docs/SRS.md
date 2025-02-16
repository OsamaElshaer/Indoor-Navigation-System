# System Requirements Specification (_SRS_)

## 1. Introduction

The System Requirements Specification (SRS) document outlines the requirements for the Indoor Navigator App.

### 1.1 Purpose of the Document

This document serves as a comprehensive guide to understanding the functional and non-functional requirements of the App. It provides stakeholders, including developers, testers, project managers, and end-users, with a clear understanding of the system.

### 1.2 Overview of the System

The Indoor Navigator App will consist of mobile applications for Android and iOS platforms, a backend server for data processing and storage, and a database for storing mapping information. The system will use Wi-Fi Signal strength techniques to collect and analyze RSSI within indoor environments, and trilateration algorithms to determine the user's position and provide navigation directions.Supporting various indoor environments, including shopping malls, airports, hospitals, and office buildings.

## 2. Overall Description

### 2.1 Product Perspective

The Indoor Navigator App operates independently as a standalone system, providing indoor navigation capabilities without reliance on other systems.

### 2.2 Product Functions

The key functions of the Indoor Navigator App include:

-   Determining the user's position using trilateration algorithms.
-   Providing real-time navigation directions to guide users to their destinations indoors.

### 2.3 User Classes and Characteristics

The users of the Indoor Navigator App can be categorized into the following classes:

1. **End Users**: individuals who will use the app to seeking navigation help in the environment.
2. **Administrators**: how's responsible for managing and maintaining the app's backend infrastructure.
3. **Developers**: Software developers involved in the development, testing, and maintenance of the app.

### 2.4 Operating Environment

<!--  the hardware, software, and network requirements necessary for the mobile device to function properly. -->

It depends but should consider it as follow: <b>"Just for considerations"

#### 4.2.1 Hardware Requirements:

-   **Processor**:
-   **Memory (RAM)**:
-   **Storage**:

#### 4.2.2 Software Requirements:

-   **Operating System**:

#### 4.2.3 Network Requirements:

-   **Network Protocols**: using network protocols HTTP1/websocket for communication with backend servers.

#### 4.2.4 Backend Infrastructure:

-   **Cloud Hosting**:
-   **Server Specifications**:
-   **Database Management System**:
-   **Scalability**:

## 3. Specific Requirements <a

### 3.1 Functional Requirements

#### 3.1.1 Authentication

-   The system will provide user authentication functionality to ensure secure access to the app,Users will be able to create accounts, log in, and log out of the app securely.

#### 3.1.2 Create Map

-   convert the drawing map to geojson format asa we can represent it an any technology .

#### 3.1.3 Positioning

-   The system will collect Wi-Fi signal data from the user's device to detect user position an indoor environments.
-   The system will use trilateration algorithms to determine the user's position indoors.Positioning accuracy will be within [accuracy threshold at most 2 meters].

#### 3.1.4 Navigation

-   The system will continuously update the user's position in real-time as they move within indoor environments.
-   Navigation directions will be displayed on the user's device in a user-friendly format, like visual maps.

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

-   The system will respond to user queries with minimal latency (at most 500 ms), ensuring a smooth user experience.
-   Indoor positioning calculations will be performed efficiently,(happened on the backend).
-   The system will support concurrent access by multiple users without effect on performance.

#### 3.2.2 Reliability

-   The system will be resilient to failures.
-   The system will recover gracefully from errors or exceptions.
-   The system providing error messages to users if errors or exceptions happens .

### 3.3 External Interfaces

<!-- refer to the interaction between the system and the external components -->

#### 3.3.1 User Interface (UI):

<div style="display: flex; justify-content: space-between; ">
    <img src="https://th.bing.com/th/id/OIP.yCW0cvOk0TRvJYF-dQLRBwHaEI?rs=1&pid=ImgDetMain"alt="" >

</div>

## 4. Use Cases

### 4.1 User Registration

-   **Actors**: User
-   **Goal**: User is successfully registered and logged in.
-   **Flow** :
    1. User launches the app.
    2. User selects the option to register.
    3. User provides required information (e.g., username, email, password,...).
    4. User submits the registration form.
    5. System validates the provided information.
    6. If validation is successful, the system creates a new user account.
    7. User receives a confirmation message and is logged in automatically.

### 4.2 Navigation

-   **Actors**: User
-   **Goal**: User has a planned route to the destination.

-   **Flow** :
    1. User launches the app.
    2. User enters the starting point and destination.
    3. System calculates the optimal route based on current location and destination.
    4. System provides navigation directions to the user.

## 5. System Models

### 5.1 Context Diagram

<img src="./docs/images/context digram.png" alt="" width="800" height="300">

### 5.2 Data Flow Diagram (DFD)

<img src="./docs/images/DFD.png" alt="" width="1000" height="500">

### 5.3 Data Example:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>

<table>
  <thead>
    <tr>
      <th></th> <!-- Index column -->
      <th>AP1</th>
      <th>AP2</th>
      <th>AP3</th>
      <th>AP4</th>
      <th>AP5</th>
      <th>AP6</th>
      <th>x</th>
      <th>y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>-37</td>
      <td>-36</td>
      <td>-36</td>
      <td>-32</td>
      <td>-33</td>
      <td>-61</td>
      <td>0.548814</td>
      <td>0.715189</td>
    </tr>
    <tr>
      <th>1</th>
      <td>-35</td>
      <td>-35</td>
      <td>-35</td>
      <td>-41</td>
      <td>-41</td>
      <td>-70</td>
      <td>0.544883</td>
      <td>0.423655</td>
    </tr>
    <tr>
      <th>2</th>
      <td>-30</td>
      <td>-36</td>
      <td>-32</td>
      <td>-40</td>
      <td>-35</td>
      <td>-61</td>
      <td>0.645894</td>
      <td>0.437587</td>
    </tr>
    <tr>
      <th>3</th>
      <td>-41</td>
      <td>-42</td>
      <td>-43</td>
      <td>-42</td>
      <td>-41</td>
      <td>-56</td>
      <td>0.891773</td>
      <td>0.963663</td>
    </tr>
    <tr>
      <th>4</th>
      <td>-44</td>
      <td>-44</td>
      <td>-44</td>
      <td>-35</td>
      <td>-36</td>
      <td>-53</td>
      <td>0.383442</td>
      <td>0.791725</td>
    </tr>
  </tbody>
</table>

</body>
</html>
