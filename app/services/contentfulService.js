'use strict';

angular.module('minditTest.ContentfulService', [])
    .service('ContentfulService', ['$q', 'contentful', function ($q, contentful) {
        var service = this;

        service.getContentTypes = function (queryString, optionSet) {
            var promise = $q.defer();

            contentful.contentTypes(queryString, optionSet).then(
                function (response) {
                    promise.resolve(response.data.items);
                },
                function (response) {
                    promise.reject(response.status);
                }
            );

            return promise.promise;
        };

        service.getContent = function (queryString, optionSet) {
            var promise = $q.defer();

            contentful.entries(queryString, optionSet).then(
                function (response) {
                    promise.resolve(response.data);
                },
                function (response) {
                    promise.reject(response.status);
                }
            );

            return promise.promise;
        };

        service.getAsset = function (id, optionSet) {
            var promise = $q.defer();

            contentful.asset(id, optionSet).then(
                function (response) {
                    promise.resolve(response.data);
                },
                function (response) {
                    promise.reject(response.status);
                }
            );

            return promise.promise;
        };

        service.getEntry = function(id, optionSet) {
            var promise = $q.defer();

            contentful.entry(id, optionSet).then(
                function(response) {
                    promise.resolve(response.data);
                },
                function (response) {
                    promise.resolve(response.status);
                }
            );

            return promise.promise;
        };
    }]);
