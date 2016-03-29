# Model Composer's functions 

ero = editable root object
erc = editable root collection
eco = editable child object
ecc = editable child collection
rro = read-only root object
rrc = read-only root collection
rco = read-only child object
rcc = read-only child collection
co = command object

<style>
  .group {
    color: blue;
  }
</style>

| <i class="group">Collections</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:-------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| itemType |     |  x  |     |  x  |     |  x  |     |  x  |     |

| <i class="group">Properties</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:-------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| boolean  |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| text     |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| email    |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| integer  |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| decimal  |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| enum     |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| dateTime |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| property |  x  |     |  x  |     |  x  |     |  x  |     |  x  |

| <i class="group">Property rules</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:-------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| required      |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| maxLength     |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| minLength     |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| lengthIs      |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| maxValue      |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| minValue      |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| expression    |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| dependency    |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| information   |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| addValidation |  x  |     |  x  |     |  *  |     |  *  |     |  x  |
| canRead       |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| canWrite      |  x  |     |  x  |     |     |     |     |     |  x  |
_\* allowed but rarely used_

| <i class="group">Object rules</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:-------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| canCreate  |     |     |     |     |     |     |     |     |     |
| canFetch   |     |     |     |     |     |     |     |     |     |
| canUpdate  |     |     |     |     |     |     |     |     |     |
| canRemove  |     |     |     |     |     |     |     |     |     |
| canExecute |     |     |     |     |     |     |     |     |     |

| <i class="group">Extensions</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:-------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| daoBuilder     |     |     |     |     |     |     |     |     |     |
| toDto          |     |     |     |     |     |     |     |     |     |
| fromDto        |     |     |     |     |     |     |     |     |     |
| toCto          |     |     |     |     |     |     |     |     |     |
| fromCto        |     |     |     |     |     |     |     |     |     |
| dataCreate     |     |     |     |     |     |     |     |     |     |
| dataFetch      |     |     |     |     |     |     |     |     |     |
| dataInsert     |     |     |     |     |     |     |     |     |     |
| dataUpdate     |     |     |     |     |     |     |     |     |     |
| dataRemove     |     |     |     |     |     |     |     |     |     |
| dataExecute    |     |     |     |     |     |     |     |     |     |
| addOtherMethod |     |     |     |     |     |     |     |     |     |
