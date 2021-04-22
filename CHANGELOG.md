# (2019-02-06)
* Fix bug overflow in timer
* Remove mobile support

# (2018-11-09)
* Fix bug when starting task, first run skips 2 sec
* Refactor css

# (2018-11-08)
* Refactor implementation of theme, use js instead of css
* Fix bug in length of taskbar when count down is stopped
* Add Google Analytics in all pages

# (2018-11-07)
* Code split routes using React-Loadable and babel plugin
* add .babelrc file
* Fix bug TaskBar not showing
* Add TimeLogs module

# (2018-11-06)
* Add Formik as dependency
* Add validation to Login form
* Use Context API for handling themes
* Refactor some code and create new components (Timebar, TaskBar)
* Change mount() to shallow() in Timer test as mount produces error when using React Router. Context is not found.

# (2018-11-05)
* Add Login module
* Add SignUp module
* Refactor, create new module for Timer 
* App now handles Routing
* Add React Router as dependency
* Add routes folder as placeholder for webpages

# (2018-10-01)
* Refactor Timer, today bar now uses web workers
* Fix bug when transitioning to a new day, task from yesterday are not removed from today bar
* Refactor some code and create new components
* Add component folder as placeholder for React components