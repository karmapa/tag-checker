#tag-checker
tag-checker

##目的:
確保經文倒進資料庫不會出錯
##用法:
###1.本地端
```
npm i
```
直接把要檢查的經文repository clone 到 tag-checker 資料夾
```
node index.js repository的名字
```
tag有錯會在命令列顯示錯誤訊息
###2.travis
在要檢查的經文repository的package.json檔加入以下資料即可
```
"scripts": {
  "test": "node node_modules/tag-checker/index.js `basename $(git rev-parse --show-toplevel)`"
},
"dependencies": {
  "tag-checker": "0.0.32"
}
```
