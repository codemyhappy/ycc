/**
 * @file    Ycc.PhotoManager.class.js
 * @author  xiaohei
 * @date    2017/9/30
 * @description		Ycc.PhotoManager.class文件。
 * 	Ycc实例的快照管理类
 *
 */



(function (Ycc){
	/**
	 * @typedef {Object} Ycc.PhotoManager.Photo
	 * @property {ImageData} imageData
	 * @property {Date} createTime
	 * @property {number} id
	 */

	/**
	 * 照片数据结构类
	 * @param {ImageData} imageData
	 * @constructor
	 */
	var Photo = function(imageData) {
		this.imageData = imageData;
		this.createTime = new Date();
		this.id = this.createTime.getTime();
	};
	
	
	/**
	 * Ycc实例的快照管理类
	 * @param yccInstance {Ycc}
	 * @constructor
	 */
	Ycc.PhotoManager = function (yccInstance) {

		/** @type {Ycc} */
		this.yccInstance = yccInstance;

		/** @type {CanvasRenderingContext2D} */
		this.ctx = yccInstance.ctx;
		
		/** @type {Ycc.PhotoManager.Photo[]} */
		this._photos = [];
	};
	
	/**
	 * 保存快照，即保存当前的原子图形渲染步骤
	 * @return {Ycc.PhotoManager}
	 */
	Ycc.PhotoManager.prototype.takePhoto = function () {
		this._photos.push(new Photo(this.ctx.getImageData(0,0,this.yccInstance.getStageWidth(),this.yccInstance.getStageHeight())));
		return this;
	};
	
	/**
	 * 获取保存的历史照片
	 * @returns {Ycc.PhotoManager.Photo[]}
	 */
	Ycc.PhotoManager.prototype.getHistoryPhotos = function () {
		return this._photos;
	};
	/**
	 * 显示照片
	 * @param {Ycc.PhotoManager.Photo} photo
	 * @returns {Ycc.PhotoManager.Photo}
	 */
	Ycc.PhotoManager.prototype.showPhoto = function (photo) {
		this.ctx.putImageData(photo.imageData,0,0);
		return photo;
	};
	
	
	/**
	 * 显示最后一次保存的快照
	 * @returns {Ycc.PhotoManager.Photo|false}
	 */
	Ycc.PhotoManager.prototype.showLastPhoto = function () {
		var len = this._photos.length;
		var photo = false;
		if(len>=1){
			photo = this._photos[len-1];
			this.showPhoto(photo);
		}
		return photo;
	};
	
	/**
	 * 删除照片
	 * @param {number} photoId	照片的id
	 * @returns {Ycc.PhotoManager.Photo|false}
	 */
	Ycc.PhotoManager.prototype.delPhotoById = function (photoId) {
		var tempPhotos = this._photos.slice(0);
		for(var i=0;i<tempPhotos.length;i++){
			if(tempPhotos[i].id === photoId){
				tempPhotos.splice(i+1,1);
				this._photos = tempPhotos;
				return tempPhotos[i];
			}
		}
		return false;
	};
	
	
	
	
	
	
})(Ycc);