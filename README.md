#Business objects

### a JavaScript object-oriented business layer for Node.js

See documentation: [http://logikum.github.io/business-objects/](http://logikum.github.io/business-objects/)

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

Run the tests:

```
$ jasmine-node tests
```

Generate the documentation with DocStrap or baseline template:

```
$ grunt docstrap
$ grunt baseline
```

### Features

Asynchronous models:

* [Editable root model](http://logikum.github.io/business-objects/EditableRootModel.html)
* [Editable child model](http://logikum.github.io/business-objects/EditableChildModel.html)
* [Editable child collection](http://logikum.github.io/business-objects/EditableChildCollection.html)
* [Read-only root model](http://logikum.github.io/business-objects/ReadOnlyRootModel.html)
* [Read-only child model](http://logikum.github.io/business-objects/ReadOnlyChildModel.html)
* [Read-only root collection](http://logikum.github.io/business-objects/ReadOnlyRootCollection.html)
* [Read-only child collection](http://logikum.github.io/business-objects/ReadOnlyChildCollection.html)
* [Command object](http://logikum.github.io/business-objects/CommandObject.html)

Synchronous models:

* [Editable root model](http://logikum.github.io/business-objects/EditableRootModelSync.html)
* [Editable child model](http://logikum.github.io/business-objects/EditableChildModelSync.html)
* [Editable child collection](http://logikum.github.io/business-objects/EditableChildCollectionSync.html)
* [Read-only root model](http://logikum.github.io/business-objects/ReadOnlyRootModelSync.html)
* [Read-only child model](http://logikum.github.io/business-objects/ReadOnlyChildModelSync.html)
* [Read-only root collection](http://logikum.github.io/business-objects/ReadOnlyRootCollectionSync.html)
* [Read-only child collection](http://logikum.github.io/business-objects/ReadOnlyChildCollectionSync.html)
* [Command object](http://logikum.github.io/business-objects/CommandObjectSync.html)

### Release History

<dl>
  <dt>v1.0.5</dt>
  <dd>
    2015.02.25.<br/>
    Fixing a bug in root collection.
  </dd>

  <dt>v1.0.4</dt>
  <dd>
    2015.02.17.<br/>
    Adding email and enum data types.
  </dd>

  <dt>v1.0.3</dt>
  <dd>
    2015.02.16.<br/>
    Fixing configuration setup bug.
  </dd>

  <dt>v1.0.2</dt>
  <dd>
    2015.02.15.<br/>
    Adding configuration setup.
  </dd>

  <dt>v1.0.1</dt>
  <dd>
    2015.02.10.<br/>
    Fixing locale access bug.
  </dd>

  <dt>v1.0.0</dt>
  <dd>
    2015.02.09.<br/>
    First public release.
  </dd>
</dl>
