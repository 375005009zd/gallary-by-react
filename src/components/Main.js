require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
let imageDatas = require('../data/imagedata.json');

//利用自执行函数,将图片名信息转成图片URL路径信息
 imageDatas = (function getImageUrl(imageDatasArr) {

	for(let i=0;i<imageDatasArr.length; i++) {
		let singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low,high){
	return Math.ceil(Math.random()*(high - low) + low);
}

//获取0~30deg的正负角度
function get30DegRandom(){
     return ((Math.random() > 0.5)? '+' : '-') + Math.ceil(Math.random()*30);
}

class ImgFigure extends React.Component {

    //imgFigure的点击处理函数
    handleClick(e) {
       this.props.inverse();

      e.stopPropagation();
      e.preventDefault();
    }

	render() {
		let styleObj = {};
  
        //如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

        //如果props属性中指定了这张图片的旋转位置，则使用
		if(this.props.arrange.rotate){
			['Moz','ms','webkit'].forEach(function(value){
			    styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));

		}

        let imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse? ' is-inverse': '';
 
		return (
           <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
             <img src={this.props.data.imageURL} alt={this.props.data.title}/>
             <figcaption className="img-title">
             	<h2>{this.props.data.title}</h2>
             	 <div className="img-back" onClick={this.handleClick}>
             	 	<p>
             	 		{this.props.data.desc}
             	 	</p>
             	 </div>
             </figcaption>
           </figure>
			);
	}
}

class AppComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
      	imgsArrangeArr: [
      		/*{
      			pos: {
      				left : '0'.
      				right: '0'
      			},
      			rotate: 0,
      			isInverse: false //图片正反面
      		}*/
      	]
      }

      this.areaPos = {
      	centerPos: {
           left:0,
           right:0
      	},
      	hPosRange: {
      		leftSecX: [0,0],
      		rightSecX: [0,0],
      		y: [0,0]
      	},
      	vPosRange: {
      		x:[0,0],
      		topY: [0,0]
      	}
      }
  }

  /*
  *  翻转图片
  *  @param index 输入当前被执行inverse操作的图片信息数组的index值
  *  @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
  */
  inverse(index) {
     return function(){
        let imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
        	imgsArrangeArr: imgsArrangeArr
        });
     }.bind(this);
  }


  componentDidMount() {

  	//拿到舞台的大小
  	let stageW = document.body.scrollWidth;
  	let stageH = document.body.scrollHeight;

    let halfStageW = Math.ceil(stageW/2);
    let halfStageH = Math.ceil(stageH/2);
   
    //拿到imageFigure
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW/2);
    let halfImgH = Math.ceil(imgH/2);


    this.areaPos.centerPos={
    	left:halfStageW-halfImgW,
    	top:halfStageH - halfImgH
    }

    //计算左侧右侧区域图片排布位置的取值范围
    this.areaPos.hPosRange.leftSecX[0] = -halfImgW;
    this.areaPos.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.areaPos.hPosRange.rightSecX[0] = halfStageW +  halfStageW;
    this.areaPos.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.areaPos.hPosRange.y[0] = -halfImgH;
    this.areaPos.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片的排布位置的
    this.areaPos.vPosRange.topY[0] = -halfImgH;
    this.areaPos.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.areaPos.vPosRange.x[0] = halfStageW - imgW;
    this.areaPos.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

 //重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        areaPos = this.areaPos,
        centerPos = areaPos.centerPos,
        hPosRange = areaPos.hPosRange,
        vPosRange = areaPos.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.random()*2,  //取一个或者不取

        topImgSpliceIndex = 0,
        
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0].pos = centerPos;

       //取出要布局上侧的图片的状态信息
       topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
       imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

       //布局位于上侧的图片
       imgsArrangeTopArr.forEach(function(value,index){
         imgsArrangeTopArr[index] = {
         	pos : {
         	   top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
         	   left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom()
        }

       });

       //布局左右两侧的图片
       for(let i=0,j = imgsArrangeArr.length,k = j/2; i<j; i++){
              let hPosRangeLORX = null;

              //前半部分布局左边,右半部分布局右边
              if(i<k) {
              	hPosRangeLORX = hPosRangeLeftSecX;
              }else {
              	hPosRangeLORX = hPosRangeRightSecX;
              }

              imgsArrangeArr[i] = {
              	pos :{
	              	top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
	              	left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
	                },
	            rotate:get30DegRandom()
              }
       }

       if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
       	imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
       }

       imgsArrangeArr.splice(centerIndex, 0 ,imgsArrangeCenterArr[0]);

       this.setState({
       	imgsArrangeArr: imgsArrangeArr
       });

  }

  render() {

    let controllerUnits = [];
    let imgFigures = [];

    imageDatas.forEach(function(value,index){

    	if(!this.state.imgsArrangeArr[index]){
              this.state.imgsArrangeArr[index] = {
              	pos: {
              		left : 0,
              		right : 0
              	},
              	rotate: 0,
              	isInverse: false
              }
    	}
    	imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
    }.bind(this));

    return (
      <section className = "stage">
        <section className = "img-sec">
        {imgFigures}
        </section>
        <nav className="controller-nav">
        {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;