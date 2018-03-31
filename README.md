# mean-blog

_A typical minimalistic blog based on MEAN structure just for fun_

# V1.0
### Structure and feature set
* Database storage: filebased [NeDB](https://github.com/louischatriot/nedb) database
* Frontend framework: AngularJS
* Backend web framework: ExpressJS
* Feature set:
  * Infinite scroll
  * Admin editor panel
  * Push notifications (in progress)
### Installation guide
* Do *npm install* in a command shell to install _gulp_ and other needed dependencies
* Do *bower install* in a command shell to install frontend libraries
* In a project folder type *gulp front* in command shell to build .css from .scss preprocessed files
* Type *nodemon server.js* in command shell to launch a server locally (default port is 3000)
