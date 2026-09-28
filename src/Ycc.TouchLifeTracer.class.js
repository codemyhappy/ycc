/**
 * @file    Ycc.TouchLifeTracer.class.js
 * @author  xiaohei
 * @date    2018/6/12
 * @description  Ycc.TouchLifeTracer.class文件
 * @requires Ycc.Listener
 */


(function (Ycc) {
	
	
	
	/**
	 * @typedef {Object} Ycc.TouchLifeTracer.TouchLife
	 * @property {number} id - 生命周期id
	 * @property {Touch} startTouchEvent - 开始的touch事件
	 * @property {Touch|null} endTouchEvent - 结束的touch事件
	 * @property {Touch[]} moveTouchEventList - 移动的touch事件列表
	 * @property {number} startTime - 开始时间
	 * @property {number} endTime - 结束时间
	 */
	
	/**
	 * touch事件的生命周期类
	 * @constructor
	 * @private
	 * */
	var TouchLife = (function () {
		var id = 0;
		return function () {
			/**
			 * 生命周期的id
			 * @type {number}
			 * */
			this.id=id++;
			
			/**
			 * 开始的touch事件
			 * @type {Touch}
			 * */
			this.startTouchEvent = null;
			
			/**
			 * 结束的touch事件
			 * @type {Touch}
			 * */
			this.endTouchEvent = null;
			
			/**
			 * 结束的touch事件
			 * @type {Touch[]}
			 * */
			this.moveTouchEventList = [];
			
			/**
			 * 开始时间
			 * @type {number}
			 */
			this.startTime = Date.now();
			
			/**
			 * 结束时间
			 * @type {number}
			 */
			this.endTime = 0;
		};
	})();
	
	
	/**
	 * touch事件追踪器
	 * @param opt
	 * @param opt.target	被追踪的dom对象
	 * @extends Ycc.Listener
	 * @constructor
	 */
	Ycc.TouchLifeTracer = function(opt) {
		Ycc.Listener.call(this);
		
		/**
		 * 追踪的对象
		 * @type {HTMLElement}
		 * */
		this.target = opt.target;
		
		/**
		 * 作用于target的所有生命周期，包含存活和死亡的周期
		 * @type {Ycc.TouchLifeTracer.TouchLife[]}
		 * */
		this._lifeList = [];
		
		/**
		 * 当前存活的生命周期，正在与target接触的触摸点生命周期
		 * @type {Ycc.TouchLifeTracer.TouchLife[]}
		 * */
		this.currentLifeList = [];
		
		/**
		 * 当前对象的touch
		 * @type {Array}
		 */
		this.targetTouches = [];
		
		/**
		 * 当前target所有的touch
		 * @type {Array}
		 */
		this.touches = [];
		
		/**
		 * 当前改变的所有touch
		 * @type {Array}
		 */
		this.changedTouches = [];
		
		/**
		 * 某个生命周期开始
		 * @type {function(Ycc.TouchLifeTracer.TouchLife): void}
		 * */
		this.onlifestart = null;
		
		/**
		 * 某个生命周期状态变更
		 * @type {function(Ycc.TouchLifeTracer.TouchLife): void}
		 * */
		this.onlifechange = null;
		
		/**
		 * 某个生命周期开始
		 * @type {function(Ycc.TouchLifeTracer.TouchLife): void}
		 * */
		this.onlifeend = null;
		
		/**
		 * 添加生命周期
		 * @param {Ycc.TouchLifeTracer.TouchLife} life	生命周期
		 * @return {void}
		 */
		this.addLife = function (life) {
			this._lifeList.push(life);
		};
		
		/**
		 * 根据identifier查找生命周期，此方法只能在生命周期内使用
		 * @param {number} identifier
		 * @return {Ycc.TouchLifeTracer.TouchLife|undefined}
		 */
		this.findCurrentLifeByTouchID = function (identifier) {
			for(var i=0;i<this.currentLifeList.length;i++){
				var life = this.currentLifeList[i];
				if(life.startTouchEvent.identifier===identifier)
					return life;
			}
		};
		
		/**
		 * 根据touchID删除当前触摸的生命周期
		 * @param {number} identifier
		 * @return {boolean}
		 */
		this.deleteCurrentLifeByTouchID = function (identifier) {
			for(var i=0;i<this.currentLifeList.length;i++){
				var life = this.currentLifeList[i];
				if(life.startTouchEvent.identifier===identifier){
					this.currentLifeList.splice(i,1);
					return true;
				}
			}
			return false;
		};
		
		
		/**
		 * 初始化
		 */
		this.init = function () {
			var self = this;
			this.target.addEventListener("touchstart",function (e) {
				e.preventDefault();
				self.syncTouches(e);
				var life = new TouchLife();
				life.startTouchEvent = e.changedTouches[0];
				self.addLife(life);
				self.currentLifeList.push(life);
				// self.onlifestart && self.onlifestart(life);
				self.triggerListener('lifestart',life);
			});
			
			this.target.addEventListener('touchmove',function (e) {
				e.preventDefault();
				self.syncTouches(e);
				var touches = e.changedTouches;
				for(var i=0;i<touches.length;i++){
					var touch = touches[i];
					var life = self.findCurrentLifeByTouchID(touch.identifier);
					var index = self.indexOfTouchFromMoveTouchEventList(life.moveTouchEventList,touch);
					if(index===-1)
						life.moveTouchEventList.push(touch);
					else
						life.moveTouchEventList[index]=touch;
					// self.onlifechange && self.onlifechange(life);
					self.triggerListener('lifechange',life);
				}
			});
			this.target.addEventListener('touchend',function (e) {
				e.preventDefault();
				self.syncTouches(e);
				var touch = e.changedTouches[0];
				var life = self.findCurrentLifeByTouchID(touch.identifier);
				life.endTouchEvent = touch;
				life.endTime = Date.now();
				self.deleteCurrentLifeByTouchID(touch.identifier);
				// self.onlifeend && self.onlifeend(life);
				self.triggerListener('lifeend',life);
			});
		};
		
		this.init();
	};
	
	// 继承prototype
	Ycc.utils.mergeObject(Ycc.TouchLifeTracer.prototype,Ycc.Listener.prototype);
	
	/**
	 * 同步当前HTML元素的touches
	 * @param {TouchEvent} e 原生的touch事件。touchstart、end、move ...
	 */
	Ycc.TouchLifeTracer.prototype.syncTouches = function (e) {
		this.touches = [];
		this.changedTouches = [];
		this.targetTouches = [];
		var i=0;
		var touches=[];
		touches = e.touches;
		for(i=0;i<touches.length;i++){
			this.touches.push(touches[i]);
		}
		touches = e.changedTouches;
		for(i=0;i<e.changedTouches.length;i++){
			this.changedTouches.push(touches[i]);
		}
		touches = e.targetTouches;
		for(i=0;i<e.targetTouches.length;i++){
			this.targetTouches.push(touches[i]);
		}
	};
	
	/**
	 * 寻找移动过的接触点
	 * @param {Touch[]} moveTouchEventList
	 * @param {Touch} touch
	 * @return {number}
	 */
	Ycc.TouchLifeTracer.prototype.indexOfTouchFromMoveTouchEventList = function (moveTouchEventList,touch) {
		for(var i=0;i<moveTouchEventList.length;i++){
			if(touch.identifier===moveTouchEventList[i].identifier)
				return i;
		}
		return -1;
	};
	
})(Ycc);