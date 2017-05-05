import angular from 'angular';
import app from './components/core';

import router from './components/router'

console.log('app', app)

app.config(router)



angular.bootstrap(document, ['app']);