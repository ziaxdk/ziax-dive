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
    { depth: 12, mins: [9, 17, 23, 26, 29, 32, 35, 38, 42, 45, 49, 53, 57, 62, 66, 71, 76, 82, 88, 94, 101, 108, 116, 125, 134],          safe_stops: [ 108, 116, 125 ] },
    { depth: 14, mins: [8, 15, 19, 22, 24, 27, 29, 32, 35, 37, 40, 43, 47, 50, 53, 57, 61, 64, 68, 73, 77, 82, 87, 92, 98],               safe_stops: [ 82, 87, 92 ] },
    { depth: 16, mins: [7, 13, 17, 19, 21, 23, 25, 27, 29, 32, 34, 37, 39, 42, 45, 48, 50, 53, 56, 60, 63, 67, 70, 72],                   safe_stops: [ 63, 67, 70 ] },
    { depth: 18, mins: [6, 11, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 41, 43, 46, 48, 51, 53, 55, 56],                       safe_stops: [ 51, 53, 55 ] },
    { depth: 20, mins: [6, 10, 13, 15, 16, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 45],                               safe_stops: [ 40, 42, 44 ] },
    { depth: 22, mins: [5, 9, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 29, 30, 32, 34, 36, 37],                                        safe_stops: [ 32, 34, 36 ] },
    { depth: 25, mins: [4, 8, 10, 11, 13, 14, 15, 17, 18, 19, 21, 23, 23, 25, 26, 28, 29],                                                safe_stops: [ 25, 26, 28 ] }
  ])
  // {depth: , RNT: , MABT: }
  .constant('RdpSurface', [
    { group: 'A', times: [ 0, 3*60-1 ] },
    { group: 'B', times: [ 47, 3*60+47 ] },
    { group: 'C', times: [ 21, 1*60+9, 4*60+9 ] },
    { group: 'D', times: [ 8, 30, 1*60+18, 4*60+18] },
    { group: 'E', times: [ 7, 16, 38, 1*60+27, 4*60+27 ] },
    { group: 'F', times: [ 7, 15, 24, 46, 1*60+34, 4*60+34] },
    { group: 'G', times: [ 6, 13, 22, 31, 53, 1*60+41, 4*60+41 ]} ,
    { group: 'H', times: [ 5, 12, 20, 28, 37, 59, 1*60+47, 4*60+47] },
    { group: 'I', times: [ 5, 11, 18, 26, 34, 43, 1*60+5, 1*60+53, 4*60+53 ] },
    { group: 'J', times: [ 5, 11, 17, 24, 31, 40, 59, 1*60+11, 2*60-1, 5*60-1 ] },
    { group: 'K', times: [ 4, 10, 16, 22, 29, 37, 45, 54, 1*60+16, 2*60+4, 5*60+4 ] },
    { group: 'L', times: [ 4, 9, 15, 21, 27, 34, 42, 50, 59, 1*60+21, 2*60+9, 5*60+18 ] },
    { group: 'M', times: [ 4, 9, 14, 19, 25, 32, 39, 46, 55, 1*60+4, 1*60+25, 2*60+14, 5*60+14 ] },
    { group: 'N', times: [ 3, 8, 13, 18, 24, 30, 36, 43, 51, 59, 1*60+8, 1*60+30, 2*60+18, 5*60+19 ] },
    { group: 'O', times: [ 3, 8, 12, 17, 23, 28, 34, 41, 47, 55, 1*60+3, 1*60+12, 1*60+34, 2*60+23, 5*60+23 ] },
    { group: 'P', times: [ 3, 7, 12, 16, 21, 27, 32, 38, 45, 51, 59, 1*60+7, 1*60+16, 1*60+38, 2*60+27, 5*60+27 ] },
    { group: 'Q', times: [ 3, 7, 11, 16, 20, 25, 30, 36, 42, 48, 55, 1*60+3, 1*60+11, 1*60+20, 1*60+42, 2*60+30, 5*60+30 ] },
    { group: 'R', times: [ 3, 7, 11, 15, 19, 24, 29, 34, 40, 46, 52, 59, 1*60+7, 1*60+15, 1*60+24, 1*60+46, 2*60+34, 5*60+35 ] },
    { group: 'S', times: [ 3, 6, 10, 14, 18, 23, 27, 32, 38, 43, 49, 56, 1*60+3, 1*60+10, 1*60+18, 1*60+27, 1*60+49, 2*60+38, 6*50+38 ] },
    { group: 'T', times: [ 2, 6, 10, 13, 15, 22, 26, 31, 36, 41, 47, 53, 59, 1*60+6, 1*60+13, 1*60+22, 1*60+31, 1*60+53, 2*60+41, 5*60+41 ] },
    { group: 'U', times: [ 2, 6, 9, 13, 17, 21, 25, 29, 34, 39, 44, 50, 56, 1*60+2, 1*60+9, 1*60+17, 1*60+25, 1*60+34, 1*60+56, 2*60+44, 5*60+44 ] },
    { group: 'V', times: [ 2, 6, 9, 12, 16, 20, 24, 28, 33, 37, 42, 47, 53, 59, 1*60+5, 1*60+12, 1*60+20, 1*60+28, 1*60+37, 2*60-1, 2*60+47, 5*60+47 ] },
    { group: 'W', times: [ 2, 5, 8, 12, 15, 19, 23, 27, 31, 36, 40, 45, 50, 56, 1*60+2, 1*60+8, 1*60+15, 1*60+23, 1*60+31, 1*60+40, 2*60+2, 2*60+50, 5*60+50 ] },
    { group: 'X', times: [ 2, 5, 8, 11, 15, 18, 22, 26, 30, 34, 39, 43, 48, 53, 59, 1*60+5, 1*60+11, 1*60+18, 1*60+26, 1*60+34, 1*60+43, 2*60+5, 2*60+53, 5*60+53 ] },
    { group: 'Y', times: [ 2, 5, 8, 11, 14, 18, 21, 25, 29, 33, 37, 41, 51, 56, 1*60+2, 1*60+8, 1*60+14, 1*60+21, 1*60+29, 1*60+37, 1*60+46, 2*60+8, 2*60+56, 5*60+56 ] },
    { group: 'Z', times: [ 2, 5, 8, 11, 14, 17, 20, 24, 28, 31, 35, 40, 44, 49, 54, 59, 1*60+5, 1*60+11, 1*60+17, 1*60+24, 1*60+31, 1*60+40, 1*60+49, 2*60+11, 3*60-1, 6*60-1 ], repeat: [{depth: 10, RNT: 219}, {depth: 12, RNT: 147}] }
  ])
  .constant('RdpRepeat', [
    {},
    {},
    {},
    { group: 'D', depths: [{depth: 10, RNT: 30, MABT: 189}, {depth: 12, RNT: 26, MABT: 121 }, {depth: 14, RNT: 22, MABT: 76}, {depth: 16, RNT: 19, MABT: 53}, {depth: 18, RNT: 16, MABT: 40}, {depth: 20, RNT: 15, MABT: 30}, {depth: 22, RNT: 13, MABT: 24}, {depth: 25, RNT: 11, MABT: 18}, {depth: 30, RNT: 9, MABT: 11}, {depth: 35, RNT: 8, MABT: 6}, {depth: 40, RNT: 7}] }
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
  .directive('jog', [function(){
    // Runs during compile
    return {
      name: 'theJog',
      // priority: 1,
      // terminal: true,
      scope: {
        index: '=jog',
        max: '=jogMax',
        storageName: '@jogStorage'
      }, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      // templateUrl: '',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
        var lastpos,
            storage = angular.isDefined($scope.storageName) ? ((window.localStorage[$scope.storageName] && JSON.parse( window.localStorage[$scope.storageName] )) || {}) : null,
            dial = JogDial(iElm[0], { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: angular.isObject(storage) ? storage.angle || 0 : 0 });

        var getIndex = function(angle, changedCb) {
          // LocalStorage('jogDepth').set('angle', newAngle);
          if (angular.isObject(storage)) {
            storage.angle = angle;
            window.localStorage[$scope.storageName] = JSON.stringify(storage);
          }
          var pos = Math.floor((angle / 360 ) * (angular.isNumber($scope.max) ? $scope.max : 360));
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };
        dial.on("mousemove", function(event) {
          getIndex(event.target.rotation, function(pos) {
            $scope.$apply(function() { $scope.index = pos; });
          });
        });
        if (storage && storage.angle)
          getIndex(storage.angle, function(pos) { $scope.index = pos; });
      }
    };
  }])
  .directive('jogSurface', ['LocalStorage', function(LocalStorage) {
    // Runs during compile
    return {
      scope: {
        surfaceIndex: '=jogSurface',
        jogMax: '=jogMax'
      },
      link: function($scope, iElm) {
        var lastpos,
            angle = LocalStorage('jogSurface').get('angle') || 0;
        var dial = JogDial(iElm[0], { wheelSize: '200px', knobSize: '70px', minDegree: 0, maxDegree: 360, degreeStartAt: angle });

        dial.on("mousemove", function(event) {
          var newAngle = event.target.rotation;
          LocalStorage('jogSurface').set('angle', newAngle);
          whenChanged(newAngle, $scope.jogMax, function(val) {
            $scope.$apply(function() { $scope.surfaceIndex = val; });
          });
        });

        var whenChanged = function(angle, max, changedCb) {
          var pos = Math.floor((angle / 360 ) * max);
          // console.log('whenChanged', pos, lastpos, changedCb);
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };

        $scope.$watch('jogMax', function(max) {
          // console.log('jogSurface jogMax', $scope.jogMax);
          whenChanged(angle, $scope.jogMax, function(val) { $scope.surfaceIndex = val; });
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
    $scope.form = angular.extend({}, { metric: true, cold: false }, settings);

    $scope.$watch('form', function(v) {
      new LocalStorage('settings').set('data', $scope.form);
    }, true);

    // $scope.save = function() {
    //   new LocalStorage('settings').set('data', $scope.form);
    // };
  }])
  .controller('rdp', ['$scope', 'rdpdata', 'RdpTable', 'RdpSurface', 'RdpRepeat', function($scope, rdpdata, RdpTable, RdpSurface, RdpRepeat) {
    $scope.log = [];
    $scope.previousDives = [];
    // $scope.previousDives = [{ depth: 14, bottomTime: 50, surfaceTime: 108, newGroupIndex: 3 }];
    $scope.previousDives.push({ depth: 14, bottomTime: 50, surfaceTime: 108, newGroupIndex: 3, newGroup: 'd' });

    // $scope.previousDive = RdpRepeat[3];
    $scope.previousDive = { group: null };

    $scope.data = rdpdata;

    $scope.RdpTable = RdpTable;
    $scope.RdpSurface = {
      times: []
    };
    $scope.group = {
      mins: []
    };

    var isRepeatedDive = $scope.isRepeatedDive = function() {
      return $scope.previousDive.group !== null;
    };

    var isRepeat = $scope.isRepeat = function() {
      return $scope.previousDives && $scope.previousDives.length !== 0;
    };

    $scope.$watchCollection('previousDives', function(col) {
      if (!angular.isArray(col) && col.length === 0) return;
      $scope.lastDive = col.slice(-1)[0];
    });


    $scope.$watch('data.depthIndex', function(v) {
      if (!angular.isDefined(v)) return;
       // console.log('data.depthIndex', v);
       $scope.group = RdpTable[v];
       $scope.data.depth = $scope.group.depth;

       // Repeat
       // if (!isRepeatedDive()) return;
       // $scope.previousDive.RNT  = $scope.previousDive.depths[v].RNT;
       // $scope.previousDive.MABT = $scope.previousDive.depths[v].MABT;
       // if (!isRepeat()) return;
       // var rnt = $scope.group.mins[ $scope.previousDives.slice(-1)[0].newGroupIndex ],
       //     andl = $scope.group.mins.slice(-1)[0] - rnt;
       // console.log('RNT', rnt);
       // console.log('ANDL', andl);
    });

    $scope.$watch('data.timeIndex', function(v) {
      if (!angular.isDefined(v)) return;
      // console.log('$scope.timeIndex', v);
      $scope.data.time = $scope.group.mins[v];


      if (isRepeat()) {
        for (var i = 0; i < $scope.group.mins.length; i++) {
          if ($scope.group.mins[i] > $scope.data.time+$scope.group.mins[ $scope.lastDive.newGroupIndex ]){
            // console.log('NEW GROUP', String.fromCharCode(97 + i));
            $scope.data.group = String.fromCharCode(97 + i);
            $scope.data.decolimit = $scope.data.time + $scope.group.mins[ $scope.lastDive.newGroupIndex ] > $scope.group.mins.slice(-1)[0] - $scope.group.mins[ $scope.lastDive.newGroupIndex ];
            $scope.RdpSurface = RdpSurface[i];
            return;
          }
        };

      }
      $scope.data.group = String.fromCharCode(97 + v);
      $scope.data.decolimit = v === $scope.group.mins.length - 1;
      $scope.data.safestop = $scope.group.safe_stops.indexOf($scope.data.time) !== -1;

      $scope.RdpSurface = RdpSurface[v];
      // console.log('setting RdpSurface in data.timeIndex', $scope.RdpSurface);
    });

    $scope.$watch('data.surfaceIndex', function(v) {
      if (!angular.isDefined(v)) return;
      $scope.data.surface = $scope.RdpSurface.times[v];

      $scope.data.newGroupIndex = $scope.RdpSurface.times.length -1 - v;
      $scope.data.newGroup = String.fromCharCode(97 + $scope.data.newGroupIndex);
      $scope.data.surfaceMax = $scope.data.surface;
      $scope.data.surfaceMin = (--v === -1) ? 0 : $scope.RdpSurface.times[v] + 1;
    });

    // Repeat dive

    $scope.use = function() {
      var d = $scope.data;
      $scope.previousDives.push({ depth: d.depth, bottomTime: d.time, surfaceTime: d.surface, newGroupIndex: d.newGroupIndex, newGroup: d.newGroup });

      // $scope.log.push({ depth: d.depth, bottomTime: d.time, surfaceTime: d.surface });
      // // // console.log('use', $scope.log);
      // // // $scope.previousDive = RdpRepeat[$scope.data.newGroupIndex];
      // $scope.previousGroupIndex = d.newGroupIndex;
    };

  }]);
}());