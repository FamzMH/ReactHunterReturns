# ReactHunterReturns
A project to bring back the OG React Hunter https://github.com/Lenshang/ReactHunter.

# Building ReactHunter
First download the latest SmartHunter from https://github.com/dragonyue0417/SmartHunter/releases and put it into libs/SmartHunter, such that the SmartHunter.sln file is found in libs/SmartHunter/SmartHunter.sln.

You need NPM. NPM for your system can be found at https://nodejs.org/en/download/. To check if it is correctly installed on Windows you can open Command Prompt and type: "node -v" and hit Enter, if a series of numbers come up you are ready for the next step.

Once NPM is installed, open the project in Visual Studio 2019. The project file is located at ReactHunter.sln. Simply hit "Run" in the top toolbar and wait for VS to finishing building the project. If the console complains about pattern scanning failing try to restart the application first. You may need to build SmartHunter individually in VS first.

# TODO
1. Partially working, need to test team damage
2. Make it look nice