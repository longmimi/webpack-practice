
    (function(modules){
        function require(id){
          const [fn,mapping] = modules[id];

          function localRequire(relativePath){
             return require(mapping[relativePath]);
          }

          const module = {
            exports: {}
          }

          fn(localRequire,module,module.exports);

          return module.exports;
        }

        require(0);
    })({
      0:[
        function(require, module, exports){
          "use strict";

var _info = require("./info.js");

(0, _info.logInfo)('longtean');
        },
        {"./info.js":1}
      ],
    
      1:[
        function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logInfo = logInfo;

var _demo = _interopRequireDefault(require("./demo.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// let Ar = [1,2,3]
// Ar.findIndex((v,i)=>{
//   console.log(v)
// })=
function logInfo(val) {
  (0, _demo["default"])(val);
}
        },
        {"./demo.js":2}
      ],
    
      2:[
        function(require, module, exports){
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _console;

function _console(val) {
  console.log('val:', val);
}
        },
        {}
      ],
    })
  