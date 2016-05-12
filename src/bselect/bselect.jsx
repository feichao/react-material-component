import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import ComponentStyle from '../_style.jsx';

const minBtnStyle = Object.assign({
  margin: '5px 0',
  marginLeft: 10,
}, ComponentStyle.minBtn);

class BSelect extends React.Component {
  
  static defaultProps = {
    /* 选择列表 */
    checkList: [],
    
    /* 根元素类名 */
    className: undefined,
    
    /* 默认值，multi为true时，是数组 */
    defaultValue: undefined,
    
    /* 组件说明文字 */
    label: undefined,
    
    /* 是否启用多选 */
    multi: false,
    
    /* 选中的值，是否是Controlled Components  */
    value: undefined,
    
    /* event  */
    onChange: undefined
  }
  
  static propTypes = {
    checkList: React.PropTypes.array.isRequired,
    className: React.PropTypes.string,
    defaultValue: (props, propName) => {
      if(props.multi) {
        if(props[propName] && !(props[propName] instanceof Array)) {
          return new Error('defaultValue should be Array cause multi is true');
        }
      }
    },
    label: React.PropTypes.string,
    multi: React.PropTypes.bool,
    value: (props, propName) => {
      if(props.multi) {
        if(props[propName] && !(props[propName] instanceof Array)) {
          return new Error('value should be Array cause multi is true');
        }
      }
    },
    onChange: React.PropTypes.func
  }
  
  constructor(props) {
    super(props);
   
    this._updateState = this._updateState.bind(this);
    this._setValue = this._setValue.bind(this);
    
    this.isMulti = this.props.multi;
    
    //init states
    this.state = {
      value: this.props.defaultValue === undefined ? this.isMulti ? [] : '' : this.props.defaultValue 
    };
  }

  componentWillMount() {}
  
  componentWillReceiveProps(nextProps) {
    this._setValue(nextProps, nextProps.value);
  }
  
  _setValue(props, value) {
    if(value !== undefined) {
      if(this.isMulti) {
        this.state.value = value === undefined ? [] : value;
      } else {
        this.state.value = value === undefined ? '' : value;
      }
    }
  }
  
  _updateState() {
    if(typeof this.props.onChange === 'function') {
      this.props.onChange(this.state.value);
    }
    
    this.setState({
      value: this.state.value
    });
  }

  render() {
    let labelText = this.props.label;
    let labelElement = labelText ? <label>{labelText + '：'}</label> : '';
    return (
      <div className={'row pdl1 pdr1 middle-xs ' + (this.props.className || '')}>
        {labelElement}
        <div className='col-xs nopadding'>
          {
            this.props.checkList.map((v, i) => {
              return (
                <RaisedButton className={v.btnClassName}
                              disabled={v.disabled}
                              label={v.label}
                              labelStyle={ComponentStyle.minBtnLabel}
                              key={i}
                              onClick={() => {
                                if(this.isMulti) {
                                  let index = this.state.value.indexOf(v.value);
                                  if(index !== -1) {
                                    this.state.value.splice(index, 1);
                                  } else {
                                    this.state.value.push(v.value);
                                  }
                                } else {
                                  this.state.value = v.value; 
                                }
                                this._updateState();
                              }}
                              secondary={(() => {
                                if(this.state.value instanceof Array) {
                                  return this.state.value.includes(v.value);
                                } else {
                                  return this.state.value === v.value;
                                }
                              })()}
                              style={minBtnStyle}/>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default BSelect;