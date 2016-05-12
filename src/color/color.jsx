import React from 'react';
import ColorPicker from 'react-color';

import TextField from 'material-ui/lib/text-field';
import Popover from 'material-ui/lib/popover/popover';

import ComponentStyle from '../_style.jsx';

const style = {
  flex: 1, 
  height: 48
};

const inputStyle = Object.assign({}, ComponentStyle.w100, ComponentStyle.normalFontSize);

const colorPosition = {
  marginTop: 0,
  boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 20px'
};

class _Color extends React.Component {
  constructor(props) {
    super(props);

    this.showColorPicker = this.showColorPicker.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleColorClose = this.handleColorClose.bind(this);
    this.onValidate = this.onValidate.bind(this);
    
    this.setValue = this.setValue.bind(this);

    this.state = {
    	displayColorPicker: false,
    	value: ''
    };
  }

  componentWillMount() {
    this.validate = this.props.input.validate;
    this.setValue(this.props.input.value);
  }
  
  componentWillReceiveProps(newProps) {
    this.setValue(newProps.input.value);
  }
  
  setValue(value) {
    if(!value) {
      this.state.value = (this.props.input.defaultValue || '').toString();
    } else {
      this.state.value = value.toString();
    }
    
    this.props.input.value = this.state.value;
    
    this.onValidate(this.state.value);
  }

  showColorPicker(ev) {
  	this.setState({
  		open: true,
      anchorEl: ev.currentTarget,
  	});
  }

  handleColorChange(color) {
    this.setValue('#' + color.hex);
  }

  handleColorClose() {
  	this.setState({
  		open: false
  	});
  }

  onValidate() {
    let value = this.state.value;
    this.props.input.isValidate = false;

    for(let key in this.validate) {
      if(key === 'required') {
        if(!value) {
          return this.setState({
            errorText: '请选择颜色',
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
    return ((
      <div style={style}>
      	<TextField hintText={this.props.input.placeholder}
                   name={this.props.input.name}
                   value={this.state.value}
                   onClick={this.showColorPicker}
                   style={inputStyle}
                   inputStyle={{color: this.state.value}}
                   className='pdr0 pdl0'
                   errorText={this.state.errorText}
                   readOnly/>
        <Popover open={this.state.open}
                 anchorEl={this.state.anchorEl}
                 anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                 onRequestClose={this.handleColorClose}>
          <ColorPicker color={this.state.value}
            			     positionCSS={colorPosition}
            		       onChange={this.handleColorChange}/>
        </Popover>
      </div>
    ));
  }
}

export default _Color;