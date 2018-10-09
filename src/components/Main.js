require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class ImgFigure extends React.Component {
	render() {
		return (
           <figure className="img-figure">
             <img src={this.props.data.imageURL} alt={this.props.data.title}/>
             <figcaption className="img-title">
             	<h2>{this.props.data.title}</h2>
             </figcaption>
           </figure>
			);
	}
}

class AppComponent extends React.Component {
  render() {

    let controllerUnits = [];
    let imgFigures = [];

    imageDatas.forEach(function(value,index){
    	imgFigures.push(<ImgFigure data={value} key={index}/>);
    })

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