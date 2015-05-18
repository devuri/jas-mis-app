/**
 * Created by matjames007 on 5/18/15.
 */
angular.module('jasmic.controllers')

/**
 *  This controller is used to handle the displaying of information on the
 *  Buyer Listing Page.
 */
    .controller('BuyersListingCtrl', ['$scope', '$mdDialog', '$location', '$routeParams', 'BuyersListingFactory',
        function ($scope, $mdDialog, $location, $routeParams, BuyersListingFactory) {
            BuyersListingFactory.query($routeParams, function(buyers) {
                $scope.buyers = buyers;
            }, function(error) {
                showDialog($mdDialog, error, true);
            });
            $scope.selected = false;

            $scope.selectedElement = function(buyer) {
                $scope.selectedBuyer = buyer;
                $scope.selected = true;
            };

            $scope.goToBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id);
            };

            $scope.editBuyer = function() {
                $location.url('buyer/'+$scope.selectedBuyer._id+'/edit');
            };
        }
    ])
    /**
     * TODO:  Incomplete New Farmer Controller that utilizes the same view as the
     * edit farmer view
     */
    .controller('NewBuyerCtrl', ['$scope', '$routeParams', 'BuyerFactory', 'BuyerTypesListingFactory',
            'ParishesFactory',
        function ($scope, $routeParams, BuyerFactory, BuyerTypesListingFactory, ParishesFactory) {
            BuyerTypesListingFactory.query(function(buyertypes) {
                $scope.buyerTypes = buyertypes;
            }, function(fail) {
                //TODO:  I need to ensure that I handle these properly
            });

            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            $scope.save = function() {
                BuyerFactory.create($scope.buyer, function(success) {
                    //TODO: Handle this!!!
                    console.log(success);
                },
                function(fail) {
                    //TODO: Handle this!!!
                    console.log(fail);
                });
            };
        }
    ])
    /**
     * This controller is responsible for the querying of the buyer by id,
     * then creation of the buyer object for the view to render.  It also
     * populates the parishes combo box for user interaction.
     */
    .controller('EditBuyerCtrl', ['$scope', '$mdDialog','$routeParams', 'BuyerFactory',
        'ParishesFactory', 'BuyerTypesListingFactory',
        function ($scope, $mdDialog, $routeParams, BuyerFactory, ParishesFactory, BuyerTypesListingFactory) {
            BuyerFactory.show({id:$routeParams.id},
                function(buyer) {
                    $scope.buyer = buyer;
                },
                function(error) {
                    showDialog($mdDialog, error, true);
                });

            BuyerTypesListingFactory.query({}, function(bTypes) {
                $scope.buyerTypes = bTypes;
            }, function(failure) {

            });

            ParishesFactory.query({},
                function(parishes) {
                    $scope.parishes = parishes;
                },
                function(error) {
                    console.log(error);
                });

            $scope.save = function() {
                BuyerFactory.update({id:$scope.buyer._id}, $scope.buyer, function(something) {
                    showDialog($mdDialog, {statusText:"Successfully Updated!"}, false);
                }, function(error) {
                    showDialog($mdDialog, error, true);
                });
            };

        }
    ])

    /**
     *  Controller logic for the profile page of a buyer.
     */
    .controller('BuyerProfileCtrl', ['$scope', '$mdDialog','$routeParams', 'BuyerFactory',
        'ParishesFactory', 'BuyerTypesListingFactory',
        function ($scope, $mdDialog, $routeParams, BuyerFactory, ParishesFactory, BuyerTypesListingFactory) {
            BuyerFactory.show({id:$routeParams.id},
                function(buyer) {
                    $scope.buyer = buyer;
                },
                function(error) {
                    showDialog($mdDialog, error, true);
                });

            $scope.isValid = isValid;

            $scope.editBuyer = function() {
                $location.url('buyer/'+$scope.buyer._id+'/edit');
            }
        }
    ]);


/**
 * Quick and dirty check to see if information is present for
 * manipulation
 * @param obj
 * @returns {boolean}
 */
isValid = function(obj) {
    if(obj == undefined) {
        return false;
    } else if(obj == '') {
        return false;
    } else {
        return true;
    }
};