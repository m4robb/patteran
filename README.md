# Helios Dev Standards



## Folder Structure
This repository represents the basic folder structure for a project. Certain files and directories may be unnecessary.
Depending on your needs you may want to delete the fontawesome files from fonts/ and css/, the 1000px-grid.psd from
_source/, the transparent .pngs from images/ and the dev/ folder if there are no experiments required for the project.
To use this folder as a base clone the repository:

	$ git clone git@github.com:heliosdesign/helios-dev-standards.git [new-project-name]

Once cloned, you should delete the `.git/` and `README.md` files. Navigate into the new project folder and run this command:

	$ rm -rf .git ; rm README.md

It you would like to include this project as a new repository, create a repo on GitHub and run the following in
the project directory:

Sets up the necessary get files:

	$ git init


Create a new README file:

	$ touch README


Stage all the directories and files in the project:

	$ git add .


Commit the files:

	$ git commit -m 'First Commit' -a


Create a remote named "origin" pointing at the GitHub repo:

	$ git remote add origin https://github.com/heliosdesign/[repo-name].git


Push to origin master:

	$ git push origin master




## HTML
* Each `<code block></code block>` indented properly using tabs. For continuity, we have set tabs to 4 spaces.
* Comment the end of major sections: EG: `</div><!-- .wrapper -->`
* Use proper HTML5 doctypes, elements (`<header>, <nav>, <footer>, <section>, <article>, <aside>`), etc.
* JavaScripts embedded at the bottom of the page for faster page loading unless it needs to be in the head.

## CSS
* Multi-line unless there is only one property.
* Properties listed alphabetically.
* Exception: group CSS3 prefixed properties together.
* Major sections commented.
* All values end with semicolon, including last property and when there is only one property.
* normalize.css or reset.css included at the top of the document using @import.

####EG:

	/* =Major Section
	/*-----------------------------------------------------------*/

	selector1 { property: value; }

	selector2 {
	    display: block;
	    height: 100%;
	    position: relative;
	    width: 100%;
	
	    -moz-border-radius: 10px;
	    -webkit-border-radius: 10px;
	    border-radius: 10px;
	}
	

##Images
####Naming Convention:
*	Regular: [prefix]-[name].png
*	Retina: [prefix]-[name]@2x.png

####Prefixes:
*	Background: bg
*	Button: btn
*	Header: hd
*	Icon: icn
*	Image: img
*	User Interface: ui

##JavaScript
*	If possible, all scripts in one file (main.js) outside of the HTML files.
*	If possible, reference external .js files at the bottom of HTML files for faster page loading.