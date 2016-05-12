import React from 'react';

const warningColor = 'rgb(244, 67, 54)';
const normalColor = 'rgb(26, 35, 126)';

class WrapText extends React.Component {
  constructor(props) {
    super(props);
    
    this.init = this.init.bind(this);
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    
    this.state = {};
    
    this.inputWrapStyle = {
      padding: '0',
      position: 'relative',
      height: '100%',
      fontSize: '12px',
      minHeight: '48px',
      paddingTop: '10px'
    };
    
    this.inputStyle = {
      padding: '0',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: 'rgba(0, 0, 0, 0.87)',
      font: 'inherit',
      fontSize: '12px',
      lineHeight: '24px',
      marginBottom: '10px'
    };

    this.thinBorderStyle = {
      border: 'none',
      borderBottom: 'solid 1px',
      borderColor: '#e0e0e0',
      bottom: '8px',
      boxSizing: 'content-box',
      margin: 0,
      position: 'absolute',
      width: '100%'
    };
    
    this.thickBorderStyle = {
      borderStyle: 'none none solid',
      borderBottomWidth: '2px',
      borderColor: normalColor,
      bottom: '8px',
      boxSizing: 'content-box', 
      margin: '0px',
      position: 'absolute', 
      width: '100%',
      transform: 'scaleX(1)',
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    };
    
    this.errorTextStyle = {
      position: 'absolute',
      bottom: '-10px',
      fontSize: '12px',
      lineHeight: '12px',
      color: warningColor,
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms' 
    };
  }

  init(props) {
    if(props.errorText) {
      this.thickBorderStyle = Object.assign({}, this.thickBorderStyle, {
        borderColor: warningColor,
        transform: 'scaleX(1)'
      });
    } else {
      this.thickBorderStyle = Object.assign({}, this.thickBorderStyle, {
        borderColor: normalColor,
        transform: 'scaleX(0)'
      });
    }
  }

  componentWillMount() {
    this.state.value = this.props.value;
    this.init(this.props);
  }
  
  componentWillReceiveProps(newProps) {
    this.state.value = newProps.value;
    this.init(newProps);
  }

  componentDidUpdate(nextProps, nextState) {

  }
  
  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 13: //enter
        this.props.onEnterKeyDown && this.props.onEnterKeyDown(ev);
        break;
      case 8:
        this.props.onBackspaceKeyDown && this.props.onBackspaceKeyDown(ev);
        break;
      default:
        break;
    }
  }
  
  onChange(ev) {
    this.props.onChange && this.props.onChange(ev); 
  }
  
  onFocus(ev) {
    this.thickBorderStyle = Object.assign({}, this.thickBorderStyle, {
      transform: 'scaleX(1)',
      borderColor: normalColor
    });
    
    if(this.props.errorText) {
      this.thickBorderStyle = Object.assign({}, this.thickBorderStyle, {
        borderColor: warningColor
      });
    }
    
    this.props.onFocus && this.props.onFocus(ev);
    
    this.setState({
      value: this.state.value
    });
  }
  
  onBlur(ev) {
    this.thickBorderStyle = Object.assign({}, this.thickBorderStyle, {
      transform: 'scaleX(0)'
    });
    
    this.props.onBlur && this.props.onBlur(ev);
    
    this.setState({
      value: this.state.value
    });
  }

  render() {
    return (
      <div>
        <div style={this.inputWrapStyle} className='row pdl1 pdr1 middle-xs'>
          {this.props.children}
          <input type='text'
                 style={this.inputStyle} 
                 placeholder={this.props.placeholder} 
                 onKeyDown={this.onKeyDown}
                 className='col-xs'
                 onChange={this.onChange}
                 value={this.state.value}
                 onFocus={this.onFocus}
                 onBlur={this.onBlur}
                 onClick={(ev) => this.props.onClick && this.props.onClick(ev)}
                 readOnly={this.props.readonly}/>
        </div>
        <div>
          <hr style={this.thinBorderStyle}/>
          <hr style={this.thickBorderStyle}/>
          <span style={this.errorTextStyle}>{this.props.errorText}</span>
        </div>
      </div>
    );
  }
}

export default WrapText;