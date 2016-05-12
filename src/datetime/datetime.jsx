import React from 'react';
import moment from 'moment';
import DateTimePicker from 'react-datetime';

import TextField from 'material-ui/lib/text-field';
import Popover from 'material-ui/lib/popover/popover';

import ComponentStyle from '../_style.jsx';

const style = {
  flex: 1, 
  height: 48
};

const inputStyle = Object.assign({}, ComponentStyle.w100, ComponentStyle.normalFontSize);

const datetimeStyle = {
  borderRadius: '2px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)', 
  position: 'absolute',
  zIndex: 99
};

class _Datetime extends React.Component {
  constructor(props) {
    super(props);

    this.onShowDateTimePicker = this.onShowDateTimePicker.bind(this);
    this.onCloseDateTimePicker = this.onCloseDateTimePicker.bind(this);
    this.onChangeDateTimePicker = this.onChangeDateTimePicker.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.setValue = this.setValue.bind(this);

    this.state = {
    	open: false,
      value: '',
      dateValue: undefined
    };
  }

  componentWillMount() {
    this.validate = this.props.input.validate;
    
    this.format = 'YYYY-MM-DD HH:mm';
    this.formatString = '日期';
    this.today = moment().format('YYYY-MM-DD');
    if(this.props.date === false) {
      this.format = 'HH:mm';
      this.formatString = '时间';
    } 
    
    if(this.props.time === false) {
      this.format = 'YYYY-MM-DD';
      this.formatString = '日期';
    }
    
    if(this.validate) {
      if(this.validate.maxDate) {
        if(this.props.date === false) {
          this.maxDate = moment(this.today + ' ' + this.validate.maxDate, 'YYYY-MM-DD HH:mm');
        } else {
          this.maxDate = moment(this.validate.maxDate, this.format);
        }
      }
      if(this.validate.minDate) {
        if(this.props.date === false) {
          this.minDate = moment(this.today + ' ' + this.validate.minDate, 'YYYY-MM-DD HH:mm');
        } else {
          this.minDate = moment(this.validate.minDate, this.format);
        }
      }
    }
    
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
    this.state.dateValue = moment(this.state.value, this.format);
    
    this.onValidate(this.state.dateValue);
  }

  onShowDateTimePicker(ev) {
    this.setState({
      open: true,
      anchorEl: ev.currentTarget,
    });
  }

  onCloseDateTimePicker() {
    this.setState({
      open: false
    });
  }

  onChangeDateTimePicker(date) {
    this.setValue(date.format(this.format));
  }

  onValidate(date) {

    this.props.input.isValidate = false;

    date = date && moment(date, this.format) || null;

    for(let key in this.validate) {
      if(key === 'required') {
        if(!date) {
          return this.setState({
            errorText: '请选择' + this.formatString,
          });
        }
      } 

      if(moment.isMoment(date)) {
        if(this.props.date === false) {
          date = moment(this.today + ' ' + date.format(this.format), 'YYYY-MM-DD HH:mm');
        }
    
        if(key === 'maxDate') {
          if(!date.isBefore(this.maxDate)) {
            return this.setState({
              errorText: '请选择小于' + this.validate.maxDate + '的' + this.formatString,
            });
          }
        }
        
        if(key === 'minDate') {
          if(date.isBefore(this.minDate)) {
            return this.setState({
              errorText: '请选择大于' + this.validate.minDate + '的' + this.formatString,
            });
          }
        }
      }
      
      if(key === 'template' && this.validate.template) {
        let validateResult = this.validate.onTemplateValidate(date);
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

    return ((
      <div style={style}>
        <TextField onClick={this.onShowDateTimePicker}
                   hintText={this.props.input.placeholder}
                   name={this.props.input.name}
                   value={this.state.value} 
                   style={inputStyle}
                   errorText={this.state.errorText}
                   readOnly/>
        <Popover open={this.state.open}
                 anchorEl={this.state.anchorEl}
                 anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                 onRequestClose={this.onCloseDateTimePicker}>
          <DateTimePicker ref='datetimePicker'
                          dateFormat={this.props.date && this.format}
                          timeFormat={this.props.time && this.format}
                          open={true}
                          input={false}
                          locale='zh-cn'
                          value={this.state.dateValue}
                          onChange= {this.onChangeDateTimePicker}/>
        </Popover>
        
      </div>
    ));
  }
}

export default _Datetime;