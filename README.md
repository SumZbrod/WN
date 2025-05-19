# WN Local Server Setup

This guide will walk you through the steps required to set up a local server for the WN application using Flask. Follow the instructions below to get started.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Python (version 3.6 or higher)
- Git

## Installation

1. **Clone the Repository**

   First, clone the repository from GitHub to your local machine. Open your terminal or command prompt and run the following command:
   
```
 git clone https://github.com/SumZbrod/WN.git
```

2. **Navigate to the Project Directory**

   Change your directory to the project folder:
   
```
cd WN
```


3. **Set Up a Virtual Environment**

   It's a good practice to use a virtual environment to manage dependencies. You can create a virtual environment using `venv`:

```
python -m venv .venv
```


4. **Activate the Virtual Environment**

   For Windows, activate the virtual environment with the following command:

```
.\.venv\Scripts\activate
```


5. **Install Required Packages**

   Install the necessary packages using the `requirements.txt` file:

```
pip install -r requirements.txt
```

6. **Copy the `StreamingAssets` Folder**

   Copy the entire StreamingAssets folder and place it inside the static directory.
ructure
```
   WN/
   ├── static/
   │   └── StreamingAssets/
   │       ├── BGM
   │       ├── CG
   │       └── ...
   ├── app.py
   ├── ...
   
```


## Running the Server

Once all dependencies are installed, you can start the Flask server. Make sure your virtual environment is activated before running this command:
```
python app.py
```


If the application is set up correctly, the Flask development server should start, and you should see output indicating that the server is running, typically on `http://127.0.0.1:5000/`.

## Troubleshooting

- Ensure that all dependencies are installed correctly. If you encounter issues, try running `pip install -r requirements.txt` again.
- Make sure your Python version is compatible with the project requirements.

## Additional Notes

- Always ensure your virtual environment is activated when working on the project to avoid conflicts with other Python projects on your machine.
- This guide assumes you are familiar with basic command-line operations.

For more details, refer to the official [Flask documentation](https://flask.palletsprojects.com/) for additional information on developing with Flask.

---

Feel free to reach out if you encounter any issues or need further assistance.
