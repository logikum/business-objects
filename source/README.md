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

| Asynchronous models | Synchronous models |
| ------------------- | ------------------ |
| [Editable root object](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableRootObject.html) | [Editable root object](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableRootObjectSync.html) |
| [Editable root collection](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableRootCollection.html) | [Editable root collection](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableRootCollectionSync.html) |
| [Editable child object](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableChildObject.html) | [Editable child object](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableChildObjectSync.html) |
| [Editable child collection](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableChildCollection.html) | [Editable child collection](https://bo.logikum.hu/api/v1.2.0/docstrap/EditableChildCollectionSync.html) |
| [Read-only root object](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyRootObject.html) | [Read-only root object](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyRootObjectSync.html) |
| [Read-only root collection](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyRootCollection.html) | [Read-only root collection](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyRootCollectionSync.html) |
| [Read-only child object](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyChildObject.html) | [Read-only child object](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyChildObjectSync.html) |
| [Read-only child collection](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyChildCollection.html) | [Read-only child collection](https://bo.logikum.hu/api/v1.2.0/docstrap/ReadOnlyChildCollectionSync.html) |
| [Command object](https://bo.logikum.hu/api/v1.2.0/docstrap/CommandObject.html) | [Command object](https://bo.logikum.hu/api/v1.2.0/docstrap/CommandObjectSync.html) |
