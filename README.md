# Eloqua Node API Helper

[![NPM](https://nodei.co/npm/eloqua-api.png)](https://nodei.co/npm/eloqua-api/)

[![dependencies Status](https://david-dm.org/PaaBliiTo/eloqua-api/status.svg)](https://david-dm.org/PaaBliiTo/eloqua-api)

## Table of contents

- [Getting Started](#getting-started)
- [Accounts](#accounts)
- [Contacts](#contacts)
- [Custom Objects](#custom-objects)
- [Roadmap](#roadmap)
- [License](#license)

---

## Getting Started

```js
npm i eloqua-api
```

To start using the functions, require the module and initiate a new Eloqua 

```js
const ELQ = require('eloqua-api');
const eloqua = new ELQ(pod, site, username, password);
```

For the pod, please use the full designation (with the p) like this : `p06`

## Accounts

### Functions

- [createAccounts](#createaccounts)
- [getAccounts](#getaccounts)
- [searchAccounts](#searchaccounts)
- [getAllAccounts](#getallaccounts)
- [deleteAccounts](#deleteaccounts)

### createAccounts

```js
eloqua.createAccounts(data, callback);
```

- `data`: array. This is an array composed of objects containing information of the accounts willing to be created.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:
```js
let data = [{name: "ACME Group", address1: "123 Fake Str."}, {name: "DIST Corp", address1: "42 Unif Bvd."}];
eloqua.createAccounts(data, function(res) {
    console.log(res);
})
```

The response in the callback is an array containing the information of the created accounts.

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

### getAccounts

```js
eloqua.getAccounts(ids, callback);
```

- `ids`: array. An array containing integers that represent the IDs of the accounts in Eloqua.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

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

- `criteria`: string. The value of the field you want to search on.
- `field`: string. The field you want to perform a search on. Enter `null` if you want to search on the standard `Company Name` field.
- `complete`: boolean. `true` if you need complete and detailed information about the account, `false` if you only need the basic information.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

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

- `elements`: array. This is an array containing the informations from the accounts
- `total`: integer. This is the total number of the elements returned by the request

### getAllAccounts

```js
eloqua.getAllAccounts(callback);
```

> **WARNING**

> Depending on the size of your Eloqua instance and the number of Accounts it has, using this function can take a lot of time. Be careful when using it.

- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

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

- `elements`: array. This is an array containing the informations from the accounts
- `total`: integer. This is the total number of the elements returned by the request

### deleteAccounts

```js
eloqua.deleteAccounts(ids, callback);
```

- `ids`: array. An array containing integers that represent the IDs of the accounts in Eloqua.
- `callback`: function. The callback function. Takes no parameter.

Exemple request:

```js
const ids = [1382, 1384];
eloqua.deleteAccounts(ids, function() {
    console.log('Deleted');
})
```

## Contacts

### Functions

- [createContacts](#createcontacts)
- [getContacts](#getcontacts)
- [searchContacts](#searchcontacts)
- [getAllContacts](#getallcontacts)
- [deleteContacts](#deletecontacts)


### createContacts

```js
eloqua.createContacts(data, callback);
```

- `data`: array. This is an array composed of objects containing information of the contacts willing to be created.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:
```js
let data = [{"emailAddress": "tst1@test.com"}, {"emailAddress": "tst2@test.com"}];
eloqua.createContacts(data, function(res) {
    console.log(res);
})
```

The response in the callback is an array containing the information of the created contacts.

Example response:
```js
[ { type: 'Contact',
    currentStatus: 'Awaiting action',
    id: '33402',
    createdAt: '1543833282',
    depth: 'complete',
    name: 'tst1@test.com',
    updatedAt: '1543833282',
    emailAddress: 'tst1@test.com',
    emailFormatPreference: 'unspecified',
    fieldValues:
     [[...]],
    isBounceback: 'false',
    isSubscribed: 'true',
    subscriptionDate: '1543833231' },
    {...}]
```

### getContacts

```js
eloqua.getContacts(ids, callback);
```

- `ids`: array. An array containing integers that represent the IDs of the contacts in Eloqua.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:
```js
const ids = [33402, 33403];
eloqua.getContacts(ids, function(res) {
    console.log(res);
})
```

The response in the callback is an array containing the information of the contacts.

Example response:
```js
[ { type: 'Contact',
    currentStatus: 'Awaiting action',
    id: '33402',
    createdAt: '1543833282',
    depth: 'complete',
    name: 'tst1@test.com',
    updatedAt: '1543833282',
    emailAddress: 'tst1@test.com',
    emailFormatPreference: 'unspecified',
    fieldValues:
     [[...]],
    isBounceback: 'false',
    isSubscribed: 'true',
    subscriptionDate: '1543833231' },
    {...}]
```

### searchContacts

```js
eloqua.searchContacts(criteria, field, complete, callback);
```

- `criteria`: string. The value of the field you want to search on.
- `field`: string. The field you want to perform a search on. Enter `null` if you want to search on the standard `emailAddress` field.
- `complete`: boolean. `true` if you need complete and detailed information about the contact, `false` if you only need the basic information.
- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:

```js
eloqua.searchContacts('tst1@test.com', null, true, function(res) {
    console.log(res);
})
```

Example response:

```js
{ elements:
   [ { type: 'Contact',
       currentStatus: 'Awaiting action',
       id: '33403',
       createdAt: '1543834309',
       depth: 'complete',
       name: 'tst1@test.com',
       updatedAt: '1543834309',
       emailAddress: 'tst1@test.com',
       emailFormatPreference: 'unspecified',
       fieldValues: [Array],
       isBounceback: 'false',
       isSubscribed: 'true',
       subscriptionDate: '1543833231' } ],
  total: 1 }
```

- `elements`: type: array. This is an array containing the informations from the contacts
- `total`: type: integer. This is the total number of the elements returned by the request

### getAllContacts

```js
eloqua.getAllContacts(callback);
```

> **WARNING**

> Depending on the size of your Eloqua instance and the number of contacts it has, using this function can take a lot of time. Be careful when using it.

- `callback`: function. The callback function. Takes one parameter, `res`, which is the data returned by the query.

Example request:

```js
eloqua.getAllContacts(function(res) {
    console.log(res);
})
```

Example response:

```js
{ elements:
   [ { type: 'Contact',
       currentStatus: 'Awaiting action',
       id: '33403',
       createdAt: '1543834309',
       depth: 'complete',
       name: 'tst1@test.com',
       updatedAt: '1543834309',
       emailAddress: 'tst1@test.com',
       emailFormatPreference: 'unspecified',
       fieldValues: [Array],
       isBounceback: 'false',
       isSubscribed: 'true',
       subscriptionDate: '1543833231' },
       {... }],
  total: 12322 }
```

- `elements`: array. This is an array containing the informations from the contacts
- `total`: integer. This is the total number of the elements returned by the request

### deleteContacts

```js
eloqua.deleteContacts(ids, callback);
```

- `ids`: array. An array containing integers that represent the IDs of the contacts in Eloqua.
- `callback`: function. The callback function. Takes no parameter.

Exemple request:

```js
const ids = [33402, 33403];
eloqua.deleteContacts(ids, function() {
    console.log('Deleted');
})
```

## Custom Objects

WIP

## Roadmap

- Custom objects functions
- Import/Export function

## License

MIT © Fabio Benoit