'use strict';

angular.module('minditTest.article', ['ngRoute'])
    .controller('ArticleController', ['$scope', '$rootScope', '$routeParams', '$q','ContentfulService',
        function($scope, $rootScope, $routeParams, $q, contentfulService) {

        var controller = this;

        $scope.sectionSlug = $routeParams.sectionSlug;
        $scope.articleSlug = $routeParams.articleSlug;

        contentfulService.getContent('content_type=section' +
            '&select=fields.name,fields.slug' +
            '&order=-sys.createdAt')
            .then(function(data) {
                $scope.sections = data.items.map(e => e.fields);
            });

        var getSectionInfo = function() {
            var promise = $q.defer();
            contentfulService.getContent('content_type=section' +
                '&select=fields.slug,sys.id')
                .then(function(data) {
                    var section = data.items.filter(e => e.fields.slug == $scope.sectionSlug)[0];
                    var sectionId = section.sys.id;

                    promise.resolve(sectionId);
                });

            return promise.promise;
        };

        var getArticlesId = function(sectionId) {
            contentfulService.getContent('content_type=article' +
                '&fields.section.sys.id=' + sectionId +
                '&select=fields.slug,sys.id').then(function(data) {
                    var articleId = data.items.filter(e => e.fields.slug == $scope.articleSlug)[0].sys.id;

                    contentfulService.getEntry(articleId).then(function(data){
                        $scope.article = data.fields;

                        var imageId = data.fields.image.sys.id;

                        $rootScope.pageTitle = data.fields.title;
                        $rootScope.keywords = data.fields.metakeywords.join`,`;
                        $rootScope.description = data.fields.metadescription;

                        contentfulService.getAsset(imageId).then(function(data) {
                            $scope.article.imgSrc = data.fields.file.url;
                        });
                    });
            });
        };

        getSectionInfo().then(function(sectionId) {
            getArticlesId(sectionId);
        });

    }]);
