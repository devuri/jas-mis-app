/**
 * Created by matjames007 on 5/20/15.
 */

angular.module('jasmic.controllers')
    .controller('DemandListingCtrl', ['$scope','$location','$routeParams', 'CurrentDemandsFactory',
        'DemandMatchFactory',
        function ($scope, $location, $routeParams, CurrentDemandsFactory, DemandMatchFactory) {
            CurrentDemandsFactory.query({}, function(demands) {
                    $scope.demands = demands;
                },
                function(error) {
                    $scope.demands = [];
                });

            $scope.selectedItem = function(demand) {
                $scope.selectedDemand = demand;
                $scope.itemSelected = true;
                lookupDemandMatches();
            };

            $scope.goToDemand = function() {
                $location.url('demand/' + $scope.selectedDemand._id);
            };

            $scope.itemSelected = false;

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.selectedDemand._id}, function(list) {
                    $scope.m_commodities = list;
                })
            }
        }
    ])
   .controller('DemandProfileCtrl', ['$scope','$mdToast','$location', '$mdDialog','$routeParams', 'DemandFactory',
        'DemandMatchFactory', 'UserProfileFactory', 'TransactionFactory',
        function ($scope, $mdToast, $location, $mdDialog, $routeParams, DemandFactory, DemandMatchFactory,
                  UserProfileFactory, TransactionFactory) {
            /**
             * Display user profile based on authenticated
             * session information.
             */
            UserProfileFactory.show(function(user) {
                $scope.user = user;
            });

            /**
             * Lookup Demand information based on ID supplied in the URL.
             */
            DemandFactory.show({id:$routeParams.id}, function(demand) {
                    $scope.demand = demand;
                    $scope.selectedDemand = demand;
                    lookupDemandMatches();
                },
                function(error) {
                    $scope.demand = {};
                });

            /**
             * Function to run when download pdf button is clicked.
             * This creates a transaction based on items in the
             * transaction cart and triggers download of pdf.
             */
            $scope.downloadPDF = function() {
                //create transaction(s)
                if($scope.m_commodities.length > 0) {
                    createTransactions();
                } else {
                    $mdToast.show($mdToast.simple().position('top right').content('No Supplies Selected!'));
                }
            };

            createTransactions = function() {
                for(var i in $scope.m_commodities) {
                    TransactionFactory.create({
                            bu_buyer: $scope.demand.bu_buyer,
                            fr_farmer: $scope.m_commodities[i].fa_farmer,
                            cr_crop: $scope.demand.cr_crop,
                            tr_status: 'Pending',
                            us_user_id: $scope.user._id,
                            de_demand: $scope.demand._id,
                            tr_value: ($scope.m_commodities[i].co_price * $scope.m_commodities[i].co_quantity),
                            co_commodity: $scope.m_commodities[i]._id
                        },
                        function(success) {
                            console.log(success);
                        },
                        function(fail) {
                            console.log(fail);
                        });
                }
            };

            /**
             * Default/initial variable states
             */
            $scope.combinedSupplyAmount = 0;
            $scope.combinedSuppyValue = 0;
            $scope.totalPercentage = 0;
            $scope.demandMet = false;
            $scope.allSelected = false;
            $scope.m_commodities = [];

            /**
             * Deselect item from the cart.
             * @param commodity
             */
            $scope.remove = function(commodity) {
                commodity.selected = false;
            };

            /**
             * Triggered when an item is checked/unchecked.
             * @param commodity
             */
            $scope.checked = function(commodity) {
                // console.log(commodity);
                var sum = 0;
                $scope.combinedSuppyValue = 0;
                for(var i in $scope.m_commodities) {
                    sum += $scope.m_commodities[i].co_quantity;
                    $scope.combinedSuppyValue +=
                        ($scope.m_commodities[i].co_price * $scope.m_commodities[i].co_quantity);
                }
                $scope.combinedSupplyAmount = sum;
                $scope.totalPercentage = (sum/$scope.demand.de_quantity) * 100;
                if(sum >= $scope.demand.de_quantity) {
                    $scope.demandMet = true;
                } else {
                    $scope.demandMet = false;
                }
            };

            lookupDemandMatches = function() {
                DemandMatchFactory.query({id: $scope.demand._id}, function(list) {
                    $scope.commodities = list;
                })
            }

            $scope.printReport = function(demand_id){
              var url = "/report/buyer_report?";
              var commodity_id= "comm_id=";
              var ampersand = "&";
                if ($scope.m_commodities.length > 0){
                    for(var i in $scope.m_commodities){
                        url = url.concat(commodity_id,$scope.m_commodities[i]._id,ampersand);
                    }
                    var report_url = url + "demand_id=" + demand_id + "&supply_value=" + $scope.combinedSuppyValue + "&supply_amount=" + $scope.combinedSupplyAmount;
                    window.location = report_url; 
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Error Detected')
                            .content('No Supply matched')
                            .ariaLabel('Alert')
                            .ok('Ok')
                        );          
                }
            }             
        }
    ]);