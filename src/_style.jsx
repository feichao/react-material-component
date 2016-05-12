/**
 * react material-ui 采用了将所有的样式文件全部内联的方式，
 * 外部class的样式往往不能覆盖内联样式，故将所有的内联样式写在此处，
 * 所有的样式都优先使用style，而不是class
 */

const Style = {};

export default Style;

Style.whiteStr = 'white';

Style.blackStr = 'black';

Style.warningStr = '#ff4081';

Style.wAuto = {
  width: 'auto'
};

Style.w100 = {
  width: '100%'
};

Style.hAuto = {
  height: 'auto'
};

Style.h100 = {
  height: '100%'
};

Style.normalHeight = {
  height: 48
};

Style.normalFontSize = {
  fontSize: 12
};

Style.dInline = {
  display: 'inline'
};

Style.dInlineB = {
  display: 'inline-block'
};

Style.normalIcon = {
  background: '#999',
  borderRadius: '50%',
  height: 'auto',
  padding: 0,
  position: 'absolute',
  width: 'auto'
};

Style.normalIconSize = {
  fontSize: 14
};

Style.bigIconBtn = {
  height: 24,
  padding: 0, 
  width: 24
};

Style.bigIconSize = {
  fontSize: 24
};

Style.cursorPointer = {
  cursor: 'pointer'
};

Style.minBtn = {
  height: 30,
  minWidth: 'auto'
};

Style.minBtnLabel = {
  lineHeight: '30px'
};

Style.centerCenter = {
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0)'
}