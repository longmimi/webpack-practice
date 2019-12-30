const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const path = require('path')

let ID = 0

function createAsset(filename) {
  const content = fs.readFileSync(filename,'utf-8')

  //利用@babel/parser 将代码转成AST  也可以用babylon（babylon现在已经合并入@babel/parser）
  const AST = parser.parse(content,{
    sourceType:'module'
  })

  //处理依赖的数组
  const dependencies = []

  traverse(AST,{
    ImportDeclaration:({node}) => {
      dependencies.push(node.source.value)
    }
  })

  const {code:transformedCode} = babel.transformFromAstSync(AST,null,{
    presets:['@babel/preset-env'],
    // plugins:[ ]
  })

  let id = ID++

  // console.log(transformedCode.code)

  return {
    id,filename,transformedCode,dependencies
  }
}

function createGraph(entry) {
  const mainAsset = createAsset('./src/index.js')
  const queue = [mainAsset]

  for(const asset of queue){
    const dirname = path.dirname(asset.filename)
    asset.mapping = {}
    asset.dependencies.forEach(relativePath => {
       const absolutePath = path.join(dirname,relativePath)
       const child = createAsset(absolutePath)
       asset.mapping[relativePath] = child.id
       queue.push(child)
    })
  }
  // console.log('queue :\n',queue)
  return queue
}

function bundle(garph) {
  let modules = ''

  garph.forEach(mod =>{
    modules +=  `
      ${mod.id}:[
        function(require, module, exports){
          ${mod.transformedCode}
        },
        ${JSON.stringify(mod.mapping)}
      ],
    `
  })

  const result = `
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
    })({${modules}})
  `
  return result
}

const garph = createGraph('./src/index.js')

const result = bundle(garph)
 
if(!fs.existsSync('./dist')){
  fs.mkdirSync('./dist')
}
fs.writeFileSync('./dist/bundle.js', result)

