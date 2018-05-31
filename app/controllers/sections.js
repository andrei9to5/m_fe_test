'use strict';

angular.module('minditTest.sections', ['ngRoute'])
    .controller('SectionsController', ['$scope', '$rootScope', '$routeParams', '$q', 'ContentfulService' ,
        function($scope, $rootScope, $routeParams, $q, contentfulService) {
            const controller = this;

            contentfulService.getContent('content_type=section' +
                '&select=fields.name,fields.slug' +
                '&order=-sys.createdAt')
                    .then(function(data) {
                        $scope.sections = data.items.map(e => e.fields);
                    });

            controller.skipped = 0;
            controller.limit = 5;
            $scope.sectionSlug = $routeParams.sectionSlug;
            $scope.articles = [];

            let allArticles = [];

            const getSectionInfo = function() {
                let promise = $q.defer();
                contentfulService.getContent('content_type=section' +
                    '&select=fields.slug,fields.name,sys.id,fields.metadescription,fields.metakeywords')
                    .then(function (data) {
                        let section;
                        if (!!$scope.sectionSlug) {
                            section = data.items.filter(e => e.fields.slug === $scope.sectionSlug)[0];
                        } else {
                            section = data.items[0];
                        }

                        controller.sectionId = section.sys.id;
                        $scope.sectionName = section.fields.name;

                        $rootScope.pageTitle = section.fields.name;
                        $rootScope.keywords = section.fields.metakeywords.join`,`;
                        $rootScope.description = section.fields.metadescription;

                        promise.resolve();
                    });

                return promise.promise;
            };

            const getArticles = function() {
                contentfulService.getContent('content_type=article' +
                    '&fields.section.sys.id=' + controller.sectionId +
                    '&select=fields.author,fields.slug,fields.synopsis,fields.title,fields.date,fields.synopsis,fields.image,sys.id' +
                    '&limit=' + controller.limit +
                    '&skip=' + controller.skipped +
                    '&order=-sys.createdAt')
                    .then(function (data) {
                        let newArticles = data.items.map(e => e.fields);

                        newArticles.forEach(e => {
                            requestImage(e.image.sys.id).then(function(data) {
                                e.image = data.fields.file.url;
                            });
                        });

                        allArticles = allArticles.concat(newArticles);

                        $scope.articles = filter(allArticles);
                        controller.total = data.total;
                    });
            };

            const requestImage = function(imageId) {
                return contentfulService.getAsset(imageId);
            };

            getSectionInfo().then(function() {
                getArticles();
            });

            controller.showMore = function() {
                controller.skipped += controller.limit;

                getArticles();
            };

            const filter = function(array) {
                if (controller.searchTerm && controller.searchTerm.trim().length >= 4) {
                    return array.filter(e=> controller.searchTerm.split` `.every(t => e.title.toLowerCase().includes(t.toLowerCase()) || e.author.toLowerCase().includes(t.toLowerCase())));
                }

                return array;
            };

            controller.onSearchInput = function() {
                $scope.articles = filter(allArticles);
            };

        }]);
