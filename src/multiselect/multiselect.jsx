import React from 'react';

import TextField from 'material-ui/lib/text-field';
import Popover from 'material-ui/lib/popover/popover';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Checkbox from 'material-ui/lib/checkbox';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import WrapText from '../wraptext/wraptext.jsx';
import CircularProgress from 'material-ui/lib/circular-progress';

import ComponentStyle from '../_style.jsx';

const style = {
  flex: 1, 
  position: 'relative'
};

const inputStyle = Object.assign({}, ComponentStyle.w100, ComponentStyle.normalFontSize);

const itemWrapStyle = {
  borderRadius: '2px',
  boxShadow: '0 0 2px rgba(0,0,0,0.5)',
  margin: '0 10px 10px 0',
  padding: '5px 10px',
  position: 'relative'
};

const deleteIconStyle = Object.assign({
  right: -7,
  top: -7
}, ComponentStyle.normalIcon);

const circularProgressStyle = {
  position: 'absolute', 
  right: 0
};

const popStyle = {
   marginTop: 8,
   overflowY: 'scroll'
};

const menuStyle = {
  minWidth: 200
};

const menuItemStyle = {
  fontSize: 12, 
  lineHeight: '32px', 
  margin: '5px 0'
};

/*  三种定义options的方式：
*     1、staticId: 定义静态选项
*     2、直接赋值options
*     3、定义getOptions: 
*          { 
*            url: 请求的url地址，
*            method: 请求的方法，get，post
*            params: 请求参数名
*            callback: 请求完成后获取特定字段
*          }
*/

class _MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    
    this.onInputChange = this.onInputChange.bind(this);
    this._updateRequests = this._updateRequests.bind(this);
    this._updateOptions  = this._updateOptions.bind(this);
    this.onWrapKeyDown = this.onWrapKeyDown.bind(this);
    this.onInputEnterKeyDown = this.onInputEnterKeyDown.bind(this);
    this.onValidate = this.onValidate.bind(this);
    
    this.getAsyncData = this.getAsyncData.bind(this);
    this.showPopover = this.showPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    
    this.hideLoading = this.hideLoading.bind(this);
    this.showLoading = this.showLoading.bind(this);
    
    this.setValue = this.setValue.bind(this);
    
    this.state = {
      searchText: '',
      menuOptions: [],//经过searchText筛选的待选项
      selectedOptions: [],//被选项
      open: false,
      anchorEl: null
    };
    
    this.interval = 650;
  }
  
  componentWillMount() {
    this.validate = this.props.input.validate;
    this.initPlaceholder = this.props.input.placeholder ? this.props.input.placeholder + '，' : '';
    this.setValue(this.props);
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    this.setValue(nextProps);
  }
  
  setValue(props) {
    let defaultOptions;
    if(!props.input.value) {
      this.state.value = (props.input.defaultValue || '').toString();
    } else {
      this.state.value = props.input.value.toString();
    }
    
    defaultOptions = this.state.value.split('++').filter(i => i);
      
    props.input.options.forEach(o => {
      if(defaultOptions.includes(o.value)) {
        o.checked = true;
      } else {
        o.checked = false;
      }
    });
    
    this.state.menuOptions = props.input.options;
    this.state.selectedOptions = props.input.options.filter(o => o.checked);
    
    this.props.input.value = this.state.value;
    
    this.onValidate(this.state.selectedOptions.length);
  }
  
  onInputChange(ev) {
    let text = ev.target.value;
    if(this.props.input.getOptions) {
      this.intervalTimeout && clearTimeout(this.intervalTimeout);
      this.intervalTimeout = setTimeout(() => this.getAsyncData(), this.interval);
    } else {
      if(text) {
        this.state.menuOptions = this.props.input.options.filter(o => o.label.toUpperCase().indexOf(text.toUpperCase()) !== -1);
      } else {
        this.state.menuOptions = this.props.input.options;
      }
    }
    this._updateRequests(text, ev.target); 
  }
  
  _updateRequests(text, target) {
    this.setState({
      searchText: text,
      open: true,
      anchorEl: target
    });
  }
  
  _updateOptions(option) {
    if(option.checked) {
      this.state.selectedOptions.push(option);
    } else {
      this.state.selectedOptions = this.state.selectedOptions.filter(s => s.value !== option.value);
    }
    
    this.props.input.value = this.state.selectedOptions.map(m => m.value).join('++');
    this.setValue(this.props);
  }
  
  _delete(index) {
    if(index < 0) {
      return;
    }
    
    this.state.selectedOptions[index].checked = false;
    this._updateOptions(this.state.selectedOptions[index]);
  }
  
  onWrapKeyDown(ev) {
    switch (ev.keyCode) {
      case 8: //backspace
        if(this.state.searchText) {
          return;
        }
        this._delete(this.state.selectedOptions.length - 1);
        break;
      case 27: //esc
        this.closePopover();
        break;
      case 40: //down
        if (this.focusOnInput && this.state.open) {
          ev.preventDefault();
          this.focusOnInput = false;
          this.showPopover();
        }
        break;
      default:
        break;
    }
  }
  
  onInputEnterKeyDown(ev) {
    setTimeout(() => this.closePopover(), 0);
  }
  
  onValidate(length) {

    this.props.input.isValidate = false;
    this.props.input.placeholder = this.initPlaceholder + '添加了' + length + '个';

    for(let key in this.validate) {
      if(key === 'required') {
        if(length === 0) {
          return this.setState({
            errorText: '必选字段',
          });
        }
      }

      if(length > 0) {
        if(key === 'minCount') {
          if(length < this.validate.minCount) {
            return this.setState({
              errorText: '至少选择' + this.validate.minCount + '个',
            });
          }
        } else if(key === 'maxCount') {
          if(length > this.validate.maxCount) {
            return this.setState({
              errorText: '至多选择' + this.validate.maxCount + '个',
            });
          }
        }
      }
      
      if(key === 'template' && this.validate.template) {
        let validateResult = this.validate.onTemplateValidate(this.state.value);
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
  
  getAsyncData() {
    let url = this.props.input.getOptions.url;
    
    this.showLoading();
    
    if(this.props.input.getOptions.method === 'post') {
      let data = this.props.input.getOptions.params + '=' + (this.state.searchText || '');
      this.context.fetchPost({api: url}, data, response => {
        this.hideLoading();
        if(response.errorCode !== 0) {
          this.context.showToast('加载数据失败：' + response.msg);
        } else {
          this.props.input.options = response.ret.data.map(d => this.props.input.getOptions.callback(d));
          this.state.menuOptions = this.props.input.options;
        }
      });
    } else {
      if(url.indexOf('?') !== -1) {
        url += '&' + this.props.input.getOptions.params + '=' + (this.state.searchText || '');
      } else {
        url += '?' + this.props.input.getOptions.params + '=' + (this.state.searchText || '');
      }
      this.context.fetchGet({api: url}, response => {
        this.hideLoading();
        if(response.errorCode !== 0) {
          this.context.showToast('加载数据失败：' + response.msg);
        } else {
          this.props.input.options = response.ret.data.map(d => this.props.input.getOptions.callback(d));
          this.state.menuOptions = this.props.input.options;
        }
      });
    }
    
  }
  
  showPopover(element) {
    this.setState({
      open: true,
      anchorEl: element
    });
  }
  
  closePopover() {
    this.setState({
      open: false,
      anchorEl: null
    });
    
    this.focusOnInput = false;
  }
  
  hideLoading() {
    this.showCircular = false;
  }
  
  showLoading() {
    this.showCircular = true;
  }
 
  render() {
    
    return (
      <div style={style} onKeyDown={this.onWrapKeyDown}>
        {
          this.showCircular && (
            <div style={circularProgressStyle}>
              <CircularProgress size={0.3}/>
            </div>
          )
        }
        
        <WrapText input={this.props.input} 
                  onEnterKeyDown={this.onInputEnterKeyDown}
                  errorText={this.state.errorText}
                  onChange={this.onInputChange}
                  value={this.state.searchText}
                  placeholder={this.props.input.placeholder}
                  onFocus={(ev) => {
                     if (!this.state.open) {
                        this._updateRequests(this.state.searchText, ev.target);
                      }
                      this.focusOnInput = true;
                    }
                   }
                   onBlur={(ev) => {//与onInputBlur的区别
                     if (this.focusOnInput && this.state.open) {
                       ev.target.focus()
                     }
                   }}>
          {
            this.state.selectedOptions.map((m, i) => {
              return (
                <div key={i} style={itemWrapStyle}>
                  <span>{m.label}</span>
                  <IconButton style={deleteIconStyle} 
                              iconStyle={ComponentStyle.normalIconSize} 
                              onClick={() => {
                                m.checked = false;
                                setTimeout(() => this._updateOptions(m), 10);
                              }}>
                    <FontIcon className='material-icons' color={ComponentStyle.whiteStr}>{'clear'}</FontIcon>
                  </IconButton>
                </div>
              )
            })
          }
        </WrapText>
        <Popover open={this.state.open}
                 anchorEl={this.state.anchorEl}
                 anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                 useLayerForClickAway={true}
                 onRequestClose={this.closePopover}
                 style={popStyle}>
          <Menu onItemTouchTap={this.onSelectItem} width='auto' style={menuStyle}>
            {
              this.state.menuOptions.map((m, i) => (
                <MenuItem key={i} style={menuItemStyle}
                          onTouchTap={() => {
                            m.checked = !m.checked;
                            setTimeout(() => this._updateOptions(m), 10);
                          }}>
                  <Checkbox label={m.label} 
                            value={m.value}
                            defaultChecked={m.checked}
                            labelStyle={ComponentStyle.wAuto}/>
                </MenuItem>
              ))
            }
          </Menu>
        </Popover>
        <input type='hidden' name={this.props.input.name} value={this.state.value}/>
      </div>
     
    )
  }
  
}
        
_MultiSelect.contextTypes = {
  fetchGet: React.PropTypes.func,
  fetchPost: React.PropTypes.func,
  fetchData: React.PropTypes.object,
  showToast: React.PropTypes.func
};
                      
export default _MultiSelect;