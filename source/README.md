# Business objects

### a JavaScript object-oriented business layer for Node.js

See tutorials and class references: https://bo.logikum.hu  

### Installation

If you want to use it in your project:

```
$ npm install business-objects
```

### Tests and Documentation

First clone the repo and install the dependencies:

```
$ git clone https://github.com/logikum/business-objects.git
$ cd business-objects
$ npm install
```

Run the tests (unit tests, core business object tests, model composer tests):

```
$ jasmine-node tests/unit --color
$ jasmine-node tests/core --color
$ jasmine-node tests/mc --color
```

Generate the documentation with DocStrap or baseline template:

```
$ grunt docstrap
$ grunt baseline
```

### Features

| Editable models | Read-only models | Other models |
| ----------------| ---------------- | ------------ |
| [Editable root object](https://bo.logikum.hu/api/v2.0.1/docstrap/EditableRootObject.html) | [Read-only root object](https://bo.logikum.hu/api/v2.0.1/docstrap/ReadOnlyRootObject.html) | [Command object](https://bo.logikum.hu/api/v2.0.1/docstrap/CommandObject.html) |  
| [Editable root collection](https://bo.logikum.hu/api/v2.0.1/docstrap/EditableRootCollection.html) | [Read-only root collection](https://bo.logikum.hu/api/v2.0.1/docstrap/ReadOnlyRootCollection.html) | 
| [Editable child object](https://bo.logikum.hu/api/v2.0.1/docstrap/EditableChildObject.html) | [Read-only child object](https://bo.logikum.hu/api/v2.0.1/docstrap/ReadOnlyChildObject.html) | 
| [Editable child collection](https://bo.logikum.hu/api/v2.0.1/docstrap/EditableChildCollection.html) | [Read-only child collection](https://bo.logikum.hu/api/v2.0.1/docstrap/ReadOnlyChildCollection.html) | 
