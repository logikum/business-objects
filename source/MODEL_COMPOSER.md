# ModelComposer's functions 

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
|:----------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| required    |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| maxLength   |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| minLength   |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| lengthIs    |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| maxValue    |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| minValue    |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| expression  |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| dependency  |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| information |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| validate    |  x  |     |  x  |     |  o  |     |  o  |     |  x  |
| canRead     |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| canWrite    |  x  |     |  x  |     |     |     |     |     |  x  |
_o = allowed but rarely used_

| <i class="group">Object rules</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:---------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| canCreate  |  x  |  x  |  x  |     |     |     |     |     |     |
| canFetch   |  x  |  x  |  x  |     |  x  |  x  |  x  |     |     |
| canUpdate  |  x  |  x  |  x  |     |     |     |     |     |     |
| canRemove  |  x  |  x  |  x  |     |     |     |     |     |     |
| canExecute |     |     |     |     |     |     |     |     |  x  |
| canCall    |  x  |  x  |  x  |     |  x  |  x  |  x  |     |  x  |

| <i class="group">Extensions</i> | ero | erc | eco | ecc | rro | rrc | rco | rcc | co&nbsp;&nbsp;|
|:----------- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| daoBuilder  |  x  |  x  |  x  |     |  x  |  x  |     |     |  x  |
| toDto       |  x  |     |  x  |     |     |     |     |     |  x  |
| fromDto     |  x  |     |  x  |     |  x  |     |  x  |     |  x  |
| toCto       |  x  |  x  |  x  |     |  x  |  x  |  x  |     |     |
| fromCto     |  x  |  x  |  x  |     |     |     |     |     |     |
| dataCreate  |  x  |     |  x  |     |     |     |     |     |     |
| dataFetch   |  x  |  x  |  x  |     |  x  |  x  |  x  |     |     |
| dataInsert  |  x  |     |  x  |     |     |     |     |     |     |
| dataUpdate  |  x  |     |  x  |     |     |     |     |     |     |
| dataRemove  |  x  |     |  x  |     |     |     |     |     |     |
| dataExecute |     |     |     |     |     |     |     |     |  x  |
| addMethod   |     |     |     |     |     |     |     |     |  x  |
