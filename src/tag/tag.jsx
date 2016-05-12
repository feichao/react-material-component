import React from 'react';

import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

import WrapText from '../wraptext/wraptext.jsx';
import ComponentStyle from '../_style.jsx';

const style = {
  flex: 1, 
  position: 'relative'
};

const inputStyle = Object.assign({}, ComponentStyle.w100, ComponentStyle.normalFontSize);

const deleteIconStyle = Object.assign({
  right: -7,
  top: -7
}, ComponentStyle.normalIcon);

const itemWrapStyle = {
  display: 'inline-block',
  borderRadius: '2px',
  boxShadow: '0 0 2px rgba(0,0,0,0.5)',
  margin: '0 10px 10px 0',
  padding: '5px 10px',
  position: 'relative'
};

class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.onAddTag = this.onAddTag.bind(this);
    this.onDeleteModal = this.onDeleteModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onValidate = this.onValidate.bind(this);
    
    this.onKeyDown = this.onKeyDown.bind(this);
    
    this.setValue = this.setValue.bind(this);
    
    this._delete = this._delete.bind(this);
    
    this.state = {
      value: '',
      inputText: '',
      dataList: []
    };
  }
  
  componentWillMount() {
    this.validate = this.props.input.validate;
    this.initPlaceholder = this.props.input.placeholder ? this.props.input.placeholder + '，' : '';
    this.setValue(this.props.input.value);
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    this.setValue(nextProps.input.value);
  }
  
  setValue(value) {
    if(!value) {
      this.state.value = (this.props.input.defaultValue || '').toString();
    } else {
      this.state.value = value.toString();
    }
    
    if(this.state.value) {
      this.state.dataList = this.state.value.split('++').filter(i => i);
    } else {
      this.state.dataList = [];
    }
    
    this.props.input.value = this.state.value;
    
    this.onValidate(this.state.dataList.length);
  }
  
  onAddTag(ev) {
    ev.preventDefault();

    this.state.dataList.push(this.state.inputText);
    this.state.inputText = '';
    this.setValue(this.state.dataList.join('++'));
  }
  
  onDeleteModal(index) {
    return () => {
      this._delete(index);
    };
  }
  
  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 8:
        if(this.state.inputText) {
          return;
        }
        this._delete(this.state.dataList.length - 1);
        break;
      default:
        break;
    }
  }
  
  _delete(index) {
    if(index < 0) {
      return;
    }
    
    this.state.dataList = this.state.dataList.filter((d, i) => i !== index);
    this.setValue(this.state.dataList.join('++'));
  }

  onChange(ev) {
    this.setState({
      inputText: ev.target.value
    });
  }

  onValidate(length) {

    this.props.input.isValidate = false;
    this.props.input.placeholder = this.initPlaceholder + '添加了' + length + '个' + this.props.input.title + '。输入内容，按回车键添加。';
    
    let vLength = this.state.dataList.join('++').length;

    for(let key in this.validate) {
      if(key === 'required') {
        if(length === 0) {
          return this.setState({
            errorText: '请添加' + this.props.input.title,
          });
        }
      }

      if(length > 0) {
        if(key === 'minCount') {
          if(length < this.validate.minCount) {
            return this.setState({
              errorText: '至少添加' + this.validate.minCount + '个',
            });
          }
        } else if(key === 'maxCount') {
          if(length > this.validate.maxCount) {
            return this.setState({
              errorText: '至多添加' + this.validate.maxCount + '个',
            });
          }
        } else if(key === 'minLength') {
          if(vLength < this.validate.minLength) {
            return this.setState({
              errorText: '总长度不能小于' + this.validate.minLength + '字',
            });
          }
        } else if(key === 'maxLength') {
          if(vLength > this.validate.maxLength) {
            return this.setState({
              errorText: '总长度不能大于' + this.validate.maxLength + '字',
            });
          }
        }

      }
      
      if(key === 'template' && this.validate.template) {
        let validateResult = this.validate.onTemplateValidate(this.state.dataList.join('++'));
        if(validateResult !== true) {
          return this.setState({
            errorText: validateResult
          });
        }
      }
    }

    this.props.input.isValidate = true;
    return this.setState({
      errorText: ''
    });
  }

  render() {
    return (
      <div style={style}
           onKeyDown={this.onKeyDown}>
        <WrapText input={this.props.input} 
                  onEnterKeyDown={this.onAddTag}
                  errorText={this.state.errorText}
                  onChange={this.onChange}
                  placeholder={this.props.input.placeholder}
                  value={this.state.inputText}>
          {
            this.state.dataList.map((d, i) => {
              return (
                <div key={i} style={itemWrapStyle}>
                  {d}
                  <IconButton style={deleteIconStyle} 
                              iconStyle={ComponentStyle.normalIconSize} 
                              onClick={this.onDeleteModal(i)}>
                    <FontIcon className='material-icons' color={ComponentStyle.whiteStr}>{'clear'}</FontIcon>
                  </IconButton>
                </div>
              )
            })
          }
        </WrapText>
        <input type='hidden' name={this.props.input.name} value={this.state.dataList.join('++')}/>
      </div>
    );
  }
}

export default Tag;