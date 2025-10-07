## Veeva-Gulp
Version: 1.0.0
Author: Ryan Foster

## Installation

**Windows might require script permission access to allow unsigned scripts to run. If you receive permission/security errors, open powershell as an Administrator and run 'set-executionpolicy remotesigned'**

**Mac users will have to use 'sudo npm install' instead of 'npm install' when inserting terminal commands**

1. Install node.js at https://nodejs.org
2. Open console at the root of project
3. If you have never used gulp before run: "npm install gulp-cli -g"
4. Run console command 'npm install'
5. Run console command 'gulp' to start server 
6. Run console command 'gulp build' to build project to 'build' and 'dist'
7. Run console command 'gulp zip' to build zips inside 'zips' folder. zips are ready to load to Veeva CLM


## Configuration
**IMPORTANT - when changing either gulpfile.js or any task.js file, stop (ctrl+c) and rerun "gulp"**
1. In the gulpfile.js set the const projectName equal to the whatever name you want appended to the slide pages.zip

## File Structure
All work should be done within the 'src' folder. Gulp is monitoring for changes within the src files. When a change occurs it will update /build, /dist/ and /zips.

/build represents what is in the browser

/dist are the converted src files that will be zipped for veeva

/zips are the autoprepared and ready for upload

## Workflow
1. New page folders can be created in the 'src/html/pages'
2. CSS and Javascript folders can be found in 'src/assets/'
3. Place single page images within that pages directory 'src/html/pageName/images'
4. Place shared images in the 'src/html/shared/images' folder.

## Linking
1. pageTemplate.html runs a script that finds inbound or outbound anchors
2. add .outbound to link externally 
3. add .inbound if hosting pdf


