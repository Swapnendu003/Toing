
# Campaign Management System

## Overview

This project includes React components designed for managing campaigns in a Next.js application. The components cover campaign creation, management, and interaction functionalities. This README provides an overview of the code, the campaign and call handling process, and steps for setting up and running the development environment.

## 🛠️ Setting Up the Development Environment

Follow these steps to set up the development environment and run the project:

1. **Clone the Repository**

   Clone the project repository from GitHub:
   ```bash
   git clone https://github.com/Swapnendu003/Toing.git
   ```

2. **Navigate to the Project Directory**

   Move into the project directory:
   ```bash
   cd toing
   ```

3. **Install Dependencies**

   Install the necessary dependencies using npm:
   ```bash
   npm install
   ```


5. **Start the Development Server**

   Run the development server:
   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser to view the application.

## 📂 Code Explanation

### AddCampaignForm Component

- **State Management**: Uses React state hooks to manage form data.
- **API Integration**: Fetches voice and language options from the API.
- **Form Validation**: Includes validation for required fields and data types.
- **Form Submission**: Handles multi-step form submission and data processing.

### CampaignTable Component

- **Data Management**: Retrieves campaign data from local storage and displays it in a table format.
- **CSV Upload**: Parses CSV files and integrates new contacts into the campaign.
- **Call Handling**: Includes functionality for making calls and viewing call logs.

## 📈 Campaign and Call Handling Process

1. **Creating a Campaign**

   - **Input Data**: Users provide campaign details including script, purpose, and tone.
   - **Upload Knowledge Base**: Users can upload a PDF or enter a URL.
   - **Define Schedule**: Set the availability hours for the campaign.
   - **Submit Form**: On submission, campaign data is sent to the server and saved in local storage.

2. **Managing Campaigns**

   - **View Campaigns**: Users can view details of each campaign.
   - **Make Calls**: Initiate calls based on campaign details.
   - **Upload Contacts**: Add new contacts via CSV upload.

## 🚀 Running the Project

After setting up the environment and starting the development server, you can:

- **Access the Application**: Open `http://localhost:3000` to interact with the `AddCampaignForm` and `CampaignTable` components.
- **Test Functionality**: Create new campaigns, manage existing ones, and upload contacts to ensure all features work as expected.




