'use strict';

// Declare app level module which depends on views, and components
angular.module('minditTest', [
    'ngRoute',
    'contentful',
    'minditTest.sections',
    'minditTest.article',
    'minditTest.ContentfulService'
])
    .config(function (contentfulProvider) {
        contentfulProvider.setOptions({
            space: '18ws4thkw9kz',
            accessToken: '983e912245d77ada3bdc0c4ada41a7adeff32aef037aded521bcce2b80b0eb92'
        });
    })
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/', {
                templateUrl: 'templates/sections.html',
                controller: 'SectionsController',
                controllerAs: 'sectionsController'
            })
            .when('/section/:sectionSlug', {
                templateUrl: 'templates/sections.html',
                controller: 'SectionsController',
                controllerAs: 'sectionsController'
            })
            .when('/section/:sectionSlug/article/:articleSlug', {
                templateUrl: 'templates/article.html',
                controller: 'ArticleController',
                controllerAs: 'articleController'
            })
            .otherwise({redirectTo: '/'});
    }
    ])
    .factory('SharedService', function () {
        return {};
    });