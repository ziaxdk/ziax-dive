angular.module('ziaxdiveApp', ['ionic'])

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
.directive('jogDepth', ['RdpTable', function(RdpTable){
  // Runs during compile
  return {
    scope: {
      depth: '=jogDepth'
    }, // {} = isolate, true = child, false/undefined = no change
    link: function($scope, iElm, iAttrs, controller) {
      var lastPos = 0;
      var dial = JogDial(iElm[0], { debug: true });
      
      dial.on("mousemove", function(event) {
        var pos = Math.floor( Math.floor(event.target.rotation) / (360 / RdpTable.length) );
        if (pos === lastPos) return;
        lastPos = pos;
        var e = RdpTable[pos];
        if (!e) return;
        $scope.$apply(function() {
          $scope.depth = e.depth;
        });
      });
    }
  };
}])
.directive('jogTime', ['RdpTable', function(RdpTable){
  // Runs during compile
  return {
    scope: {
      time: '=jogTime',
      depth: '@depth'
    }, // {} = isolate, true = child, false/undefined = no change
    link: function($scope, iElm, iAttrs, controller) {
      var lastPos = 0;
      var dial = JogDial(iElm[0], { debug: true });
      
      dial.on("mousemove", function(event) {
        var rdp = RdpTable.filter(function(v) { return $scope.depth == v.depth; })[0];
        // console.log(rdp.mins);
        var pos = Math.floor( Math.floor(event.target.rotation) / (360 / rdp.mins.length) );
        // console.log(pos, $scope.depth);
        if (pos === lastPos) return;
        lastPos = pos;
        var e = rdp.mins[pos];
        if (!e) return;
        $scope.$apply(function() {
          $scope.time = e;
        });
      });

    }
  };
}])
.controller('rdp', ['$scope', 'RdpTable', function($scope, RdpTable) {
  $scope.myTitle = 'RDP';

  $scope.depth = 10;
  $scope.time = 10;
  $scope.safestop = false;

  var findGroup = function() {
    var rdp = RdpTable.filter(function(v) { return $scope.depth == v.depth; })[0];
    for (var i = 0; i <= rdp.mins.length; i++) {
      if ($scope.time == rdp.mins[i]) {
        $scope.group = String.fromCharCode(97 + i);
        if (i === rdp.mins.length-1) {
          $scope.safestop = false;
          $scope.decolimit = true;
        }
        else {
          $scope.safestop = rdp.safe_stops.indexOf($scope.time) !== -1;
          $scope.decolimit = false;
        }
        return;
      }
    }
  };
  $scope.$watch('depth', function(v) {
     findGroup();
  });
  $scope.$watch('time', function(v) {
     findGroup();
  });
  
}]);