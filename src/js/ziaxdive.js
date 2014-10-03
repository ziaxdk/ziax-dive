(function() {
  'use strict';
  var safeFn = function(fn) {
    try {
      fn();
    }
    catch(e) {
      console.log('safe', e.message);
    }
  };

  angular.module('ziaxdiveApp', ['ionic'])
  .run(['$ionicPlatform', function($ionicPlatform) {

    $ionicPlatform.ready(function() {
      safeFn(function() {
        if(StatusBar) {
          StatusBar.overlaysWebView(true);
        }
      });
      safeFn(function() {
        navigator.vibrate(500);
      });
    });
  }])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "tmpl/tabs.html"
      })
      .state('tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "tmpl/home.html",
            controller: 'rdp'
          }
        }
      })
      .state('tabs.settings', {
        url: "/settings",
        views: {
          'settings-tab': {
            templateUrl: "tmpl/settings.html",
            controller: 'settings'
          }
        }
      })
      .state('tabs.about', {
        url: "/about",
        views: {
          'about-tab': {
            templateUrl: "tmpl/about.html"
          }
        }
      });
     $urlRouterProvider.otherwise("/tab/home");

  })
  .constant('RdpTable', [
    { depth: 10, mins: [10, 20, 26, 30, 34, 37, 41, 45, 50, 54, 59, 64, 70, 75, 82, 88, 95, 104, 112, 122, 133, 145, 160, 178, 199, 219], safe_stops: [ 160, 178, 199 ] },
    { depth: 12, mins: [9, 17, 23, 26, 29, 32, 35, 38, 42, 45, 49, 53, 57, 62, 66, 71, 76, 82, 88, 94, 101, 108, 116, 125, 134],          safe_stops: [ 116, 125, 134 ] },
    { depth: 14, mins: [8, 15, 19, 22, 24, 27, 29, 32, 35, 37, 40, 43, 47, 50, 53, 57, 61, 64, 68, 73, 77, 82, 87, 92, 98],               safe_stops: [ 82, 87, 92 ] },
    { depth: 16, mins: [7, 13, 17, 19, 21, 23, 25, 27, 29, 32, 34, 37, 39, 42, 45, 48, 50, 53, 56, 60, 63, 67, 70, 72],                   safe_stops: [ 63, 67, 70 ] },
    { depth: 18, mins: [6, 11, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 41, 43, 46, 48, 51, 53, 55, 56],                       safe_stops: [ 51, 53, 55 ] },
    { depth: 20, mins: [6, 10, 13, 15, 16, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 45],                               safe_stops: [ 40, 42, 44 ] },
    { depth: 22, mins: [5, 9, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 29, 30, 32, 34, 36, 37],                                        safe_stops: [ 32, 34, 36 ] },
    { depth: 25, mins: [4, 8, 10, 11, 13, 14, 15, 17, 18, 19, 21, 23, 23, 25, 26, 28, 29],                                                safe_stops: [ 25, 26, 28 ] }
  ])
  .constant('RdpSurface', [
    { group: 'A', times: [ 0, 3*60 ] },
    { group: 'B', times: [ 48, 3*60+48 ] },
    { group: 'C', times: [ 22, 1*60+10, 4*60+10 ] },
    { group: 'D', times: [ 9, 31, 1*60+19, 4*60+19] },
    { group: 'E', times: [ 8, 17, 39, 1*60+28, 4*60+28 ] },
    { group: 'F', times: [ 8, 16, 25, 47, 1*60+35, 4*60+35] },
    { group: 'G', times: [ 7, 14, 23, 32, 54, 1*60+42, 4*60+42 ]} ,
    { group: 'H', times: [ 6, 13, 21, 29, 38, 60, 1*60+48, 4*60+48] },
    { group: 'I', times: [ 6, 12, 19, 27, 35, 44, 1*60+6, 1*60+54, 4*60+54 ] },
    { group: 'J', times: [ 6, 12, 18, 25, 32, 41, 60, 1*60+12, 2*60, 5*60 ] },
    { group: 'K', times: [ 5, 11, 17, 23, 30, 38, 46, 55, 1*60+17, 2*60+5, 5*60+15 ] },
    { group: 'L', times: [ 5, 10, 16, 22, 28, 35, 43, 51, 60, 1*60+22, 2*60+10, 5*60+19 ] }
  ])
  .constant('Settings', {
    metrics: [
      { text: 'm', multiplier: 1 },
      { text: 'ft', multiplier: 3.2808399 }
    ]
  })
  .filter('min', [function() {
    return function(val) {
      var m = Math.floor(val / 60);
      return (m > 0) ? m + 'h' + (val % 60) + 'm' : val + 'm';
    };
  }])
  .factory('LocalStorage', [function() {
    return function LocalStorage(name) {
      if (!name) throw new Error("need name");
      var storage = (window.localStorage[name] && JSON.parse( window.localStorage[name] )) || {};
      return {
        get: function(key) {
          return storage[key];
        },
        set: function(key, val) {
          storage[key] = val;
          window.localStorage[name] = JSON.stringify(storage);
        }
      };
    };
  }])
  .directive('jogDepth', ['RdpTable', 'LocalStorage', function(RdpTable, LocalStorage) {
    // Runs during compile
    return {
      scope: {
        depthIndex: '=jogDepth',
        jogMax: '=jogMax'
      },
      link: function($scope, iElm) {
        var lastpos,
            angle = LocalStorage('jogDepth').get('angle') || 0;
        var dial = JogDial(iElm[0], { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: angle });

        dial.on("mousemove", function(event) {
          var newAngle = event.target.rotation;
          LocalStorage('jogDepth').set('angle', newAngle);
          whenChanged(newAngle, $scope.jogMax, function(val) {
            $scope.$apply(function() { $scope.depthIndex = val; });
          });
        });

        var whenChanged = function(angle, max, changedCb) {
          var pos = Math.floor((angle / 360 ) * max);
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };
        whenChanged(angle, $scope.jogMax, function(val) { $scope.depthIndex = val; });
      }
    };
  }])
  .directive('jogTime', ['RdpTable', 'LocalStorage', function(RdpTable, LocalStorage) {
    // Runs during compile
    return {
      scope: {
        timeIndex: '=jogTime',
        depthIndex: '=depthIndex',
        jogMax: '=jogMax',
      }, // {} = isolate, true = child, false/undefined = no change
      link: function($scope, iElm) {
        var lastpos,
            angle = LocalStorage('jogTime').get('angle') || 0;
        var dial = JogDial(iElm[0], { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: angle });

        dial.on("mousemove", function(event) {
          var newAngle = event.target.rotation;
          LocalStorage('jogTime').set('angle', newAngle);
          whenChanged(newAngle, $scope.jogMax, function(val) {
            $scope.$apply(function() { $scope.timeIndex = val; });
          });
        });

        var whenChanged = function(angle, max, changedCb) {
          var pos = Math.floor((angle / 360 ) * max);
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };

        $scope.$watch('jogMax', function(max) {
          whenChanged(angle, $scope.jogMax, function(val) { $scope.timeIndex = val; });
        });
      }
    };
  }])
  .directive('addMetrics', ['Settings', function(Settings) {
    return function($scope, iElm) {
        iElm.addClass('metric').removeClass('ft');
        // iElm.addClass('ft').removeClass('metric');
    };
  }])
  .directive('eventDisable', [function() {
    return function($scope, iElm) {
      iElm.on('touchstart', function(event) {
        event.stopPropagation();
      });
    };
  }])
  .service('rdpdata', ['RdpTable', 'Settings', function(RdpTable, Settings) {
    return {
      depth: 10,
      time: 10,
      surface: 0

    };
  }])
  .controller('settings', ['$scope', 'LocalStorage', function($scope, LocalStorage) {
    var settings = new LocalStorage('settings').get('data');
    $scope.form = angular.extend({}, { metric: true }, settings);

    $scope.save = function() {
      new LocalStorage('settings').set('data', $scope.form);
    };
  }])
  .controller('rdp', ['$scope', 'rdpdata', 'RdpTable', function($scope, rdpdata, RdpTable) {
    $scope.data = rdpdata;
    $scope.RdpTable = RdpTable;
    $scope.group = {
      mins: []
    };

    $scope.$watch('data.depthIndex', function(v) {
      if (!angular.isDefined(v)) return;
       // console.log('data.depthIndex', v);
       $scope.group = RdpTable[v];
       $scope.data.depth = $scope.group.depth;
    });

    $scope.$watch('data.timeIndex', function(v) {
      if (!angular.isDefined(v)) return;
      // console.log('$scope.timeIndex', v);
      $scope.data.time = $scope.group.mins[v];
      $scope.data.group = String.fromCharCode(97 + v);
      $scope.data.decolimit = v === $scope.group.mins.length - 1;
      $scope.data.safestop = $scope.group.safe_stops.indexOf($scope.data.time) !== -1;
    });

  }]);
}());