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
        templateUrl: "templates/tabs.html"
      })
      .state('tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/home.html",
            controller: 'rdp'
          }
        }
      })
      .state('tabs.about', {
        url: "/about",
        views: {
          'about-tab': {
            templateUrl: "templates/about.html"
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
        depth: '=jogDepth'
      },
      link: function($scope, iElm) {
        var whenChanged = function(angle, max, changedCb) {
          var pos = Math.floor((angle / 360 ) * max);
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };

        var findVal = function(pos) {
          var e = RdpTable[pos];
          return (e) ? e.depth : 0;
        };

        var lastpos = 0;
        var angle = LocalStorage('jogDepth').get('angle') || 0;
        var dial = JogDial(iElm[0], { wheelSize:'200px', knobSize:'70px', minDegree:0, maxDegree:360, degreeStartAt: angle });

        dial.on("mousemove", function(event) {
          var newAngle = event.target.rotation;
          LocalStorage('jogDepth').set('angle', newAngle);
          whenChanged(newAngle, RdpTable.length, function(val) {
            $scope.$apply(function() { $scope.depth = findVal(val); });
          });
        });

        whenChanged(angle, RdpTable.length, function(val) { $scope.depth = findVal(val); });
      }
    };
  }])
  .directive('jogTime', ['RdpTable', 'LocalStorage', function(RdpTable, LocalStorage) {
    // Runs during compile
    return {
      scope: {
        time: '=jogTime',
        depth: '@depth'
      }, // {} = isolate, true = child, false/undefined = no change
      link: function($scope, iElm) {
        var whenChanged = function(angle, max, changedCb) {
          var pos = Math.floor((angle / 360 ) * max);
          if (pos === lastpos) return;
          lastpos = pos;
          changedCb(pos);
        };

        var findVal = function(pos) {
          var e = RdpTable[pos];
          return (e) ? e.depth : 0;
        };

        var lastpos = 0;
        var angle = LocalStorage('jogTime').get('angle') || 0;
        var rdp = RdpTable.filter(function(v) { return $scope.depth == v.depth; })[0];
        var dial = JogDial(iElm[0], { wheelSize:'200px', knobSize:'70px', minDegree:0, maxDegree:360, degreeStartAt: angle });

        dial.on("mousemove", function(event) {
          var newAngle = event.target.rotation;
          LocalStorage('jogTime').set('angle', newAngle);

          whenChanged(newAngle, rdp.mins.length, function(val) {
            $scope.$apply(function() {
              $scope.time = rdp.mins[val];
            });
            // console.log(val, rdp.mins[val]);
            // $scope.$apply(function() { $scope.depth = findVal(val); });
          });
        });

        $scope.$watch('depth', function(v) {
          LocalStorage('jogTime').set('angle', 0);
          dial.angle(0);

          
          // whenChanged(0, 0, angular.noop);
        });

        whenChanged(angle, rdp.mins.length, function(val) { $scope.time = rdp.mins[val]; });



        // var angle = LocalStorage('jogTime').get('angle') || 0;
        // var lastPos = 0;
        // var dial = JogDial(iElm[0], { wheelSize:'200px', knobSize:'70px', minDegree:0, maxDegree:360, degreeStartAt: 0 });

        // var turnDaKnob = function(angle, apply) {
        //   LocalStorage('jogTime').set('angle', angle);
        //   var rdp = RdpTable.filter(function(v) { return $scope.depth == v.depth; })[0];
        //   // console.log(rdp.mins);
        //   var pos = Math.floor( Math.floor(angle) / (360 / rdp.mins.length) );
        //   // console.log(pos, $scope.depth);
        //   if (pos === lastPos) return;
        //   lastPos = pos;
        //   var e = rdp.mins[pos];
        //   if (!e) return;
        //   if (apply) {
        //     $scope.$apply(function() {
        //       $scope.time = e;
        //     });
        //   }
        //   else {
        //     $scope.time = e;
        //     dial.angle(angle);
        //   }
        // };

        // // turnDaKnob(angle);
        
        // dial.on("mousemove", function(event) {
        //   turnDaKnob(event.target.rotation, true);
        // });

        // $scope.$watch('depth', function(v) {
        //   console.log('depth', v);
        // });

      }
    };
  }])
  // .directive('jogSurface', ['RdpSurface', function(RdpSurface){
  //   // Runs during compile
  //   return {
  //     scope: {
  //       group: '@jogGroup',
  //       surface: '=jogSurface'
  //     }, // {} = isolate, true = child, false/undefined = no change
  //     link: function($scope, iElm, iAttrs, controller) {
  //       $scope.$watch('group', function(v) {
  //         console.log('group', v);
  //       });
  //       var dial = JogDial(iElm[0], { wheelSize:'200px', knobSize:'70px', minDegree:0, maxDegree:360, degreeStartAt: 0 });
  //       dial.on("mousemove", function(event) {
  //         $scope.$apply(function() {
  //           $scope.surface = Math.floor(event.target.rotation);
  //         });

  //         // var rdp = RdpTable.filter(function(v) { return $scope.depth == v.depth; })[0];
  //         // // console.log(rdp.mins);
  //         // var pos = Math.floor( Math.floor(event.target.rotation) / (360 / rdp.mins.length) );
  //         // // console.log(pos, $scope.depth);
  //         // if (pos === lastPos) return;
  //         // lastPos = pos;
  //         // var e = rdp.mins[pos];
  //         // if (!e) return;
  //         // // $scope.$apply(function() {
  //         // //   $scope.time = e;
  //         // // });
  //       });

  //     }
  //   };
  // }])
  .directive('addMetrics', ['Settings', function(Settings) {
    return function($scope, iElm) {
        iElm.addClass('metric').removeClass('ft');
        // iElm.addClass('ft').removeClass('metric');
    };
  }])
  .directive('eventDisable', [function() {
    return function($scope, iElm, iAttrs, controller) {
      iElm.on('touchstart', function(event) {
        event.stopPropagation();
      });
    };
  }])
  // .directive('evts', ['$ionicGesture', function($ionicGesture) {
  //   // Runs during compile
  //   return {
  //     // name: '',
  //     // priority: 1,
  //     // terminal: true,
  //     // scope: {}, // {} = isolate, true = child, false/undefined = no change
  //     // controller: function($scope, $element, $attrs, $transclude) {},
  //     // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
  //     // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
  //     // template: '',
  //     // templateUrl: '',
  //     // replace: true,
  //     // transclude: true,
  //     // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
  //     link: function($scope, $element, $attrs) {
  //       $element.on('drag', function() {
  //         console.log('tock');

  //       });
  //       // console.log($element);
  //       // $element.off('touchstart touchend touchmove')
  //       // $ionicGesture.on('touch', function(e) {
  //       //   e.cancelBubble = true;
  //       //   e.preventDefault();
  //       //   console.log('tock', e);
  //       //   // $scope.$apply($attrs[ngName]);
  //       // }, $element);
  //     }
  //   };
  // }])
  .service('rdpdata', ['RdpTable', 'Settings', function(RdpTable, Settings) {
    return {
      depth: 10,
      time: 10,
      surface: 0
      
    };
  }])
  .controller('rdp', ['$scope', 'rdpdata', 'RdpTable', function($scope, rdpdata, RdpTable) {
    $scope.data = rdpdata;

    // $scope.depth = 10;
    // $scope.time = 10;
    // $scope.safestop = false;

    // $scope.metric = Settings.metrics[0].text;

    $scope.$watch('data.time', function(v) {
       findGroup();
    });

    // console.log($scope)
    var findGroup = function() {
      var rdp = RdpTable.filter(function(v) { return $scope.data.depth == v.depth; })[0];
      if (!rdp) return;
      for (var i = 0; i <= rdp.mins.length; i++) {
        if ($scope.data.time == rdp.mins[i]) {
          var group = String.fromCharCode(97 + i);
          $scope.data.group = group;
          if (i === rdp.mins.length-1) {
            $scope.data.safestop = false;
            $scope.data.decolimit = true;
          }
          else {
            $scope.data.safestop = rdp.safe_stops.indexOf($scope.data.time) !== -1;
            $scope.data.decolimit = false;
          }
          return;
        }
      }
    };

  }]);
}());