/**
 * Ycc.js - Mini and powerful canvas engine for creating App or Game.
 * @see https://github.com/lizhiqianduan/ycc
 */

interface YccConfig {
  debugDrawContainer?: boolean;
}

// ============================================================
// Ycc class (constructor + instance members)
// ============================================================

declare class Ycc {
  ctx: CanvasRenderingContext2D;
  canvasDom: HTMLCanvasElement;
  layerList: Ycc.Layer[];
  photoManager: Ycc.PhotoManager;
  layerManager: Ycc.LayerManager;
  ticker: Ycc.Ticker;
  debugger: Ycc.Debugger;
  loader: Ycc.Loader;
  ajax: Ycc.Ajax;
  baseUI: Ycc.UI;
  gesture: Ycc.Gesture;
  config: YccConfig;
  isMobile: boolean;
  stageW: number;
  stageH: number;
  dpi: number;

  constructor(config?: YccConfig);

  getStageWidth(): number;
  getStageHeight(): number;
  bindCanvas(canvas: HTMLCanvasElement): Ycc;
  clearStage(): void;
  findLayerById(id: number): Ycc.Layer | null;
  findUiById(id: number): Ycc.UI.Base | null;
  getUIFromPointer(dot: Ycc.Math.Dot, uiIsShow?: boolean): Ycc.UI.Base | null;
  getUIListFromPointer(dot: Ycc.Math.Dot, options?: { uiIsShow: boolean; uiIsGhost: boolean }): Ycc.UI.Base[];
  createCanvas(options?: { width?: number; height?: number; dpiAdaptation?: boolean }): HTMLCanvasElement;
  createCacheCtx(options?: { width?: number; height?: number }): CanvasRenderingContext2D;
  getSystemInfo(): {
    model: string;
    pixelRatio: number;
    windowWidth: number;
    windowHeight: number;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
  };
}

// ============================================================
// Ycc namespace (all sub-types)
// ============================================================

declare namespace Ycc {
  // ----------------------------------------------------------
  // Ycc.utils
  // ----------------------------------------------------------
  namespace utils {
    function extend<T extends object>(targetObj: T, obj2: any, isDeepClone?: boolean): T;
    function mergeObject<T>(target: T, src: any): T;
    function isString(str: any): str is string;
    function isNum(str: any): str is number;
    function isBoolean(str: any): str is boolean;
    function isObj(str: any): str is object;
    function isFn(str: any): str is Function;
    function isArray(str: any): str is any[];
    function isMobile(): boolean;
    function deepClone<T>(arrOrObj: T): T;
    function renderTpl(tpl: string, renderObj: any): string;
    function releaseObject(obj: object): void;
    function releaseArray(arr: any[]): void;
    function isWx(): boolean;
  }

  // ----------------------------------------------------------
  // Ycc.Math
  // ----------------------------------------------------------
  namespace Math {
    class Dot {
      x: number;
      y: number;
      constructor(x: number, y: number);
      constructor(dot: { x: number; y: number });
      isInRect(rect: Rect): boolean;
      isEqual(dot: Dot): boolean;
      plus(dot: Dot): Dot;
      rotate(rotation: number, anchorDot?: Dot): Dot;
      static threeDotIsOnLine(dot1: Dot, dot2: Dot, dot3: Dot): boolean;
    }

    class Rect {
      yccClass: typeof Rect;
      x: number;
      y: number;
      width: number;
      height: number;
      constructor(startDot: Dot, width: number, height: number);
      constructor(x: number, y: number, width: number, height: number);
      constructor(rect: { x: number; y: number; width: number; height: number });
      toPositive(): void;
      getVertices(): Dot[];
      updateByVertices(vertices: Dot[]): void;
    }

    class Vector {
      x: number;
      y: number;
      z: number;
      constructor();
      constructor(x: number, y: number, z?: number);
      constructor(obj: { x?: number; y?: number; z?: number });
      dot(v2: Vector): number;
      cross(v2: Vector): Vector;
      getLength(): number;
    }

    class Matrix {
      data: number[];
      m: number;
      n: number;
      constructor(data: number[], m: number, n: number);
      dot(M: Matrix): Matrix;
      get(i: number, j: number): number;
      set(i: number, j: number, val: number): void;
    }

    class Polygon {
      coordinates: Dot[];
      constructor(option: { coordinates: Dot[] });
      isContainDot(dot: Dot): boolean;
    }
  }

  // ----------------------------------------------------------
  // Ycc.Tree
  // ----------------------------------------------------------
  class Tree {
    $id: number;
    $parentID: number | null;
    children: Tree[];
    data: any;
    static release(treeNode: Tree): void;
    static getNodeMap(): Record<number, Tree>;
    static createByJSON(json: { data: any; children?: any[] }): Tree;
    static createByNodes(nodes: Array<{ id: number; parentID?: number; [key: string]: any }>): Tree;
    getNodeMap(): Record<number, Tree>;
    getParent(): Tree | null;
    addChildTree(tree: Tree): this;
    removeChildTree(tree: Tree): this;
    getDepth(): number;
    itor(option?: { reverse?: boolean }): {
      each: (cb: (node: Tree) => boolean | void) => boolean;
      leftChildFirst: (cb: (node: Tree) => boolean | void) => boolean;
      rightChildFirst: (cb: (node: Tree) => boolean | void) => boolean;
      depthDown: (cb: (node: Tree, level: number) => boolean | void | number) => boolean;
    };
    toNodeList(): Tree[];
    getNodeListGroupByLayer(): Record<number, Tree[]>;
    getParentList(): Tree[];
    getBrotherList(): Tree[];
  }

  // ----------------------------------------------------------
  // Ycc.Event
  // ----------------------------------------------------------
  class Event {
    yccClass: typeof Event;
    type: string;
    x: number;
    y: number;
    originEvent: Event | null;
    stop: boolean;
    target: Ycc.UI.Base | null;
    constructor(type: string);
    constructor(type: object);
  }

  // ----------------------------------------------------------
  // Ycc.Listener
  // ----------------------------------------------------------
  class Listener {
    yccClass: typeof Listener;
    listeners: Record<string, Function[]>;
    stopType: Record<string, boolean>;
    disableType: Record<string, boolean>;
    stopAllEvent: boolean;
    onclick: ((e: Ycc.Event) => void) | null;
    onmousedown: ((e: Ycc.Event) => void) | null;
    onmouseup: ((e: Ycc.Event) => void) | null;
    onmousemove: ((e: Ycc.Event) => void) | null;
    ondragstart: ((e: Ycc.Event) => void) | null;
    ondragging: ((e: Ycc.Event) => void) | null;
    ondragend: ((e: Ycc.Event) => void) | null;
    onmouseover: ((e: Ycc.Event) => void) | null;
    onmouseout: ((e: Ycc.Event) => void) | null;
    ontouchstart: ((e: Ycc.Event) => void) | null;
    ontouchmove: ((e: Ycc.Event) => void) | null;
    ontouchend: ((e: Ycc.Event) => void) | null;
    ontap: ((e: Ycc.Event) => void) | null;
    static release(listener: Listener): void;
    addListener(type: string, listener: Function): void;
    stop(type: string): void;
    triggerListener(type: string, ...data: any[]): void;
    removeListener(type: string, listener: Function): void;
    disableEvent(type: string): void;
    resumeEvent(type: string): void;
  }

  // ----------------------------------------------------------
  // Ycc.Ajax
  // ----------------------------------------------------------
  class Ajax {
    yccClass: typeof Ajax;
    get(url: string, successCb: Function, errorCb: Function, responseType?: string): void;
    get(option: { url: string; successCb: Function; errorCb: Function; responseType?: string }): void;
  }

  // ----------------------------------------------------------
  // Ycc.Ticker
  // ----------------------------------------------------------
  interface TickerFrame {
    createTime: number;
    deltaTime: number;
    fps: number;
    frameCount: number;
    isRendered: boolean;
  }

  class Ticker {
    yccClass: typeof Ticker;
    yccInstance: Ycc;
    currentFrame: TickerFrame | null;
    startTime: number;
    lastFrameTime: number;
    lastFrameTickerCount: number;
    deltaTime: number;
    deltaTimeExpect: number;
    deltaTimeRatio: number;
    frameListenerList: Array<(frame: TickerFrame) => void>;
    defaultFrameRate: number;
    defaultDeltaTime: number;
    tickerSpace: number;
    frameAllCount: number;
    timerTickCount: number;
    constructor(yccInstance: Ycc);
    start(frameRate?: number): void;
    stop(): void;
    addFrameListener(listener: (frame: TickerFrame) => void): void;
    removeFrameListener(listener: (frame: TickerFrame) => void): void;
    broadcastFrameEvent(frame: TickerFrame): void;
    broadcastToLayer(frame: TickerFrame): void;
  }

  // ----------------------------------------------------------
  // Ycc.Loader
  // ----------------------------------------------------------
  interface ResourceItem {
    name?: string;
    url: string;
    type?: 'image' | 'audio';
    res?: HTMLImageElement | HTMLAudioElement;
    crossOrigin?: string;
    timeout?: number;
  }

  class Loader {
    yccClass: typeof Loader;
    ajax: Ajax;
    basePath: string;
    loadResParallel(
      resArr: ResourceItem[],
      endCb: (resArr: ResourceItem[], resMap: Record<string, any>) => void,
      progressCb?: (res: ResourceItem, error: Error | null, index: number) => void
    ): void;
    loadResOneByOne(
      resArr: ResourceItem[],
      endCb: (resArr: ResourceItem[], resMap: Record<string, any>) => void,
      progressCb?: (res: ResourceItem, error: Error | null, index: number) => void
    ): void;
    getResByName(name: string, resArr: ResourceItem[]): ResourceItem | null;
  }

  // ----------------------------------------------------------
  // Ycc.Debugger
  // ----------------------------------------------------------
  namespace Debugger {
    class Log {
      message: string;
      constructor(message: string);
    }
    class Error {
      message: string;
      constructor(message: string);
    }
  }

  class Debugger {
    yccInstance: Ycc;
    deltaTime: Ycc.UI.Base | null;
    deltaTimeExpect: Ycc.UI.Base | null;
    frameAllCount: Ycc.UI.Base | null;
    deltaTimeAverage: Ycc.UI.Base | null;
    renderTime: Ycc.UI.Base | null;
    renderUiCount: Ycc.UI.Base | null;
    totalJSHeapSize: any;
    usedJSHeapSize: any;
    jsHeapSizeLimit: any;
    fields: Array<{ name: string; cb: () => any; ui: Ycc.UI.Base }>;
    rect: Ycc.UI.Rect | null;
    layer: Ycc.Layer | null;
    constructor(yccInstance: Ycc);
    init(): void;
    showDebugPanel(): void;
    updateInfo(): void;
    addField(name: string, cb: () => any): void;
    addToLayer(layer: Ycc.Layer): void;
    updateField(name: string, cb: () => any): void;
  }

  // ----------------------------------------------------------
  // Ycc.PhotoManager
  // ----------------------------------------------------------
  interface Photo {
    imageData: ImageData;
    createTime: Date;
    id: number;
  }

  class PhotoManager {
    yccInstance: Ycc;
    ctx: CanvasRenderingContext2D;
    takePhoto(): PhotoManager;
    getHistoryPhotos(): Photo[];
    showPhoto(photo: Photo): Photo;
    showLastPhoto(): Photo | false;
    delPhotoById(photoId: number): Photo | false;
  }

  // ----------------------------------------------------------
  // Ycc.TouchLifeTracer
  // ----------------------------------------------------------
  interface TouchLife {
    id: number;
    startTouchEvent: Touch;
    endTouchEvent: Touch | null;
    moveTouchEventList: Touch[];
    startTime: number;
    endTime: number;
  }

  class TouchLifeTracer extends Listener {
    target: HTMLElement;
    currentLifeList: TouchLife[];
    targetTouches: Touch[];
    touches: Touch[];
    changedTouches: Touch[];
    onlifestart: ((life: TouchLife) => void) | null;
    onlifechange: ((life: TouchLife) => void) | null;
    onlifeend: ((life: TouchLife) => void) | null;
    constructor(opt: { target: HTMLElement });
    syncTouches(e: TouchEvent): void;
    indexOfTouchFromMoveTouchEventList(moveTouchEventList: Touch[], touch: Touch): number;
  }

  // ----------------------------------------------------------
  // Ycc.Gesture
  // ----------------------------------------------------------
  interface GestureEventData {
    type: string;
    target: any;
    identifier: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
    force: number;
    swipeDirection: string;
    createTime: number;
  }

  class Gesture extends Listener {
    option: { target: HTMLElement | null; useMulti: boolean };
    constructor(option: { target: HTMLElement; useMulti?: boolean });
    enableMutiTouch(enable: boolean): void;
  }

  // ----------------------------------------------------------
  // Ycc.Layer
  // ----------------------------------------------------------
  interface LayerConfig {
    name?: string;
    type?: 'ui' | 'tool' | 'text';
    enableEventManager?: boolean;
    enableFrameEvent?: boolean;
    show?: boolean;
    ghost?: boolean;
    useCache?: boolean;
  }

  class Layer extends Listener {
    uiList: Ycc.UI.Base[];
    uiCountRecursion: number;
    uiCountRendered: number;
    yccInstance: Ycc;
    ctx: CanvasRenderingContext2D;
    useCache: boolean;
    ctxCache: CanvasRenderingContext2D;
    ctxCacheRect: Ycc.Math.Rect | null;
    renderCacheRect: boolean;
    id: number;
    type: string;
    textValue: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    show: boolean;
    ghost: boolean;
    enableEventManager: boolean;
    enableFrameEvent: boolean;
    onFrameComing: (frame: TickerFrame) => void;
    static release(layer: Layer): void;
    constructor(yccInstance: Ycc, option?: LayerConfig);
    init(): void;
    clear(): void;
    removeAllUI(): void;
    removeSelf(): void;
    renderToStage(): void;
    addUI(ui: Ycc.UI.Base, beforeUI?: Ycc.UI.Base): Ycc.UI.Base;
    removeUI(ui: Ycc.UI.Base): boolean;
    render(forceUpdate?: boolean): void;
    reRender(forceUpdate?: boolean): void;
    renderCacheToStage(forceUpdate?: boolean): void;
    getUIFromPointer(dot: Ycc.Math.Dot, uiIsShow?: boolean): Ycc.UI.Base | null;
    getUIListFromPointer(dot: Ycc.Math.Dot, options?: { uiIsShow: boolean; uiIsGhost: boolean }): Ycc.UI.Base[];
    transformToAbsolute(dotOrArr: Ycc.Math.Dot | Ycc.Math.Dot[]): Ycc.Math.Dot | Ycc.Math.Dot[];
    transformToLocal(dotOrArr: Ycc.Math.Dot | Ycc.Math.Dot[]): Ycc.Math.Dot | Ycc.Math.Dot[];
    renderAllToCtx(ctx: CanvasRenderingContext2D): void;
    updateCache(): void;
    clearCache(): void;
  }

  // ----------------------------------------------------------
  // Ycc.LayerManager
  // ----------------------------------------------------------
  class LayerManager {
    yccInstance: Ycc;
    renderTime: number;
    maxRenderTime: number;
    renderUiCount: number;
    constructor(yccInstance: Ycc);
    init(): void;
    newLayer(config: LayerConfig): Layer;
    deleteLayer(layer: Layer): Layer;
    deleteAllLayer(): void;
    reRenderAllLayerToStage(forceUpdate?: boolean): void;
    enableEventManagerOnly(layer: Layer): LayerManager | false;
    enableEventManagerAll(enable: boolean): LayerManager;
    renderAllLayerByJsonArray(jsonArray: Array<{ option: LayerConfig; ui: Array<{ type: string; option: any }> }>): void;
  }

  // ----------------------------------------------------------
  // Ycc.UI
  // ----------------------------------------------------------
  namespace UI {
    class Base extends Listener {
      $id: number;
      $parentID: number | null;
      children: Base[];
      data: any;
      id: number;
      name: string;
      ctx: CanvasRenderingContext2D | null;
      ctxCache: CanvasRenderingContext2D | null;
      dpi: number;
      rect: Ycc.Math.Rect;
      x: number;
      y: number;
      anchorX: number;
      anchorY: number;
      rotation: number;
      rectBgColor: string;
      rectBorderWidth: number;
      rectBorderColor: string;
      show: boolean;
      ghost: boolean;
      stopEventBubbleUp: boolean;
      opacity: number;
      lineWidth: number;
      fillStyle: string;
      strokeStyle: string;
      belongTo: Ycc.Layer | null;
      userData: any;
      isShowRotateBeforeUI: boolean;
      baseUI: Ycc.UI | null;
      _beforeInit: (() => void) | null;
      _afterInit: (() => void) | null;
      _onAdded: (() => void) | null;
      _onChildrenRendered: (() => void) | null;
      oncomputestart: (() => void) | null;
      oncomputeend: (() => void) | null;
      onrenderstart: (() => void) | null;
      onrenderend: (() => void) | null;
      static release(uiNode: Base): void;
      constructor(option?: any);
      init(layer: Ycc.Layer): void;
      computeUIProps(): void;
      renderRectBgColor(absoluteRect: Ycc.Math.Rect): void;
      renderRectBorder(absoluteRect: Ycc.Math.Rect): void;
      removeSelf(): void;
      addChild(ui: Base): Base;
      addChildTree(tree: Base): this;
      removeChild(ui: Base): Base;
      removeChildTree(tree: Base): this;
      getParent(): Base | null;
      getDepth(): number;
      getBrotherList(): Base[];
      scaleAndRotate(): void;
      isOutOfStage(): boolean;
      isOutOfRect(rect: Ycc.Math.Rect): boolean;
      _renderContainer(absoluteRect: Ycc.Math.Rect): void;
      __render(): { message: string } | null;
      _processBeforeRender(): void;
      _processAfterRender(): void;
      getMaxContentInWidth(content: string, width: number): string;
      extend(option: object): this;
      clone(): Base;
      getAbsolutePositionPolygon(): Ycc.Math.Dot[];
      getAbsolutePositionRect(): Ycc.Math.Rect;
      getAbsolutePosition(): Ycc.Math.Dot;
      transformToAbsolute(dotOrArr: Ycc.Math.Dot | Ycc.Math.Dot[]): Ycc.Math.Dot | Ycc.Math.Dot[];
      transformToLocal(dotOrArr: Ycc.Math.Dot | Ycc.Math.Dot[]): Ycc.Math.Dot | Ycc.Math.Dot[];
      containDot(dot: Ycc.Math.Dot): boolean;
      getDeepLevel(): number;
      transformByRotate(dotOrArr: Ycc.Math.Dot | Ycc.Math.Dot[]): Ycc.Math.Dot | Ycc.Math.Dot[];
      _setCtxProps(props?: object, ctx?: CanvasRenderingContext2D): void;
      triggerUIEventBubbleUp(type: string, x: number, y: number, originEvent?: Event): Base[];
    }

    class Polygon extends Base {
      fill: boolean;
      fillStyle: string;
      noneZeroMode: number;
      isDrawIndex: boolean;
      coordinates: Ycc.Math.Dot[];
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
      renderPath(): void;
      getAbsolutePositionPolygon(): Ycc.Math.Dot[];
      getAbsolutePosition(pos?: Ycc.Math.Dot): Ycc.Math.Dot;
      getAbsolutePositionRect(): Ycc.Math.Rect;
      renderDashBeforeUI(ctx?: CanvasRenderingContext2D): void;
      containDot(dot: Ycc.Math.Dot, noneZeroMode?: number): boolean;
    }

    class Rect extends Polygon {
      fill: boolean;
      color: string;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
    }

    class Circle extends Polygon {
      point: Ycc.Math.Dot | null;
      r: number;
      color: string;
      fill: boolean;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
      containDot(dot: Ycc.Math.Dot, noneZeroMode?: number): boolean;
    }

    class Ellipse extends Polygon {
      point: Ycc.Math.Dot;
      width: number;
      height: number;
      angle: number;
      color: string;
      fill: boolean;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
      containDot(dot: Ycc.Math.Dot, noneZeroMode?: number): boolean;
    }

    class Line extends Polygon {
      start: Ycc.Math.Dot;
      end: Ycc.Math.Dot;
      width: number;
      color: string;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
    }

    class BrokenLine extends Polygon {
      pointList: Ycc.Math.Dot[];
      width: number;
      color: string;
      smooth: boolean;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
    }

    class SingleLineText extends Polygon {
      displayContent: string;
      content: string;
      fontSize: string;
      fill: boolean;
      color: string;
      xAlign: string;
      yAlign: string;
      overflow: string;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
    }

    class MultiLineText extends Polygon {
      displayLines: string[];
      content: string;
      fontSize: string;
      lineHeight: number;
      fill: boolean;
      color: string;
      wordBreak: string;
      overflow: string;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
    }

    class Image extends Polygon {
      fillMode: 'none' | 'repeat' | 'scale' | 'auto' | 'scale9Grid' | 'scaleRepeat';
      res: HTMLImageElement | null;
      mirror: number;
      scale9GridRect: Ycc.Math.Rect | null;
      scaleRepeatRect: Ycc.Math.Rect | null;
      constructor(option?: any);
      computeUIProps(): void;
      render(): void;
    }

    class ImageFrameAnimation extends Polygon {
      res: HTMLImageElement | null;
      frameSpace: number;
      firstFrameRect: Ycc.Math.Rect | null;
      startFrameCount: number;
      frameRectCount: number;
      autoplay: boolean;
      isRunning: boolean;
      mirror: number;
      constructor(option?: any);
      computeUIProps(): void;
      render(): void;
      start(): void;
      stop(): void;
    }

    class CropRect extends Polygon {
      ctrlSize: number;
      enableDragOut: boolean;
      fill: boolean;
      ctrlRect1: Ycc.Math.Rect;
      ctrlRect2: Ycc.Math.Rect;
      ctrlRect3: Ycc.Math.Rect;
      ctrlRect4: Ycc.Math.Rect;
      btns: any[];
      btnHeight: number;
      btnVerticalPadding: number;
      showName: string;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
      setCtrlBtns(btns: Array<object>): void;
    }

    class ScrollerRect extends Polygon {
      selfRender: boolean;
      contentW: number;
      contentH: number;
      enableSwipe: boolean;
      swipeFrameCount: number;
      swipeAcceleration: number;
      swipeInitSpeed: number;
      constructor(option?: any);
      computeUIProps(): void;
      render(ctx?: CanvasRenderingContext2D): void;
      addChild(ui: Base): Base;
    }

    class ComponentButton extends Base {
      rectBorderWidth: number;
      rectBorderColor: string;
      backgroundImageRes: HTMLImageElement | null;
      text: string;
      textColor: string;
      __bgUI: Image | null;
      __textUI: SingleLineText | null;
      constructor(option?: any);
      computeUIProps(): void;
      render(): void;
    }
  }

  // Ycc.UI (legacy drawing API)
  class UI {
    yccClass: typeof UI;
    ctx: CanvasRenderingContext2D;
    ctxWidth: number;
    ctxHeight: number;
    constructor(yccInstance: Ycc);
    text(positionDot: number[], content: string, fill?: boolean): this;
    line(dot1: number[], dot2: number[]): this;
    rect(left_top_dot: number[], right_bottom_dot: number[], fill?: boolean): this;
    ellipse(centrePoint: number[], width: number, height: number, rotateAngle: number, fill: boolean): this;
    circleArc(centrePoint: number[], r: number, startAngle: number, endAngle: number, counterclockwise?: boolean): this;
    sector(centrePoint: number[], r: number, startAngle: number, endAngle: number, fill?: boolean, counterclockwise?: boolean): this;
    foldLine(pointList: number[][]): this;
    circle(centrePoint: number[], r: number, fill: boolean): this;
    image(img: HTMLImageElement, left_top_dot?: number[]): this;
    scale(scaleX: number, scaleY: number): this;
    clear(): this;
  }
}
