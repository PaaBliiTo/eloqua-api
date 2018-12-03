# Eloqua Node API Helper

## Table of contents

- [Getting Started](#getting-started)
- [Accounts](#accounts)
- [Contacts](#contacts)
- [Custom Objects](#custom-objects)
- [Roadmap](#roadmap)
- [License](#license)

---

## Getting Started

To start using the functions, require the module and initiate a new Eloqua 

```js
const ELQ = require('eloqua-api');
const eloqua = new ELQ(pod, site, username, password);
```

For the pod, please use the full designation (with the p) like this : `p06`

## Accounts

### Functions

- [createAccount](#createaccount)
- [getAccounts](#getaccounts)
- [searchAccounts](#searchaccounts)
- [getAllAccounts](#getallaccounts)
- [deleteAccounts](#deleteaccounts)

### createAccount

```js
eloqua.createAccount(data, callback);
```

The `data` parameter is an array of objects containing the information of the accounts willing to be created.

Example request:
```js
let data = [{name: "ACME Group", address1: "123 Fake Str."}, {name: "DIST Corp", address1: "42 Unif Bvd."}];
eloqua.createAccount(data, function(res) {
    console.log(res);
})
```

The response in the callback is an array containing the information of the created accounts.

Reponse example:
```js
[{ type: 'Account',
  id: '1382',
  createdAt: '1543784368',
  depth: 'complete',
  description: '',
  name: 'ACME Group',
  updatedAt: '1543784368',
  address1: '123 Fake Str.',
  address2: '',
  address3: '',
  businessPhone: '',
  city: '',
  country: '',
  fieldValues: [],
  postalCode: '',
  province: '' },
  {...}]
```

### getAccounts

```js
eloqua.getAccounts(ids, callback);
```

- `ids`: type: array. An array containing integers that represent the IDs of the accounts in Eloqua.
- `callback`: type: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:
```js
const ids = [1382, 1384];
eloqua.createAccount(ids, function(res) {
    console.log(res);
})
```

The response in the callback is an array containing the information of the accounts.

Example response:
```js
[{ type: 'Account',
  id: '1382',
  createdAt: '1543784368',
  depth: 'complete',
  description: '',
  name: 'ACME Group',
  updatedAt: '1543784368',
  address1: '123 Fake Str.',
  address2: '',
  address3: '',
  businessPhone: '',
  city: '',
  country: '',
  fieldValues: [],
  postalCode: '',
  province: '' },
  {...}]
```

### searchAccounts

```js
eloqua.searchAccounts(criteria, field, complete, callback);
```

- `criteria`: type: string. The value of the field you want to search on.
- `field`: type: string. The field you want to perform a search on. Enter `null` if you want to search on the standard `Company Name` field.
- `complete`: type: boolean. `true` if you need complete and detailed information about the account, `false` if you only need the basic information.
- `callback`: type: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:

```js
eloqua.searchAccounts('ACME*', null, true, function(res) {
    console.log(res);
})
```

Example response:

```js
{ elements:
  [ { type: 'Account',
       id: '1382',
       createdAt: '1543784368',
       depth: 'complete',
       description: '',
       name: 'ACME Group',
       updatedAt: '1543784368',
       address1: '123 Fake Str.',
       address2: '',
       address3: '',
       businessPhone: '',
       city: '',
       country: '',
       fieldValues: [Array],
       postalCode: '',
       province: '' },
       {...} ],
  total: 3 }
```

- `elements`: type: array. This is an array containing the informations from the accounts
- `total`: type: integer. This is the total number of the elements returned by the request

### getAllAccounts

```js
eloqua.getAllAccounts(callback);
```

> **WARNING**

> Depending on the size of your Eloqua instance and the number of Accounts it has, using this function can take a lot of time. Be careful when using it.

- `callback`: type: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:

```js
eloqua.getAllAccounts(function(res) {
    console.log(res);
})
```

Example response:

```js
{ elements:
  [ { type: 'Account',
       id: '1382',
       createdAt: '1543784368',
       depth: 'complete',
       description: '',
       name: 'ACME Group',
       updatedAt: '1543784368',
       address1: '123 Fake Str.',
       address2: '',
       address3: '',
       businessPhone: '',
       city: '',
       country: '',
       fieldValues: [Array],
       postalCode: '',
       province: '' },
       {...} ],
  total: 6 }
```

- `elements`: type: array. This is an array containing the informations from the accounts
- `total`: type: integer. This is the total number of the elements returned by the request

### deleteAccounts

```js
eloqua.deleteAccounts(ids, callback);
```

- `ids`: type: array. An array containing integers that represent the IDs of the accounts in Eloqua.
- `callback`: type: function. The callback function. Takes no parameter.

Exemple request:

```js
const ids = [1382, 1384];
eloqua.deleteAccounts(ids, function() {
    console.log('Deleted');
})
```

## Contacts

WIP

## Custom Objects

WIP

## Roadmap

- Custom objects functions
- Import/Export function

## License

MIT © Fabio Benoit