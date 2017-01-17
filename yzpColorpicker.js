var yzpColorpicker=angular.module("app",[])
.directive("yzpColorpicker",function(){
  return{
    scope:{
      label:'@',
      yzpValue:'@'
    },
    template:'<div class="yzpColorpicker"><label>{{label}}</label><button ng-click=showColorbox()>{{yzpValue}}&nbsp;<i class="icon-th-large icon-large" style="color:{{yzpValue}}"></i></button><yzp-colorbox yzp-id="canvas" yzp-value="yzpValue" is-show=isShow></yzp-colorbox></div>',
    link:function(scope){
      scope.showColorbox=function(){
        scope.isShow=true;
      }
    }
  }
})
.directive("yzpColorbox",function($timeout,$filter){
  return{
    scope:{
      yzpValue:'=',
      yzpId:'@',
      isShow:'='
    },
    replace:true,
    template:'<div class="masking"  ng-show="isShow"><div class="yzpColorbox" ng-click="detectValue()"><canvas id="{{yzpId}}" width=600 height=500></canvas><br><label>R:</label><input ng-model=R type="number"><label>G:</label><input ng-model=G type="number"></input><label>B:</label><input ng-model=B type="number"></input><label>HEX:</label><input ng-model=yzpValue|getHEX:R:G:B></input><i style="float:left;margin-top:20px;color:rgb(100,200,200);font-weight:900;font-size:20px;">yzpUI</i><button ng-click="notShow()"><i class="icon-ok icon-large"></i></button></div><div>',
    link:function(scope){
      scope.notShow=function(){
        scope.isShow=false;
      }
      var colorBox;
      scope.$watch("yzpValue",function(){
        colorBox=null;
        scope.yzpValue=$filter("toRgb")(scope.yzpValue);
        scope.R=scope.yzpValue.match(/\d+/g)[0]/1;
        scope.G=scope.yzpValue.match(/\d+/g)[1]/1;
        scope.B=scope.yzpValue.match(/\d+/g)[2]/1;
        colorBox=new yzpChromatic(500,scope.yzpId,scope.yzpValue);
      })
      scope.detectValue=function(){
        scope.yzpValue=colorBox.colorBar.selectedColor.color;
      }
      scope.$watch("R",function(){
        scope.yzpValue="rgb("+(scope.R||0)+","+(scope.G||0)+","+(scope.B||0)+")";

      });
      scope.$watch("G",function(){
        scope.yzpValue="rgb("+(scope.R||0)+","+(scope.G||0)+","+(scope.B||0)+")";
      })
      scope.$watch("B",function(){
        scope.yzpValue="rgb("+(scope.R||0)+","+(scope.G||0)+","+(scope.B||0)+")";
      })

      function yzpChromatic(r,id,value){
        var colorSquare,colorBar,selectedColor;
        this.value=value;
        this.init=(function(This){
          This.colorBar=new colorBox(r,id,This.value);
        })(this);
        function colorBox(r,id,value){
          this.value=value;
          this.render=function(){
            colorSquare=new colorSquare(r,id);
            this.colorSquare=colorSquare;
            colorBar=new colorBar(canvas,this.value);
            this.colorBar=colorBar;
            selectedColor=new selectedColor(canvas,this.value);
            this.selectedColor=selectedColor;
          }
          this.init=(function(This){
            This.render();
          })(this)
        }
        function colorSquare(r,id){
          var canvas=document.getElementById(id);
          var context=canvas.getContext("2d");
          this.width=r;
          this.height=r;
          this.x=0;
          this.y=0;
          this.eventListener=function(){
            var This=this;
            canvas.addEventListener("mousemove",function(event) {
              if(publicMath.isOnelement(event,This.x,This.y,This.width,This.height)){
                canvas.style.cursor="crosshair";
              }else{
                canvas.style.cursor="auto";
              }
            });
            canvas.addEventListener("click",function(event){
              var eventCoord=publicMath.fixCompatibility(event);
              var x=eventCoord[0];
              var y=eventCoord[1];
              var colorData=context.getImageData(x,y,1,1).data;
              if(publicMath.isOnelement(event,This.x,This.y,This.width,This.height)){
                This.value="rgb("+colorData[0]+","+colorData[1]+","+colorData[2]+")";
                selectedColor.changeColor(This.value);
                colorBar.changeTone(This.value);
              }
            })
          };
          this.render=function(){
            context.beginPath();
            context.rect(this.x,this.y,this.width,this.height);
            var gradient=context.createLinearGradient(0,0,500,500);
            gradient.addColorStop(0,"rgb(255,100,100)");
            gradient.addColorStop(0.4,"rgb(100,100,255)");
            gradient.addColorStop(0.8,"rgb(100,255,100)");
            gradient.addColorStop(1,"rgb(255,100,100)");
            context.fillStyle=gradient;
            context.fill();
          }
          this.init=(function(This){
            This.render();
            This.eventListener();
          })(this);
        }

        function colorBar(canvas,value){
          var context=canvas.getContext("2d");
          this.width=50;
          this.height=450
          this.x=510;
          this.y=0;
          this.tone=value;
          this.render=function(){
            context.beginPath();
            context.rect(this.x,this.y,this.width,this.height);
            var gradient=context.createLinearGradient(this.x,this.y,this.x,this.y+this.height);
            gradient.addColorStop(0,"rgb(0,0,0)");
            gradient.addColorStop(0.5,this.tone);
            gradient.addColorStop(1,"rgb(255,255,255)");
            context.fillStyle=gradient;
            context.fill();
          };
          this.changeTone=function(color){
            this.tone=color;
            this.render();
          };
          this.eventListener=function(){
            var This=this;
            canvas.addEventListener("click",function(event){
              if(publicMath.isOnelement(event,This.x,This.y,This.width,This.height)){
                var eventCoord=publicMath.fixCompatibility(event);
                var x=eventCoord[0];
                var y=eventCoord[1];
                var colorData=context.getImageData(x,y,1,1).data;
                This.value="rgb("+colorData[0]+","+colorData[1]+","+colorData[2]+")";
                selectedColor.changeColor(This.value);
              }
            })
          }
          this.init=(function(This){
            This.render();
            This.eventListener();
          })(this)
        }
        function selectedColor(canvas,color){
          var context=canvas.getContext("2d");
          this.width=50;
          this.height=50
          this.x=510;
          this.y=450;
          this.color=color;
          this.render=function(){
            context.beginPath();
            context.rect(this.x,this.y,this.width,this.height);
            context.fillStyle=this.color;
            context.fill();
          };
          this.changeColor=function(color){
            this.color=color;
            this.render();
          };
          this.init=(function(This){
            This.render();
          })(this);
        }
      }

    }
  }
})
.filter("toRgb",function(){
  return function(input){
    if(input.match(/#/)){
      var R=parseInt(input.substr(1,2),16);
      var G=parseInt(input.substr(3,2),16);
      var B=parseInt(input.substr(5,2),16);

      return "rgb("+R+","+G+","+B+")";
    }else{
      return input;
    }
  }
})
.filter("getHEX",function(){
  return function(input,r,g,b){
    if(input.match(/rgb/)){
      var first=r.toString(16);
      var second=g.toString(16);
      var third=b.toString(16);
      return '#'+first+second+third;
    }
  }
})
