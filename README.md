# WN Local Server Setup

This guide will walk you through the steps required to set up a local server for the WN application using Flask. Follow the instructions below to get started.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
<ul data-start="200" data-end="360">
<li data-start="200" data-end="278">
<p data-start="202" data-end="278"><span class="relative -mx-px my-[-0.2rem] rounded px-px py-[0.2rem] transition-colors duration-100 ease-in-out"><span class="_fadeIn_m1hgl_8">Python </span><span class="_fadeIn_m1hgl_8">3.8 </span><span class="_fadeIn_m1hgl_8">or </span><span class="_fadeIn_m1hgl_8">higher </span><span class="_fadeIn_m1hgl_8">installed </span><span class="_fadeIn_m1hgl_8">on </span><span class="_fadeIn_m1hgl_8">your </span><span class="_fadeIn_m1hgl_8">system. </span><span class="_fadeIn_m1hgl_8">You </span><span class="_fadeIn_m1hgl_8">can </span><span class="_fadeIn_m1hgl_8">download </span><span class="_fadeIn_m1hgl_8">it </span><span class="_fadeIn_m1hgl_8">from </span><span class="_fadeIn_m1hgl_8">the </span><a href="https://www.python.org/downloads/" data-start="76" data-end="136" rel="noopener noreferrer" target="_new"><span class="_fadeIn_m1hgl_8">official </span><span class="_fadeIn_m1hgl_8">Python </span><span class="_fadeIn_m1hgl_8">website</span></a><span class="_fadeIn_m1hgl_8">.</span></span></p>
</li>
<li data-start="280" data-end="360">
<p data-start="282" data-end="360"><span class="relative -mx-px my-[-0.2rem] rounded px-px py-[0.2rem] transition-colors duration-100 ease-in-out"><span class="_fadeIn_m1hgl_8">Git </span><span class="_fadeIn_m1hgl_8">installed </span><span class="_fadeIn_m1hgl_8">on </span><span class="_fadeIn_m1hgl_8">your </span><span class="_fadeIn_m1hgl_8">system. </span><span class="_fadeIn_m1hgl_8">You </span><span class="_fadeIn_m1hgl_8">can </span><span class="_fadeIn_m1hgl_8">download </span><span class="_fadeIn_m1hgl_8">it </span><span class="_fadeIn_m1hgl_8">from </span><span class="_fadeIn_m1hgl_8">the </span><a href="https://git-scm.com/downloads" data-start="59" data-end="112" rel="noopener noreferrer" target="_new"><span class="_fadeIn_m1hgl_8">official </span><span class="_fadeIn_m1hgl_8">Git </span><span class="_fadeIn_m1hgl_8">website</span></a><span class="_fadeIn_m1hgl_8">.</span></span></p>
</li>
</ul>


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
