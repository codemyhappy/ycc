/**
 * @file    Ycc.Math.js
 * @author  xiaohei
 * @date    2017/11/2
 * @description  Ycc.Math文件
 */


(function (Ycc) {
	
	var extend = Ycc.utils.extend;
	
	/**
	 * 数学表达式模块
	 * @constructor
	 */
	Ycc.Math = function () {};
	
	/**
	 * 点
	 * @param {number} x - x坐标
	 * @param {number} y - y坐标
	 * @constructor
	 *//**
	 * 点
	 * @param {object} dot - 点对象
	 * @param {number} dot.x - x坐标
	 * @param {number} dot.y - y坐标
	 * @constructor
	 */
	Ycc.Math.Dot = function (dot) {
		/**
		 * x坐标
		 * @type {number}
		 */
		this.x = 0;
		/**
		 * y坐标
		 * @type {number}
		 */
		this.y = 0;
		
		var len = arguments.length;
		if(len===1){
			this.x = dot.x;
			this.y = dot.y;
		}else if(len===2){
			this.x = arguments[0];
			this.y = arguments[1];
		}
		
	};
	
	/**
	 * 点是否在某个区域内
	 * @param {Ycc.Math.Rect} rect - 区域
	 * @return {boolean}
	 */
	Ycc.Math.Dot.prototype.isInRect = function (rect) {
		return this.x>=rect.x&&this.x<=rect.x+rect.width  && this.y>=rect.y && this.y<=rect.y+rect.height;
	};
	
	/**
	 * 判读两点位置是否相同
	 * @param {Ycc.Math.Dot} dot - 另一个点
	 * @return {boolean}
	 */
	Ycc.Math.Dot.prototype.isEqual = function (dot) {
		return this.x===dot.x && this.y===dot.y;
	};
	
	/**
	 * 点的加法/点的偏移量
	 * @param {Ycc.Math.Dot} dot - 加的点
	 * @return {Ycc.Math.Dot} 返回一个新的点
	 */
	Ycc.Math.Dot.prototype.plus = function (dot) {
		return new Ycc.Math.Dot(this.x+dot.x,this.y+dot.y);
	};
	
	/**
	 * 将当前点绕另外一个点旋转一定度数
	 * @param {number} rotation - 旋转角度
	 * @param {Ycc.Math.Dot} [anchorDot] - 锚点坐标
	 * @return {Ycc.Math.Dot} 旋转后的点
	 */
	Ycc.Math.Dot.prototype.rotate = function (rotation,anchorDot) {
		anchorDot=anchorDot||new Ycc.Math.Dot(0,0);
		var dotX = this.x,dotY=this.y,anchorX=anchorDot.x,anchorY=anchorDot.y;
		var dx = (dotX - anchorX)*Math.cos(rotation/180*Math.PI) - (dotY - anchorY)*Math.sin(rotation/180*Math.PI)+anchorX;
		var dy = (dotY - anchorY)*Math.cos(rotation/180*Math.PI) + (dotX - anchorX)*Math.sin(rotation/180*Math.PI)+anchorY;
		return new Ycc.Math.Dot(dx,dy);
	};
	
	/**
	 * 判断三点是否共线
	 * @param {Ycc.Math.Dot} dot1 - 第一个点
	 * @param {Ycc.Math.Dot} dot2 - 第二个点
	 * @param {Ycc.Math.Dot} dot3 - 第三个点
	 * @return {boolean}
	 */
	Ycc.Math.Dot.threeDotIsOnLine = function (dot1,dot2,dot3) {
		// 存在位置相同点肯定共线
		if(dot1.isEqual(dot2) || dot1.isEqual(dot3) || dot2.isEqual(dot3))
			return true;
		// 三个点x一样
		if(dot1.x===dot2.x&&dot2.x===dot3.x)
			return true;
		var k1 = Math.abs(dot1.y-dot2.y)/Math.abs(dot1.x-dot2.x);
		var k2 = Math.abs(dot1.y-dot3.y)/Math.abs(dot1.x-dot3.x);
		return k1===k2;
	};
	
	
	
	
	/**
	 * 区域
	 * @param {Ycc.Math.Dot} startDot - 起点
	 * @param {number} width - 宽度
	 * @param {number} height - 高度
	 * @constructor
	 *//**
	 * 区域
	 * @param {number} x - 左上角x坐标
	 * @param {number} y - 左上角y坐标
	 * @param {number} width - 宽度
	 * @param {number} height - 高度
	 * @constructor
	 *//**
	 * 区域
	 * @param {object} rect - 矩形对象
	 * @param {number} rect.x - 左上角x坐标
	 * @param {number} rect.y - 左上角y坐标
	 * @param {number} rect.width - 宽度
	 * @param {number} rect.height - 高度
	 * @constructor
	 */
	Ycc.Math.Rect = function (rect) {
		/**
		 * 构造器的引用
		 * @type {function}
		 */
		this.yccClass = Ycc.Math.Rect;
		
		/**
		 * 左上角x坐标
		 * @type {number}
		 */
		this.x = 0;
		/**
		 * 左上角y坐标
		 * @type {number}
		 */
		this.y = 0;
		/**
		 * 区域宽
		 * @type {number}
		 */
		this.width = 0;
		/**
		 * 区域高
		 * @type {number}
		 */
		this.height = 0;
		
		var len = arguments.length;
		if(len===1){
			this.x = rect.x;
			this.y = rect.y;
			this.width = rect.width;
			this.height = rect.height;
		}else if(len===3){
			this.x = arguments[0].x;
			this.y = arguments[0].y;
			this.width = arguments[1];
			this.height = arguments[2];
		}else if(len === 4){
			this.x = arguments[0];
			this.y = arguments[1];
			this.width = arguments[2];
			this.height = arguments[3];
		}
		
		
		this.toPositive();
	};
	
	/**
	 * 将矩形的长和宽转换为正数
	 * @return {void}
	 */
	Ycc.Math.Rect.prototype.toPositive = function () {
		var x0 = this.x,
			y0 = this.y,
			x1 = this.x + this.width,
			y1 = this.y + this.height;
		this.x = x0<x1?x0:x1;
		this.y = y0<y1?y0:y1;
		this.width = Math.abs(this.width);
		this.height = Math.abs(this.height);
	};
	
	/**
	 * 获取区域的顶点列表
	 * @return {Ycc.Math.Dot[]}
	 */
	Ycc.Math.Rect.prototype.getVertices = function () {
		return [
			new Ycc.Math.Dot(this.x,this.y),
			new Ycc.Math.Dot(this.x+this.width,this.y),
			new Ycc.Math.Dot(this.x+this.width,this.y+this.height),
			new Ycc.Math.Dot(this.x,this.y+this.height),
			new Ycc.Math.Dot(this.x,this.y)
		];
	};
	
	/**
	 * 根据顶点更新数值
	 * @param {Ycc.Math.Dot[]} vertices - 顶点数组
	 * @return {void}
	 */
	Ycc.Math.Rect.prototype.updateByVertices = function (vertices) {
		if(!Ycc.utils.isArray(vertices))
			return console.error('参数必须是数组！');
		this.x = vertices[0].x;
		this.y = vertices[0].y;
		this.width = vertices[1].x-this.x;
		this.height = vertices[2].y-this.y;
	};
	
	
	
	
	/**
	 * 向量构造函数
	 * @constructor
	 *//**
	 * 向量构造函数
	 * @param {number} x - x分量
	 * @param {number} y - y分量
	 * @param {number} [z=0] - z分量
	 * @constructor
	 *//**
	 * 向量构造函数
	 * @param {object} obj - 向量对象
	 * @param {number} [obj.x=0] - x分量
	 * @param {number} [obj.y=0] - y分量
	 * @param {number} [obj.z=0] - z分量
	 * @constructor
	 */
	Ycc.Math.Vector = function () {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		
		if(arguments.length===3 || arguments.length===2){
			this.x=arguments[0]||0;
			this.y=arguments[1]||0;
			this.z=arguments[2]||0;
		}
		
		if(arguments.length===1){
			if(!Ycc.utils.isObj(arguments[0])) console.error('constructor need a objec as param!');
			this.x=arguments[0].x||0;
			this.y=arguments[0].y||0;
			this.z=arguments[0].z||0;
		}
	};
	
	/**
	 * 向量的点乘法
	 * @param {Ycc.Math.Vector} v2 - 点乘向量
	 * @return {number}
	 */
	Ycc.Math.Vector.prototype.dot = function (v2) {
		return this.x*v2.x+this.y*v2.y+this.z*v2.z;
	};
	
	
	/**
	 * 向量的叉乘法
	 * @param {Ycc.Math.Vector} v2 - 叉乘向量
	 * @return {Ycc.Math.Vector}
	 */
	Ycc.Math.Vector.prototype.cross = function (v2) {
		var res = new Ycc.Math.Vector();
		res.x = this.y*v2.z-v2.y*this.z;
		res.y = v2.x*this.z-this.x*v2.z;
		res.z = this.x*v2.y-v2.x*this.y;
		return res;
	};
	
	
	/**
	 * 获取向量的模长
	 * @return {number}
	 */
	Ycc.Math.Vector.prototype.getLength = function () {
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z,2);
	};
	
	
	/**
	 * 矩阵的构造方法。
	 * @param {number[]} data - 矩阵所有行拼接的数组
	 * @param {number} m - 行数
	 * @param {number} n - 列数
	 * @constructor
	 */
	Ycc.Math.Matrix = function (data,m,n) {
		this.data 	= data;
		this.m 		= m;
		this.n		= n;
	};
	
	/**
	 * 矩阵点乘法
	 * @param {Ycc.Math.Matrix} M - 另一个矩阵
	 * @return {Ycc.Math.Matrix}
	 */
	Ycc.Math.Matrix.prototype.dot = function (M) {
		if(M.m!==this.n || M.n!==this.m)
			return console.error('两个矩阵的行数和列数不对应，不能相乘！');
		
		var N = new Ycc.Math.Matrix([],this.m,this.m);
		// 循环行
		for(var i=1;i<=this.m;i++){
			// 循环矩阵赋值
			for(var k=1;k<=this.m;k++){
				var temp =0;
				// 循环列
				for(var j=1;j<=this.n;j++){
					temp += this.get(i,j)*M.get(j,k);
				}
				N.set(i,k,temp);
			}
			
		}
		return N;
	};
	
	/**
	 * 获取矩阵i行j列的元素。
	 * 注：i，i下标从1开始
	 * @param {number} i - 行号
	 * @param {number} j - 列号
	 * @return {number}
	 */
	Ycc.Math.Matrix.prototype.get = function (i, j) {
		return this.data[(i-1)*this.n+j-1];
	};
	
	/**
	 * 设置矩阵i行j列的元素为val
	 * 注：i，i下标从1开始
	 * @param {number} i - 行号
	 * @param {number} j - 列号
	 * @param {number} val - 值
	 * @return {void}
	 */
	Ycc.Math.Matrix.prototype.set = function (i, j, val) {
		this.data[(i-1)*this.n+j-1] = val;
	};
	
	
})(Ycc);