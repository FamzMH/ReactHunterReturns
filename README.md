# React Hunter Returns
A project to bring back the OG React Hunter https://github.com/Lenshang/ReactHunter.

# Building ReactHunter

## 1. Grab the latest Smart Hunter source code
Download the latest Smart Hunter from https://github.com/dragonyue0417/SmartHunter/releases (make sure you click (Source code (zip)) and put it into libs/SmartHunter directory, such that the SmartHunter.sln file is found in ../libs/SmartHunter/SmartHunter/SmartHunter.sln.

## 2. Download and install NPM
You need NPM. NPM for your system can be found at https://nodejs.org/en/download/. To check if it is correctly installed on Windows you can open Command Prompt and type: "node -v" and hit Enter, if a series of numbers come up you are ready for the next step.

## 3. Setup Visual Studio to automatically copy Smart Hunter build output into React Hunter build folder
Once NPM is installed, open the project in Visual Studio 2019. The project file is located at ../ReactHunter.sln. Right-click SmartHunter on the right in the Solution Explorer -> Properties -> Build -> Output -> Output Path -> "../ReactHunter/bin/x64/Debug". Note that the output path listed here is the default one on my system and may be different for you depending on your VS configuration.

## 4. Run
Hit "Run" in the top toolbar and wait for VS to finishing building the project. If the React Hunter console window complains about anything (e.g. pattern scanning failing) you most likely didn't complete step 3 properly.

# TODO
1. Make it look nice
